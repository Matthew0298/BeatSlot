import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Href, useRouter } from 'expo-router';

export default function NotFound() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Pressable onPress={() => router.replace('/' as Href)}>
        <Text style={styles.link}>Torna alla home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 40, fontWeight: 'bold', marginBottom: 16 },
  link: { color: '#3B82F6', fontSize: 16 },
});
