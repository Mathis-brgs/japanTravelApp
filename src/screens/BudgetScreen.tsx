import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Keyboard, Switch, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Expense {
  id: string;
  originalAmount: number;    
  originalCurrency: 'JPY' | 'EUR'; 
  convertedAmount: number;   
  rateUsed: number;          
  label: string;
  date: string;
}

export default function BudgetScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [isYen, setIsYen] = useState(true);
  
  const [yenRate, setYenRate] = useState(163); 
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  const TOTAL_BUDGET = 2500; 

  useEffect(() => {
    const initData = async () => {
      const savedExpenses = await AsyncStorage.getItem('@travel_expenses');
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses));

      const savedRate = await AsyncStorage.getItem('@last_yen_rate');
      if (savedRate) setYenRate(JSON.parse(savedRate));

      fetchCurrentRate();
    };
    initData();
  }, []);

  const fetchCurrentRate = async () => {
    setIsLoadingRate(true);
    try {
      const response = await fetch('https://api.frankfurter.app/latest?from=EUR&to=JPY');
      const data = await response.json();
      
      if (data.rates && data.rates.JPY) {
        const newRate = data.rates.JPY;
        setYenRate(newRate);
        await AsyncStorage.setItem('@last_yen_rate', JSON.stringify(newRate));
      }
    } catch (e) {
      console.log("Erreur API (probablement offline), utilisation du taux local");
    } finally {
      setIsLoadingRate(false);
    }
  };

  const addExpense = async () => {
    if (!amount || !label) return;

    const rawAmount = parseFloat(amount.replace(',', '.'));
    let eurValue = isYen ? rawAmount / yenRate : rawAmount;

    const newExpense: Expense = {
      id: Date.now().toString(),
      originalAmount: rawAmount,
      originalCurrency: isYen ? 'JPY' : 'EUR',
      convertedAmount: parseFloat(eurValue.toFixed(2)),
      rateUsed: parseFloat(yenRate.toFixed(2)),
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

  const currentTotalSpent = expenses.reduce((sum, exp) => sum + exp.convertedAmount, 0);
  const remaining = TOTAL_BUDGET - currentTotalSpent;

  return (
    <View style={styles.container}>
      {/* HEADER : RÉSUMÉ DU BUDGET */}
      <View style={styles.summaryCard}>
        <View style={styles.headerRow}>
          <Text style={styles.summaryTitle}>Budget Restant</Text>
          {isLoadingRate ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <TouchableOpacity onPress={fetchCurrentRate}>
              <Text style={styles.rateInfo}>Taux: 1€ = {yenRate.toFixed(1)}¥ ↻</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.remainingAmount}>{remaining.toFixed(2)} €</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min((currentTotalSpent / TOTAL_BUDGET) * 100, 100)}%` }]} />
        </View>
        <Text style={styles.totalSpent}>
          Dépensé : {currentTotalSpent.toFixed(2)} € / {TOTAL_BUDGET} €
        </Text>
      </View>

      {/* FORMULAIRE D'AJOUT */}
      <View style={styles.inputContainer}>
        <View style={styles.currencyRow}>
          <Text style={styles.currencyLabel}>
            Saisie en <Text style={{ color: '#e63946' }}>{isYen ? 'Yens (¥)' : 'Euros (€)'}</Text>
          </Text>
          <Switch 
            value={isYen} 
            onValueChange={setIsYen} 
            trackColor={{ false: "#767577", true: "#e63946" }}
          />
        </View>

        <TextInput 
          style={styles.input} 
          placeholder={isYen ? "Montant en ¥" : "Montant en €"} 
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        
        {isYen && amount ? (
          <Text style={styles.previewText}>
            ≈ {(parseFloat(amount.replace(',', '.')) / yenRate).toFixed(2)} €
          </Text>
        ) : null}

        <TextInput 
          style={styles.input} 
          placeholder="C'était quoi ?" 
          value={label}
          onChangeText={setLabel}
        />
        
        <TouchableOpacity style={styles.addButton} onPress={addExpense}>
          <Text style={styles.addButtonText}>Ajouter la dépense</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.historyTitle}>Historique</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.expenseLabel}>{item.label}</Text>
              <Text style={styles.expenseDate}>
                {item.date} {item.originalCurrency === 'JPY' ? `• Taux: ${item.rateUsed}` : ''}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.expenseAmount}>
                {item.originalCurrency === 'JPY' ? `${item.originalAmount} ¥` : `${item.originalAmount} €`}
              </Text>
              {item.originalCurrency === 'JPY' && (
                <Text style={styles.subAmountConverted}>≈ {item.convertedAmount} €</Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune dépense pour le moment.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 15 },
  summaryCard: { backgroundColor: '#1d3557', padding: 20, borderRadius: 15, marginBottom: 15 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTitle: { color: '#f1faee', fontSize: 14, opacity: 0.8 },
  rateInfo: { color: '#a8dadc', fontSize: 12, fontWeight: 'bold' },
  remainingAmount: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 5 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginVertical: 10 },
  progressBarFill: { height: 6, backgroundColor: '#e63946', borderRadius: 3 },
  totalSpent: { color: '#a8dadc', fontSize: 12 },
  inputContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3 },
  currencyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  currencyLabel: { fontWeight: '700', color: '#4a4e69' },
  input: { borderBottomWidth: 1, borderBottomColor: '#dee2e6', marginBottom: 12, padding: 8, fontSize: 16, color: '#2b2d42' },
  previewText: { fontSize: 12, color: '#e63946', marginBottom: 10, fontWeight: 'bold', marginTop: -10 },
  addButton: { backgroundColor: '#e63946', padding: 14, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#2b2d42', marginBottom: 10, marginLeft: 5 },
  expenseItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', marginBottom: 8, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#1d3557' },
  expenseLabel: { fontSize: 16, fontWeight: 'bold', color: '#2b2d42' },
  expenseDate: { fontSize: 11, color: '#8d99ae', marginTop: 2 },
  expenseAmount: { fontSize: 16, fontWeight: 'bold', color: '#2b2d42' },
  subAmountConverted: { fontSize: 12, color: '#e63946', fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#8d99ae', marginTop: 20 }
});
