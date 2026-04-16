import 'react-native-gesture-handler';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { theme } from './src/styles/theme';  

import PlanningScreen from './src/screens/PlanningScreen';
import TodoScreen from './src/screens/TodoScreen';
import GearScreen from './src/screens/GearScreen';
import LexiqueScreen from './src/screens/LexiqueScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import ToolsScreen from './src/screens/ToolsScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? theme.dark : theme.light;

  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="Planning"
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          drawerStyle: { backgroundColor: colors.background, width: 260 },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.textSecondary,
        }}
      >
        <Drawer.Screen name="Planning" component={PlanningScreen} options={{ title: 'Mon Planning' }} />
        <Drawer.Screen name="Todo" component={TodoScreen} options={{ title: 'To-Do & Réservations' }} />
        <Drawer.Screen name="Gear" component={GearScreen} options={{ title: 'Checklist Matériel' }} />
        <Drawer.Screen name="Lexique" component={LexiqueScreen} options={{ title: 'Lexique de Survie' }} />
        <Drawer.Screen name="Budget" component={BudgetScreen} options={{ title: 'Suivi Budget' }} />
        <Drawer.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'Wishlist Shopping' }} />
        <Drawer.Screen name="Tools" component={ToolsScreen} options={{ title: 'Outils' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
