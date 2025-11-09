import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma, Nusach } from "@prisma/client";

// GET /api/synagogues - Search synagogues with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nusach = searchParams.get("nusach");
    const search = searchParams.get("search");

    // Build Prisma query (without search - we'll filter search in memory for better Hebrew support)
    const where: Prisma.SynagogueWhereInput = {};

    // Filter by nusach
    if (nusach) {
      // Validate that the nusach value is a valid enum value
      if (Object.values(Nusach).includes(nusach as Nusach)) {
        where.nusach = nusach as Nusach;
      }
    }

    // Text search - SQLite doesn't support case-insensitive mode well, so we filter in application layer
    // We'll fetch all synagogues (or filtered by other criteria) and then filter by search term in memory
    let searchTerm: string | null = null;
    if (search) {
      searchTerm = search.trim();
      // Don't add search to where clause - we'll filter in memory for better Hebrew support
      // This allows us to do case-insensitive search which SQLite doesn't support well
    }

    // Geographic search (if lat/lng provided)
    // Don't apply geographic filter if there's a search term - search should work across all of Israel
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "10"; // Default 10km radius

    if (lat && lng && !searchTerm) {
      // Only apply geographic filter if there's NO search term
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusKm = parseFloat(radius);
      
      // Only apply geographic filter if radius is reasonable (< 500km)
      // This prevents filtering out all results when radius is very large
      if (radiusKm < 500) {
        // Approximate: 1 degree latitude ≈ 111 km
        // For longitude, it varies by latitude, but for Israel (~31-33°N) it's ~96 km
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / 96;

        where.AND = [
          ...(where.AND || []),
          {
            latitude: {
              gte: latitude - latDelta,
              lte: latitude + latDelta,
            },
            longitude: {
              gte: longitude - lngDelta,
              lte: longitude + lngDelta,
            },
          },
        ];
      }
      // If radius >= 500km, don't apply geographic filter (show all synagogues)
    }

    // Fetch synagogues from database with reviews aggregation
    const synagogues = await prisma.synagogue.findMany({
      where,
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        averageRating: "desc",
      },
    });

    // Calculate averageRating and totalReviews from reviews
    let synagoguesWithRatings = synagogues.map((synagogue) => {
      const reviews = synagogue.reviews;
      const totalReviews = reviews.length;
      const averageRating =
        totalReviews > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

      return {
        id: synagogue.id,
        name: synagogue.name,
        address: synagogue.address,
        city: synagogue.city,
        latitude: synagogue.latitude,
        longitude: synagogue.longitude,
        nusach: synagogue.nusach,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews: totalReviews,
        wheelchairAccess: synagogue.wheelchairAccess,
        parking: synagogue.parking,
        airConditioning: synagogue.airConditioning,
      };
    });

    // Additional client-side filtering for better Hebrew search support
    // SQLite's contains is case-sensitive and doesn't work well with Hebrew
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      synagoguesWithRatings = synagoguesWithRatings.filter((synagogue) => {
        return (
          synagogue.name.toLowerCase().includes(searchLower) ||
          synagogue.address.toLowerCase().includes(searchLower) ||
          synagogue.city.toLowerCase().includes(searchLower)
        );
      });
    }

    return NextResponse.json({ synagogues: synagoguesWithRatings });
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

    // Create synagogue in database
    const synagogue = await prisma.synagogue.create({
      data: {
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
      },
    });

    return NextResponse.json({
      synagogue: {
        id: synagogue.id,
        name: synagogue.name,
        address: synagogue.address,
        city: synagogue.city,
        state: synagogue.state,
        country: synagogue.country,
        postalCode: synagogue.postalCode,
        latitude: synagogue.latitude,
        longitude: synagogue.longitude,
        nusach: synagogue.nusach,
        rabbi: synagogue.rabbi,
        phone: synagogue.phone,
        email: synagogue.email,
        website: synagogue.website,
        description: synagogue.description,
        wheelchairAccess: synagogue.wheelchairAccess,
        parking: synagogue.parking,
        airConditioning: synagogue.airConditioning,
        womensSection: synagogue.womensSection,
        mikveh: synagogue.mikveh,
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
