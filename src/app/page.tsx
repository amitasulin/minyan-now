"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useReducer, useEffect, useState, Reducer } from "react";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Filter,
  Search,
  TrendingUp,
  Navigation,
  Sparkles,
  X,
  Menu,
} from "lucide-react";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => (
    <div className="h-96 flex items-center justify-center text-gray-500">
      טוען מפה...
    </div>
  ),
  ssr: false,
});

interface Synagogue {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  nusach: string;
  averageRating: number;
  totalReviews: number;
  wheelchairAccess: boolean;
  parking: boolean;
  airConditioning: boolean;
}

interface State {
  userLocation: { lat: number; lng: number } | null;
  synagogues: Synagogue[];
  searchQuery: string;
  selectedNusach: string;
  selectedPrayer: string;
  loading: boolean;
}

type Action =
  | { type: "SET_USER_LOCATION"; payload: { lat: number; lng: number } }
  | { type: "SET_SYNAGOGUES_AND_FINISH_LOADING"; payload: Synagogue[] }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_NUSACH"; payload: string }
  | { type: "SET_SELECTED_PRAYER"; payload: string };

const initialState: State = {
  userLocation: null,
  synagogues: [],
  searchQuery: "",
  selectedNusach: "",
  selectedPrayer: "",
  loading: true,
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "SET_USER_LOCATION":
      return { ...state, userLocation: action.payload };
    case "SET_SYNAGOGUES_AND_FINISH_LOADING":
      return { ...state, synagogues: action.payload, loading: false };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_SELECTED_NUSACH":
      return { ...state, selectedNusach: action.payload };
    case "SET_SELECTED_PRAYER":
      return { ...state, selectedPrayer: action.payload };
    default:
      return state;
  }
};


export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    userLocation,
    synagogues,
    searchQuery,
    selectedNusach,
    selectedPrayer,
    loading,
  } = state;

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch({
            type: "SET_USER_LOCATION",
            payload: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        },
        (error: GeolocationPositionError) => {
          console.error("Error getting location:", error);
          // Default to Tel Aviv, Israel if location access denied
          dispatch({
            type: "SET_USER_LOCATION",
            payload: { lat: 32.0853, lng: 34.7818 },
          });
        }
      );
    } else {
      dispatch({
        type: "SET_USER_LOCATION",
        payload: { lat: 32.0853, lng: 34.7818 },
      });
    }

    // Fetch synagogues from API
    const fetchSynagogues = async (location?: { lat: number; lng: number }) => {
      try {
        const params = new URLSearchParams();
        // Use large radius to show all synagogues initially
        if (location) {
          params.append("lat", location.lat.toString());
          params.append("lng", location.lng.toString());
          params.append("radius", "200"); // 200km to cover all of Israel
        }

        const response = await fetch(`/api/synagogues?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          dispatch({
            type: "SET_SYNAGOGUES_AND_FINISH_LOADING",
            payload: data.synagogues || [],
          });
        } else {
          console.error("Failed to fetch synagogues");
          // Fallback to empty array on error
          dispatch({
            type: "SET_SYNAGOGUES_AND_FINISH_LOADING",
            payload: [],
          });
        }
      } catch (error) {
        console.error("Error fetching synagogues:", error);
        // Fallback to empty array on error
        dispatch({
          type: "SET_SYNAGOGUES_AND_FINISH_LOADING",
          payload: [],
        });
      }
    };

    // Fetch synagogues when location is available
    if (userLocation) {
      fetchSynagogues(userLocation);
    } else {
      fetchSynagogues();
    }
  }, []);

  // Refetch synagogues when search query or filters change
  useEffect(() => {
    const fetchSynagogues = async (location?: { lat: number; lng: number }) => {
      try {
        const params = new URLSearchParams();
        
        // Only use geographic filter if there's NO search query (search should work across all of Israel)
        // If there's a search query, don't limit by location - search everywhere
        if (location && !searchQuery) {
          if (selectedNusach) {
            // If filtering by nusach only, use moderate radius
            params.append("lat", location.lat.toString());
            params.append("lng", location.lng.toString());
            params.append("radius", "50"); // 50km radius when filtering by nusach
          } else {
            // If no filters at all, use a very large radius to show all synagogues
            params.append("lat", location.lat.toString());
            params.append("lng", location.lng.toString());
            params.append("radius", "200"); // 200km to cover all of Israel
          }
        }
        // If there's a search query, don't add geographic filter - search everywhere
        
        if (selectedNusach) {
          params.append("nusach", selectedNusach);
        }
        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const response = await fetch(`/api/synagogues?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          dispatch({
            type: "SET_SYNAGOGUES_AND_FINISH_LOADING",
            payload: data.synagogues || [],
          });
        } else {
          console.error("Failed to fetch synagogues:", response.status);
          // Don't clear synagogues on error, keep existing ones
        }
      } catch (error) {
        console.error("Error fetching synagogues:", error);
        // Don't clear synagogues on error, keep existing ones
      }
    };

    // Debounce search query
    const timeoutId = setTimeout(() => {
      if (userLocation) {
        fetchSynagogues(userLocation);
      } else {
        fetchSynagogues();
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedNusach, userLocation]);

  // Helper function to get Hebrew nusach name
  const getNusachHebrewName = (nusach: string): string => {
    const nusachMap: { [key: string]: string } = {
      ASHKENAZ: "אשכנז",
      SEPHARD: "ספרד",
      EDOT_MIZRACH: "עדות המזרח",
      YEMENITE: "תימני",
      CHABAD: "חב\"ד",
    };
    return nusachMap[nusach] || nusach;
  };

  // The synagogues are already filtered by the API, so we just use them directly
  // Only apply client-side filtering if needed for additional features
  const filteredSynagogues = synagogues;

  const handleSearchClear = () => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const handleSynagogueClick = (synagogueId: string) => {
    router.push(`/synagogue/${synagogueId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl transform hover:scale-110 transition-transform">
                🕍
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                מניין עכשיו
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                מצא מניין
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/synagogues"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                בתי כנסת
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/report"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                דווח
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group"
              >
                אודות
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
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
            
            {/* Desktop Login Button */}
            <button className="hidden md:block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 font-semibold">
              התחבר
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
                  className="text-gray-700 hover:text-blue-600 font-medium py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors text-right"
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
                <button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all font-semibold text-right">
                  התחבר
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse me-2" />
              <span className="text-blue-200 font-semibold">פלטפורמה קהילתית</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in">
              מצא מניין פעיל
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                בקרבתך
              </span>
            </h2>
            <p className="text-2xl md:text-3xl mb-4 text-blue-100 font-light">
              בפחות מדקה
            </p>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              יותר מ-{synagogues.length} בתי כנסת ברחבי ישראל זמינים עכשיו
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  {searchQuery && (
                    <button
                      onClick={handleSearchClear}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                      aria-label="נקה חיפוש"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <input
                    type="text"
                    id="search-input"
                    name="search"
                    placeholder="חפש לפי מיקום, שם בית כנסת, עיר או נוסח..."
                    value={searchQuery}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_SEARCH_QUERY",
                        payload: e.target.value,
                      })
                    }
                    onKeyDown={handleKeyDown}
                    className={`w-full px-4 py-4 ${searchQuery ? "pr-12 pl-12" : "pr-12"} rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg transition-all`}
                  />
                </div>
                <button
                  onClick={() => {
                    const input = document.querySelector(
                      'input[type="text"][placeholder*="חפש"]'
                    ) as HTMLInputElement;
                    input?.focus();
                  }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-bold hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center sm:w-auto w-full"
                >
                  <Search className="w-5 h-5 ms-2" />
                  חיפוש
                </button>
              </div>
              {searchQuery && (
                <div className="mt-4 text-right text-blue-100 text-sm">
                  נמצאו {filteredSynagogues.length} תוצאות עבור &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold text-yellow-300 mb-1">
                {synagogues.length}
              </div>
              <div className="text-sm text-blue-200">בתי כנסת</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold text-yellow-300 mb-1">
                <TrendingUp className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-sm text-blue-200">דיווחים חיים</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold text-yellow-300 mb-1">
                <Navigation className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-sm text-blue-200">ניווט מדויק</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="text-3xl font-bold text-yellow-300 mb-1">24/7</div>
              <div className="text-sm text-blue-200">זמינות</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-gradient-to-r from-gray-50 to-white py-6 border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
              <Filter className="w-5 h-5 text-blue-600 ms-2" />
              <span className="text-sm font-semibold text-gray-800">סינון:</span>
            </div>
            <select
              id="nusach-filter"
              name="nusach"
              value={selectedNusach}
              onChange={(e) =>
                dispatch({
                  type: "SET_SELECTED_NUSACH",
                  payload: e.target.value,
                })
              }
              aria-label="Filter by Nusach"
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-blue-300 transition-colors font-medium"
            >
              <option value="">כל הנוסחים</option>
              <option value="ASHKENAZ">אשכנז</option>
              <option value="SEPHARD">ספרד</option>
              <option value="EDOT_MIZRACH">עדות המזרח</option>
              <option value="YEMENITE">תימני</option>
              <option value="CHABAD">חב&quot;ד</option>
            </select>
            <select
              id="prayer-filter"
              name="prayer"
              value={selectedPrayer}
              onChange={(e) =>
                dispatch({
                  type: "SET_SELECTED_PRAYER",
                  payload: e.target.value,
                })
              }
              aria-label="Filter by Prayer"
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-blue-300 transition-colors font-medium"
            >
              <option value="">כל התפילות</option>
              <option value="SHACHARIT">שחרית</option>
              <option value="MINCHA">מנחה</option>
              <option value="MAARIV">ערבית</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg me-3 shadow-md">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                בתי כנסת בקרבת מקום
                <span className="ms-2 text-sm font-normal text-gray-500">
                  ({filteredSynagogues.length} תוצאות)
                </span>
              </h3>
              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : userLocation ? (
                <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
                  <Map
                    center={userLocation}
                    synagogues={filteredSynagogues.map((s) => ({
                      id: s.id,
                      name: s.name,
                      latitude: s.latitude,
                      longitude: s.longitude,
                      address: s.address,
                      city: s.city,
                      averageRating: s.averageRating,
                    }))}
                    onSynagogueClick={handleSynagogueClick}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-500">
                  טוען מפה...
                </div>
              )}
            </div>
          </div>

          {/* Synagogue List */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold mb-5 flex items-center text-gray-900">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg me-3 shadow-md">
                  <Users className="w-5 h-5 text-white" />
                </div>
                בתי כנסת
                <span className="ms-2 text-sm font-normal text-gray-500">
                  ({filteredSynagogues.length})
                </span>
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                {filteredSynagogues.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-600 font-semibold text-lg mb-2">
                      לא נמצאו תוצאות
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      {searchQuery
                        ? `אין בתי כנסת התואמים לחיפוש "${searchQuery}"`
                        : "נסה לשנות את המסננים או לבצע חיפוש אחר"}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={handleSearchClear}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                      >
                        נקה חיפוש
                      </button>
                    )}
                  </div>
                ) : (
                  filteredSynagogues.map((synagogue, index) => (
                  <div
                    key={synagogue.id}
                    className="group p-4 border-2 border-gray-100 rounded-xl hover:border-blue-300 hover:shadow-lg cursor-pointer transition-all transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50"
                    onClick={() => handleSynagogueClick(synagogue.id)}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                        {synagogue.name}
                      </h4>
                      <div className="flex items-center text-sm bg-yellow-50 px-2 py-1 rounded-lg ms-3 border border-yellow-200">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 me-1" />
                        <span className="font-bold text-yellow-700">
                          {synagogue.averageRating.toLocaleString("he-IL", {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })}
                        </span>
                        <span className="ms-1 text-xs text-gray-500">
                          ({synagogue.totalReviews})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 me-2 text-gray-400" />
                      <span className="line-clamp-1">{synagogue.address}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 font-medium">
                      {synagogue.city}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg shadow-sm">
                        {synagogue.nusach}
                      </span>
                      <div className="flex gap-2">
                        {synagogue.wheelchairAccess && (
                          <span
                            className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium"
                            title="נגיש לכסא גלגלים"
                          >
                            ♿
                          </span>
                        )}
                        {synagogue.parking && (
                          <span
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                            title="חניה"
                          >
                            🅿️
                          </span>
                        )}
                        {synagogue.airConditioning && (
                          <span
                            className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium"
                            title="מיזוג אוויר"
                          >
                            ❄️
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl border border-blue-100 p-6">
              <h3 className="text-xl font-bold mb-5 text-gray-900 flex items-center">
                <Sparkles className="w-5 h-5 me-2 text-blue-600" />
                פעולות מהירות
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <Users className="w-5 h-5 ms-2" />
                  דווח על מניין פעיל
                </button>
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <Clock className="w-5 h-5 ms-2" />
                  צפה בזמני תפילה
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="text-3xl ms-2 transform hover:scale-110 transition-transform">
                  🕍
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                  מניין עכשיו
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                מצא מניינים פעילים ובתי כנסת בקרבתך בזמן אמת. פלטפורמה קהילתית
                לחיבור יהודי ברחבי ישראל.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-lg text-blue-300">תכונות</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">
                  מצא מניין
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  חיפוש בתי כנסת
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  זמני תפילה
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  דיווחים מהקהילה
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-lg text-blue-300">תמיכה</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">
                  מרכז עזרה
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  צור קשר
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  דווח על תקלה
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  שאלות נפוצות
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-5 text-lg text-blue-300">קהילה</h4>
              <ul className="space-y-3 text-gray-400">
                <Link
                  href="/about"
                  className="block hover:text-white transition-colors"
                >
                  אודותינו
                </Link>
                <li className="hover:text-white transition-colors cursor-pointer">
                  מדיניות פרטיות
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  תנאי שימוש
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  גישת API
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-right">
                &copy; 2024 מניין עכשיו. כל הזכויות שמורות.
              </p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  📱
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  ✉️
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  🌐
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

