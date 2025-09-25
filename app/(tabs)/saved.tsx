import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MapPin, Clock, Download, Trash2 } from 'lucide-react-native';

interface SavedItem {
  id: string;
  title: string;
  type: 'trail' | 'gem';
  category: string;
  image: string;
  rating: number;
  duration?: string;
  distance?: string;
  savedDate: string;
  downloaded: boolean;
}

const SAVED_ITEMS: SavedItem[] = [
  {
    id: '1',
    title: 'Historic Cafés & Hidden Courtyards',
    type: 'trail',
    category: 'Culture',
    image: 'https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg',
    rating: 4.8,
    duration: '2h 30min',
    distance: '1.8 km',
    savedDate: '2 days ago',
    downloaded: true
  },
  {
    id: '2',
    title: 'The Bookshop Cat Café',
    type: 'gem',
    category: 'Food',
    image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg',
    rating: 4.7,
    savedDate: '1 week ago',
    downloaded: false
  },
  {
    id: '3',
    title: 'Riverside Secret Gardens',
    type: 'trail',
    category: 'Nature',
    image: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg',
    rating: 4.9,
    duration: '3h 15min',
    distance: '4.2 km',
    savedDate: '3 days ago',
    downloaded: true
  }
];

export default function SavedScreen() {
  const [savedItems, setSavedItems] = useState(SAVED_ITEMS);
  const [selectedTab, setSelectedTab] = useState('all');

  const filteredItems = savedItems.filter(item => {
    if (selectedTab === 'trails') return item.type === 'trail';
    if (selectedTab === 'gems') return item.type === 'gem';
    if (selectedTab === 'offline') return item.downloaded;
    return true;
  });

  const handleDownload = (itemId: string) => {
    setSavedItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, downloaded: !item.downloaded } : item
      )
    );
  };

  const handleRemove = (itemId: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const renderSavedItem = (item: SavedItem) => (
    <TouchableOpacity key={item.id} style={styles.savedCard}>
      <Image source={{ uri: item.image }} style={styles.savedImage} />
      <View style={styles.savedContent}>
        <View style={styles.savedHeader}>
          <View style={styles.typeIndicator}>
            <Text style={styles.typeText}>
              {item.type === 'trail' ? '🥾 Trail' : '💎 Gem'}
            </Text>
          </View>
          <Text style={styles.savedDate}>{item.savedDate}</Text>
        </View>
        
        <Text style={styles.savedTitle}>{item.title}</Text>
        
        <View style={styles.savedMeta}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.ratingText}>⭐ {item.rating}</Text>
        </View>

        {item.type === 'trail' && (
          <View style={styles.trailInfo}>
            <View style={styles.trailMetaItem}>
              <Clock size={12} color="#6B7280" />
              <Text style={styles.trailMetaText}>{item.duration}</Text>
            </View>
            <View style={styles.trailMetaItem}>
              <MapPin size={12} color="#6B7280" />
              <Text style={styles.trailMetaText}>{item.distance}</Text>
            </View>
          </View>
        )}

        <View style={styles.savedActions}>
          <TouchableOpacity 
            style={[styles.actionButton, item.downloaded && styles.actionButtonActive]}
            onPress={() => handleDownload(item.id)}
          >
            <Download size={16} color={item.downloaded ? "#FFFFFF" : "#14B8A6"} />
            <Text style={[styles.actionButtonText, item.downloaded && styles.actionButtonTextActive]}>
              {item.downloaded ? 'Downloaded' : 'Download'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemove(item.id)}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const tabs = [
    { id: 'all', label: 'All', count: savedItems.length },
    { id: 'trails', label: 'Trails', count: savedItems.filter(i => i.type === 'trail').length },
    { id: 'gems', label: 'Gems', count: savedItems.filter(i => i.type === 'gem').length },
    { id: 'offline', label: 'Offline', count: savedItems.filter(i => i.downloaded).length }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Saved</Text>
          <Text style={styles.subtitle}>Your favorite trails and hidden gems</Text>
        </View>
        <View style={styles.heartContainer}>
          <Heart size={24} color="#14B8A6" fill="#14B8A6" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.tabActive]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Text style={[styles.tabText, selectedTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
            <View style={[styles.tabCount, selectedTab === tab.id && styles.tabCountActive]}>
              <Text style={[styles.tabCountText, selectedTab === tab.id && styles.tabCountTextActive]}>
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Saved Items */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredItems.length > 0 ? (
          filteredItems.map(renderSavedItem)
        ) : (
          <View style={styles.emptyState}>
            <Heart size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No saved items</Text>
            <Text style={styles.emptyStateText}>
              {selectedTab === 'offline' 
                ? 'Download some trails and gems for offline access'
                : 'Start saving your favorite trails and hidden gems'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Storage Info */}
      {savedItems.some(item => item.downloaded) && (
        <View style={styles.storageInfo}>
          <Download size={16} color="#6B7280" />
          <Text style={styles.storageText}>
            {savedItems.filter(item => item.downloaded).length} items downloaded • Available offline
          </Text>
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  heartContainer: {
    backgroundColor: '#F0FDFA',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabActive: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 6,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabCount: {
    backgroundColor: '#F3F4F6',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabCountTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  savedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  savedImage: {
    width: '100%',
    height: 160,
  },
  savedContent: {
    padding: 16,
  },
  savedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIndicator: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  savedDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  savedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  savedMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  trailInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  trailMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  trailMetaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  savedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  actionButtonActive: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14B8A6',
    marginLeft: 8,
  },
  actionButtonTextActive: {
    color: '#FFFFFF',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 22,
  },
  storageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  storageText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
});