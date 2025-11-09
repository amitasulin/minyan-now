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
  
  // Check if file exists
  if (!fs.existsSync(dbPath)) {
    console.error(`❌ Database file not found at: ${dbPath}`);
    console.error(`Current working directory: ${process.cwd()}`);
    throw new Error(`Database file not found at: ${dbPath}`);
  }
  
  // Convert Windows path separators to forward slashes for SQLite
  // SQLite on Windows needs forward slashes, and spaces need to be handled
  databaseUrl = `file:${dbPath.replace(/\\/g, "/")}`;
  
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
