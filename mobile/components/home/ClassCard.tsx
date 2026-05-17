import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ClassCardProps {
  title: string;
  instructor: string;
  time: string;
  duration: string;
  capacity: number;
  enrolled: number;
  location?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  credits: number;
  onBook?: () => void;
  bookingDisabled?: boolean;
}

export default function ClassCard({
  title,
  instructor,
  time,
  duration,
  capacity,
  enrolled,
  location = 'Studio',
  difficulty = 'Beginner',
  credits,
  onBook,
  bookingDisabled,
}: ClassCardProps) {
  const spotsLeft = capacity - enrolled;
  const difficultyColor =
    difficulty === 'Beginner' ? '#22C55E' : difficulty === 'Intermediate' ? '#EAB308' : '#EF4444';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.instructor}>con {instructor}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: difficultyColor }]}>
          <Text style={styles.badgeText}>{difficulty}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={16} color="#6B7280" style={styles.icon} />
        <Text style={styles.infoText}>
          {time} • {duration}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="people-outline" size={16} color="#6B7280" style={styles.icon} />
        <Text style={styles.infoText}>
          {enrolled}/{capacity} • {spotsLeft} posti liberi
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color="#6B7280" style={styles.icon} />
        <Text style={styles.infoText}>{location}</Text>
      </View>
      <Text style={styles.credits}>
        {credits} credit{credits !== 1 ? 'i' : 'o'}
      </Text>
      <TouchableOpacity
        disabled={bookingDisabled || spotsLeft <= 0}
        style={[styles.button, (bookingDisabled || spotsLeft <= 0) && styles.buttonDisabled]}
        onPress={onBook}
      >
        <Text style={styles.buttonText}>{spotsLeft > 0 ? 'Prenota' : 'Completo'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  instructor: { fontSize: 12, color: '#6B7280' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { color: '#fff', fontSize: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  icon: { marginRight: 4 },
  infoText: { fontSize: 12, color: '#6B7280' },
  credits: { fontSize: 12, fontWeight: '500', color: '#3B82F6', marginBottom: 8 },
  button: { backgroundColor: '#3B82F6', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#9CA3AF' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
