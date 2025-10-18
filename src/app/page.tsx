"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Users, Star, Filter, Search } from "lucide-react";
import Map from "@/components/Map";

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

export default function Home() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [synagogues, setSynagogues] = useState<Synagogue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNusach, setSelectedNusach] = useState("");
  const [selectedPrayer, setSelectedPrayer] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockSynagogues: Synagogue[] = [
    {
      id: "1",
      name: "Congregation Beth Israel",
      address: "123 Main Street",
      city: "Brooklyn, NY",
      latitude: 40.6782,
      longitude: -73.9442,
      nusach: "ASHKENAZ",
      averageRating: 4.5,
      totalReviews: 23,
      wheelchairAccess: true,
      parking: true,
      airConditioning: true,
    },
    {
      id: "2",
      name: "Sephardic Center",
      address: "456 Oak Avenue",
      city: "Brooklyn, NY",
      latitude: 40.6892,
      longitude: -73.9342,
      nusach: "SEPHARD",
      averageRating: 4.2,
      totalReviews: 18,
      wheelchairAccess: false,
      parking: true,
      airConditioning: true,
    },
    {
      id: "3",
      name: "Chabad House",
      address: "789 Pine Street",
      city: "Brooklyn, NY",
      latitude: 40.6682,
      longitude: -73.9542,
      nusach: "CHABAD",
      averageRating: 4.8,
      totalReviews: 31,
      wheelchairAccess: true,
      parking: false,
      airConditioning: false,
    },
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Brooklyn, NY if location access denied
          setUserLocation({ lat: 40.6782, lng: -73.9442 });
        }
      );
    } else {
      setUserLocation({ lat: 40.6782, lng: -73.9442 });
    }

    // Simulate loading synagogues
    setTimeout(() => {
      setSynagogues(mockSynagogues);
      setLoading(false);
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
    window.location.href = `/synagogue/${synagogueId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🕍</div>
              <h1 className="text-2xl font-bold text-gray-900">Minyan Now</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Find Minyan
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Synagogues
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Report
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                About
              </a>
            </nav>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Find an Active Minyan Near You
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            In under a minute
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by location or synagogue name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Filters:
              </span>
            </div>
            <select
              value={selectedNusach}
              onChange={(e) => setSelectedNusach(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Nusach</option>
              <option value="ASHKENAZ">Ashkenaz</option>
              <option value="SEPHARD">Sephard</option>
              <option value="EDOT_MIZRACH">Edot Mizrach</option>
              <option value="YEMENITE">Yemenite</option>
              <option value="CHABAD">Chabad</option>
            </select>
            <select
              value={selectedPrayer}
              onChange={(e) => setSelectedPrayer(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Prayers</option>
              <option value="SHACHARIT">Shacharit</option>
              <option value="MINCHA">Mincha</option>
              <option value="MAARIV">Maariv</option>
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
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Nearby Synagogues
              </h3>
              {loading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : userLocation ? (
                <Map
                  center={userLocation}
                  synagogues={filteredSynagogues}
                  onSynagogueClick={handleSynagogueClick}
                  className="w-full h-96 rounded-lg"
                />
              ) : (
                <div className="h-96 flex items-center justify-center text-gray-500">
                  Loading map...
                </div>
              )}
            </div>
          </div>

          {/* Synagogue List */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Synagogues ({filteredSynagogues.length})
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
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        {synagogue.averageRating.toFixed(1)}
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
                        {synagogue.wheelchairAccess && <span>♿</span>}
                        {synagogue.parking && <span>🅿️</span>}
                        {synagogue.airConditioning && <span>❄️</span>}
                      </div>
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
                  <Clock className="w-4 h-4 mr-2" />
                  View Prayer Times
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
                <div className="text-2xl">🕍</div>
                <h3 className="text-xl font-bold">Minyan Now</h3>
              </div>
              <p className="text-gray-400">
                Find active minyanim and nearby synagogues in real-time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Find Minyan</li>
                <li>Synagogue Search</li>
                <li>Prayer Times</li>
                <li>Community Reports</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Report Issue</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>API Access</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Minyan Now. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
