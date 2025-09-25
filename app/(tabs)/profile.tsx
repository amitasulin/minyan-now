import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, MapPin, Award, Settings, Share2, Star, Camera } from 'lucide-react-native';

interface UserStats {
  trailsCompleted: number;
  gemsDiscovered: number;
  totalDistance: string;
  contributions: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  total?: number;
}

const USER_STATS: UserStats = {
  trailsCompleted: 12,
  gemsDiscovered: 28,
  totalDistance: '34.7 km',
  contributions: 5
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Trail Blazer',
    description: 'Complete your first trail',
    icon: '🥾',
    earned: true
  },
  {
    id: '2',
    title: 'Gem Hunter',
    description: 'Discover 10 hidden gems',
    icon: '💎',
    earned: true
  },
  {
    id: '3',
    title: 'Culture Explorer',
    description: 'Complete 5 culture trails',
    icon: '🏛️',
    earned: false,
    progress: 3,
    total: 5
  },
  {
    id: '4',
    title: 'Local Guide',
    description: 'Add 10 community contributions',
    icon: '📍',
    earned: false,
    progress: 5,
    total: 10
  }
];

export default function ProfileScreen() {
  const [user] = useState({
    name: 'Alex Chen',
    username: '@alexexplores',
    bio: 'Adventure seeker finding hidden gems in every city 🌟',
    avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg',
    joinDate: 'March 2024'
  });

  const renderStatCard = (label: string, value: string | number, icon: any) => (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderAchievement = (achievement: Achievement) => (
    <View key={achievement.id} style={[styles.achievementCard, achievement.earned && styles.achievementEarned]}>
      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
      <View style={styles.achievementContent}>
        <Text style={[styles.achievementTitle, achievement.earned && styles.achievementTitleEarned]}>
          {achievement.title}
        </Text>
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
        {!achievement.earned && achievement.progress && achievement.total && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${(achievement.progress / achievement.total) * 100}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>{achievement.progress}/{achievement.total}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color="#14B8A6" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Camera size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userHandle}>{user.username}</Text>
          <Text style={styles.userBio}>{user.bio}</Text>
          <Text style={styles.joinDate}>Exploring since {user.joinDate}</Text>
          
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={16} color="#14B8A6" />
            <Text style={styles.shareButtonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Adventure Stats</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Trails\nCompleted', USER_STATS.trailsCompleted, <MapPin size={20} color="#14B8A6" />)}
            {renderStatCard('Hidden Gems\nDiscovered', USER_STATS.gemsDiscovered, <Star size={20} color="#F59E0B" />)}
            {renderStatCard('Total\nDistance', USER_STATS.totalDistance, <Award size={20} color="#8B5CF6" />)}
            {renderStatCard('Community\nContributions', USER_STATS.contributions, <User size={20} color="#EF4444" />)}
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Text style={styles.sectionSubtitle}>Unlock badges by exploring and contributing</Text>
          {ACHIEVEMENTS.map(renderAchievement)}
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <MapPin size={16} color="#14B8A6" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Completed "Historic Cafés Trail"</Text>
              <Text style={styles.activityTime}>2 days ago</Text>
            </View>
          </View>
          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Star size={16} color="#F59E0B" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Discovered "Secret Rooftop Garden"</Text>
              <Text style={styles.activityTime}>1 week ago</Text>
            </View>
          </View>
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
  settingsButton: {
    backgroundColor: '#F0FDFA',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#14B8A6',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userHandle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  userBio: {
    fontSize: 16,
    color: '#111827',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14B8A6',
    marginLeft: 8,
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    backgroundColor: '#F0FDFA',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  achievementsSection: {
    marginBottom: 32,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementEarned: {
    opacity: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#14B8A6',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
  },
  achievementTitleEarned: {
    color: '#111827',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#14B8A6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  activitySection: {
    marginBottom: 32,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    backgroundColor: '#F0FDFA',
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
  },
});