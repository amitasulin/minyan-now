import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mock data for synagogues list
const mockSynagogues = [
  {
    id: "1",
    name: "Congregation Beth Israel",
    address: "123 Main Street",
    city: "Brooklyn, NY",
    latitude: 40.6782,
    longitude: -73.9442,
    nusach: "ASHKENAZ",
    averageRating: 4.5,
    totalReviews: 23,
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
  },
  {
    id: "2",
    name: "Sephardic Center",
    address: "456 Oak Avenue",
    city: "Brooklyn, NY",
    latitude: 40.6892,
    longitude: -73.9342,
    nusach: "SEPHARD",
    averageRating: 4.2,
    totalReviews: 18,
    wheelchairAccess: false,
    parking: true,
    airConditioning: true,
  },
  {
    id: "3",
    name: "Chabad House",
    address: "789 Pine Street",
    city: "Brooklyn, NY",
    latitude: 40.6682,
    longitude: -73.9542,
    nusach: "CHABAD",
    averageRating: 4.8,
    totalReviews: 31,
    wheelchairAccess: true,
    parking: false,
    airConditioning: false,
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
