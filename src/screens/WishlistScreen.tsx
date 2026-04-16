import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WishItem {
  id: string;
  name: string;
  store: string;
  price: string;
  bought: boolean;
}

export default function WishlistScreen() {
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
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput 
          style={styles.input} 
          placeholder="Objet (ex: Figurine Luffy)" 
          value={name}
          onChangeText={setName}
        />
        <View style={styles.row}>
          <TextInput 
            style={[styles.input, { flex: 2, marginRight: 10 }]} 
            placeholder="Lieu (ex: Akihabara)" 
            value={store}
            onChangeText={setStore}
          />
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            placeholder="Prix ¥" 
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>Ajouter à la liste</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.itemCard, item.bought && styles.itemBought]} 
            onPress={() => toggleBought(item.id)}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemName, item.bought && styles.textCrossed]}>{item.name}</Text>
              <Text style={styles.itemDetails}>{item.store} • {item.price} ¥</Text>
            </View>
            <View style={[styles.statusBadge, item.bought && styles.statusBadgeDone]}>
              <Text style={styles.statusText}>{item.bought ? "OK" : "À trouver"}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  form: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 3 },
  input: { borderBottomWidth: 1, borderBottomColor: '#dee2e6', marginBottom: 12, padding: 8, fontSize: 16 },
  row: { flexDirection: 'row' },
  addButton: { backgroundColor: '#e63946', padding: 12, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  itemCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center', elevation: 1 },
  itemBought: { opacity: 0.6, backgroundColor: '#e9ecef' },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#2b2d42' },
  itemDetails: { fontSize: 14, color: '#8d99ae' },
  textCrossed: { textDecorationLine: 'line-through' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, backgroundColor: '#f1faee', borderWidth: 1, borderColor: '#a8dadc' },
  statusBadgeDone: { backgroundColor: '#a8dadc', borderColor: '#457b9d' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#1d3557' }
});
