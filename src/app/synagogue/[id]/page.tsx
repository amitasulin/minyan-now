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
}

interface SynagoguePageProps {
  params: Promise<{ id: string }>;
}

export default function SynagoguePage({ params }: SynagoguePageProps) {
  const [synagogueId, setSynagogueId] = useState<string>("");
  const [synagogue, setSynagogue] = useState<SynagogueDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<{
    shacharit: string;
    mincha: string;
    maariv: string;
  } | null>(null);

  const fetchSynagogueDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/synagogues/${synagogueId}`);
      if (response.ok) {
        const data = await response.json();
        setSynagogue(data.synagogue);
      }
    } catch (error) {
      console.error("Error fetching synagogue details:", error);
    } finally {
      setLoading(false);
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
    }
  }, [synagogue, fetchPrayerTimes]);

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

  if (!synagogue && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            בית כנסת לא נמצא
          </h1>
          <p className="text-gray-600 mb-4">
            בית הכנסת שחיפשת לא קיים במערכת.
          </p>
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

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {synagogue.rabbi && (
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-2">
                      Rabbi:
                    </span>
                    <span className="text-sm text-gray-900">
                      {synagogue.rabbi}
                    </span>
                  </div>
                )}
                {synagogue.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-500 mr-2" />
                    <a
                      href={`tel:${synagogue.phone}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {synagogue.phone}
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
                {synagogue.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-500 mr-2" />
                    <a
                      href={synagogue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>

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

            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Location
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
                Prayer Schedule
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
