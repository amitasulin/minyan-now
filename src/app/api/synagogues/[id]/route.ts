import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { Synagogue, Review, MinyanReport, SynagoguePhoto } from "@/types/synagogue";

// Load synagogues from JSON file
function loadSynagogues(): Synagogue[] {
  const filePath = path.join(process.cwd(), "data", "synagogues.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents) as Synagogue[];
}

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

    // Load synagogues from JSON
    const synagogues = loadSynagogues();
    const synagogue = synagogues.find((s) => s.id === synagogueId);

    if (!synagogue) {
      console.error(`[API] Synagogue not found: ${synagogueId}`);
      return NextResponse.json(
        { error: "Synagogue not found", id: synagogueId },
        { status: 404 }
      );
    }

    console.log(`[API] Found synagogue: ${synagogue.name} (${synagogue.id})`);

    // Calculate average rating from reviews if available
    const reviews = synagogue.reviews || [];
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / totalReviews
        : synagogue.averageRating || 0;

    // Format recent reports (take last 10, sorted by reportTime desc)
    const minyanReports = synagogue.minyanReports || [];
    const recentReports = minyanReports
      .sort((a: MinyanReport, b: MinyanReport) => {
        const timeA = new Date(a.reportTime).getTime();
        const timeB = new Date(b.reportTime).getTime();
        return timeB - timeA;
      })
      .slice(0, 10)
      .map((report: MinyanReport) => ({
        id: report.id,
        prayerType: report.prayerType,
        status: report.status,
        reportTime: report.reportTime,
        notes: report.notes || undefined,
        user: {
          name: report.user?.name || "Anonymous",
          trustScore: 85, // Default trust score
        },
      }));

    // Format prayer schedule
    const prayerSchedule = synagogue.prayerSchedule || [
      // Default schedule if none exists
      { dayOfWeek: 0, prayerType: "SHACHARIT", time: "8:00" },
      { dayOfWeek: 0, prayerType: "MINCHA", time: "13:30" },
      { dayOfWeek: 0, prayerType: "MAARIV", time: "19:30" },
    ];

    // Format photos (take first 5)
    const photos = (synagogue.photos || []).slice(0, 5).map((photo: SynagoguePhoto) => ({
      id: photo.id,
      url: photo.url,
      caption: photo.caption || undefined,
      isPrimary: photo.isPrimary || false,
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
        totalReviews: totalReviews || synagogue.totalReviews || 0,
        prayerSchedule: prayerSchedule,
        recentReports: recentReports,
        photos: photos,
      },
    });
  } catch (error) {
    console.error("[API] Error fetching synagogue details:", error);
    console.error(
      "[API] Error details:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      {
        error: "Failed to fetch synagogue details",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PUT /api/synagogues/[id] - Update synagogue (mock - returns success but doesn't save)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: synagogueId } = await params;
    const body = await request.json();

    // Load synagogues from JSON
    const synagogues = loadSynagogues();
    const existingSynagogue = synagogues.find((s) => s.id === synagogueId);

    if (!existingSynagogue) {
      return NextResponse.json(
        { error: "Synagogue not found" },
        { status: 404 }
      );
    }

    // Return updated synagogue (mock - doesn't actually save)
    return NextResponse.json({
      synagogue: {
        ...existingSynagogue,
        ...body,
      },
    });
  } catch (error) {
    console.error("Error updating synagogue:", error);
    return NextResponse.json(
      { error: "Failed to update synagogue" },
      { status: 500 }
    );
  }
}

// DELETE /api/synagogues/[id] - Delete synagogue (mock - returns success but doesn't delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: synagogueId } = await params;

    // Load synagogues from JSON
    const synagogues = loadSynagogues();
    const existingSynagogue = synagogues.find((s) => s.id === synagogueId);

    if (!existingSynagogue) {
      return NextResponse.json(
        { error: "Synagogue not found" },
        { status: 404 }
      );
    }

    // Return success (mock - doesn't actually delete)
    return NextResponse.json({ message: "Synagogue deleted successfully" });
  } catch (error) {
    console.error("Error deleting synagogue:", error);
    return NextResponse.json(
      { error: "Failed to delete synagogue" },
      { status: 500 }
    );
  }
}
