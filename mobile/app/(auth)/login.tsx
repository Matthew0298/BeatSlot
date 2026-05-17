import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Href, useRouter } from 'expo-router';
import InputField from '@/components/InputField';
import Button from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(app)/(tabs)/dashboard' as Href);
    } catch (err) {
      Alert.alert('Errore', err instanceof Error ? err.message : 'Login fallito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accedi</Text>
      <InputField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title={loading ? 'Attendi...' : 'Accedi'} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#F9FAFB' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
});
