import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { useSession } from "../context/AuthContext";

export const usePushNotifications = () => {
  const { curentScreen } = useSession();
  const notificationHandled = useRef(new Set()); // Armazena notificações processadas

  useEffect(() => {
    console.log("Tela atual no useEffect:", curentScreen);

    const requestPermission = async () => {
      try {
        const permissionAsked = await SecureStore.getItemAsync(
          "notification_token"
        );
        if (!permissionAsked) {
          const { status } = await Notifications.requestPermissionsAsync();
          if (status === "granted") {
            await SecureStore.setItemAsync("notification_token", "true");
          }
        }

        if (Platform.OS !== "web") {
          const tokenData = await Notifications.getExpoPushTokenAsync();
          console.log("Push Notification Token:", tokenData.data);
        }
      } catch (error) {
        console.error("Error requesting permission or fetching token:", error);
      }
    };

    requestPermission();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const handleNotification = (notification: any) => {
      const notificationId = notification.request.identifier;

      // Verifique se a notificação já foi processada
      if (notificationHandled.current.has(notificationId)) {
        return; // Ignorar notificação já processada
      }

      notificationHandled.current.add(notificationId);

      // Limite o tamanho do Set para evitar crescimento desnecessário
      if (notificationHandled.current.size > 1000) {
        const ids = Array.from(notificationHandled.current);
        notificationHandled.current.clear();
        ids.slice(-500).forEach((id) => notificationHandled.current.add(id)); // Retém os últimos 500 IDs
      }

      console.log("Tela atual durante a notificação:", curentScreen);

      if (
        curentScreen !== "Chat" &&
        notification.request.content.data?.scheduled !== true
      ) {
        Notifications.scheduleNotificationAsync({
          content: {
            title: notification.request.content.title || "Nova mensagem",
            body:
              notification.request.content.body ||
              "Você tem uma nova mensagem.",
            data: {
              ...notification.request.content.data,
              scheduled: true, // Marca como agendada
            },
          },
          trigger: null, // Envio imediato
        }).catch((err) => console.error("Erro ao agendar notificação:", err));
      } else {
        console.log("Notificação processada:", notificationId);
      }
    };

    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        try {
          if (notification.request.content.data?.scheduled === true) {
            return;
          }

          console.log("Notificação recebida:", notification.request.identifier);
          handleNotification(notification);
        } catch (error) {
          console.error("Erro ao processar notificação recebida:", error);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [curentScreen]); // Dependência para garantir que o efeito seja executado corretamente
};
``;
