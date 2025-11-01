import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Real Israeli synagogue data
const mockSynagogues = [
  {
    id: "1",
    name: "בית הכנסת הגדול - תל אביב",
    address: "רחוב אלנבי 110",
    city: "תל אביב-יפו",
    latitude: 32.0643,
    longitude: 34.7704,
    nusach: "ASHKENAZ",
    averageRating: 4.7,
    totalReviews: 145,
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
  },
  {
    id: "2",
    name: "בית הכנסת החורבה",
    address: "הרובע היהודי",
    city: "ירושלים",
    latitude: 31.7746,
    longitude: 35.2298,
    nusach: "ASHKENAZ",
    averageRating: 4.9,
    totalReviews: 289,
    wheelchairAccess: true,
    parking: false,
    airConditioning: true,
  },
  {
    id: "3",
    name: "בית הכנסת הספרדי - ירושלים",
    address: "רחוב בן יהדה 45",
    city: "ירושלים",
    latitude: 31.7781,
    longitude: 35.2246,
    nusach: "SEPHARD",
    averageRating: 4.6,
    totalReviews: 178,
    wheelchairAccess: false,
    parking: true,
    airConditioning: true,
  },
  {
    id: "4",
    name: "בית כנסת חב\"ד רמת אביב",
    address: "רחוב רמת אביב 30",
    city: "תל אביב-יפו",
    latitude: 32.1173,
    longitude: 34.8069,
    nusach: "CHABAD",
    averageRating: 4.8,
    totalReviews: 92,
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
  },
  {
    id: "5",
    name: "בית הכנסת העתיק בטבריה",
    address: "הרובע היהודי העתיק",
    city: "טבריה",
    latitude: 32.7894,
    longitude: 35.5426,
    nusach: "SEPHARD",
    averageRating: 4.5,
    totalReviews: 67,
    wheelchairAccess: false,
    parking: false,
    airConditioning: false,
  },
  {
    id: "6",
    name: "בית הכנסת אוהל משה - חיפה",
    address: "רחוב הרצל 50",
    city: "חיפה",
    latitude: 32.8192,
    longitude: 34.9992,
    nusach: "ASHKENAZ",
    averageRating: 4.4,
    totalReviews: 134,
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
  },
  {
    id: "7",
    name: "בית הכנסת עדת ישורון - נתניה",
    address: "רחוב בן גוריון 15",
    city: "נתניה",
    latitude: 32.3298,
    longitude: 34.8572,
    nusach: "EDOT_MIZRACH",
    averageRating: 4.6,
    totalReviews: 98,
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
  },
  {
    id: "8",
    name: "בית הכנסת אור החיים - בני ברק",
    address: "רחוב רבי עקיבא 120",
    city: "בני ברק",
    latitude: 32.0918,
    longitude: 34.8268,
    nusach: "ASHKENAZ",
    averageRating: 4.9,
    totalReviews: 234,
    wheelchairAccess: true,
    parking: false,
    airConditioning: true,
  },
];

// GET /api/synagogues - Search synagogues with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nusach = searchParams.get("nusach");
    const search = searchParams.get("search");

    let filteredSynagogues = [...mockSynagogues];

    // Filter by nusach
    if (nusach) {
      filteredSynagogues = filteredSynagogues.filter(
        (synagogue) => synagogue.nusach === nusach
      );
    }

    // Text search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredSynagogues = filteredSynagogues.filter(
        (synagogue) =>
          synagogue.name.toLowerCase().includes(searchLower) ||
          synagogue.address.toLowerCase().includes(searchLower) ||
          synagogue.city.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ synagogues: filteredSynagogues });
  } catch (error) {
    console.error("Error fetching synagogues:", error);
    return NextResponse.json(
      { error: "Failed to fetch synagogues" },
      { status: 500 }
    );
  }
}

// POST /api/synagogues - Create new synagogue
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      address,
      city,
      state,
      country,
      postalCode,
      latitude,
      longitude,
      nusach,
      rabbi,
      phone,
      email,
      website,
      description,
      wheelchairAccess,
      parking,
      airConditioning,
      womensSection,
      mikveh,
    } = body;

    // For now, just return the new synagogue data with a generated ID
    // In production, you would create in the database here
    const newId = (mockSynagogues.length + 1).toString();
    const synagogue = {
      id: newId,
      name,
      address,
      city,
      state,
      country,
      postalCode,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      nusach,
      rabbi,
      phone,
      email,
      website,
      description,
      wheelchairAccess: wheelchairAccess || false,
      parking: parking || false,
      airConditioning: airConditioning || false,
      womensSection: womensSection || false,
      mikveh: mikveh || false,
      averageRating: 0,
      totalReviews: 0,
    };

    return NextResponse.json({ synagogue });
  } catch (error) {
    console.error("Error creating synagogue:", error);
    return NextResponse.json(
      { error: "Failed to create synagogue" },
      { status: 500 }
    );
  }
}
