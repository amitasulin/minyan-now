/**
 * Script to fetch synagogues from Google Places API
 * This script searches for synagogues across major Israeli cities
 * and imports them into the database
 */

import { PrismaClient, Nusach } from "@prisma/client";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

// Use DATABASE_URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL environment variable is not set");
  console.error("Please set DATABASE_URL in your .env.local file");
  throw new Error("DATABASE_URL is required");
}

// PostgreSQL connection - no file path handling needed
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  log: process.env.DEBUG ? ['query', 'error', 'warn'] : ['error', 'warn'],
});

interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
}

interface GooglePlaceDetails {
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_phone_number?: string;
  website?: string;
  international_phone_number?: string;
}

// Focused search for Afula and nearby moshavim
const cities = [
  { name: "עפולה", lat: 32.6100, lng: 35.2900 },
  { name: "עפולה עילית", lat: 32.6200, lng: 35.2800 },
  // Moshavim near Afula
  { name: "אומן", lat: 32.5800, lng: 35.3200 },
  { name: "ניר יפה", lat: 32.5900, lng: 35.3100 },
  { name: "גדיש", lat: 32.5700, lng: 35.3300 },
];

async function searchPlaces(
  apiKey: string,
  query: string,
  location: string,
  radius: number = 10000
): Promise<GooglePlaceResult[]> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query
  )}&location=${location}&radius=${radius}&key=${apiKey}&language=he`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" || data.status === "ZERO_RESULTS") {
      return data.results || [];
    } else {
      console.error(`Error searching places: ${data.status}`, data.error_message);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching places:`, error);
    return [];
  }
}

async function getPlaceDetails(
  apiKey: string,
  placeId: string
): Promise<GooglePlaceDetails | null> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,formatted_phone_number,website,international_phone_number&key=${apiKey}&language=he`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      return data.result;
    } else {
      console.error(`Error getting place details: ${data.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching place details:`, error);
    return null;
  }
}

function extractCityFromAddress(address: string): string {
  // Comprehensive list of Israeli cities to extract from address
  const cityPatterns = [
    { pattern: /ירושלים/, name: "ירושלים" },
    { pattern: /תל אביב/, name: "תל אביב-יפו" },
    { pattern: /חיפה/, name: "חיפה" },
    { pattern: /באר שבע/, name: "באר שבע" },
    { pattern: /נתניה/, name: "נתניה" },
    { pattern: /אשדוד/, name: "אשדוד" },
    { pattern: /רמת גן/, name: "רמת גן" },
    { pattern: /בני ברק/, name: "בני ברק" },
    { pattern: /בת ים/, name: "בת ים" },
    { pattern: /הרצליה/, name: "הרצליה" },
    { pattern: /כפר סבא/, name: "כפר סבא" },
    { pattern: /רחובות/, name: "רחובות" },
    { pattern: /ראשון לציון/, name: "ראשון לציון" },
    { pattern: /פתח תקווה/, name: "פתח תקווה" },
    { pattern: /רעננה/, name: "רעננה" },
    { pattern: /חולון/, name: "חולון" },
    { pattern: /טבריה/, name: "טבריה" },
    { pattern: /צפת/, name: "צפת" },
    { pattern: /אילת/, name: "אילת" },
    { pattern: /אשקלון/, name: "אשקלון" },
    { pattern: /מודיעין/, name: "מודיעין-מכבים-רעות" },
    { pattern: /קריית אתא/, name: "קריית אתא" },
    { pattern: /גבעתיים/, name: "גבעתיים" },
    { pattern: /אור יהודה/, name: "אור יהודה" },
    { pattern: /לוד/, name: "לוד" },
    { pattern: /רמלה/, name: "רמלה" },
    { pattern: /קריית גת/, name: "קריית גת" },
    { pattern: /קריית שמונה/, name: "קריית שמונה" },
    { pattern: /נהריה/, name: "נהריה" },
    { pattern: /עכו/, name: "עכו" },
    { pattern: /זכרון יעקב/, name: "זכרון יעקב" },
    { pattern: /חדרה/, name: "חדרה" },
    { pattern: /רמת השרון/, name: "רמת השרון" },
    { pattern: /גבעת שמואל/, name: "גבעת שמואל" },
    { pattern: /קריית אונו/, name: "קריית אונו" },
    { pattern: /יהוד/, name: "יהוד-מונוסון" },
    { pattern: /ראש העין/, name: "ראש העין" },
    { pattern: /אריאל/, name: "אריאל" },
    { pattern: /מעלה אדומים/, name: "מעלה אדומים" },
    { pattern: /בית שמש/, name: "בית שמש" },
    { pattern: /קריית מלאכי/, name: "קריית מלאכי" },
    { pattern: /קריית ביאליק/, name: "קריית ביאליק" },
    { pattern: /נס ציונה/, name: "נס ציונה" },
    { pattern: /גדרה/, name: "גדרה" },
    { pattern: /יבנה/, name: "יבנה" },
    { pattern: /עפולה/, name: "עפולה" },
    { pattern: /עמק יזרעאל/, name: "עמק יזרעאל" },
    { pattern: /עפולה עילית/, name: "עפולה עילית" },
    { pattern: /עין חרוד/, name: "עין חרוד" },
    { pattern: /בית שאן/, name: "בית שאן" },
    { pattern: /מגדל העמק/, name: "מגדל העמק" },
    { pattern: /יקנעם/, name: "יקנעם" },
    { pattern: /מעלות/, name: "מעלות תרשיחא" },
    { pattern: /תרשיחא/, name: "מעלות תרשיחא" },
    { pattern: /כרמיאל/, name: "כרמיאל" },
    { pattern: /ראש פינה/, name: "ראש פינה" },
    { pattern: /מצפה רמון/, name: "מצפה רמון" },
    { pattern: /דימונה/, name: "דימונה" },
    { pattern: /ירוחם/, name: "ירוחם" },
    { pattern: /אומן/, name: "אומן" },
    { pattern: /ניר יפה/, name: "ניר יפה" },
    { pattern: /גדיש/, name: "גדיש" },
  ];

  for (const { pattern, name } of cityPatterns) {
    if (pattern.test(address)) {
      return name;
    }
  }

  // Try to extract from address parts
  const addressParts = address.split(",");
  for (const part of addressParts) {
    for (const { pattern, name } of cityPatterns) {
      if (pattern.test(part.trim())) {
        return name;
      }
    }
  }

  // Default to first part of address or "ישראל"
  return addressParts[addressParts.length - 1]?.trim() || "ישראל";
}

function determineNusach(name: string, address: string): Nusach {
  const nameLower = name.toLowerCase();
  const addressLower = address.toLowerCase();

  if (nameLower.includes("חב\"ד") || nameLower.includes("chabad")) {
    return Nusach.CHABAD;
  }
  if (
    nameLower.includes("ספרד") ||
    nameLower.includes("sephard") ||
    addressLower.includes("ספרד")
  ) {
    return Nusach.SEPHARD;
  }
  if (
    nameLower.includes("תימן") ||
    nameLower.includes("yemenite") ||
    addressLower.includes("תימן")
  ) {
    return Nusach.YEMENITE;
  }
  if (
    nameLower.includes("מזרח") ||
    nameLower.includes("mizrach") ||
    addressLower.includes("מזרח")
  ) {
    return Nusach.EDOT_MIZRACH;
  }

  return Nusach.ASHKENAZ; // Default
}

async function importSynagogue(place: GooglePlaceDetails): Promise<void> {
  try {
    // Try to check if synagogue already exists, but don't fail if check fails
    let existing = null;
    try {
      existing = await prisma.synagogue.findFirst({
        where: {
          name: place.name,
          latitude: {
            gte: place.geometry.location.lat - 0.001,
            lte: place.geometry.location.lat + 0.001,
          },
          longitude: {
            gte: place.geometry.location.lng - 0.001,
            lte: place.geometry.location.lng + 0.001,
          },
        },
      });
    } catch (checkError) {
      // If check fails, continue anyway - might be a connection issue
      console.log(`⚠️  Could not check for existing: ${place.name}`);
    }

    if (existing) {
      console.log(`⏭️  Skipping existing: ${place.name}`);
      return;
    }

    const city = extractCityFromAddress(place.formatted_address);
    const nusach = determineNusach(place.name, place.formatted_address);

    await prisma.synagogue.create({
      data: {
        name: place.name,
        address: place.formatted_address,
        city: city,
        country: "ישראל",
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        nusach: nusach,
        phone: place.formatted_phone_number || place.international_phone_number || null,
        website: place.website || null,
        wheelchairAccess: false, // Default, can be updated later
        parking: false,
        airConditioning: false,
        womensSection: true, // Most synagogues have this
        mikveh: false,
      },
    });

    console.log(`✅ Imported: ${place.name} - ${city}`);
  } catch (error: any) {
    // More specific error handling
    if (error?.code === 'P2002') {
      console.log(`⏭️  Skipping duplicate: ${place.name}`);
    } else {
      console.error(`❌ Error importing ${place.name}:`, error?.message || error);
    }
  }
}

async function main() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set in environment variables");
    process.exit(1);
  }

  console.log("🔍 Starting to fetch synagogues from Google Places API...\n");

  const allPlaces: GooglePlaceResult[] = [];
  const processedPlaceIds = new Set<string>();

  // Search for synagogues in each city
  for (const city of cities) {
    console.log(`\n📍 Searching in ${city.name}...`);
    const location = `${city.lat},${city.lng}`;

    // Search with different Hebrew terms and variations
    const queries = [
      "בית כנסת",
      "synagogue",
      "בית תפילה",
      "בית כנסת אשכנז",
      "בית כנסת ספרד",
      "בית כנסת חב\"ד",
    ];

    for (const query of queries) {
      const places = await searchPlaces(apiKey, query, location, 15000);

      for (const place of places) {
        if (!processedPlaceIds.has(place.place_id)) {
          allPlaces.push(place);
          processedPlaceIds.add(place.place_id);
        }
      }

      // Rate limiting - wait between requests to avoid API limits
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  console.log(`\n📊 Found ${allPlaces.length} unique synagogues\n`);
  console.log("📥 Fetching details and importing...\n");

  // Fetch details and import
  for (let i = 0; i < allPlaces.length; i++) {
    const place = allPlaces[i];
    console.log(`[${i + 1}/${allPlaces.length}] Processing: ${place.name}`);

    const details = await getPlaceDetails(apiKey, place.place_id);

    if (details) {
      await importSynagogue(details);
    }

    // Rate limiting - wait between requests
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log("\n✅ Done! Synagogues imported successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

