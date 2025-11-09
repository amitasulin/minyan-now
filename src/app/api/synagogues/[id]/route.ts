import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/synagogues/[id] - Get synagogue details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: synagogueId } = await params;

    console.log(`[API] Fetching synagogue with ID: ${synagogueId}`);

    if (!synagogueId) {
      console.error("[API] No synagogue ID provided");
      return NextResponse.json(
        { error: "Synagogue ID is required" },
        { status: 400 }
      );
    }

    // Fetch synagogue from database
    console.log(`[API] Querying database for synagogue: ${synagogueId}`);
    const synagogue = await prisma.synagogue.findUnique({
      where: { id: synagogueId },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        prayerSchedule: {
          select: {
            dayOfWeek: true,
            prayerType: true,
            time: true,
          },
        },
        minyanReports: {
          take: 10,
          orderBy: {
            reportTime: "desc",
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        photos: {
          take: 5,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!synagogue) {
      console.error(`[API] Synagogue not found in database: ${synagogueId}`);
      return NextResponse.json(
        { error: "Synagogue not found", id: synagogueId },
        { status: 404 }
      );
    }

    console.log(`[API] Found synagogue: ${synagogue.name} (${synagogue.id})`);

    // Calculate average rating
    const totalReviews = synagogue.reviews.length;
    const averageRating =
      totalReviews > 0
        ? synagogue.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Format recent reports - handle case where user might not exist
    const recentReports = synagogue.minyanReports.map((report) => {
      try {
        return {
          id: report.id,
          prayerType: report.prayerType,
          status: report.status,
          reportTime: report.reportTime.toISOString(),
          notes: report.notes || undefined,
          user: {
            name: report.user?.name || "Anonymous",
            trustScore: 85, // Default trust score, can be calculated from user data
          },
        };
      } catch (err) {
        console.error(`[API] Error formatting report ${report.id}:`, err);
        return null;
      }
    }).filter((report): report is NonNullable<typeof report> => report !== null);

    // Format prayer schedule
    const prayerSchedule = synagogue.prayerSchedule.map((schedule) => ({
      dayOfWeek: schedule.dayOfWeek,
      prayerType: schedule.prayerType,
      time: schedule.time,
    }));

    // Format photos
    const photos = synagogue.photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption || undefined,
      isPrimary: photo.isPrimary,
    }));

    // Return formatted synagogue data
    return NextResponse.json({
      synagogue: {
        id: synagogue.id,
        name: synagogue.name,
        address: synagogue.address,
        city: synagogue.city,
        state: synagogue.state || undefined,
        country: synagogue.country,
        latitude: synagogue.latitude,
        longitude: synagogue.longitude,
        nusach: synagogue.nusach,
        rabbi: synagogue.rabbi || undefined,
        phone: synagogue.phone || undefined,
        email: synagogue.email || undefined,
        website: synagogue.website || undefined,
        description: synagogue.description || undefined,
        wheelchairAccess: synagogue.wheelchairAccess,
        parking: synagogue.parking,
        airConditioning: synagogue.airConditioning,
        womensSection: synagogue.womensSection,
        mikveh: synagogue.mikveh,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: totalReviews,
        prayerSchedule: prayerSchedule.length > 0 ? prayerSchedule : [
          // Default schedule if none exists
          { dayOfWeek: 0, prayerType: "SHACHARIT", time: "8:00" },
          { dayOfWeek: 0, prayerType: "MINCHA", time: "13:30" },
          { dayOfWeek: 0, prayerType: "MAARIV", time: "19:30" },
        ],
        recentReports: recentReports,
        photos: photos,
      },
    });
  } catch (error) {
    console.error("[API] Error fetching synagogue details:", error);
    console.error("[API] Error details:", error instanceof Error ? error.message : String(error));
    console.error("[API] Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json(
      { error: "Failed to fetch synagogue details", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/synagogues/[id] - Update synagogue
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: synagogueId } = await params;
    const body = await request.json();

    // For now, just return the updated mock data
    // In production, you would update the database here
    const synagogue =
      mockSynagogues[synagogueId as keyof typeof mockSynagogues];

    if (!synagogue) {
      return NextResponse.json(
        { error: "Synagogue not found" },
        { status: 404 }
      );
    }

    // Simulate update by returning the existing data with any changes
    const updatedSynagogue = { ...synagogue, ...body };

    return NextResponse.json({ synagogue: updatedSynagogue });
  } catch (error) {
    console.error("Error updating synagogue:", error);
    return NextResponse.json(
      { error: "Failed to update synagogue" },
      { status: 500 }
    );
  }
}

// DELETE /api/synagogues/[id] - Delete synagogue
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: synagogueId } = await params;

    // For now, just check if the synagogue exists in mock data
    // In production, you would delete from the database here
    const synagogue =
      mockSynagogues[synagogueId as keyof typeof mockSynagogues];

    if (!synagogue) {
      return NextResponse.json(
        { error: "Synagogue not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Synagogue deleted successfully" });
  } catch (error) {
    console.error("Error deleting synagogue:", error);
    return NextResponse.json(
      { error: "Failed to delete synagogue" },
      { status: 500 }
    );
  }
}
