"use client";

import { useState, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

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

  const mapContainerStyle = {
    width: "100%",
    height: className.includes("h-") ? "100%" : "384px",
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  // Custom synagogue icon
  const synagogueIcon = {
    url: "data:image/svg+xml;base64," + btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path fill="#1e40af" d="M16 2L2 10v4h2v10c0 2.2 1.8 4 4 4h6v6h8v-6h6c2.2 0 4-1.8 4-4V14h2v-4L16 2z"/>
        <circle cx="16" cy="18" r="3" fill="#fbbf24"/>
      </svg>
    `),
    scaledSize: { width: 32, height: 32 } as google.maps.Size,
    anchor: { x: 16, y: 32 } as google.maps.Point,
  };

  const handleMarkerClick = useCallback(
    (synagogueId: string) => {
      setSelectedSynagogue(synagogueId);
    },
    []
  );

  const handleInfoWindowClose = useCallback(() => {
    setSelectedSynagogue(null);
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      options={mapOptions}
    >
      {synagogues.map((synagogue) => (
        <div key={synagogue.id}>
          <Marker
            position={{ lat: synagogue.latitude, lng: synagogue.longitude }}
            icon={synagogueIcon}
            onClick={() => handleMarkerClick(synagogue.id)}
            title={synagogue.name}
          />
          {selectedSynagogue === synagogue.id && (
            <InfoWindow
              position={{ lat: synagogue.latitude, lng: synagogue.longitude }}
              onCloseClick={handleInfoWindowClose}
            >
              <div style={{ direction: "rtl", minWidth: "200px", padding: "8px" }}>
                <h3 style={{ fontWeight: "600", marginBottom: "4px", fontSize: "14px", color: "#111827" }}>
                  {synagogue.name}
                </h3>
                {synagogue.address && (
                  <p style={{ fontSize: "12px", color: "#4b5563", marginBottom: "4px" }}>
                    {synagogue.address}
                  </p>
                )}
                {synagogue.city && (
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
                    {synagogue.city}
                  </p>
                )}
                {synagogue.averageRating && (
                  <p style={{ fontSize: "12px", color: "#d97706", marginBottom: "8px" }}>
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
  );
};

export default MapComponent;
