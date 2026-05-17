import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import Button from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function WelcomeScreen({ onLogin, onRegister }: WelcomeScreenProps) {
  const gymImage = require('../../assets/images/gymins.jpg');

  return (
    <ImageBackground source={gymImage} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>
            Fit
            <Text style={styles.gradientText}>Flow</Text>
          </Text>
          <Text style={styles.subtitle}>
            Prenota le tue lezioni. Segui i crediti. Raggiungi i tuoi obiettivi.
          </Text>
        </View>
        <Card style={styles.card}>
          <CardContent style={styles.cardContent}>
            <Button onPress={onLogin} style={styles.button}>
              Accedi
            </Button>
            <Button onPress={onRegister} style={styles.button}>
              Crea account
            </Button>
          </CardContent>
        </Card>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  textBlock: { marginBottom: 24 },
  title: { fontSize: 40, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  gradientText: { color: '#4ade80' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 8 },
  card: { backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 12, marginTop: 24, padding: 16, width: '100%' },
  cardContent: { width: '100%' },
  button: { width: '100%', marginBottom: 12 },
});
