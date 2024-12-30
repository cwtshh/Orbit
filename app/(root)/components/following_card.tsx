import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { API_URL } from "@/app/utils/API_URL";
import { useRouter } from "expo-router";

interface User {
  _id: string;
  name: string;
  username: string;
  profile_photo_path: string;
}

interface FollowingCardProps {
  user: User;
}

const FollowingCard = ({ user }: FollowingCardProps) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/other_profile/${user._id}`)}
      className="bg-slate-200 p-4 flex flex-row gap-4 items-center mb-2 rounded-lg"
    >
      <View className="flex justify-center items-center  w-14 h-12">
        {user.profile_photo_path ? (
          <View className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              source={{
                uri: `${API_URL}/user/photo/${user._id}`,
              }}
              style={{ width: 40, height: 40, borderRadius: 20 }} // A imagem vai ter 40px de largura e altura
            />
          </View>
        ) : (
          <View className="flex w-[40px] flex-row gap-4 items-center justify-center bg-steel-gray-700 p-2 rounded-full">
            <FontAwesome name="user" size={24} color="white" />
          </View>
        )}
      </View>
      <View>
        <Text className="font-bold text-lg">{user.username}</Text>
        <Text className="text-gray-500 text-sm">{user.name}</Text>
      </View>
    </Pressable>
  );
};

export default FollowingCard;
