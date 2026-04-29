import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HOME_NAVIGATOR } from '@/constant/navigation';
import HomeNavigator from './HomeNavigator';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name={HOME_NAVIGATOR} component={HomeNavigator} />
    </Tab.Navigator>
  );
}
