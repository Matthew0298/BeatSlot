import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PackageCardProps {
  name: string;
  credits: number;
  price: number;
  onPurchase: () => void;
}

export default function PackageCard({ name, credits, price, onPurchase }: PackageCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.credits}>{credits}</Text>
        <Text style={styles.creditsLabel}>crediti</Text>
      </View>
      <Text style={styles.price}>€{(price / 100).toFixed(2)}</Text>
      <TouchableOpacity style={styles.button} onPress={onPurchase}>
        <Text style={styles.buttonText}>Acquista</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  header: { alignItems: 'center', marginBottom: 8 },
  name: { fontSize: 18, fontWeight: '600' },
  credits: { fontSize: 28, fontWeight: '700', color: '#3B82F6' },
  creditsLabel: { fontSize: 12, color: '#6B7280' },
  price: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  button: { backgroundColor: '#3B82F6', paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});
