import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/minyan-reports - Get recent minyan reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const synagogueId = searchParams.get("synagogueId");
    const prayerType = searchParams.get("prayerType");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20");

    let whereClause: any = {};

    if (synagogueId) {
      whereClause.synagogueId = synagogueId;
    }

    if (prayerType) {
      whereClause.prayerType = prayerType;
    }

    if (status) {
      whereClause.status = status;
    }

    const reports = await prisma.minyanReport.findMany({
      where: whereClause,
      include: {
        synagogue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            latitude: true,
            longitude: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            trustScore: true,
          },
        },
      },
      orderBy: {
        reportTime: "desc",
      },
      take: limit,
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Error fetching minyan reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch minyan reports" },
      { status: 500 }
    );
  }
}

// POST /api/minyan-reports - Create new minyan report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      synagogueId,
      userId,
      prayerType,
      status,
      latitude,
      longitude,
      notes,
      minyanCount,
      needsMore,
    } = body;

    // Validate required fields
    if (!synagogueId || !userId || !prayerType || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const report = await prisma.minyanReport.create({
      data: {
        synagogueId,
        userId,
        prayerType,
        status,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        notes,
        minyanCount: minyanCount ? parseInt(minyanCount) : null,
        needsMore: needsMore ? parseInt(needsMore) : null,
      },
      include: {
        synagogue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            trustScore: true,
          },
        },
      },
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Error creating minyan report:", error);
    return NextResponse.json(
      { error: "Failed to create minyan report" },
      { status: 500 }
    );
  }
}

// PUT /api/minyan-reports/[id]/verify - Verify a minyan report
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("id");
    const body = await request.json();
    const { userId } = body;

    if (!reportId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the current report
    const report = await prisma.minyanReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Add user to verifiedBy array if not already there
    const verifiedBy = report.verifiedBy.includes(userId)
      ? report.verifiedBy
      : [...report.verifiedBy, userId];

    // Update report with verification
    const updatedReport = await prisma.minyanReport.update({
      where: { id: reportId },
      data: {
        verifiedBy,
        isVerified: verifiedBy.length >= 2, // Require 2+ verifications
      },
      include: {
        synagogue: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            trustScore: true,
          },
        },
      },
    });

    return NextResponse.json({ report: updatedReport });
  } catch (error) {
    console.error("Error verifying minyan report:", error);
    return NextResponse.json(
      { error: "Failed to verify minyan report" },
      { status: 500 }
    );
  }
}
