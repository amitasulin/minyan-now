import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Ensure DATABASE_URL is set correctly for SQLite
let databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";

// Always convert to absolute path for better reliability
if (databaseUrl.startsWith("file:")) {
  let dbPath: string;

  if (databaseUrl.startsWith("file:./") || databaseUrl.startsWith("file:../")) {
    // Relative path - resolve it
    const relativePath = databaseUrl.replace(/^file:\.?\//, "");
    dbPath = path.resolve(process.cwd(), relativePath);
  } else {
    // Absolute path - extract it
    dbPath = databaseUrl.replace(/^file:/, "");
  }

  const dbDir = path.dirname(dbPath);

  // Ensure the directory exists before accessing the file
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Create an empty SQLite file if it does not yet exist
  if (!fs.existsSync(dbPath)) {
    fs.closeSync(fs.openSync(dbPath, "a"));
  }

  // Convert Windows path separators to forward slashes for SQLite
  const normalizedPath = dbPath.replace(/\\/g, "/");

  // Encode spaces and other special characters so SQLite can open the file
  const encodedPath = encodeURI(normalizedPath);

  databaseUrl = `file:${encodedPath}`;

  // Log for debugging
  if (process.env.NODE_ENV !== "production") {
    console.log(`✅ Database URL resolved: ${databaseUrl}`);
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
