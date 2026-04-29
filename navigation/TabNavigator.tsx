import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HOME_NAVIGATOR } from "@/constant/navigation";
import HomeNavigator from "./HomeNavigator";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: any;

          if (route.name === HOME_NAVIGATOR) {
            iconName = focused ? "home" : "home-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ff3b30",
        tabBarInactiveTintColor: "#999",
      })}
    >
      <Tab.Screen
        name={HOME_NAVIGATOR}
        component={HomeNavigator}
        options={{ title: "Home" }}
      />
    </Tab.Navigator>
  );
}