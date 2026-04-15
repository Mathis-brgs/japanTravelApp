import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const phrases = [
  { fr: "L'addition s'il vous plaît", jp: "O-kanjo onegaishimasu" },
  { fr: "Sans wasabi s'il vous plaît", jp: "Wasabi nuki de onegaishimasu" },
  { fr: "Je vais prendre ceci (en pointant)", jp: "Kore o onegaishimasu" },
  { fr: "Où est le centre Yamato Transport ?", jp: "Yamato-unyu wa doko desu ka ?" },
  { fr: "Où sont les toilettes ?", jp: "Toire wa doko desu ka ?" },
  { fr: "Merci beaucoup", jp: "Arigato gozaimasu" }
];

export default function LexiqueScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Phrases Utiles</Text>
      {phrases.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.fr}>{item.fr}</Text>
          <Text style={styles.jp}>{item.jp}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2b2d42', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 12, borderLeftWidth: 5, borderLeftColor: '#e63946' },
  fr: { fontSize: 14, color: '#8d99ae', marginBottom: 4 },
  jp: { fontSize: 18, fontWeight: 'bold', color: '#1d3557' }
});
