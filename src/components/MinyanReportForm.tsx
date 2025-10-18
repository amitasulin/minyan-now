"use client";

import { useState } from "react";
import { MapPin, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface MinyanReportFormProps {
  synagogueId: string;
  synagogueName: string;
  onClose: () => void;
  onReportSubmitted: () => void;
}

export default function MinyanReportForm({
  synagogueId,
  synagogueName,
  onClose,
  onReportSubmitted,
}: MinyanReportFormProps) {
  const [formData, setFormData] = useState({
    prayerType: "SHACHARIT",
    status: "ACTIVE_NOW",
    minyanCount: "",
    needsMore: "",
    notes: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Unable to get your location. Please enable location services."
          );
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/minyan-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          synagogueId,
          userId: "demo-user-id", // In production, get from auth context
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      onReportSubmitted();
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      setError("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Report Minyan Status
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">
                {synagogueName}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prayer Type
              </label>
              <select
                name="prayerType"
                value={formData.prayerType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="SHACHARIT">Shacharit (Morning)</option>
                <option value="MINCHA">Mincha (Afternoon)</option>
                <option value="MAARIV">Maariv (Evening)</option>
                <option value="MUSAF">Musaf</option>
                <option value="NEILAH">Neilah</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="ACTIVE_NOW">🟢 Minyan Active Now</option>
                <option value="STARTING_SOON">🟡 Starting Soon</option>
                <option value="NEEDS_MORE">🔴 Need More People</option>
                <option value="FINISHED">⚫ Finished</option>
                <option value="NO_MINYAN">❌ No Minyan</option>
                <option value="CANCELLED">🚫 Cancelled</option>
              </select>
            </div>

            {formData.status === "NEEDS_MORE" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many more people needed?
                </label>
                <input
                  type="number"
                  name="needsMore"
                  value={formData.needsMore}
                  onChange={handleInputChange}
                  min="1"
                  max="9"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {formData.status === "ACTIVE_NOW" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many people are present? (optional)
                </label>
                <input
                  type="number"
                  name="minyanCount"
                  value={formData.minyanCount}
                  onChange={handleInputChange}
                  min="10"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Any additional information about the minyan..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm text-gray-600">
                  {formData.latitude && formData.longitude
                    ? "Location verified"
                    : "Location not verified"}
                </span>
              </div>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Verify Location
              </button>
            </div>

            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
