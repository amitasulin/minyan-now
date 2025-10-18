import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/synagogues - Search synagogues with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "10"; // km
    const nusach = searchParams.get("nusach");
    const prayerType = searchParams.get("prayerType");
    const search = searchParams.get("search");

    let whereClause: any = {};

    // Location-based search
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusNum = parseFloat(radius);

      // Simple bounding box search (for demo - in production use PostGIS)
      const latDelta = radiusNum / 111; // Rough conversion km to degrees
      const lngDelta = radiusNum / (111 * Math.cos((latNum * Math.PI) / 180));

      whereClause = {
        latitude: {
          gte: latNum - latDelta,
          lte: latNum + latDelta,
        },
        longitude: {
          gte: lngNum - lngDelta,
          lte: lngNum + lngDelta,
        },
      };
    }

    // Filter by nusach
    if (nusach) {
      whereClause.nusach = nusach;
    }

    // Text search
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    const synagogues = await prisma.synagogue.findMany({
      where: whereClause,
      include: {
        prayerSchedule: prayerType
          ? {
              where: { prayerType },
            }
          : true,
        reviews: {
          select: {
            rating: true,
          },
        },
        photos: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      take: 50,
    });

    return NextResponse.json({ synagogues });
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

    const synagogue = await prisma.synagogue.create({
      data: {
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
      },
    });

    return NextResponse.json({ synagogue });
  } catch (error) {
    console.error("Error creating synagogue:", error);
    return NextResponse.json(
      { error: "Failed to create synagogue" },
      { status: 500 }
    );
  }
}
