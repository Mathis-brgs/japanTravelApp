import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, useColorScheme } from 'react-native';
import { theme } from '../styles/theme';

export default function ToolsScreen() {
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? theme.dark : theme.light;
  
  const openMaps = (query: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Outils de poche</Text>
      
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
      
      <Text style={[styles.info, { color: colors.textSecondary }]}>
        Ces boutons ouvrent directement Google Maps avec la recherche filtrée autour de ta position.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
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
  info: { marginTop: 30, textAlign: 'center', fontSize: 13 }
});
