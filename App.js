import StackNavigator from "./components/StackNavigator";
import { PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";

export default function App() {
  const clearStorageOnReload = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared on reload");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  useEffect(() => {
    // Clear storage when app loads
    clearStorageOnReload();
  }, []);

  return (
    <PaperProvider>
      <StackNavigator />
    </PaperProvider>
  );
}
