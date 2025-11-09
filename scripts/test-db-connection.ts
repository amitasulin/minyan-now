import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { resolve } from "path";
import path from "path";
import fs from "fs";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

// Create Prisma client
let databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";

// Remove quotes from DATABASE_URL if present
if (databaseUrl.startsWith('"') && databaseUrl.endsWith('"')) {
  databaseUrl = databaseUrl.slice(1, -1);
}
if (databaseUrl.startsWith("'") && databaseUrl.endsWith("'")) {
  databaseUrl = databaseUrl.slice(1, -1);
}

if (databaseUrl.startsWith("file:")) {
  let dbPath: string;
  
  if (databaseUrl.startsWith("file:./") || databaseUrl.startsWith("file:../")) {
    const relativePath = databaseUrl.replace(/^file:\.?\//, "");
    dbPath = path.resolve(process.cwd(), relativePath);
  } else {
    dbPath = databaseUrl.replace(/^file:/, "");
  }
  
  dbPath = dbPath.replace(/^["']|["']$/g, "");
  const absolutePath = path.resolve(dbPath);
  databaseUrl = `file:${absolutePath.replace(/\\/g, "/")}`;
  
  console.log(`Database path: ${absolutePath}`);
  console.log(`Database exists: ${fs.existsSync(absolutePath)}`);
  console.log(`Database URL: ${databaseUrl}`);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

async function test() {
  try {
    console.log("\nTesting database connection...");
    const count = await prisma.synagogue.count();
    console.log(`✅ Connection successful! Found ${count} synagogues.`);
    
    // Try a simple query
    const first = await prisma.synagogue.findFirst();
    if (first) {
      console.log(`✅ Query successful! First synagogue: ${first.name}`);
    }
  } catch (error: any) {
    console.error(`❌ Connection failed:`, error.message);
    console.error(`Error code:`, error.code);
  } finally {
    await prisma.$disconnect();
  }
}

test();

