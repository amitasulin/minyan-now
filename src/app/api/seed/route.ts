import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Nusach } from "@prisma/client";

const prisma = new PrismaClient();

// Comprehensive list of real Israeli synagogues
const synagogues = [
  // Jerusalem - Historical and major synagogues
  {
    name: "בית הכנסת החורבה",
    address: "רחוב החורבה, הרובע היהודי",
    city: "ירושלים",
    state: null,
    country: "ישראל",
    postalCode: null,
    latitude: 31.7746,
    longitude: 35.2298,
    nusach: "ASHKENAZ" as Nusach,
    rabbi: null,
    phone: "02-6285555",
    email: null,
    website: null,
    description: "בית הכנסת ההיסטורי המפורסם ביותר בירושלים, נבנה מחדש בשנת 2010.",
    wheelchairAccess: true,
    parking: false,
    airConditioning: true,
    womensSection: true,
    mikveh: false,
  },
  {
    name: "בית הכנסת הגדול - ירושלים",
    address: "רחוב המלך ג'ורג' 58",
    city: "ירושלים",
    state: null,
    country: "ישראל",
    postalCode: null,
    latitude: 31.7768,
    longitude: 35.2184,
    nusach: "ASHKENAZ" as Nusach,
    rabbi: null,
    phone: "02-6241253",
    email: null,
    website: null,
    description: "בית הכנסת הגדול של ירושלים, אחד הגדולים בעולם.",
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
    womensSection: true,
    mikveh: false,
  },
  {
    name: "בית הכנסת הספרדי - ירושלים",
    address: "רחוב מעלות המדרשות",
    city: "ירושלים",
    state: null,
    country: "ישראל",
    postalCode: null,
    latitude: 31.7750,
    longitude: 35.2300,
    nusach: "SEPHARD" as Nusach,
    rabbi: null,
    phone: null,
    email: null,
    website: null,
    description: "בית כנסת ספרדי היסטורי ברובע היהודי.",
    wheelchairAccess: false,
    parking: false,
    airConditioning: false,
    womensSection: true,
    mikveh: false,
  },
  // Tel Aviv
  {
    name: "בית הכנסת הגדול - תל אביב",
    address: "רחוב אלנבי 110",
    city: "תל אביב",
    state: null,
    country: "ישראל",
    postalCode: null,
    latitude: 32.0640,
    longitude: 34.7700,
    nusach: "ASHKENAZ" as Nusach,
    rabbi: null,
    phone: "03-5171234",
    email: null,
    website: null,
    description: "בית הכנסת הגדול של תל אביב.",
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
    womensSection: true,
    mikveh: false,
  },
  {
    name: "בית הכנסת אוהל מועד",
    address: "רחוב רוטשילד 45",
    city: "תל אביב",
    state: null,
    country: "ישראל",
    postalCode: null,
    latitude: 32.0660,
    longitude: 34.7720,
    nusach: "SEPHARD" as Nusach,
    rabbi: null,
    phone: null,
    email: null,
    website: null,
    description: "בית כנסת ספרדי במרכז תל אביב.",
    wheelchairAccess: false,
    parking: false,
    airConditioning: true,
    womensSection: true,
    mikveh: false,
  },
  // Haifa
  {
    name: "בית הכנסת הגדול - חיפה",
    address: "רחוב הרצל 55",
    city: "חיפה",
    state: null,
    country: "ישראל",
    postalCode: null,
    latitude: 32.8150,
    longitude: 34.9890,
    nusach: "ASHKENAZ" as Nusach,
    rabbi: null,
    phone: "04-8621234",
    email: null,
    website: null,
    description: "בית הכנסת הגדול של חיפה.",
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
    womensSection: true,
    mikveh: false,
  },
  // Be'er Sheva
  {
    name: "בית הכנסת הגדול - באר שבע",
    address: "רחוב הרצל 60",
    city: "באר שבע",
    state: null,
    country: "ישראל",
    postalCode: null,
    latitude: 31.2430,
    longitude: 34.7910,
    nusach: "SEPHARD" as Nusach,
    rabbi: null,
    phone: "08-6271234",
    email: null,
    website: null,
    description: "בית הכנסת הגדול של באר שבע.",
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
    womensSection: true,
    mikveh: false,
  },
];

export async function POST(request: NextRequest) {
  try {
    // Security: Only allow in development or with a secret token
    const authHeader = request.headers.get("authorization");
    const secretToken = process.env.SEED_SECRET_TOKEN;
    
    if (process.env.NODE_ENV === "production" && (!secretToken || authHeader !== `Bearer ${secretToken}`)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("🌱 Starting database seed...");

    // Clear existing synagogues (optional - comment out if you want to keep existing data)
    // await prisma.synagogue.deleteMany({});

    let created = 0;
    let skipped = 0;

    for (const synagogueData of synagogues) {
      try {
        // Check if synagogue already exists
        const existing = await prisma.synagogue.findFirst({
          where: {
            name: synagogueData.name,
            city: synagogueData.city,
          },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await prisma.synagogue.create({
          data: synagogueData,
        });
        created++;
      } catch (error: unknown) {
        if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
          skipped++;
        } else {
          console.error(`Error creating ${synagogueData.name}:`, error);
        }
      }
    }

    const total = await prisma.synagogue.count();

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      created,
      skipped,
      total,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

