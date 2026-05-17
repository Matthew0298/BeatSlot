import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Href, useRouter } from 'expo-router';
import InputField from '@/components/InputField';
import Button from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    nome: '',
    cognome: '',
    codice_fiscale: '',
    indirizzo: '',
    phone: '',
    birth_date: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await signUp(form);
      router.replace('/(app)/(tabs)/dashboard' as Href);
    } catch (err) {
      Alert.alert('Errore', err instanceof Error ? err.message : 'Registrazione fallita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrazione</Text>
      <InputField label="Username" value={form.username} onChangeText={(v) => handleChange('username', v)} />
      <InputField label="Email" value={form.email} onChangeText={(v) => handleChange('email', v)} keyboardType="email-address" />
      <InputField label="Password" value={form.password} onChangeText={(v) => handleChange('password', v)} secureTextEntry />
      <InputField label="Nome" value={form.nome} onChangeText={(v) => handleChange('nome', v)} />
      <InputField label="Cognome" value={form.cognome} onChangeText={(v) => handleChange('cognome', v)} />
      <InputField label="Codice Fiscale" value={form.codice_fiscale} onChangeText={(v) => handleChange('codice_fiscale', v)} />
      <InputField label="Indirizzo" value={form.indirizzo} onChangeText={(v) => handleChange('indirizzo', v)} />
      <InputField label="Telefono" value={form.phone} onChangeText={(v) => handleChange('phone', v)} />
      <InputField label="Data di nascita" value={form.birth_date} onChangeText={(v) => handleChange('birth_date', v)} placeholder="YYYY-MM-DD" />
      <InputField label="Genere" value={form.gender} onChangeText={(v) => handleChange('gender', v)} placeholder="M/F" />
      <Button title={loading ? 'Attendi...' : 'Registrati'} onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#F9FAFB' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
});
