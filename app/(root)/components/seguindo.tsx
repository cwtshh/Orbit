import { View, Text } from "react-native";
import React, { useCallback, useState } from "react";
import axios from "axios";
import { useSession } from "@/app/context/AuthContext";
import { notifyToast } from "@/app/utils/Toast";
import { useFocusEffect } from "expo-router";
import { API_URL } from "@/app/utils/API_URL";
import FollowingCard from "./following_card";

interface User {
  id: string;
  name: string;
  username: string;
  _id: string;
  profile_photo_path: string;
}

const Seguindo = () => {
  const { user } = useSession();
  const [following, setFollowing] = useState<User[]>([]);

  const get_user_following = async () => {
    await axios
      .get(`${API_URL}/user/following/${user?.id}`, { withCredentials: true })
      .then((res) => {
        setFollowing(res.data);
      })
      .catch((err) => {
        notifyToast(
          "error",
          "Erro ao buscar seguidores",
          "Tente novamente mais tarde"
        );
      });
  };

  useFocusEffect(
    useCallback(() => {
      get_user_following();
    }, [])
  );

  return (
    <View className="p-4">
      {following.map((follow: User, index: number) => {
        return <FollowingCard key={index} user={follow} />;
      })}
    </View>
  );
};

export default Seguindo;
