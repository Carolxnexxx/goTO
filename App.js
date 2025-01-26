import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import LogIn from './components/LogIn'; 
import Rewards from './components/Rewards'; 
import MapScreen from './components/MapScreen'; 
import Calendar from './components/Calendar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogIn">
        <Stack.Screen 
          name="LogIn" 
          component={LogIn} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="HomeScreen" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        
        <Stack.Screen 
          name="Rewards" 
          component={Rewards} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="MapScreen" 
          component={MapScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="Calendar" 
          component={Calendar} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
