import { Href, useRouter } from 'expo-router';
import AccountSection from '@/components/home/AccountSection';
import { useAuth } from '@/context/AuthContext';

export default function AccountTab() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const user = profile?.user;
  const credits = profile?.membership?.credits_balance ?? 0;

  const handleLogout = async () => {
    await signOut();
    router.replace('/(auth)/welcome' as Href);
  };

  return (
    <AccountSection
      userName={user ? `${user.nome} ${user.cognome}`.trim() || user.username : ''}
      userEmail={user?.email ?? ''}
      userCredits={credits}
      onLogout={handleLogout}
    />
  );
}
