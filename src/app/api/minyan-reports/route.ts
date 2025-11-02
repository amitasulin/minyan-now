import { NextRequest, NextResponse } from "next/server";

// Mock data for minyan reports
const mockReports = [
  {
    id: "1",
    synagogueId: "1",
    userId: "user1",
    prayerType: "SHACHARIT",
    status: "ACTIVE_NOW",
    reportTime: new Date().toISOString(),
    latitude: 40.6782,
    longitude: -73.9442,
    notes: "Good minyan today, about 12 people",
    minyanCount: 12,
    needsMore: null,
    verifiedBy: ["user2", "user3"],
    isVerified: true,
    synagogue: {
      id: "1",
      name: "Congregation Beth Israel",
      address: "123 Main Street",
      city: "Brooklyn",
      latitude: 40.6782,
      longitude: -73.9442,
    },
    user: {
      id: "user1",
      name: "Anonymous",
      trustScore: 85,
    },
  },
  {
    id: "2",
    synagogueId: "1",
    userId: "user2",
    prayerType: "MINCHA",
    status: "STARTING_SOON",
    reportTime: new Date(Date.now() - 3600000).toISOString(),
    latitude: 40.6782,
    longitude: -73.9442,
    notes: "Starting in 10 minutes",
    minyanCount: null,
    needsMore: 2,
    verifiedBy: ["user1"],
    isVerified: false,
    synagogue: {
      id: "1",
      name: "Congregation Beth Israel",
      address: "123 Main Street",
      city: "Brooklyn",
      latitude: 40.6782,
      longitude: -73.9442,
    },
    user: {
      id: "user2",
      name: "David M.",
      trustScore: 92,
    },
  },
  {
    id: "3",
    synagogueId: "2",
    userId: "user3",
    prayerType: "MAARIV",
    status: "ACTIVE_NOW",
    reportTime: new Date().toISOString(),
    latitude: 40.6892,
    longitude: -73.9342,
    notes: "Beautiful service tonight",
    minyanCount: 15,
    needsMore: null,
    verifiedBy: ["user1", "user4"],
    isVerified: true,
    synagogue: {
      id: "2",
      name: "Sephardic Center",
      address: "456 Oak Avenue",
      city: "Brooklyn",
      latitude: 40.6892,
      longitude: -73.9342,
    },
    user: {
      id: "user3",
      name: "Sarah L.",
      trustScore: 88,
    },
  },
];

// GET /api/minyan-reports - Get recent minyan reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const synagogueId = searchParams.get("synagogueId");
    const prayerType = searchParams.get("prayerType");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20");

    let filteredReports = [...mockReports];

    // Filter by synagogueId
    if (synagogueId) {
      filteredReports = filteredReports.filter(
        (report) => report.synagogueId === synagogueId
      );
    }

    // Filter by prayerType
    if (prayerType) {
      filteredReports = filteredReports.filter(
        (report) => report.prayerType === prayerType
      );
    }

    // Filter by status
    if (status) {
      filteredReports = filteredReports.filter(
        (report) => report.status === status
      );
    }

    // Sort by reportTime descending and limit
    filteredReports = filteredReports
      .sort(
        (a, b) =>
          new Date(b.reportTime).getTime() - new Date(a.reportTime).getTime()
      )
      .slice(0, limit);

    return NextResponse.json({ reports: filteredReports });
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

    // For now, just return the new report data with a generated ID
    // In production, you would create in the database here
    const newId = (mockReports.length + 1).toString();
    const report = {
      id: newId,
      synagogueId,
      userId,
      prayerType,
      status,
      reportTime: new Date().toISOString(),
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      notes,
      minyanCount: minyanCount ? parseInt(minyanCount) : null,
      needsMore: needsMore ? parseInt(needsMore) : null,
      verifiedBy: [],
      isVerified: false,
      synagogue: {
        id: synagogueId,
        name: "Mock Synagogue",
        address: "Mock Address",
        city: "Mock City",
      },
      user: {
        id: userId,
        name: "Anonymous",
        trustScore: 75,
      },
    };

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

    // Find the report in mock data
    const report = mockReports.find((r) => r.id === reportId);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Add user to verifiedBy array if not already there
    const verifiedBy = report.verifiedBy.includes(userId)
      ? report.verifiedBy
      : [...report.verifiedBy, userId];

    // Simulate update by returning the report with verification
    const updatedReport = {
      ...report,
      verifiedBy,
      isVerified: verifiedBy.length >= 2, // Require 2+ verifications
    };

    return NextResponse.json({ report: updatedReport });
  } catch (error) {
    console.error("Error verifying minyan report:", error);
    return NextResponse.json(
      { error: "Failed to verify minyan report" },
      { status: 500 }
    );
  }
}
