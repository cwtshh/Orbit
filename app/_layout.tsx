import { Stack } from "expo-router";
import React from "react";
import { View, StatusBar } from "react-native";
import './styles/global.css'
import Toast from 'react-native-toast-message';
import { SessionProvider } from "./context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SessionProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#5d4e85" barStyle="light-content"  />
        <View className="h-full w-full" style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(root)" />
            <Stack.Screen name="index" />
            <Stack.Screen name="register" />
          </Stack>
          <Toast />
        </View>
      </SafeAreaView>
    </SessionProvider>
  );
}
