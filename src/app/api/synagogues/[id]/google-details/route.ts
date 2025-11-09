import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/synagogues/[id]/google-details - Get additional details from Google Places API
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: synagogueId } = await params;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API key not configured" },
        { status: 500 }
      );
    }

    // Get synagogue from database
    const synagogue = await prisma.synagogue.findUnique({
      where: { id: synagogueId },
      select: {
        name: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!synagogue) {
      return NextResponse.json(
        { error: "Synagogue not found" },
        { status: 404 }
      );
    }

    // Search for the synagogue in Google Places
    const searchQuery = encodeURIComponent(
      `${synagogue.name} ${synagogue.latitude},${synagogue.longitude}`
    );
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&location=${synagogue.latitude},${synagogue.longitude}&radius=100&key=${apiKey}&language=he`;

    try {
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData.status === "OK" && searchData.results.length > 0) {
        // Find the closest match
        const place = searchData.results[0];
        const placeId = place.place_id;

        // Get detailed information
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,photos,rating,user_ratings_total,reviews,geometry&key=${apiKey}&language=he`;

        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        if (detailsData.status === "OK") {
          const result = detailsData.result;

          // Format photos URLs
          const photos = result.photos
            ? result.photos.slice(0, 5).map((photo: any) => ({
                url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`,
                width: photo.width,
                height: photo.height,
              }))
            : [];

          // Format reviews
          const reviews = result.reviews
            ? result.reviews.slice(0, 5).map((review: any) => ({
                author: review.author_name,
                rating: review.rating,
                text: review.text,
                time: review.time,
                relativeTime: review.relative_time_description,
              }))
            : [];

          return NextResponse.json({
            googleDetails: {
              placeId: placeId,
              rating: result.rating || null,
              userRatingsTotal: result.user_ratings_total || 0,
              openingHours: result.opening_hours
                ? {
                    openNow: result.opening_hours.open_now,
                    weekdayText: result.opening_hours.weekday_text || [],
                    periods: result.opening_hours.periods || [],
                  }
                : null,
              photos: photos,
              reviews: reviews,
              website: result.website || null,
              phone: result.formatted_phone_number || null,
            },
          });
        }
      }

      return NextResponse.json({
        googleDetails: null,
        message: "No Google Places data found for this synagogue",
      });
    } catch (error) {
      console.error("Error fetching Google Places data:", error);
      return NextResponse.json(
        { error: "Failed to fetch Google Places data" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in google-details route:", error);
    return NextResponse.json(
      { error: "Failed to fetch Google details" },
      { status: 500 }
    );
  }
}

