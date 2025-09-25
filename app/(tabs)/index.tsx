import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Clock, Star, Filter } from 'lucide-react-native';

interface Trail {
  id: string;
  title: string;
  category: string;
  duration: string;
  distance: string;
  rating: number;
  image: string;
  description: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
}

interface HiddenGem {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  description: string;
}

const SAMPLE_TRAILS: Trail[] = [
  {
    id: '1',
    title: 'Historic Cafés & Hidden Courtyards',
    category: 'Culture',
    duration: '2h 30min',
    distance: '1.8 km',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg',
    description: 'Discover century-old cafés tucked away in secret courtyards',
    difficulty: 'Easy'
  },
  {
    id: '2',
    title: 'Street Art Underground',
    category: 'Art',
    duration: '1h 45min',
    distance: '2.3 km',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg',
    description: 'Follow vibrant murals through forgotten alleyways',
    difficulty: 'Moderate'
  },
  {
    id: '3',
    title: 'Riverside Secret Gardens',
    category: 'Nature',
    duration: '3h 15min',
    distance: '4.2 km',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg',
    description: 'Peaceful gardens and hidden riverside spots locals love',
    difficulty: 'Easy'
  }
];

const HIDDEN_GEMS: HiddenGem[] = [
  {
    id: '1',
    name: 'The Bookshop Cat Café',
    category: 'Food',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg',
    description: 'Cozy café with resident cats and rare books'
  },
  {
    id: '2',
    name: 'Rooftop Sunset Viewpoint',
    category: 'Views',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg',
    description: 'Secret rooftop with panoramic city views'
  }
];

export default function DiscoverScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Culture', 'Nature', 'Food', 'Art', 'History'];

  const renderTrailCard = (trail: Trail) => (
    <TouchableOpacity key={trail.id} style={styles.trailCard}>
      <Image source={{ uri: trail.image }} style={styles.trailImage} />
      <View style={styles.trailContent}>
        <View style={styles.trailHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{trail.category}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{trail.rating}</Text>
          </View>
        </View>
        <Text style={styles.trailTitle}>{trail.title}</Text>
        <Text style={styles.trailDescription}>{trail.description}</Text>
        <View style={styles.trailMeta}>
          <View style={styles.metaItem}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.metaText}>{trail.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.metaText}>{trail.distance}</Text>
          </View>
          <View style={[styles.difficultyBadge, trail.difficulty === 'Easy' ? styles.difficultyEasy : trail.difficulty === 'Moderate' ? styles.difficultyModerate : styles.difficultyHard]}>
            <Text style={styles.difficultyText}>{trail.difficulty}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHiddenGem = (gem: HiddenGem) => (
    <TouchableOpacity key={gem.id} style={styles.gemCard}>
      <Image source={{ uri: gem.image }} style={styles.gemImage} />
      <View style={styles.gemContent}>
        <View style={styles.gemHeader}>
          <Text style={styles.gemTitle}>{gem.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{gem.rating}</Text>
          </View>
        </View>
        <Text style={styles.gemDescription}>{gem.description}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{gem.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Discover Hidden</Text>
            <Text style={styles.title}>Trails & Gems</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#14B8A6" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryButtonText, selectedCategory === category && styles.categoryButtonTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Trails */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Curated Trails</Text>
          <Text style={styles.sectionSubtitle}>Follow themed routes crafted by locals</Text>
          {SAMPLE_TRAILS.map(renderTrailCard)}
        </View>

        {/* Hidden Gems */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hidden Gems</Text>
          <Text style={styles.sectionSubtitle}>Secret spots off the beaten path</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gemsContainer}>
            {HIDDEN_GEMS.map(renderHiddenGem)}
          </ScrollView>
        </View>
      </ScrollView>
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
  filterButton: {
    backgroundColor: '#F0FDFA',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  trailCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trailImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  trailContent: {
    padding: 16,
  },
  trailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
  },
  trailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  trailDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  trailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  difficultyEasy: {
    backgroundColor: '#D1FAE5',
  },
  difficultyModerate: {
    backgroundColor: '#FEF3C7',
  },
  difficultyHard: {
    backgroundColor: '#FECACA',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  gemsContainer: {
    paddingHorizontal: 20,
  },
  gemCard: {
    backgroundColor: '#FFFFFF',
    width: 250,
    marginRight: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gemImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  gemContent: {
    padding: 16,
  },
  gemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  gemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  gemDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
});