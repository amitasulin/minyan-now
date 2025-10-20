import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/synagogues/[id] - Get synagogue details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: synagogueId } = await params;

    const synagogue = await prisma.synagogue.findUnique({
      where: { id: synagogueId },
      include: {
        prayerSchedule: {
          orderBy: [{ dayOfWeek: "asc" }, { prayerType: "asc" }],
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        photos: {
          where: { isPrimary: true },
          take: 1,
        },
        minyanReports: {
          take: 10,
          orderBy: { reportTime: "desc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                trustScore: true,
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

    return NextResponse.json({ synagogue });
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

    const synagogue = await prisma.synagogue.update({
      where: { id: synagogueId },
      data: body,
    });

    return NextResponse.json({ synagogue });
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

    await prisma.synagogue.delete({
      where: { id: synagogueId },
    });

    return NextResponse.json({ message: "Synagogue deleted successfully" });
  } catch (error) {
    console.error("Error deleting synagogue:", error);
    return NextResponse.json(
      { error: "Failed to delete synagogue" },
      { status: 500 }
    );
  }
}
