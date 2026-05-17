import { Href, useRouter } from 'expo-router';
import { WelcomeScreen } from '@/components/home/WelcomeScreen';

export default function WelcomeRoute() {
  const router = useRouter();
  return (
    <WelcomeScreen
      onLogin={() => router.push('/(auth)/login' as Href)}
      onRegister={() => router.push('/(auth)/register' as Href)}
    />
  );
}
