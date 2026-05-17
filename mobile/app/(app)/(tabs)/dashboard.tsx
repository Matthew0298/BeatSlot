import { Alert } from 'react-native';
import Dashboard from '@/components/home/Dashboard';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function DashboardTab() {
  const { profile, refreshProfile } = useAuth();
  const user = profile?.user;
  const credits = profile?.membership?.credits_balance ?? 0;
  const userName = user ? `${user.nome} ${user.cognome}`.trim() || user.username : '';

  const handleBook = async (sessionId: number) => {
    try {
      await api.createBooking(sessionId);
      await refreshProfile();
      Alert.alert('Prenotato', 'Lezione prenotata con successo');
    } catch (err) {
      Alert.alert('Errore', err instanceof Error ? err.message : 'Prenotazione fallita');
    }
  };

  return <Dashboard userCredits={credits} userName={userName} onBook={handleBook} />;
}
