import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  text: string;
  done: boolean;
}

const initialTasks: Task[] = [
  { id: '1', text: 'Août/Sept: Réserver Pocket WiFi Premium', done: false },
  { id: '2', text: 'Septembre: Installer eSIM Ubigi (Secours)', done: false },
  { id: '3', text: '13 Sept: Réserver Shinkansen Kanazawa', done: false },
  { id: '4', text: '15 Sept: Réserver Nohi Bus (Shirakawa-go)', done: false },
  { id: '5', text: '16 Sept: Réserver Thunderbird (Osaka)', done: false },
  { id: '6', text: '27 Sept: Promo Hayatoku-21 (Osaka -> Tokyo)', done: false },
  { id: '7', text: 'J9: Envoyer valise Yamato Asakusa (031650)', done: false }
];

export default function TodoScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('@travel_todos');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        } else {
          setTasks(initialTasks);
        }
      } catch (e) {
        console.error("Erreur de chargement", e);
      }
    };
    loadTasks();
  }, []);

  const toggleTask = async (id: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
    
    // Sauvegarde en local
    try {
      await AsyncStorage.setItem('@travel_todos', JSON.stringify(updatedTasks));
    } catch (e) {
      console.error("Erreur de sauvegarde", e);
    }
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TouchableOpacity style={styles.taskContainer} onPress={() => toggleTask(item.id)}>
      <View style={[styles.checkbox, item.done && styles.checkboxDone]}>
        {item.done && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.taskText, item.done && styles.taskTextDone]}>
        {item.text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Checklist & Réservations</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { fontSize: 20, fontWeight: 'bold', color: '#2b2d42', padding: 20, paddingBottom: 10 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  taskContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    marginBottom: 10, 
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e63946',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxDone: { backgroundColor: '#e63946' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  taskText: { fontSize: 16, color: '#4a4e69', flex: 1 },
  taskTextDone: { textDecorationLine: 'line-through', color: '#adb5bd' }
});
