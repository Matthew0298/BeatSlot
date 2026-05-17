import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import PackageCard from '@/components/home/PackageCard';
import { api, CreditPackage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function PackagesTab() {
  const { refreshProfile } = useAuth();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api
      .packages()
      .then((res) => setPackages(res.packages))
      .catch(() => setPackages([]))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handlePurchase = async (id: number) => {
    try {
      await api.purchasePackage(id);
      await refreshProfile();
      Alert.alert('Acquistato', 'Crediti aggiunti al tuo account');
    } catch (err) {
      Alert.alert('Errore', err instanceof Error ? err.message : 'Acquisto fallito');
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pacchetti crediti</Text>
      {loading ? (
        <ActivityIndicator color="#3B82F6" />
      ) : (
        packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            name={pkg.name}
            credits={pkg.credits}
            price={pkg.price_cents}
            onPurchase={() => handlePurchase(pkg.id)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingTop: 48 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
});
