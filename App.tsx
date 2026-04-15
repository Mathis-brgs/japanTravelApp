import 'react-native-gesture-handler';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import PlanningScreen from './src/screens/PlanningScreen';
import TodoScreen from './src/screens/TodoScreen';

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
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
