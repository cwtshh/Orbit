import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/app/utils/API_URL";
import { useSession } from "@/app/context/AuthContext";
import { notifyToast } from "@/app/utils/Toast";
import { useFocusEffect } from "expo-router";
import ChatCard from "../components/chat_card";

interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
}

interface Message {
  user: string;
  content: string;
  createdAt: Date;
}
interface Chat {
  _id: string;
  users: User[];
  messages: Message[];
}

const chats = () => {
  const [userChats, setUserChats] = useState([]);
  const { user, setCurrentScreen } = useSession();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const get_user_chats = async () => {
    setLoading(true);
    await axios
      .get(`${API_URL}/user/chats/${user?.id}`)
      .then((res) => {
        setUserChats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        notifyToast(
          "error",
          "Erro ao buscar chats",
          "Não foi possível buscar os chats, tente novamente mais tarde."
        );
      });
  };

  const filteredChats =
    searchText.trim() === ""
      ? userChats
      : userChats.filter((chat: Chat) => {
          return chat.users.some(
            (other_user) =>
              other_user._id !== user?.id &&
              (other_user.username
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
                other_user.name
                  .toLowerCase()
                  .includes(searchText.toLowerCase()))
          );
        });
  useFocusEffect(
    useCallback(() => {
      get_user_chats();
      setCurrentScreen("Chats");
    }, [])
  );

  return (
    <View className="h-full w-full">
      <View className="bg-steel-gray-800 p-4 flex flex-row justify-between items-center">
        <Text className="font-bold text-2xl text-white">Chats</Text>
      </View>

      <View className="p-4">
        <View className="flex flex-row items-center gap-4 px-4 h-14 border border-gray-300 rounded-full bg-white">
          <FontAwesome name="search" size={18} color="#9688cc" />
          <TextInput
            onChangeText={setSearchText}
            placeholder="Procure por chats..."
            className="flex-1 text-sm text-black"
            placeholderTextColor="#A0A0A0"
          />
        </View>
      </View>
      <ScrollView className="flex-1 rounded-lg p-4">
        <View className="flex flex-col gap-4">
          {loading ? (
            <View className="flex flex-col items-center justify-center h-40">
              <ActivityIndicator
                animating={loading}
                size="large"
                color="#725ea4"
              />
            </View>
          ) : filteredChats.length > 0 ? (
            filteredChats.map((chat, index) => (
              <ChatCard key={index} chat={chat} />
            ))
          ) : (
            <View className="flex flex-col items-center justify-center h-40">
              <Text className="text-gray-400 text-lg">
                Você não possui chats
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default chats;
