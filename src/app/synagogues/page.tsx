"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, Filter, MapPin, Star } from "lucide-react";

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

export default function SynagoguesPage() {
  const router = useRouter();
  const [synagogues, setSynagogues] = useState<Synagogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNusach, setSelectedNusach] = useState("");

  useEffect(() => {
    const fetchSynagogues = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedNusach) params.append("nusach", selectedNusach);
        if (searchQuery) params.append("search", searchQuery);

        const response = await fetch(`/api/synagogues?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setSynagogues(data.synagogues);
        }
      } catch (error) {
        console.error("Error fetching synagogues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSynagogues();
  }, [searchQuery, selectedNusach]);

  const handleSynagogueClick = (synagogueId: string) => {
    router.push(`/synagogue/${synagogueId}`);
  };

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
              חזרה
            </Link>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🕍</div>
              <h1 className="text-2xl font-bold text-gray-900">מניין עכשיו</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            בתי כנסת
          </h1>
          <p className="text-gray-600">
            מצא וחקור בתי כנסת ברחבי ישראל
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="חפש לפי שם בית כנסת, כתובת או עיר..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedNusach}
                onChange={(e) => setSelectedNusach(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">כל הנוסחים</option>
                <option value="ASHKENAZ">אשכנז</option>
                <option value="SEPHARD">ספרד</option>
                <option value="EDOT_MIZRACH">עדות המזרח</option>
                <option value="YEMENITE">תימני</option>
                <option value="CHABAD">חב"ד</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : synagogues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <p className="text-gray-600 text-lg">
              לא נמצאו בתי כנסת התואמים לחיפוש שלך
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {synagogues.map((synagogue) => (
              <div
                key={synagogue.id}
                onClick={() => handleSynagogueClick(synagogue.id)}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">
                    {synagogue.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 ms-2">
                    <Star className="w-4 h-4 text-yellow-400 me-1" />
                    {synagogue.averageRating.toFixed(1)}
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 me-2" />
                  <span className="text-sm">
                    {synagogue.address}, {synagogue.city}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {synagogue.nusach}
                  </span>
                  <span className="text-xs text-gray-500">
                    {synagogue.totalReviews} ביקורות
                  </span>
                </div>

                <div className="flex gap-2 text-xs">
                  {synagogue.wheelchairAccess && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      ♿
                    </span>
                  )}
                  {synagogue.parking && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      🅿️
                    </span>
                  )}
                  {synagogue.airConditioning && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      ❄️
                    </span>
                  )}
                </div>

                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  צפה בפרטים
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

