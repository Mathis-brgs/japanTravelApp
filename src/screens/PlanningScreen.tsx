import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import planningData from '../data/planning.json';

interface DayPlan {
  id: string;
  date: string;
  ville: string;
  activite: string;
  food: string;
}

export default function PlanningScreen() {
  const renderItem = ({ item }: { item: DayPlan }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{item.id} - {item.date}</Text>
      <Text style={styles.ville}>{item.ville}</Text>
      <Text style={styles.activite}>{item.activite}</Text>
      <Text style={styles.food}>{item.food}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={planningData as DayPlan[]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  listContent: {
    padding: 16,
  },
  card: { 
    backgroundColor: '#ffffff', 
    padding: 16, 
    marginBottom: 12, 
    borderRadius: 8, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  date: { 
    fontSize: 14, 
    color: '#888', 
    fontWeight: 'bold',
    marginBottom: 4 
  },
  ville: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#2b2d42' 
  },
  activite: { 
    fontSize: 16, 
    color: '#4a4e69', 
    marginVertical: 8 
  },
  food: { 
    fontSize: 14, 
    color: '#e63946', 
    fontWeight: '600' 
  }
});
