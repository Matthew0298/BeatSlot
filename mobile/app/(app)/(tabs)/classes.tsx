import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import ClassCard from '@/components/home/ClassCard';
import { api, Session } from '@/lib/api';
import { sessionToCardProps } from '@/lib/session-utils';
import { useAuth } from '@/context/AuthContext';

export default function ClassesTab() {
  const { refreshProfile } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api
      .sessions()
      .then((res) => setSessions(res.sessions))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleBook = async (sessionId: number) => {
    try {
      await api.createBooking(sessionId);
      await refreshProfile();
      load();
      Alert.alert('Prenotato', 'Lezione prenotata con successo');
    } catch (err) {
      Alert.alert('Errore', err instanceof Error ? err.message : 'Prenotazione fallita');
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Tutte le lezioni</Text>
      {loading ? (
        <ActivityIndicator color="#3B82F6" />
      ) : (
        sessions.map((session) => (
          <ClassCard key={session.id} {...sessionToCardProps(session)} onBook={() => handleBook(session.id)} />
        ))
      )}
      {!loading && sessions.length === 0 && <Text style={styles.empty}>Nessuna lezione disponibile</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingTop: 48 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  empty: { color: '#6B7280' },
});
