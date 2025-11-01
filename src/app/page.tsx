"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useReducer, useEffect, Reducer } from "react";
import { MapPin, Clock, Users, Star, Filter, Search } from "lucide-react";

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

// Real Israeli synagogue data
const mockSynagogues: Synagogue[] = [
  {
    id: "1",
    name: "בית הכנסת הגדול - תל אביב",
    address: "רחוב אלנבי 110",
    city: "תל אביב-יפו",
    latitude: 32.0643,
    longitude: 34.7704,
    nusach: "ASHKENAZ",
    averageRating: 4.7,
    totalReviews: 145,
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
  },
  {
    id: "2",
    name: "בית הכנסת החורבה",
    address: "הרובע היהודי",
    city: "ירושלים",
    latitude: 31.7746,
    longitude: 35.2298,
    nusach: "ASHKENAZ",
    averageRating: 4.9,
    totalReviews: 289,
    wheelchairAccess: true,
    parking: false,
    airConditioning: true,
  },
  {
    id: "3",
    name: "בית הכנסת הספרדי - ירושלים",
    address: "רחוב בן יהדה 45",
    city: "ירושלים",
    latitude: 31.7781,
    longitude: 35.2246,
    nusach: "SEPHARD",
    averageRating: 4.6,
    totalReviews: 178,
    wheelchairAccess: false,
    parking: true,
    airConditioning: true,
  },
  {
    id: "4",
    name: "בית כנסת חב\"ד רמת אביב",
    address: "רחוב רמת אביב 30",
    city: "תל אביב-יפו",
    latitude: 32.1173,
    longitude: 34.8069,
    nusach: "CHABAD",
    averageRating: 4.8,
    totalReviews: 92,
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
  },
  {
    id: "5",
    name: "בית הכנסת העתיק בטבריה",
    address: "הרובע היהודי העתיק",
    city: "טבריה",
    latitude: 32.7894,
    longitude: 35.5426,
    nusach: "SEPHARD",
    averageRating: 4.5,
    totalReviews: 67,
    wheelchairAccess: false,
    parking: false,
    airConditioning: false,
  },
  {
    id: "6",
    name: "בית הכנסת אוהל משה - חיפה",
    address: "רחוב הרצל 50",
    city: "חיפה",
    latitude: 32.8192,
    longitude: 34.9992,
    nusach: "ASHKENAZ",
    averageRating: 4.4,
    totalReviews: 134,
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
  },
  {
    id: "7",
    name: "בית הכנסת עדת ישורון - נתניה",
    address: "רחוב בן גוריון 15",
    city: "נתניה",
    latitude: 32.3298,
    longitude: 34.8572,
    nusach: "EDOT_MIZRACH",
    averageRating: 4.6,
    totalReviews: 98,
    wheelchairAccess: true,
    parking: true,
    airConditioning: true,
  },
  {
    id: "8",
    name: "בית הכנסת אור החיים - בני ברק",
    address: "רחוב רבי עקיבא 120",
    city: "בני ברק",
    latitude: 32.0918,
    longitude: 34.8268,
    nusach: "ASHKENAZ",
    averageRating: 4.9,
    totalReviews: 234,
    wheelchairAccess: true,
    parking: false,
    airConditioning: true,
  },
];

export default function Home() {
  const router = useRouter();
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

    // Simulate loading synagogues
    setTimeout(() => {
      dispatch({
        type: "SET_SYNAGOGUES_AND_FINISH_LOADING",
        payload: mockSynagogues,
      });
    }, 1000);
  }, []);

  const filteredSynagogues = synagogues.filter((synagogue) => {
    const matchesSearch =
      synagogue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      synagogue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      synagogue.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNusach =
      !selectedNusach || synagogue.nusach === selectedNusach;
    return matchesSearch && matchesNusach;
  });

  const handleSynagogueClick = (synagogueId: string) => {
    router.push(`/synagogue/${synagogueId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🕍</div>
              <h1 className="text-2xl font-bold text-gray-900">מניין עכשיו</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                מצא מניין
              </Link>
              <Link
                href="/synagogues"
                className="text-gray-600 hover:text-gray-900"
              >
                בתי כנסת
              </Link>
              <Link
                href="/report"
                className="text-gray-600 hover:text-gray-900"
              >
                דווח
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                אודות
              </Link>
            </nav>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              התחבר
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            מצא מניין פעיל בקרבתך
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">בפחות מדקה</p>
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="חפש לפי מיקום או שם בית כנסת..."
                  value={searchQuery}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_SEARCH_QUERY",
                      payload: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center justify-center sm:w-auto w-full">
                <Search className="w-5 h-5 ms-2" />
                חיפוש
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-500 ms-2" />
              <span className="text-sm font-medium text-gray-700">סינון:</span>
            </div>
            <select
              value={selectedNusach}
              onChange={(e) =>
                dispatch({
                  type: "SET_SELECTED_NUSACH",
                  payload: e.target.value,
                })
              }
              aria-label="Filter by Nusach"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">כל הנוסחים</option>
              <option value="ASHKENAZ">אשכנז</option>
              <option value="SEPHARD">ספרד</option>
              <option value="EDOT_MIZRACH">עדות המזרח</option>
              <option value="YEMENITE">תימני</option>
              <option value="CHABAD">חב"ד</option>
            </select>
            <select
              value={selectedPrayer}
              onChange={(e) =>
                dispatch({
                  type: "SET_SELECTED_PRAYER",
                  payload: e.target.value,
                })
              }
              aria-label="Filter by Prayer"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                <MapPin className="w-5 h-5 ms-2 text-blue-600" />
                בתי כנסת בקרבת מקום
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
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                <Users className="w-5 h-5 ms-2 text-blue-600" />
                בתי כנסת ({filteredSynagogues.length})
              </h3>
              <div className="space-y-3">
                {filteredSynagogues.map((synagogue) => (
                  <div
                    key={synagogue.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                    onClick={() => handleSynagogueClick(synagogue.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {synagogue.name}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 me-1" />
                        {synagogue.averageRating.toLocaleString("he-IL", {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}
                        <span className="ml-1">({synagogue.totalReviews})</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {synagogue.address}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {synagogue.city}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {synagogue.nusach}
                      </span>
                      <div className="flex space-x-2 text-xs text-gray-500">
                        {synagogue.wheelchairAccess && (
                          <span role="img" aria-label="Wheelchair accessible">
                            ♿
                          </span>
                        )}
                        {synagogue.parking && (
                          <span role="img" aria-label="Parking available">
                            🅿️
                          </span>
                        )}
                        {synagogue.airConditioning && (
                          <span role="img" aria-label="Air conditioning">
                            ❄️
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                פעולות מהירות
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center">
                  <Users className="w-4 h-4 ms-2" />
                  דווח על מניין פעיל
                </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                  <Clock className="w-4 h-4 ms-2" />
                  צפה בזמני תפילה
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl ms-2">🕍</div>
                <h3 className="text-xl font-bold">מניין עכשיו</h3>
              </div>
              <p className="text-gray-400">
                מצא מניינים פעילים ובתי כנסת בקרבתך בזמן אמת.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">תכונות</h4>
              <ul className="space-y-2 text-gray-400">
                <li>מצא מניין</li>
                <li>חיפוש בתי כנסת</li>
                <li>זמני תפילה</li>
                <li>דיווחים מהקהילה</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">תמיכה</h4>
              <ul className="space-y-2 text-gray-400">
                <li>מרכז עזרה</li>
                <li>צור קשר</li>
                <li>דווח על תקלה</li>
                <li>שאלות נפוצות</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">קהילה</h4>
              <ul className="space-y-2 text-gray-400">
                <li>אודותינו</li>
                <li>מדיניות פרטיות</li>
                <li>תנאי שימוש</li>
                <li>גישת API</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 מניין עכשיו. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
