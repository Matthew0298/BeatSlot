import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api, Booking } from '@/lib/api';
import { formatSessionTime } from '@/lib/session-utils';

interface AccountSectionProps {
  userName: string;
  userEmail: string;
  userCredits: number;
  onLogout: () => void;
}

export default function AccountSection({ userName, userEmail, userCredits, onLogout }: AccountSectionProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .myBookings()
      .then((res) => setBookings(res.bookings))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>{userEmail}</Text>
        <Text style={styles.credits}>{userCredits} crediti disponibili</Text>
      </View>
      <Text style={styles.sectionTitle}>Le mie prenotazioni</Text>
      {loading ? (
        <ActivityIndicator color="#3B82F6" />
      ) : bookings.length === 0 ? (
        <Text style={styles.empty}>Nessuna prenotazione</Text>
      ) : (
        bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingRow}>
            <View>
              <Text style={styles.bookingName}>{booking.session?.activity?.name ?? 'Lezione'}</Text>
              <Text style={styles.bookingDate}>
                {booking.session ? formatSessionTime(booking.session.start_at) : ''}
              </Text>
            </View>
            <Text style={styles.status}>{booking.status}</Text>
          </View>
        ))
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.logoutText}>Esci</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F9FAFB' },
  profileCard: { backgroundColor: '#3B82F6', borderRadius: 12, padding: 16, marginBottom: 16 },
  name: { color: '#fff', fontSize: 18, fontWeight: '700' },
  email: { color: '#E5E7EB', fontSize: 12, marginTop: 4 },
  credits: { color: '#fff', fontSize: 14, marginTop: 8, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookingName: { fontSize: 14, fontWeight: '500' },
  bookingDate: { fontSize: 12, color: '#6B7280' },
  status: { fontSize: 12, color: '#3B82F6', alignSelf: 'center' },
  empty: { color: '#6B7280', marginBottom: 16 },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  logoutText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
