import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

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
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const RenderSection = (title: string, subtitle: string, items: any[], color: string) => (
    <View style={styles.section}>
      <Text style={[styles.title, { color: color }]}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {items.map((item) => (
        <TouchableOpacity 
          key={item.id}
          style={[styles.item, checkedItems.includes(item.id) && styles.itemChecked]} 
          onPress={() => toggleItem(item.id)}
        >
          <Text style={[styles.itemText, checkedItems.includes(item.id) && styles.textChecked]}>
            {checkedItems.includes(item.id) ? '✅ ' : '⬜ '} {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {RenderSection(
        "Matin : Départ", 
        "À vérifier avant de sortir de l'hôtel :", 
        morningGear, 
        "#2b2d42"
      )}
      
      <View style={styles.separator} />

      {RenderSection(
        "Soir : Recharge", 
        "À faire avant de dormir :", 
        eveningCharging, 
        "#38b000"
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  section: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#8d99ae', marginBottom: 15 },
  item: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 8, elevation: 1 },
  itemChecked: { backgroundColor: '#e9ecef' },
  itemText: { fontSize: 16, color: '#2b2d42' },
  textChecked: { color: '#adb5bd', textDecorationLine: 'line-through' },
  separator: { height: 1, backgroundColor: '#dee2e6', marginVertical: 20 }
});
