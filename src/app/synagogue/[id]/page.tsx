"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Phone,
  Mail,
  Globe,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import Map from "@/components/Map";
import MinyanReportForm from "@/components/MinyanReportForm";

interface GoogleDetails {
  placeId?: string;
  rating?: number;
  userRatingsTotal?: number;
  openingHours?: {
    openNow: boolean;
    weekdayText: string[];
    periods: any[];
  };
  photos?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  reviews?: Array<{
    author: string;
    rating: number;
    text: string;
    time: number;
    relativeTime: string;
  }>;
  website?: string;
  phone?: string;
}

interface SynagogueDetails {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  nusach: string;
  rabbi?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  wheelchairAccess: boolean;
  parking: boolean;
  airConditioning: boolean;
  womensSection: boolean;
  mikveh: boolean;
  averageRating: number;
  totalReviews: number;
  prayerSchedule: Array<{
    dayOfWeek: number;
    prayerType: string;
    time: string;
  }>;
  recentReports: Array<{
    id: string;
    prayerType: string;
    status: string;
    reportTime: string;
    notes?: string;
    user: {
      name?: string;
      trustScore: number;
    };
  }>;
  photos?: Array<{
    id: string;
    url: string;
    caption?: string;
    isPrimary: boolean;
  }>;
}

interface SynagoguePageProps {
  params: Promise<{ id: string }>;
}

export default function SynagoguePage({ params }: SynagoguePageProps) {
  const [synagogueId, setSynagogueId] = useState<string>("");
  const [synagogue, setSynagogue] = useState<SynagogueDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [googleDetails, setGoogleDetails] = useState<GoogleDetails | null>(null);
  const [loadingGoogleDetails, setLoadingGoogleDetails] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<{
    shacharit: string;
    mincha: string;
    maariv: string;
  } | null>(null);

  const fetchSynagogueDetails = useCallback(async () => {
    if (!synagogueId) {
      console.log("[Page] No synagogue ID, skipping fetch");
      setLoading(false);
      return;
    }
    console.log(`[Page] Fetching synagogue details for ID: ${synagogueId}`);
    try {
      const response = await fetch(`/api/synagogues/${synagogueId}`);
      console.log(`[Page] Response status: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`[Page] Received data:`, data);
        if (data.synagogue) {
          setSynagogue(data.synagogue);
          console.log(`[Page] Set synagogue: ${data.synagogue.name}`);
        } else {
          console.error("[Page] No synagogue data in response:", data);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Page] Failed to fetch synagogue:", response.status, errorData);
      }
    } catch (error) {
      console.error("[Page] Error fetching synagogue details:", error);
    } finally {
      setLoading(false);
    }
  }, [synagogueId]);

  const fetchGoogleDetails = useCallback(async () => {
    if (!synagogueId) return;
    try {
      setLoadingGoogleDetails(true);
      const response = await fetch(`/api/synagogues/${synagogueId}/google-details`);
      if (response.ok) {
        const data = await response.json();
        if (data.googleDetails) {
          setGoogleDetails(data.googleDetails);
        }
      }
    } catch (error) {
      console.error("Error fetching Google details:", error);
    } finally {
      setLoadingGoogleDetails(false);
    }
  }, [synagogueId]);

  const fetchPrayerTimes = useCallback(async () => {
    if (!synagogue) return;
    try {
      const response = await fetch(
        `/api/prayer-times?lat=${synagogue.latitude}&lng=${synagogue.longitude}`
      );
      if (response.ok) {
        const data = await response.json();
        setPrayerTimes(data.prayerTimes);
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  }, [synagogue]);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSynagogueId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (synagogueId) {
      fetchSynagogueDetails();
    }
  }, [synagogueId, fetchSynagogueDetails]);

  useEffect(() => {
    if (synagogue) {
      fetchPrayerTimes();
      fetchGoogleDetails();
    }
  }, [synagogue, fetchPrayerTimes, fetchGoogleDetails]);

  const getDayName = (dayOfWeek: number) => {
    const days = [
      "ראשון",
      "שני",
      "שלישי",
      "רביעי",
      "חמישי",
      "שישי",
      "שבת",
    ];
    return days[dayOfWeek];
  };

  const getPrayerTypeName = (prayerType: string) => {
    const types: { [key: string]: string } = {
      SHACHARIT: "שחרית",
      MINCHA: "מנחה",
      MAARIV: "ערבית",
      MUSAF: "מוסף",
      NEILAH: "נעילה",
    };
    return types[prayerType] || prayerType;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      ACTIVE_NOW: "text-green-600 bg-green-100",
      STARTING_SOON: "text-yellow-600 bg-yellow-100",
      NEEDS_MORE: "text-red-600 bg-red-100",
      FINISHED: "text-gray-600 bg-gray-100",
      NO_MINYAN: "text-gray-600 bg-gray-100",
      CANCELLED: "text-red-600 bg-red-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!synagogue && !loading && synagogueId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            בית כנסת לא נמצא
          </h1>
          <p className="text-gray-600 mb-4">
            בית הכנסת שחיפשת לא קיים במערכת.
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-sm text-gray-500 mb-4">
              ID: {synagogueId}
            </p>
          )}
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </Link>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🕍</div>
              <h1 className="text-2xl font-bold text-gray-900">Minyan Now</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Synagogue Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {synagogue.name}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {synagogue.address}, {synagogue.city}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>
                      {synagogue.averageRating.toFixed(1)} (
                      {synagogue.totalReviews} reviews)
                    </span>
                    <span className="mx-2">•</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {synagogue.nusach === "ASHKENAZ" ? "אשכנז" :
                       synagogue.nusach === "SEPHARD" ? "ספרד" :
                       synagogue.nusach === "EDOT_MIZRACH" ? "עדות המזרח" :
                       synagogue.nusach === "YEMENITE" ? "תימן" :
                       synagogue.nusach === "CHABAD" ? "חב\"ד" : synagogue.nusach}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowReportForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Report Minyan
                </button>
              </div>

              {synagogue.description && (
                <p className="text-gray-700 mb-4">{synagogue.description}</p>
              )}

              {/* Google Rating (if available) */}
              {googleDetails?.rating && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 ml-2" />
                    <div>
                      <span className="font-semibold text-gray-900">
                        {googleDetails.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600 mr-2">
                        {" "}
                        ({googleDetails.userRatingsTotal || 0} ביקורות ב-Google)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Photos - from database or Google */}
              {(synagogue.photos && synagogue.photos.length > 0) ||
              (googleDetails?.photos && googleDetails.photos.length > 0) ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">תמונות</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Show database photos first */}
                    {synagogue.photos &&
                      synagogue.photos.map((photo) => (
                        <img
                          key={photo.id}
                          src={photo.url}
                          alt={photo.caption || `${synagogue.name} - תמונה`}
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(photo.url, "_blank")}
                        />
                      ))}
                    {/* Then show Google photos if no database photos */}
                    {(!synagogue.photos ||
                      synagogue.photos.length === 0) &&
                      googleDetails?.photos &&
                      googleDetails.photos.map((photo, index) => (
                        <img
                          key={`google-${index}`}
                          src={photo.url}
                          alt={`${synagogue.name} - תמונה ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(photo.url, "_blank")}
                        />
                      ))}
                  </div>
                </div>
              ) : null}

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {synagogue.rabbi && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-2">
                      רב:
                    </span>
                    <span className="text-sm text-gray-900">
                      {synagogue.rabbi}
                    </span>
                  </div>
                )}
                {(synagogue.phone || googleDetails?.phone) && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                    <a
                      href={`tel:${googleDetails?.phone || synagogue.phone}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {googleDetails?.phone || synagogue.phone}
                    </a>
                  </div>
                )}
                {synagogue.email && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-500 mr-2" />
                    <a
                      href={`mailto:${synagogue.email}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {synagogue.email}
                    </a>
                  </div>
                )}
                {(synagogue.website || googleDetails?.website) && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-500 mr-2" />
                    <a
                      href={googleDetails?.website || synagogue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      אתר אינטרנט
                    </a>
                  </div>
                )}
              </div>

              {/* Opening Hours from Google */}
              {googleDetails?.openingHours && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">שעות פעילות</h3>
                  {googleDetails.openingHours.openNow !== undefined && (
                    <div className="mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          googleDetails.openingHours.openNow
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {googleDetails.openingHours.openNow
                          ? "🟢 פתוח עכשיו"
                          : "🔴 סגור עכשיו"}
                      </span>
                    </div>
                  )}
                  {googleDetails.openingHours.weekdayText.length > 0 && (
                    <div className="space-y-1 text-sm">
                      {googleDetails.openingHours.weekdayText.map(
                        (day, index) => (
                          <div key={index} className="text-gray-700">
                            {day}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Accessibility Features */}
              <div className="flex flex-wrap gap-2">
                {synagogue.wheelchairAccess && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    ♿ Wheelchair Access
                  </span>
                )}
                {synagogue.parking && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    🅿️ Parking
                  </span>
                )}
                {synagogue.airConditioning && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    ❄️ Air Conditioning
                  </span>
                )}
                {synagogue.womensSection && (
                  <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                    👩 Women&apos;s Section
                  </span>
                )}
                {synagogue.mikveh && (
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                    🛁 Mikveh
                  </span>
                )}
              </div>
            </div>

            {/* Google Reviews */}
            {googleDetails?.reviews && googleDetails.reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-3">
                  ביקורות מ-Google
                </h3>
                <div className="space-y-4">
                  {googleDetails.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-2">
                            <span className="text-blue-600 font-semibold text-sm">
                              {review.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {review.author}
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-500 mr-2">
                                {review.relativeTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                מיקום
              </h3>
              <Map
                center={{ lat: synagogue.latitude, lng: synagogue.longitude }}
                zoom={15}
                synagogues={[synagogue]}
                className="w-full h-64 rounded-lg"
                onSynagogueClick={() => {
                  // Already on the synagogue detail page, no action needed
                }}
              />
            </div>

            {/* Prayer Schedule */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                לוח זמני תפילה
              </h3>
              {prayerTimes && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Today&apos;s Prayer Times
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Shacharit:</span>
                      <span className="ml-2 font-medium">
                        {prayerTimes.shacharit}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Mincha:</span>
                      <span className="ml-2 font-medium">
                        {prayerTimes.mincha}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Maariv:</span>
                      <span className="ml-2 font-medium">
                        {prayerTimes.maariv}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {synagogue.prayerSchedule.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-medium">
                      {getDayName(schedule.dayOfWeek)}
                    </span>
                    <span className="text-gray-600">
                      {getPrayerTypeName(schedule.prayerType)}: {schedule.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Reports */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Recent Reports
              </h3>
              <div className="space-y-3">
                {synagogue.recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(report.reportTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-900 mb-1">
                      {getPrayerTypeName(report.prayerType)}
                    </div>
                    {report.notes && (
                      <p className="text-xs text-gray-600">{report.notes}</p>
                    )}
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {report.user.name || "Anonymous"} • Trust:{" "}
                        {report.user.trustScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center">
                  <Users className="w-4 h-4 mr-2" />
                  Report Active Minyan
                </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                  <Star className="w-4 h-4 mr-2" />
                  Write Review
                </button>
                <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minyan Report Form Modal */}
      {showReportForm && (
        <MinyanReportForm
          synagogueId={synagogue.id}
          synagogueName={synagogue.name}
          onClose={() => setShowReportForm(false)}
          onReportSubmitted={() => {
            fetchSynagogueDetails(); // Refresh data
          }}
        />
      )}
    </div>
  );
}
