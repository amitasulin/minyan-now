import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/synagogues/[id] - Get synagogue details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: synagogueId } = await params;

    // Fetch synagogue from database
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
      },
    });

    if (!synagogue) {
      return NextResponse.json(
        { error: "Synagogue not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const totalReviews = synagogue.reviews.length;
    const averageRating =
      totalReviews > 0
        ? synagogue.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    // Format recent reports
    const recentReports = synagogue.minyanReports.map((report) => ({
      id: report.id,
      prayerType: report.prayerType,
      status: report.status,
      reportTime: report.reportTime.toISOString(),
      notes: report.notes || undefined,
      user: {
        name: report.user?.name || undefined,
        trustScore: 85, // Default trust score, can be calculated from user data
      },
    }));

    // Format prayer schedule
    const prayerSchedule = synagogue.prayerSchedule.map((schedule) => ({
      dayOfWeek: schedule.dayOfWeek,
      prayerType: schedule.prayerType,
      time: schedule.time,
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
      },
    });
  } catch (error) {
    console.error("Error fetching synagogue details:", error);
    return NextResponse.json(
      { error: "Failed to fetch synagogue details" },
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
