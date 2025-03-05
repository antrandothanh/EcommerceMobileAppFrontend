import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";
import CategoryScreen from "./CategoryScreen";
import SearchScreen from "./SearchScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Trang Chủ") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Tìm Kiếm") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Danh Mục") {
            iconName = focused ? "book" : "book-outline"
          } else if (route.name === "Hồ Sơ") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Trang Chủ"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Tìm Kiếm"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Danh Mục"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Hồ Sơ"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
