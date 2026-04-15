import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const myGear = [
  { id: '1', name: 'Téléphone (Chargé à 100%)' },
  { id: '2', name: 'Pocket WiFi' },
  { id: '3', name: 'Batterie Externe + Câble' },
  { id: '4', name: 'Écouteurs' },
  { id: '5', name: 'Passeport' }
];

export default function GearScreen() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check-out Hôtel</Text>
      <Text style={styles.subtitle}>À vérifier avant de claquer la porte :</Text>
      <FlatList
        data={myGear}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.item, checkedItems.includes(item.id) && styles.itemChecked]} 
            onPress={() => toggleItem(item.id)}
          >
            <Text style={[styles.itemText, checkedItems.includes(item.id) && styles.textChecked]}>
              {checkedItems.includes(item.id) ? '✅ ' : '⬜ '} {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2b2d42', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#8d99ae', marginBottom: 20 },
  item: { backgroundColor: '#fff', padding: 18, borderRadius: 10, marginBottom: 10, elevation: 1 },
  itemChecked: { backgroundColor: '#e9ecef' },
  itemText: { fontSize: 16, color: '#2b2d42' },
  textChecked: { color: '#adb5bd', textDecorationLine: 'line-through' }
});
