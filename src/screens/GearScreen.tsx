import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { theme } from '../styles/theme';

const morningGear = [
  { id: 'm1', name: 'Téléphone' },
  { id: 'm2', name: 'Pocket WiFi' },
  { id: 'm3', name: 'Batterie Externe + Câble' },
  { id: 'm4', name: 'Écouteurs' },
  { id: 'm5', name: 'Passeport (Si changement de ville)' }
];

const eveningCharging = [
  { id: 'e1', name: 'Mettre le téléphone en charge' },
  { id: 'e2', name: 'Charger le Pocket WiFi' },
  { id: 'e3', name: 'Recharger la batterie externe' },
  { id: 'e4', name: 'Charger les écouteurs' }
];

export default function GearScreen() {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? theme.dark : theme.light;
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const RenderSection = (title: string, subtitle: string, items: any[], accentColor: string) => (
    <View style={styles.section}>
      <Text style={[styles.title, { color: isDark ? colors.text : accentColor }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
      {items.map((item) => (
        <TouchableOpacity 
          key={item.id}
          style={[styles.item, { backgroundColor: colors.surface }, checkedItems.includes(item.id) && { backgroundColor: isDark ? '#2A2A2A' : '#e9ecef' }]} 
          onPress={() => toggleItem(item.id)}
        >
          <Text style={[styles.itemText, { color: colors.text }, checkedItems.includes(item.id) && { color: colors.textSecondary, textDecorationLine: 'line-through' }]}>
            {checkedItems.includes(item.id) ? '✅ ' : '⬜ '} {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {RenderSection("Matin : Départ", "À vérifier avant de sortir :", morningGear, "#2b2d42")}
      <View style={[styles.separator, { backgroundColor: colors.border }]} />
      {RenderSection("Soir : Recharge", "À faire avant de dormir :", eveningCharging, colors.accent)}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  section: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, marginBottom: 15 },
  item: { padding: 16, borderRadius: 10, marginBottom: 8, elevation: 1 },
  itemText: { fontSize: 16 },
  separator: { height: 1, marginVertical: 20 }
});
