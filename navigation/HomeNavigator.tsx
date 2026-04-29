import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HOME_SCREEN } from '@/constant/navigation';
import HomeScreen from '@/app/Home';

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false, }}>
      <Stack.Screen name={HOME_SCREEN} component={HomeScreen} />
    </Stack.Navigator>
  );
}
