import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { resolve } from "path";
import path from "path";
import fs from "fs";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

// Create Prisma client
let databaseUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";

if (databaseUrl.startsWith("file:")) {
  let dbPath: string;
  
  if (databaseUrl.startsWith("file:./") || databaseUrl.startsWith("file:../")) {
    const relativePath = databaseUrl.replace(/^file:\.?\//, "");
    dbPath = path.resolve(process.cwd(), relativePath);
  } else {
    dbPath = databaseUrl.replace(/^file:/, "");
  }
  
  if (!fs.existsSync(dbPath)) {
    console.error(`❌ Database file not found at: ${dbPath}`);
    process.exit(1);
  }
  
  databaseUrl = `file:${dbPath.replace(/\\/g, "/")}`;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

async function main() {
  try {
    const total = await prisma.synagogue.count();
    console.log(`\n📊 Total synagogues in database: ${total}\n`);

    if (total === 0) {
      console.log("❌ No synagogues found in database!");
      return;
    }

    // Check for Afula synagogues
    const afulaSynagogues = await prisma.synagogue.findMany({
      where: {
        OR: [
          { city: { contains: "עפולה" } },
          { name: { contains: "עפולה" } },
          { address: { contains: "עפולה" } },
        ],
      },
    });

    console.log(`\n📍 Synagogues in Afula area: ${afulaSynagogues.length}\n`);
    
    if (afulaSynagogues.length > 0) {
      console.log("Found synagogues:");
      afulaSynagogues.slice(0, 10).forEach((syn, i) => {
        console.log(`  ${i + 1}. ${syn.name} - ${syn.city}`);
      });
    } else {
      console.log("❌ No synagogues found in Afula area");
    }

    // Show cities distribution
    const cities = await prisma.synagogue.groupBy({
      by: ["city"],
      _count: true,
      orderBy: {
        _count: {
          city: "desc",
        },
      },
      take: 20,
    });

    console.log("\n📋 Top cities by synagogue count:");
    cities.forEach((city) => {
      console.log(`  ${city.city}: ${city._count} synagogues`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

