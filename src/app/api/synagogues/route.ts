import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/synagogues - Search synagogues with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nusach = searchParams.get("nusach");
    const search = searchParams.get("search");

    // Build Prisma query
    const where: any = {};

    // Filter by nusach
    if (nusach) {
      where.nusach = nusach;
    }

    // Text search - using case-insensitive search with Prisma
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
        { city: { contains: search } },
      ];
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
    const synagoguesWithRatings = synagogues.map((synagogue) => {
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
