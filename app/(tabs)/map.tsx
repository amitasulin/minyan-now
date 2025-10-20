import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation, Search, Layers } from 'lucide-react-native';

interface MapLocation {
  id: string;
  name: string;
  type: 'trail' | 'gem';
  category: string;
  latitude: number;
  longitude: number;
  rating: number;
}

const MAP_LOCATIONS: MapLocation[] = [
  {
    id: '1',
    name: 'Historic Cafés Trail Start',
    type: 'trail',
    category: 'Culture',
    latitude: 40.7128,
    longitude: -74.0060,
    rating: 4.8
  },
  {
    id: '2',
    name: 'The Bookshop Cat Café',
    type: 'gem',
    category: 'Food',
    latitude: 40.7180,
    longitude: -74.0020,
    rating: 4.7
  },
  {
    id: '3',
    name: 'Street Art Underground',
    type: 'trail',
    category: 'Art',
    latitude: 40.7200,
    longitude: -74.0100,
    rating: 4.6
  }
];

export default function MapScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  
  const filters = ['All', 'Trails', 'Hidden Gems', 'Food', 'Culture', 'Nature'];

  const renderLocationCard = (location: MapLocation) => (
    <TouchableOpacity 
      key={location.id} 
      style={styles.locationCard}
      onPress={() => setSelectedLocation(location)}
    >
      <View style={styles.locationIcon}>
        <MapPin size={16} color="#14B8A6" />
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationType}>
          {location.type === 'trail' ? '🥾 Trail' : '💎 Hidden Gem'} • {location.category}
        </Text>
      </View>
      <Text style={styles.locationRating}>⭐ {location.rating}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore Map</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="#14B8A6" />
        </TouchableOpacity>
      </View>

      {/* Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterPill, selectedFilter === filter && styles.filterPillActive]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={48} color="#14B8A6" />
          <Text style={styles.mapPlaceholderTitle}>Interactive Map</Text>
          <Text style={styles.mapPlaceholderText}>
            Explore trails and hidden gems on an interactive map
          </Text>
          <TouchableOpacity style={styles.enableMapButton}>
            <Navigation size={16} color="#FFFFFF" />
            <Text style={styles.enableMapText}>Enable Location</Text>
          </TouchableOpacity>
        </View>
        
        {/* Map Controls */}
        <TouchableOpacity style={styles.layersButton}>
          <Layers size={20} color="#14B8A6" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.locationButton}>
          <Navigation size={20} color="#14B8A6" />
        </TouchableOpacity>
      </View>

      {/* Locations List */}
      <View style={styles.locationsSection}>
        <Text style={styles.sectionTitle}>Nearby Locations</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {MAP_LOCATIONS.map(renderLocationCard)}
        </ScrollView>
      </View>

      {/* Selected Location Details */}
      {selectedLocation && (
        <View style={styles.selectedLocationOverlay}>
          <View style={styles.selectedLocationContent}>
            <Text style={styles.selectedLocationName}>{selectedLocation.name}</Text>
            <Text style={styles.selectedLocationMeta}>
              {selectedLocation.type === 'trail' ? '🥾 Trail' : '💎 Hidden Gem'} • {selectedLocation.category} • ⭐ {selectedLocation.rating}
            </Text>
            <View style={styles.selectedLocationActions}>
              <TouchableOpacity style={styles.primaryButton}>
                <Navigation size={16} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Get Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setSelectedLocation(null)}>
                <Text style={styles.secondaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#F0FDFA',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    margin: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  mapPlaceholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 200,
    lineHeight: 22,
    marginBottom: 20,
  },
  enableMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14B8A6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  enableMapText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  layersButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationsSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingHorizontal: 20,
    maxHeight: 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  locationIcon: {
    backgroundColor: '#F0FDFA',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  locationType: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  locationRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  selectedLocationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 100,
  },
  selectedLocationContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  selectedLocationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  selectedLocationMeta: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  selectedLocationActions: {
    flexDirection: 'row',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14B8A6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginRight: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
});