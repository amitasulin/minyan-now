import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { Synagogue } from "@/types/synagogue";

// Load synagogues from JSON file
function loadSynagogues(): Synagogue[] {
  const filePath = path.join(process.cwd(), "data", "synagogues.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents) as Synagogue[];
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/synagogues - Search synagogues with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nusach = searchParams.get("nusach");
    const search = searchParams.get("search");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "10"; // Default 10km radius

    // Load all synagogues from JSON
    let synagogues = loadSynagogues();

    // Filter by nusach
    if (nusach) {
      synagogues = synagogues.filter((s) => s.nusach === nusach);
    }

    // Text search - filter in memory for better Hebrew support
    let searchTerm: string | null = null;
    if (search) {
      searchTerm = search.trim();
      const searchLower = searchTerm.toLowerCase();
      synagogues = synagogues.filter((s) => {
        return (
          s.name.toLowerCase().includes(searchLower) ||
          s.address.toLowerCase().includes(searchLower) ||
          s.city.toLowerCase().includes(searchLower)
        );
      });
    }

    // Geographic search (if lat/lng provided and no search term)
    // Don't apply geographic filter if there's a search term - search should work across all of Israel
    if (lat && lng && !searchTerm) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusKm = parseFloat(radius);

      // Only apply geographic filter if radius is reasonable (< 500km)
      if (radiusKm < 500) {
        synagogues = synagogues.filter((s) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            s.latitude,
            s.longitude
          );
          return distance <= radiusKm;
        });
      }
      // If radius >= 500km, don't apply geographic filter (show all synagogues)
    }

    // Format response - use averageRating and totalReviews from JSON
    const synagoguesWithRatings = synagogues.map((synagogue) => ({
      id: synagogue.id,
      name: synagogue.name,
      address: synagogue.address,
      city: synagogue.city,
      latitude: synagogue.latitude,
      longitude: synagogue.longitude,
      nusach: synagogue.nusach,
      averageRating: synagogue.averageRating || 0,
      totalReviews: synagogue.totalReviews || 0,
      wheelchairAccess: synagogue.wheelchairAccess,
      parking: synagogue.parking,
      airConditioning: synagogue.airConditioning,
    }));

    // Sort by average rating (descending)
    synagoguesWithRatings.sort((a, b) => b.averageRating - a.averageRating);

    return NextResponse.json({ synagogues: synagoguesWithRatings });
  } catch (error) {
    console.error("Error fetching synagogues:", error);
    return NextResponse.json(
      { error: "Failed to fetch synagogues" },
      { status: 500 }
    );
  }
}

// POST /api/synagogues - Create new synagogue (mock - returns success but doesn't save)
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

    // Generate a mock ID
    const mockId = `syn_${Date.now()}`;

    // Return mock response (in real app, this would save to database)
    return NextResponse.json({
      synagogue: {
        id: mockId,
        name,
        address,
        city,
        state: state || null,
        country: country || "ישראל",
        postalCode: postalCode || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        nusach: nusach || "ASHKENAZ",
        rabbi: rabbi || null,
        phone: phone || null,
        email: email || null,
        website: website || null,
        description: description || null,
        wheelchairAccess: wheelchairAccess || false,
        parking: parking || false,
        airConditioning: airConditioning || false,
        womensSection: womensSection || false,
        mikveh: mikveh || false,
        averageRating: 0,
        totalReviews: 0,
      },
    });
  } catch (error) {
    console.error("Error creating synagogue:", error);
    return NextResponse.json(
      { error: "Failed to create synagogue" },
      { status: 500 }
    );
  }
}
