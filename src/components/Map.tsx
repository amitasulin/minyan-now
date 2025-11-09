"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, InfoWindow, useLoadScript } from "@react-google-maps/api";

interface MapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  synagogues: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    averageRating?: number;
  }>;
  onSynagogueClick: (synagogueId: string) => void;
  className?: string;
}

const libraries: (
  | "places"
  | "geometry"
  | "drawing"
  | "visualization"
  | "marker"
)[] = ["places", "marker"];

const MapComponent = ({
  center,
  zoom = 13,
  synagogues = [],
  onSynagogueClick,
  className = "w-full h-96",
}: MapProps) => {
  const [selectedSynagogue, setSelectedSynagogue] = useState<string | null>(
    null
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Use useLoadScript hook instead of LoadScript component to prevent double loading
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });

  const mapContainerStyle = {
    width: "100%",
    height: className.includes("h-") ? "100%" : "384px",
  };

  // Get map ID from environment or use demo
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";
  const isDemoMapId = mapId === "DEMO_MAP_ID";

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    mapId: mapId, // Required for AdvancedMarkerElement
    // Only use styles if using DEMO_MAP_ID (no custom map style)
    // If using a real Map ID, the styles are defined in the Map Style, so don't override them
    ...(isDemoMapId && {
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    }),
  };

  // Custom synagogue icon element
  const createMarkerContent = useCallback(() => {
    const div = document.createElement("div");
    div.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path fill="#1e40af" d="M16 2L2 10v4h2v10c0 2.2 1.8 4 4 4h6v6h8v-6h6c2.2 0 4-1.8 4-4V14h2v-4L16 2z"/>
        <circle cx="16" cy="18" r="3" fill="#fbbf24"/>
      </svg>
    `;
    div.style.width = "32px";
    div.style.height = "32px";
    div.style.cursor = "pointer";
    return div;
  }, []);

  const handleMarkerClick = useCallback((synagogueId: string) => {
    setSelectedSynagogue(synagogueId);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedSynagogue(null);
  }, []);

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border-2 border-red-200">
        <div className="text-center p-6 max-w-md">
          <div className="text-4xl mb-4">🗺️</div>
          <p className="text-red-600 font-bold text-lg mb-2">
            מפתח API לא הוגדר
          </p>
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            כדי שהמפה תעבוד, יש צורך להגדיר מפתח API של Google Maps.
          </p>
          <div className="bg-white rounded-lg p-4 text-right text-xs text-gray-600 border border-gray-200">
            <p className="font-semibold mb-2">איך להגדיר:</p>
            <ol className="list-decimal list-inside space-y-1 text-right">
              <li>
                צור קובץ{" "}
                <code className="bg-gray-100 px-1 rounded">.env.local</code>{" "}
                בתיקיית השורש
              </li>
              <li>
                הוסף את השורה:
                <br />
                <code className="bg-gray-100 px-2 py-1 rounded block mt-1">
                  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=&quot;המפתח_שלך&quot;
                </code>
              </li>
              <li>קבל מפתח מ-Google Cloud Console</li>
              <li>רענן את הדף</li>
            </ol>
          </div>
          <a
            href="https://console.cloud.google.com/google/maps-apis"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors"
          >
            קבל מפתח API מהקישור הזה
          </a>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center p-6">
          <p className="text-red-600 font-bold">שגיאה בטעינת Google Maps</p>
          <p className="text-sm text-gray-700 mt-2">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען מפה...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={mapOptions}
        onLoad={(mapInstance) => {
          setMap(mapInstance);
        }}
      >
        {synagogues.map((synagogue) => (
          <div key={synagogue.id}>
            {selectedSynagogue === synagogue.id && (
              <InfoWindow
                position={{ lat: synagogue.latitude, lng: synagogue.longitude }}
                onCloseClick={handleInfoWindowClose}
              >
                <div
                  style={{
                    direction: "rtl",
                    minWidth: "200px",
                    padding: "8px",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: "600",
                      marginBottom: "4px",
                      fontSize: "14px",
                      color: "#111827",
                    }}
                  >
                    {synagogue.name}
                  </h3>
                  {synagogue.address && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#4b5563",
                        marginBottom: "4px",
                      }}
                    >
                      {synagogue.address}
                    </p>
                  )}
                  {synagogue.city && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "8px",
                      }}
                    >
                      {synagogue.city}
                    </p>
                  )}
                  {synagogue.averageRating && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#d97706",
                        marginBottom: "8px",
                      }}
                    >
                      ⭐ {synagogue.averageRating.toFixed(1)}
                    </p>
                  )}
                  <button
                    onClick={() => {
                      onSynagogueClick(synagogue.id);
                      handleInfoWindowClose();
                    }}
                    style={{
                      width: "100%",
                      marginTop: "8px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      fontSize: "12px",
                      padding: "4px 12px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1d4ed8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#2563eb";
                    }}
                  >
                    פרטים נוספים
                  </button>
                </div>
              </InfoWindow>
            )}
          </div>
        ))}
      </GoogleMap>
      <AdvancedMarkers
        map={map}
        synagogues={synagogues}
        onMarkerClick={handleMarkerClick}
        createMarkerContent={createMarkerContent}
      />
    </>
  );
};

// Component to handle AdvancedMarkerElement creation
const AdvancedMarkers = ({
  map,
  synagogues,
  onMarkerClick,
  createMarkerContent,
}: {
  map: google.maps.Map | null;
  synagogues: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }>;
  onMarkerClick: (synagogueId: string) => void;
  createMarkerContent: () => HTMLElement;
}) => {
  const markersRef = useRef<
    Map<string, google.maps.marker.AdvancedMarkerElement>
  >(new Map());

  useEffect(() => {
    if (!map || !window.google?.maps) return;

    // Load marker library if not already loaded
    const loadMarkers = async () => {
      try {
        // Check if marker library is already loaded
        if (!window.google.maps.marker) {
          await window.google.maps.importLibrary("marker");
        }

        // Clean up old markers
        markersRef.current.forEach((marker) => {
          marker.map = null;
        });
        markersRef.current.clear();

        // Create new markers
        synagogues.forEach((synagogue) => {
          const markerElement = createMarkerContent();

          const marker = new window.google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat: synagogue.latitude, lng: synagogue.longitude },
            content: markerElement,
            title: synagogue.name,
          });

          markerElement.addEventListener("click", () => {
            onMarkerClick(synagogue.id);
          });

          markersRef.current.set(synagogue.id, marker);
        });
      } catch (error) {
        console.error("Error loading markers:", error);
      }
    };

    loadMarkers();

    // Cleanup function
    return () => {
      markersRef.current.forEach((marker) => {
        marker.map = null;
      });
      markersRef.current.clear();
    };
  }, [map, synagogues, onMarkerClick, createMarkerContent]);

  return null;
};

export default MapComponent;
