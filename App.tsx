import 'react-native-gesture-handler';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import PlanningScreen from './src/screens/PlanningScreen';
import TodoScreen from './src/screens/TodoScreen';
import GearScreen from './src/screens/GearScreen';
import LexiqueScreen from './src/screens/LexiqueScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import WishlistScreen from './src/screens/WishlistScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="Planning"
        screenOptions={{
          headerStyle: { backgroundColor: '#e63946' },
          headerTintColor: '#fff',
          drawerActiveTintColor: '#e63946',
        }}
      >
        <Drawer.Screen 
          name="Planning" 
          component={PlanningScreen} 
          options={{ title: 'Mon Planning' }} 
        />
        <Drawer.Screen 
          name="Todo" 
          component={TodoScreen} 
          options={{ title: 'To-Do & Réservations' }} 
        />
        <Drawer.Screen 
          name="Gear" 
          component={GearScreen} 
          options={{ title: 'Checklist Matériel' }} 
        />
        <Drawer.Screen 
          name="Lexique" 
          component={LexiqueScreen} 
          options={{ title: 'Lexique de Survie' }} 
        />
        <Drawer.Screen 
          name="Budget" 
          component={BudgetScreen} 
          options={{ title: 'Suivi Budget' }} 
        />
        <Drawer.Screen 
          name="Wishlist" 
          component={WishlistScreen} 
          options={{ title: 'Wishlist Shopping' }} 
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
