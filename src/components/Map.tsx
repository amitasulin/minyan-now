"use client";

import { useEffect, useRef, useState } from "react";

interface MapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  synagogues?: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    nusach: string;
    averageRating: number;
  }>;
  onSynagogueClick?: (synagogueId: string) => void;
  className?: string;
}

export default function Map({
  center,
  zoom = 13,
  synagogues = [],
  onSynagogueClick,
  className = "w-full h-96",
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      // Wait for Google Maps to be loaded
      if (typeof window === "undefined" || !window.google) {
        console.error("Google Maps not loaded");
        return;
      }

      try {
        // Import the Maps library
        const { Map } = (await google.maps.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;

        if (mapRef.current) {
          const mapInstance = new Map(mapRef.current, {
            center,
            zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          });

          setMap(mapInstance);
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    // Wait for Google Maps to be available
    const checkGoogleMaps = () => {
      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps
      ) {
        initMap();
      } else {
        // Retry after a short delay
        setTimeout(checkGoogleMaps, 100);
      }
    };

    checkGoogleMaps();
  }, []);

  useEffect(() => {
    if (!map || !synagogues.length) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));

    const newMarkers = synagogues.map((synagogue) => {
      const marker = new google.maps.Marker({
        position: { lat: synagogue.latitude, lng: synagogue.longitude },
        map,
        title: synagogue.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#2563eb" stroke="#ffffff" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-family="Arial">🕍</text>
            </svg>
          `)}`,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        },
      });

      marker.addListener("click", () => {
        if (onSynagogueClick) {
          onSynagogueClick(synagogue.id);
        }
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Fit map to show all synagogues
    if (synagogues.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      synagogues.forEach((synagogue) => {
        bounds.extend({ lat: synagogue.latitude, lng: synagogue.longitude });
      });
      map.fitBounds(bounds);
    }
  }, [map, synagogues, onSynagogueClick]);

  return (
    <div className={className} style={{ minHeight: "300px" }}>
      <div ref={mapRef} className="w-full h-full" />
      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
