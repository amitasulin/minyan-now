"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Users,
  AlertCircle,
  CheckCircle,
  Search,
  Star,
  Navigation,
  Menu,
} from "lucide-react";
import Link from "next/link";

interface Synagogue {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

export default function ReportPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"minyan" | "review" | "issue">("minyan");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [synagogues, setSynagogues] = useState<Synagogue[]>([]);
  const [selectedSynagogue, setSelectedSynagogue] = useState<Synagogue | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [minyanForm, setMinyanForm] = useState({
    prayerType: "SHACHARIT",
    status: "ACTIVE_NOW",
    minyanCount: "",
    needsMore: "",
    notes: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });

  const [issueForm, setIssueForm] = useState({
    issueType: "incorrect_info",
    description: "",
    contactEmail: "",
  });

  const fetchSynagogues = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      const response = await fetch(`/api/synagogues?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSynagogues(data.synagogues || []);
      }
    } catch (error) {
      console.error("Error fetching synagogues:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchSynagogues();
  }, [fetchSynagogues]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMinyanForm((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("לא ניתן לקבל את המיקום שלך. אנא הפעל שירותי מיקום.");
        }
      );
    } else {
      setError("הדפדפן שלך לא תומך במיקום.");
    }
  };

  const handleMinyanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSynagogue) {
      setError("אנא בחר בית כנסת");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/minyan-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          synagogueId: selectedSynagogue.id,
          userId: "demo-user-id",
          ...minyanForm,
        }),
      });

      if (!response.ok) {
        throw new Error("נכשל בשליחת הדיווח");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMinyanForm({
          prayerType: "SHACHARIT",
          status: "ACTIVE_NOW",
          minyanCount: "",
          needsMore: "",
          notes: "",
          latitude: null,
          longitude: null,
        });
        setSelectedSynagogue(null);
      }, 3000);
    } catch (error) {
      console.error("Error submitting report:", error);
      setError("נכשל בשליחת הדיווח. אנא נסה שוב.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSynagogue) {
      setError("אנא בחר בית כנסת");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // TODO: Implement review API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setReviewForm({ rating: 5, comment: "" });
        setSelectedSynagogue(null);
      }, 3000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("נכשל בשליחת הביקורת. אנא נסה שוב.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSynagogue) {
      setError("אנא בחר בית כנסת");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // TODO: Implement issue report API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setIssueForm({
          issueType: "incorrect_info",
          description: "",
          contactEmail: "",
        });
        setSelectedSynagogue(null);
      }, 3000);
    } catch (error) {
      console.error("Error submitting issue:", error);
      setError("נכשל בשליחת הדיווח. אנא נסה שוב.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSynagogues = synagogues.filter(
    (synagogue) =>
      !searchQuery ||
      synagogue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      synagogue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      synagogue.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-3xl transform hover:scale-110 transition-transform">
                🕍
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                מניין עכשיו
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                מצא מניין
              </Link>
              <Link
                href="/synagogues"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                בתי כנסת
              </Link>
              <Link
                href="/report"
                className="text-blue-600 font-medium transition-colors"
              >
                דווח
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                אודות
              </Link>
            </nav>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="תפריט"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 animate-in slide-in-from-top duration-200">
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors text-right"
                >
                  מצא מניין
                </Link>
                <Link
                  href="/synagogues"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors text-right"
                >
                  בתי כנסת
                </Link>
                <Link
                  href="/report"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors text-right"
                >
                  דווח
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors text-right"
                >
                  אודות
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">דווח לקהילה</h2>
          <p className="text-sm sm:text-base text-gray-600">
            עזור לקהילה על ידי דיווח על מניינים פעילים, כתיבת ביקורות או דיווח על בעיות
          </p>
        </div>

        {/* Tabs - Responsive for mobile */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 overflow-x-auto">
          <div className="flex border-b min-w-max sm:min-w-0">
            <button
              onClick={() => setSelectedTab("minyan")}
              className={`flex-1 sm:flex-none min-w-[120px] sm:min-w-0 px-3 sm:px-6 py-3 sm:py-4 text-center font-medium transition-colors text-sm sm:text-base ${
                selectedTab === "minyan"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2" />
              <span className="block sm:inline">דווח על מניין</span>
            </button>
            <button
              onClick={() => setSelectedTab("review")}
              className={`flex-1 sm:flex-none min-w-[120px] sm:min-w-0 px-3 sm:px-6 py-3 sm:py-4 text-center font-medium transition-colors text-sm sm:text-base ${
                selectedTab === "review"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2" />
              <span className="block sm:inline">כתוב ביקורת</span>
            </button>
            <button
              onClick={() => setSelectedTab("issue")}
              className={`flex-1 sm:flex-none min-w-[120px] sm:min-w-0 px-3 sm:px-6 py-3 sm:py-4 text-center font-medium transition-colors text-sm sm:text-base ${
                selectedTab === "issue"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2" />
              <span className="block sm:inline">דווח על בעיה</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Synagogue Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">בחר בית כנסת</h3>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="חפש בית כנסת..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchSynagogues();
                  }}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Synagogue List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : filteredSynagogues.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">לא נמצאו בתי כנסת</p>
                ) : (
                  filteredSynagogues.map((synagogue) => (
                    <button
                      key={synagogue.id}
                      onClick={() => setSelectedSynagogue(synagogue)}
                      className={`w-full text-right p-3 rounded-lg border transition-colors ${
                        selectedSynagogue?.id === synagogue.id
                          ? "bg-blue-50 border-blue-500"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium text-gray-900">{synagogue.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {synagogue.address}, {synagogue.city}
                      </div>
                    </button>
                  ))
                )}
              </div>

              {selectedSynagogue && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <MapPin className="w-4 h-4 text-blue-600 ml-2" />
                    <span className="font-medium text-blue-900">{selectedSynagogue.name}</span>
                  </div>
                  <p className="text-sm text-blue-700">{selectedSynagogue.city}</p>
                  <button
                    onClick={() => router.push(`/synagogue/${selectedSynagogue.id}`)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Navigation className="w-4 h-4 ml-1" />
                    צפה בפרטים
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {!selectedSynagogue ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    בחר בית כנסת
                  </h3>
                  <p className="text-gray-500">
                    אנא בחר בית כנסת מהרשימה כדי להתחיל
                  </p>
                </div>
              ) : (
                <>
                  {/* Minyan Report Form */}
                  {selectedTab === "minyan" && (
                    <form onSubmit={handleMinyanSubmit} className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">דווח על מניין פעיל</h3>
                        <div className="p-4 bg-blue-50 rounded-lg mb-6">
                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-blue-600 ml-2" />
                            <span className="font-medium text-blue-900">
                              {selectedSynagogue.name}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            סוג תפילה
                          </label>
                          <select
                            name="prayerType"
                            value={minyanForm.prayerType}
                            onChange={(e) =>
                              setMinyanForm({ ...minyanForm, prayerType: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="SHACHARIT">שחרית</option>
                            <option value="MINCHA">מנחה</option>
                            <option value="MAARIV">ערבית</option>
                            <option value="MUSAF">מוסף</option>
                            <option value="NEILAH">נעילה</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            סטטוס נוכחי
                          </label>
                          <select
                            name="status"
                            value={minyanForm.status}
                            onChange={(e) =>
                              setMinyanForm({ ...minyanForm, status: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="ACTIVE_NOW">🟢 מניין פעיל עכשיו</option>
                            <option value="STARTING_SOON">🟡 מתחיל בקרוב</option>
                            <option value="NEEDS_MORE">🔴 צריך עוד אנשים</option>
                            <option value="FINISHED">⚫ הסתיים</option>
                            <option value="NO_MINYAN">❌ אין מניין</option>
                            <option value="CANCELLED">🚫 בוטל</option>
                          </select>
                        </div>

                        {minyanForm.status === "NEEDS_MORE" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              כמה אנשים נוספים נדרשים?
                            </label>
                            <input
                              type="number"
                              name="needsMore"
                              value={minyanForm.needsMore}
                              onChange={(e) =>
                                setMinyanForm({ ...minyanForm, needsMore: e.target.value })
                              }
                              min="1"
                              max="9"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}

                        {minyanForm.status === "ACTIVE_NOW" && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              כמה אנשים נוכחים? (אופציונלי)
                            </label>
                            <input
                              type="number"
                              name="minyanCount"
                              value={minyanForm.minyanCount}
                              onChange={(e) =>
                                setMinyanForm({ ...minyanForm, minyanCount: e.target.value })
                              }
                              min="10"
                              max="200"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            הערות נוספות (אופציונלי)
                          </label>
                          <textarea
                            name="notes"
                            value={minyanForm.notes}
                            onChange={(e) =>
                              setMinyanForm({ ...minyanForm, notes: e.target.value })
                            }
                            rows={4}
                            placeholder="מידע נוסף על המניין..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-500 ml-2" />
                            <span className="text-sm text-gray-600">
                              {minyanForm.latitude && minyanForm.longitude
                                ? "מיקום מאומת"
                                : "מיקום לא מאומת"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            אמת מיקום
                          </button>
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-600 ml-2" />
                          <span className="text-sm text-red-800">{error}</span>
                        </div>
                      )}

                      {success && (
                        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                          <span className="text-sm text-green-800">
                            הדיווח נשלח בהצלחה!
                          </span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                            שולח...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 ml-2" />
                            שלח דיווח
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Review Form */}
                  {selectedTab === "review" && (
                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">כתוב ביקורת</h3>
                        <div className="p-4 bg-blue-50 rounded-lg mb-6">
                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-blue-600 ml-2" />
                            <span className="font-medium text-blue-900">
                              {selectedSynagogue.name}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            דירוג (1-5 כוכבים)
                          </label>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setReviewForm({ ...reviewForm, rating })}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`w-8 h-8 ${
                                    rating <= reviewForm.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ביקורת
                          </label>
                          <textarea
                            name="comment"
                            value={reviewForm.comment}
                            onChange={(e) =>
                              setReviewForm({ ...reviewForm, comment: e.target.value })
                            }
                            rows={6}
                            placeholder="שתף את החוויה שלך..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-600 ml-2" />
                          <span className="text-sm text-red-800">{error}</span>
                        </div>
                      )}

                      {success && (
                        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                          <span className="text-sm text-green-800">הביקורת נשלחה בהצלחה!</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                            שולח...
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 ml-2" />
                            שלח ביקורת
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Issue Report Form */}
                  {selectedTab === "issue" && (
                    <form onSubmit={handleIssueSubmit} className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">דווח על בעיה</h3>
                        <div className="p-4 bg-blue-50 rounded-lg mb-6">
                          <div className="flex items-center">
                            <MapPin className="w-5 h-5 text-blue-600 ml-2" />
                            <span className="font-medium text-blue-900">
                              {selectedSynagogue.name}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            סוג בעיה
                          </label>
                          <select
                            name="issueType"
                            value={issueForm.issueType}
                            onChange={(e) =>
                              setIssueForm({ ...issueForm, issueType: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="incorrect_info">מידע שגוי</option>
                            <option value="closed">בית כנסת סגור</option>
                            <option value="address">כתובת שגויה</option>
                            <option value="hours">שעות פעילות שגויות</option>
                            <option value="other">אחר</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            תיאור הבעיה
                          </label>
                          <textarea
                            name="description"
                            value={issueForm.description}
                            onChange={(e) =>
                              setIssueForm({ ...issueForm, description: e.target.value })
                            }
                            rows={6}
                            placeholder="תאר את הבעיה בפירוט..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            אימייל ליצירת קשר (אופציונלי)
                          </label>
                          <input
                            type="email"
                            name="contactEmail"
                            value={issueForm.contactEmail}
                            onChange={(e) =>
                              setIssueForm({ ...issueForm, contactEmail: e.target.value })
                            }
                            placeholder="your@email.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-600 ml-2" />
                          <span className="text-sm text-red-800">{error}</span>
                        </div>
                      )}

                      {success && (
                        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 ml-2" />
                          <span className="text-sm text-green-800">הדיווח נשלח בהצלחה!</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                            שולח...
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 ml-2" />
                            שלח דיווח
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

