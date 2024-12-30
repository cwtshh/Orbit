import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const usePushNotifications = () => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        console.log("Requesting notification permission...");

        // Verifique se a permissão já foi solicitada
        const permissionAsked = await SecureStore.getItemAsync("notification_token");
        if (!permissionAsked) {
          // Solicitar permissão para notificações
          const { status } = await Notifications.requestPermissionsAsync();
          if (status === "granted") {
            await SecureStore.setItemAsync("notification_token", "true");
            console.log("Permission granted.");
          } else {
            console.log("Permission not granted.");
          }
        } else {
          console.log("Permission already asked.");
        }

        // Solicitar o token de push
        if (Platform.OS !== 'web') {
          const token = await Notifications.getExpoPushTokenAsync();
          console.log("Expo Push Token:", token.data); // Enviar esse token para o servidor
        }
      } catch (error) {
        console.error("Error requesting permission or fetching token:", error);
      }
    };

    requestPermission();

    // Ouvir quando uma notificação for recebida
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
      
    });

    // Limpeza do listener
    return () => {
      subscription.remove();
    };
  }, []);
};
