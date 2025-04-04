import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./SplashScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import EditProfileScreen from "./EditProfileScreen";
import MyOrderScreen from "./MyOrderScreen";
import EditNotificationScreen from "./EditNotificationScreen";
import SignUpScreen from "./SignUpScreen";
import SignInScreen from "./SignInScreen";
import AdminHomeScreen from "./admin/AdminHomeScreen";
import AdminGenreManagementScreen from "./admin/AdminGenreManagementScreen";
import AdminBooksManagementScreen from "./admin/AdminBooksManagementScreen";
import BookDetailScreen from "./BookDetailScreen";

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        {/* Customer screens */}
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainApp"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyOrder"
          component={MyOrderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditNotification"
          component={EditNotificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{ headerShown: false }}
        />

        {/* Admin screens */}
        <Stack.Screen
          name="AdminHome"
          component={AdminHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminGenreManagement"
          component={AdminGenreManagementScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminBooksManagement"
          component={AdminBooksManagementScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
