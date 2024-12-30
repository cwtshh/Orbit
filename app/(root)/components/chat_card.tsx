import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useSession } from "@/app/context/AuthContext";
import { useRouter } from "expo-router";
import { API_URL } from "@/app/utils/API_URL";

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  profile_photo_path: string;
}

interface Chat {
  _id: string;
  users: User[];
  messages: any[];
}

interface ChatCardProps {
  chat: Chat;
}

const ChatCard = ({ chat }: ChatCardProps) => {
  const { user } = useSession();
  const other_user = chat.users.find((o_user) => o_user._id !== user?.id);
  const last_message =
    chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1]
      : { content: "", user: "", createdAt: "" };
  const last_message_user = chat.users.find(
    (o_user) => o_user._id === last_message.user
  ) || { _id: "", name: "", username: "" };
  const last_message_date = new Date(last_message.createdAt);
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/user_chat/${chat._id}`)}
      className="bg-slate-300 flex flex-row items-center gap-4 p-4 rounded-lg h-32"
    >
      {other_user?.profile_photo_path ? (
        <View className="w-14 h-14 rounded-full overflow-hidden">
          <Image
            source={{
              uri: `${API_URL}/user/photo/${other_user._id}`,
            }}
            style={{ width: 56, height: 56, borderRadius: 28 }}
          />
        </View>
      ) : (
        <View className="flex flex-row items-center gap-4 p-4 bg-steel-gray-600 rounded-full">
          <Text>
            <FontAwesome name="user" size={24} color="#9688cc" />
          </Text>
        </View>
      )}
      {/* ) : (
        <View className="flex flex-row items-center gap-4 p-4 bg-steel-gray-600 rounded-full">
          <Text>
            <FontAwesome name="user" size={24} color="#9688cc" />
          </Text>
        </View>
      )} */}
      <View>
        <Text className="font-bold">{other_user?.name}</Text>
        <Text className="italic">@{other_user?.username}</Text>

        {chat.messages.length !== 0 ? (
          <>
            <Text>
              Ultima mensagem:
              <Text className="italic text-slate-600">
                {" " +
                  last_message_date.toLocaleDateString("pt-br", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </Text>
            </Text>
            <Text className="font-bold">
              {last_message.content} -{" "}
              {last_message_user?._id === user?.id
                ? "Você"
                : last_message_user?.name}
            </Text>
          </>
        ) : (
          <Text className="italic text-slate-600">Sem mensagens</Text>
        )}
      </View>
    </Pressable>
  );
};

export default ChatCard;
