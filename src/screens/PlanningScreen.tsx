import React from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme } from 'react-native';
import { theme } from '../styles/theme';
import planningData from '../data/planning.json';

interface DayPlan {
  id: string;
  date: string;
  ville: string;
  activite: string;
  food: string;
}

export default function PlanningScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? theme.dark : theme.light;

  const renderItem = ({ item }: { item: DayPlan }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.date, { color: colors.textSecondary }]}>{item.id} - {item.date}</Text>
      <Text style={[styles.ville, { color: colors.text }]}>{item.ville}</Text>
      <Text style={[styles.activite, { color: colors.textSecondary }]}>{item.activite}</Text>
      <Text style={[styles.food, { color: colors.primary }]}>{item.food}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
  },
  listContent: {
    padding: 16,
  },
  card: { 
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
    fontWeight: 'bold',
    marginBottom: 4 
  },
  ville: { 
    fontSize: 18, 
    fontWeight: 'bold', 
  },
  activite: { 
    fontSize: 16, 
    marginVertical: 8 
  },
  food: { 
    fontSize: 14, 
    fontWeight: '600' 
  }
});
