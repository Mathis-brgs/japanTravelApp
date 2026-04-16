import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { theme } from '../styles/theme';

const phrases = [
  { fr: "L'addition s'il vous plaît", jp: "O-kanjo onegaishimasu" },
  { fr: "Sans wasabi s'il vous plaît", jp: "Wasabi nuki de onegaishimasu" },
  { fr: "Je vais prendre ceci (en pointant)", jp: "Kore o onegaishimasu" },
  { fr: "Où est le centre Yamato Transport ?", jp: "Yamato-unyu wa doko desu ka ?" },
  { fr: "Où sont les toilettes ?", jp: "Toire wa doko desu ka ?" },
  { fr: "Merci beaucoup", jp: "Arigato gozaimasu" }
];

export default function LexiqueScreen() {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? theme.dark : theme.light;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Phrases Utiles</Text>
      {phrases.map((item, index) => (
        <View key={index} style={[styles.card, { backgroundColor: colors.surface, borderLeftColor: colors.primary }]}>
          <Text style={[styles.fr, { color: colors.textSecondary }]}>{item.fr}</Text>
          <Text style={[styles.jp, { color: isDark ? colors.text : '#1d3557' }]}>{item.jp}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 15, borderRadius: 8, marginBottom: 12, borderLeftWidth: 5 },
  fr: { fontSize: 14, marginBottom: 4 },
  jp: { fontSize: 18, fontWeight: 'bold' }
});
