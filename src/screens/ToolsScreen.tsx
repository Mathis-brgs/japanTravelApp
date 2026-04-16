import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function ToolsScreen() {
  
  const openMaps = (query: string) => {
    // On génère une URL de recherche Google Maps
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Outils de poche</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.toolButton, { backgroundColor: '#4CAF50' }]} 
          onPress={() => openMaps('Convenience+store')}
        >
          <Text style={styles.buttonText}>Trouver un Kombini</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.toolButton, { backgroundColor: '#2196F3' }]} 
          onPress={() => openMaps('Public+toilet')}
        >
          <Text style={styles.buttonText}>Toilettes publiques</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.toolButton, { backgroundColor: '#FF9800', marginTop: 15 }]} 
        onPress={() => openMaps('ATM+International')}
      >
        <Text style={styles.buttonText}>ATM</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2b2d42', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  toolButton: { 
    flex: 1, 
    padding: 15, 
    borderRadius: 10, 
    marginHorizontal: 5, 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  info: { marginTop: 30, color: '#8d99ae', textAlign: 'center', fontSize: 13 }
});
