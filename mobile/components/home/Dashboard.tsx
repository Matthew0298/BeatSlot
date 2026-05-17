import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ClassCard from '@/components/home/ClassCard';
import { api, Session } from '@/lib/api';
import { sessionToCardProps } from '@/lib/session-utils';

interface DashboardProps {
  userCredits: number;
  userName: string;
  onBook?: (sessionId: number) => void;
}

export default function Dashboard({ userCredits, userName, onBook }: DashboardProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .sessions()
      .then((res) => setSessions(res.sessions.slice(0, 3)))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bentornato, {userName}!</Text>
        <View style={styles.badge}>
          <Ionicons name="card-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.badgeText}>{userCredits} Crediti</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prossime lezioni</Text>
        {loading ? (
          <ActivityIndicator color="#3B82F6" />
        ) : sessions.length === 0 ? (
          <Text style={styles.empty}>Nessuna lezione in programma</Text>
        ) : (
          sessions.map((session) => (
            <ClassCard
              key={session.id}
              {...sessionToCardProps(session)}
              onBook={onBook ? () => onBook(session.id) : undefined}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, marginBottom: 16 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: { color: '#fff', fontSize: 14 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  empty: { color: '#6B7280', fontSize: 14 },
});
