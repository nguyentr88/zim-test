import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TAB_NAVIGATOR } from '@/constant/navigation';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name={TAB_NAVIGATOR} component={TabNavigator} />
    </Stack.Navigator>
  );
}
