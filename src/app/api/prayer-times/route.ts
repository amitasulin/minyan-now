import { NextRequest, NextResponse } from "next/server";

// GET /api/prayer-times - Get prayer times for a location
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    // Try MyZmanim API first, fallback to Hebcal
    let prayerTimes = null;

    try {
      // MyZmanim API call
      const myZmanimResponse = await fetch(
        `https://www.myzmanim.com/webservice/zmanim?latitude=${lat}&longitude=${lng}&date=${date}&timezone=America/New_York&format=json`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MYZMANIM_API_KEY}`,
          },
        }
      );

      if (myZmanimResponse.ok) {
        const data = await myZmanimResponse.json();
        prayerTimes = {
          shacharit: data.shacharit,
          mincha: data.mincha,
          maariv: data.maariv,
          sunrise: data.sunrise,
          sunset: data.sunset,
          source: "myzmanim",
        };
      }
    } catch {
      console.log("MyZmanim API failed, trying Hebcal...");
    }

    // Fallback to Hebcal API
    if (!prayerTimes) {
      try {
        const hebcalResponse = await fetch(
          `https://www.hebcal.com/zmanim?cfg=json&latitude=${lat}&longitude=${lng}&date=${date}&timezone=America/New_York`
        );

        if (hebcalResponse.ok) {
          const data = await hebcalResponse.json();
          prayerTimes = {
            shacharit: data.times?.shacharit || data.times?.alot,
            mincha: data.times?.mincha,
            maariv: data.times?.maariv || data.times?.tzeit,
            sunrise: data.times?.sunrise,
            sunset: data.times?.sunset,
            source: "hebcal",
          };
        }
      } catch {
        console.log("Hebcal API also failed");
      }
    }

    // If both APIs fail, return calculated times (basic calculation)
    if (!prayerTimes) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const targetDate = new Date(date);

      // Basic calculation (not halachically accurate, just for demo)
      const sunrise = calculateSunrise(latitude, longitude, targetDate);
      const sunset = calculateSunset(latitude, longitude, targetDate);

      prayerTimes = {
        shacharit: addMinutes(sunrise, 30), // 30 minutes after sunrise
        mincha: addMinutes(sunset, -30), // 30 minutes before sunset
        maariv: addMinutes(sunset, 15), // 15 minutes after sunset
        sunrise,
        sunset,
        source: "calculated",
      };
    }

    return NextResponse.json({ prayerTimes });
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return NextResponse.json(
      { error: "Failed to fetch prayer times" },
      { status: 500 }
    );
  }
}

// Helper functions for basic sunrise/sunset calculation
function calculateSunrise(lat: number, lng: number, date: Date): string {
  // Simplified calculation - in production, use proper astronomical algorithms
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const declination = 23.45 * Math.sin(((284 + dayOfYear) * Math.PI) / 180);
  const hourAngle = Math.acos(
    -Math.tan((lat * Math.PI) / 180) * Math.tan((declination * Math.PI) / 180)
  );
  const sunriseTime = 12 - (hourAngle * 12) / Math.PI - lng / 15;

  const hours = Math.floor(sunriseTime);
  const minutes = Math.floor((sunriseTime - hours) * 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function calculateSunset(lat: number, lng: number, date: Date): string {
  // Simplified calculation - in production, use proper astronomical algorithms
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const declination = 23.45 * Math.sin(((284 + dayOfYear) * Math.PI) / 180);
  const hourAngle = Math.acos(
    -Math.tan((lat * Math.PI) / 180) * Math.tan((declination * Math.PI) / 180)
  );
  const sunsetTime = 12 + (hourAngle * 12) / Math.PI - lng / 15;

  const hours = Math.floor(sunsetTime);
  const minutes = Math.floor((sunsetTime - hours) * 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function addMinutes(timeString: string, minutes: number): string {
  const [hours, mins] = timeString.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;

  return `${newHours.toString().padStart(2, "0")}:${newMins
    .toString()
    .padStart(2, "0")}`;
}
