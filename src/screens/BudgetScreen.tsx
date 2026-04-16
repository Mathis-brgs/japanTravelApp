import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Keyboard, Switch, ActivityIndicator, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';

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
  const isDark = useColorScheme() === 'dark';
  const colors = isDark ? theme.dark : theme.light;

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
        setYenRate(data.rates.JPY);
        await AsyncStorage.setItem('@last_yen_rate', JSON.stringify(data.rates.JPY));
      }
    } catch (e) { console.log("Offline"); } finally { setIsLoadingRate(false); }
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
    setAmount(''); setLabel(''); Keyboard.dismiss();
  };

  const currentTotalSpent = expenses.reduce((sum, exp) => sum + exp.convertedAmount, 0);
  const remaining = TOTAL_BUDGET - currentTotalSpent;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.summaryCard, { backgroundColor: isDark ? colors.surface : '#1d3557' }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.summaryTitle, { color: '#f1faee' }]}>Budget Restant</Text>
          {isLoadingRate ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <TouchableOpacity onPress={fetchCurrentRate}>
              <Text style={[styles.rateInfo, { color: '#a8dadc' }]}>1€ = {yenRate.toFixed(1)}¥ ↻</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.remainingAmount, { color: '#fff' }]}>{remaining.toFixed(2)} €</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${Math.min((currentTotalSpent / TOTAL_BUDGET) * 100, 100)}%`, backgroundColor: colors.primary }]} />
        </View>
        <Text style={[styles.totalSpent, { color: '#a8dadc' }]}>Dépensé : {currentTotalSpent.toFixed(2)} € / {TOTAL_BUDGET} €</Text>
      </View>

      <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.currencyRow}>
          <Text style={[styles.currencyLabel, { color: colors.text }]}>Saisie en <Text style={{ color: colors.primary }}>{isYen ? 'Yens (¥)' : 'Euros (€)'}</Text></Text>
          <Switch value={isYen} onValueChange={setIsYen} trackColor={{ false: "#767577", true: colors.primary }} />
        </View>
        <TextInput 
          style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]} 
          placeholder={isYen ? "Montant en ¥" : "Montant en €"} placeholderTextColor={colors.textSecondary}
          keyboardType="numeric" value={amount} onChangeText={setAmount}
        />
        {isYen && amount ? (
          <Text style={[styles.previewText, { color: colors.primary }]}>≈ {(parseFloat(amount.replace(',', '.')) / yenRate).toFixed(2)} €</Text>
        ) : null}
        <TextInput 
          style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]} 
          placeholder="C'était quoi ?" placeholderTextColor={colors.textSecondary}
          value={label} onChangeText={setLabel}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={addExpense}>
          <Text style={styles.addButtonText}>Ajouter la dépense</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.expenseItem, { backgroundColor: colors.surface, borderLeftColor: isDark ? colors.primary : '#1d3557' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.expenseLabel, { color: colors.text }]}>{item.label}</Text>
              <Text style={[styles.expenseDate, { color: colors.textSecondary }]}>{item.date} {item.originalCurrency === 'JPY' ? `• Taux: ${item.rateUsed}` : ''}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.expenseAmount, { color: colors.text }]}>{item.originalAmount} {item.originalCurrency === 'JPY' ? '¥' : '€'}</Text>
              {item.originalCurrency === 'JPY' && <Text style={[styles.subAmountConverted, { color: colors.primary }]}>≈ {item.convertedAmount} €</Text>}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  summaryCard: { padding: 20, borderRadius: 15, marginBottom: 15 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTitle: { fontSize: 14, opacity: 0.8 },
  rateInfo: { fontSize: 12, fontWeight: 'bold' },
  remainingAmount: { fontSize: 32, fontWeight: 'bold', marginVertical: 5 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginVertical: 10 },
  progressBarFill: { height: 6, borderRadius: 3 },
  totalSpent: { fontSize: 12 },
  inputContainer: { padding: 15, borderRadius: 12, marginBottom: 15, elevation: 3 },
  currencyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  currencyLabel: { fontWeight: '700' },
  input: { borderBottomWidth: 1, marginBottom: 12, padding: 8, fontSize: 16 },
  previewText: { fontSize: 12, marginBottom: 10, fontWeight: 'bold', marginTop: -10 },
  addButton: { padding: 14, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  historyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginLeft: 5 },
  expenseItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, marginBottom: 8, borderRadius: 10, borderLeftWidth: 4 },
  expenseLabel: { fontSize: 16, fontWeight: 'bold' },
  expenseDate: { fontSize: 11, marginTop: 2 },
  expenseAmount: { fontSize: 16, fontWeight: 'bold' },
  subAmountConverted: { fontSize: 12, fontWeight: '600' }
});
