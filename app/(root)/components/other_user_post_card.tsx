import { View, Text, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API_URL } from "@/app/utils/API_URL";
import { useSession } from "@/app/context/AuthContext";
import { notifyToast } from "@/app/utils/Toast";
import axios from "axios";

const OPostCard = ({ post }: any) => {
  const router = useRouter();
  const { user } = useSession();
  const [likes, setLikes] = useState<number>(post.likes);
  const created_at = new Date(post.createdAt);

  const image_path = `${API_URL}/user/photo/${user?.id}/${post?._id}/`;

  const handlePostLike = async () => {
    await axios
      .patch(`${API_URL}/user/post/like`, {
        user_id: user?.id,
        post_id: post._id,
      })
      .then(() => {
        setLikes(likes + 1);
        notifyToast("success", "Post liked", "");
      })
      .catch((err: any) => {
        notifyToast(
          "error",
          "Error",
          "An error occurred while trying to like the post"
        );
      });
  };
  return (
    <Pressable
      className="mb-4"
      onPress={() => router.push(`/post_detail/${post._id}`)}
    >
      <View className="border p-4 rounded-xl border-gray-50 bg-steel-gray-100">
        <View className="flex flex-row gap-4 items-start">
          {post.user.profile_photo_path ? (
            <View className="bg-steel-gray-800 p-2 rounded-full w-10 h-10 flex items-center justify-center">
              <Image
                source={{
                  uri: `${API_URL}/user/photo/${
                    post.user._id
                  }?timestamp=${new Date().getTime()}`,
                }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
              />
            </View>
          ) : (
            <View className="bg-steel-gray-800 p-2 rounded-full w-10 h-10 flex items-center justify-center">
              <FontAwesome name="user" size={24} color="white" />
            </View>
          )}

          <View>
            <Text className="font-bold text-lg">{post.user.username}</Text>
            <Text>{created_at.toLocaleDateString("pt-br")}</Text>
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-lg">{post.content}</Text>
        </View>

        {post.photo && (
          <View className="mt-4 rounded-xl overflow-hidden">
            <Image
              source={{ uri: image_path }}
              style={{
                width: "100%",
                aspectRatio: 4 / 3, // Mantém a proporção de 4:3
              }}
            />
          </View>
        )}

        <View className="flex flex-row gap-4 items-center justify-start mt-4">
          <Pressable
            onPress={handlePostLike}
            className="flex flex-row items-center"
          >
            <FontAwesome name="heart" size={18} color="#9688cc" />
            <Text className="ml-1">{likes}</Text>
          </Pressable>
          <View className="flex flex-row items-center">
            <FontAwesome name="comment" size={18} color="#9688cc" />
            <Text className="ml-1">{post.comments_count}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default OPostCard;
