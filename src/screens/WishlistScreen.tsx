import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Keyboard, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';

interface WishItem {
  id: string;
  name: string;
  store: string;
  price: string;
  bought: boolean;
}

export default function WishlistScreen() {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? theme.dark : theme.light;

  const [wishlist, setWishlist] = useState<WishItem[]>([]);
  const [name, setName] = useState('');
  const [store, setStore] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const loadWishlist = async () => {
      const saved = await AsyncStorage.getItem('@travel_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    };
    loadWishlist();
  }, []);

  const addItem = async () => {
    if (!name) return;

    const newItem: WishItem = {
      id: Date.now().toString(),
      name,
      store: store || 'N/A',
      price: price || '?',
      bought: false,
    };

    const updated = [...wishlist, newItem];
    setWishlist(updated);
    await AsyncStorage.setItem('@travel_wishlist', JSON.stringify(updated));
    
    setName(''); setStore(''); setPrice('');
    Keyboard.dismiss();
  };

  const toggleBought = async (id: string) => {
    const updated = wishlist.map(item => 
      item.id === id ? { ...item, bought: !item.bought } : item
    );
    setWishlist(updated);
    await AsyncStorage.setItem('@travel_wishlist', JSON.stringify(updated));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.form, { backgroundColor: colors.surface }]}>
        <TextInput 
          style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]} 
          placeholder="Objet (ex: Figurine Luffy)" 
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, { flex: 2, marginRight: 10, color: colors.text, borderBottomColor: colors.border }]} 
            placeholder="Lieu (ex: Akihabara)" 
            placeholderTextColor={colors.textSecondary}
            value={store}
            onChangeText={setStore}
          />
          <TextInput 
            style={[styles.input, { flex: 1, color: colors.text, borderBottomColor: colors.border }]} 
            placeholder="Prix ¥" 
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={addItem}>
          <Text style={styles.addButtonText}>Ajouter à la liste</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[
              styles.itemCard, 
              { backgroundColor: colors.surface }, 
              item.bought && { opacity: 0.5 }
            ]} 
            onPress={() => toggleBought(item.id)}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemName, { color: colors.text }, item.bought && styles.textCrossed]}>
                {item.name}
              </Text>
              <Text style={[styles.itemDetails, { color: colors.textSecondary }]}>
                {item.store} • {item.price} ¥
              </Text>
            </View>
            <View style={[
              styles.statusBadge, 
              { borderColor: colors.border, backgroundColor: isDark ? colors.background : '#f1faee' },
              item.bought && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}>
              <Text style={[styles.statusText, { color: item.bought ? '#fff' : colors.text }]}>
                {item.bought ? "OK" : "À trouver"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  form: { padding: 15, borderRadius: 12, marginBottom: 20, elevation: 3 },
  input: { borderBottomWidth: 1, marginBottom: 12, padding: 8, fontSize: 16 },
  row: { flexDirection: 'row' },
  addButton: { padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  itemCard: { flexDirection: 'row', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center', elevation: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemDetails: { fontSize: 14, marginTop: 4 },
  textCrossed: { textDecorationLine: 'line-through' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, borderWidth: 1 },
  statusText: { fontSize: 12, fontWeight: 'bold' }
});
