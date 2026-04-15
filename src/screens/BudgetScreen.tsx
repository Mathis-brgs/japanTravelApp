import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Expense {
  id: string;
  amount: number;
  label: string;
  date: string;
}

export default function BudgetScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');

  const TOTAL_BUDGET = 2500; // Ton budget total estimé (à modifier selon tes envies)

  useEffect(() => {
    const loadExpenses = async () => {
      const saved = await AsyncStorage.getItem('@travel_expenses');
      if (saved) setExpenses(JSON.parse(saved));
    };
    loadExpenses();
  }, []);

  const addExpense = async () => {
    if (!amount || !label) return;

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      label: label,
      date: new Date().toLocaleDateString('fr-FR'),
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    await AsyncStorage.setItem('@travel_expenses', JSON.stringify(updated));
    
    setAmount('');
    setLabel('');
    Keyboard.dismiss();
  };

  const currentTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <View style={styles.container}>
      {/* Header Budget Global */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Budget Restant</Text>
        <Text style={styles.remainingAmount}>{(TOTAL_BUDGET - currentTotal).toFixed(2)} €</Text>
        <Text style={styles.totalSpent}>Dépensé : {currentTotal.toFixed(2)} € / {TOTAL_BUDGET} €</Text>
      </View>

      {/* Formulaire d'ajout rapide */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Montant (€)" 
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TextInput 
          style={styles.input} 
          placeholder="C'était quoi ? (ex: Ramen J3)" 
          value={label}
          onChangeText={setLabel}
        />
        <TouchableOpacity style={styles.addButton} onPress={addExpense}>
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des dépenses */}
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <View>
              <Text style={styles.expenseLabel}>{item.label}</Text>
              <Text style={styles.expenseDate}>{item.date}</Text>
            </View>
            <Text style={styles.expenseAmount}>-{item.amount} €</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  summaryCard: { backgroundColor: '#1d3557', padding: 25, borderRadius: 15, marginBottom: 20 },
  summaryTitle: { color: '#f1faee', fontSize: 16, opacity: 0.8 },
  remainingAmount: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 5 },
  totalSpent: { color: '#a8dadc', fontSize: 14 },
  inputContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  input: { borderBottomWidth: 1, borderBottomColor: '#dee2e6', marginBottom: 10, padding: 8, fontSize: 16 },
  addButton: { backgroundColor: '#e63946', padding: 12, borderRadius: 5, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  expenseItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginBottom: 8, borderRadius: 8 },
  expenseLabel: { fontSize: 16, fontWeight: '600', color: '#2b2d42' },
  expenseDate: { fontSize: 12, color: '#8d99ae' },
  expenseAmount: { fontSize: 16, color: '#e63946', fontWeight: 'bold' }
});
