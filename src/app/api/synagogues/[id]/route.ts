import { NextRequest, NextResponse } from "next/server";

// Mock data for synagogues
const mockSynagogues = {
  "1": {
    id: "1",
    name: "Congregation Beth Israel",
    address: "123 Main Street",
    city: "Brooklyn",
    state: "NY",
    country: "USA",
    latitude: 40.6782,
    longitude: -73.9442,
    nusach: "ASHKENAZ",
    rabbi: "Rabbi David Cohen",
    phone: "(555) 123-4567",
    email: "info@bethisrael.org",
    website: "https://bethisrael.org",
    description:
      "A warm and welcoming Orthodox synagogue serving the Brooklyn community for over 50 years.",
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
    womensSection: true,
    mikveh: false,
    averageRating: 4.5,
    totalReviews: 23,
    prayerSchedule: [
      { dayOfWeek: 0, prayerType: "SHACHARIT", time: "8:00 AM" },
      { dayOfWeek: 0, prayerType: "MINCHA", time: "1:30 PM" },
      { dayOfWeek: 0, prayerType: "MAARIV", time: "7:30 PM" },
      { dayOfWeek: 1, prayerType: "SHACHARIT", time: "7:30 AM" },
      { dayOfWeek: 1, prayerType: "MINCHA", time: "1:30 PM" },
      { dayOfWeek: 1, prayerType: "MAARIV", time: "7:30 PM" },
      { dayOfWeek: 2, prayerType: "SHACHARIT", time: "7:30 AM" },
      { dayOfWeek: 2, prayerType: "MINCHA", time: "1:30 PM" },
      { dayOfWeek: 2, prayerType: "MAARIV", time: "7:30 PM" },
      { dayOfWeek: 3, prayerType: "SHACHARIT", time: "7:30 AM" },
      { dayOfWeek: 3, prayerType: "MINCHA", time: "1:30 PM" },
      { dayOfWeek: 3, prayerType: "MAARIV", time: "7:30 PM" },
      { dayOfWeek: 4, prayerType: "SHACHARIT", time: "7:30 AM" },
      { dayOfWeek: 4, prayerType: "MINCHA", time: "1:30 PM" },
      { dayOfWeek: 4, prayerType: "MAARIV", time: "7:30 PM" },
      { dayOfWeek: 5, prayerType: "SHACHARIT", time: "7:30 AM" },
      { dayOfWeek: 5, prayerType: "MINCHA", time: "1:30 PM" },
      { dayOfWeek: 5, prayerType: "MAARIV", time: "7:30 PM" },
      { dayOfWeek: 6, prayerType: "SHACHARIT", time: "9:00 AM" },
      { dayOfWeek: 6, prayerType: "MINCHA", time: "2:00 PM" },
      { dayOfWeek: 6, prayerType: "MAARIV", time: "8:00 PM" },
    ],
    recentReports: [
      {
        id: "1",
        prayerType: "SHACHARIT",
        status: "ACTIVE_NOW",
        reportTime: new Date().toISOString(),
        notes: "Good minyan today, about 12 people",
        user: {
          name: "Anonymous",
          trustScore: 85,
        },
      },
      {
        id: "2",
        prayerType: "MINCHA",
        status: "STARTING_SOON",
        reportTime: new Date(Date.now() - 3600000).toISOString(),
        notes: "Starting in 10 minutes",
        user: {
          name: "David M.",
          trustScore: 92,
        },
      },
    ],
  },
  "2": {
    id: "2",
    name: "Sephardic Center",
    address: "456 Oak Avenue",
    city: "Brooklyn",
    state: "NY",
    country: "USA",
    latitude: 40.6892,
    longitude: -73.9342,
    nusach: "SEPHARD",
    rabbi: "Rabbi Yosef Ben-David",
    phone: "(555) 987-6543",
    email: "contact@sephardiccenter.org",
    website: "https://sephardiccenter.org",
    description:
      "A vibrant Sephardic community center offering traditional services and cultural programs.",
    wheelchairAccess: false,
    parking: true,
    airConditioning: true,
    womensSection: true,
    mikveh: true,
    averageRating: 4.2,
    totalReviews: 18,
    prayerSchedule: [
      { dayOfWeek: 0, prayerType: "SHACHARIT", time: "8:15 AM" },
      { dayOfWeek: 0, prayerType: "MINCHA", time: "1:45 PM" },
      { dayOfWeek: 0, prayerType: "MAARIV", time: "7:45 PM" },
      { dayOfWeek: 1, prayerType: "SHACHARIT", time: "7:45 AM" },
      { dayOfWeek: 1, prayerType: "MINCHA", time: "1:45 PM" },
      { dayOfWeek: 1, prayerType: "MAARIV", time: "7:45 PM" },
      { dayOfWeek: 2, prayerType: "SHACHARIT", time: "7:45 AM" },
      { dayOfWeek: 2, prayerType: "MINCHA", time: "1:45 PM" },
      { dayOfWeek: 2, prayerType: "MAARIV", time: "7:45 PM" },
      { dayOfWeek: 3, prayerType: "SHACHARIT", time: "7:45 AM" },
      { dayOfWeek: 3, prayerType: "MINCHA", time: "1:45 PM" },
      { dayOfWeek: 3, prayerType: "MAARIV", time: "7:45 PM" },
      { dayOfWeek: 4, prayerType: "SHACHARIT", time: "7:45 AM" },
      { dayOfWeek: 4, prayerType: "MINCHA", time: "1:45 PM" },
      { dayOfWeek: 4, prayerType: "MAARIV", time: "7:45 PM" },
      { dayOfWeek: 5, prayerType: "SHACHARIT", time: "7:45 AM" },
      { dayOfWeek: 5, prayerType: "MINCHA", time: "1:45 PM" },
      { dayOfWeek: 5, prayerType: "MAARIV", time: "7:45 PM" },
      { dayOfWeek: 6, prayerType: "SHACHARIT", time: "9:15 AM" },
      { dayOfWeek: 6, prayerType: "MINCHA", time: "2:15 PM" },
      { dayOfWeek: 6, prayerType: "MAARIV", time: "8:15 PM" },
    ],
    recentReports: [
      {
        id: "3",
        prayerType: "MAARIV",
        status: "ACTIVE_NOW",
        reportTime: new Date().toISOString(),
        notes: "Beautiful service tonight",
        user: {
          name: "Sarah L.",
          trustScore: 88,
        },
      },
    ],
  },
  "3": {
    id: "3",
    name: "Chabad House",
    address: "789 Pine Street",
    city: "Brooklyn",
    state: "NY",
    country: "USA",
    latitude: 40.6682,
    longitude: -73.9542,
    nusach: "CHABAD",
    rabbi: "Rabbi Menachem Mendel",
    phone: "(555) 456-7890",
    email: "info@chabadhouse.org",
    website: "https://chabadhouse.org",
    description:
      "A welcoming Chabad center providing spiritual guidance and community services.",
    wheelchairAccess: true,
    parking: false,
    airConditioning: false,
    womensSection: true,
    mikveh: false,
    averageRating: 4.8,
    totalReviews: 31,
    prayerSchedule: [
      { dayOfWeek: 0, prayerType: "SHACHARIT", time: "8:30 AM" },
      { dayOfWeek: 0, prayerType: "MINCHA", time: "2:00 PM" },
      { dayOfWeek: 0, prayerType: "MAARIV", time: "8:00 PM" },
      { dayOfWeek: 1, prayerType: "SHACHARIT", time: "8:00 AM" },
      { dayOfWeek: 1, prayerType: "MINCHA", time: "2:00 PM" },
      { dayOfWeek: 1, prayerType: "MAARIV", time: "8:00 PM" },
      { dayOfWeek: 2, prayerType: "SHACHARIT", time: "8:00 AM" },
      { dayOfWeek: 2, prayerType: "MINCHA", time: "2:00 PM" },
      { dayOfWeek: 2, prayerType: "MAARIV", time: "8:00 PM" },
      { dayOfWeek: 3, prayerType: "SHACHARIT", time: "8:00 AM" },
      { dayOfWeek: 3, prayerType: "MINCHA", time: "2:00 PM" },
      { dayOfWeek: 3, prayerType: "MAARIV", time: "8:00 PM" },
      { dayOfWeek: 4, prayerType: "SHACHARIT", time: "8:00 AM" },
      { dayOfWeek: 4, prayerType: "MINCHA", time: "2:00 PM" },
      { dayOfWeek: 4, prayerType: "MAARIV", time: "8:00 PM" },
      { dayOfWeek: 5, prayerType: "SHACHARIT", time: "8:00 AM" },
      { dayOfWeek: 5, prayerType: "MINCHA", time: "2:00 PM" },
      { dayOfWeek: 5, prayerType: "MAARIV", time: "8:00 PM" },
      { dayOfWeek: 6, prayerType: "SHACHARIT", time: "9:30 AM" },
      { dayOfWeek: 6, prayerType: "MINCHA", time: "2:30 PM" },
      { dayOfWeek: 6, prayerType: "MAARIV", time: "8:30 PM" },
    ],
    recentReports: [
      {
        id: "4",
        prayerType: "SHACHARIT",
        status: "NEEDS_MORE",
        reportTime: new Date(Date.now() - 7200000).toISOString(),
        notes: "Need 2 more people for minyan",
        user: {
          name: "Anonymous",
          trustScore: 75,
        },
      },
    ],
  },
};

// GET /api/synagogues/[id] - Get synagogue details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: synagogueId } = await params;

    const synagogue =
      mockSynagogues[synagogueId as keyof typeof mockSynagogues];

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
