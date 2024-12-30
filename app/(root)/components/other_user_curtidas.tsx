import { View, Text } from "react-native";
import React, { useState, useCallback } from "react";
import { API_URL } from "@/app/utils/API_URL";
import axios from "axios";
import { notifyToast } from "@/app/utils/Toast";
import { useFocusEffect } from "expo-router";
import PostCard from "./postcard";
import { ActivityIndicator } from "react-native";

const Ocurtidas = ({ user_id }: any) => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const get_user_likes = async () => {
    setLoading(true);
    await axios
      .get(`${API_URL}/user/likes/${user_id}`, { withCredentials: true })
      .then((res) => {
        setLikedPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        notifyToast(
          "error",
          "Error",
          "An error occurred while trying to fetch liked posts"
        );
        setLoading(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      get_user_likes();
    }, [])
  );

  return (
    <View className="">
      {loading ? (
        <View className="flex flex-col items-center justify-center h-40">
          <ActivityIndicator animating={loading} size="large" color="#725ea4" />
        </View>
      ) : likedPosts.length > 0 ? (
        likedPosts.map((post, index) => {
          return (
            <View key={index} className="mb-4">
              <PostCard post={post} trigger_reload={() => null} />
            </View>
          );
        })
      ) : (
        <Text className="text-cente text-xl font-bold">
          Este usuário ainda não curtiu nenhum blip.
        </Text>
      )}
    </View>
  );
};

export default Ocurtidas;
