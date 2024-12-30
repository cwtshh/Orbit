import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "expo-router/build/hooks";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { notifyToast } from "@/app/utils/Toast";
import { useSession } from "@/app/context/AuthContext";
import { API_URL } from "@/app/utils/API_URL";
import Ocurtidas from "../../components/other_user_curtidas";
import OBlips from "../../components/ohter_user_posts";
import { useFocusEffect } from "expo-router";

// TODO - COLOCAR API URL NA ENV PORRA
interface OtherUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  posts: any[];
  followers: any[];
  following: any[];
  likes: any[];
  profile_photo_path: string;
}

const other_profile = () => {
  const searchParams = useSearchParams();
  const [ohterUser, setOtherUser] = useState<OtherUser>();
  const [following, setFollowing] = useState<any[]>([]);
  const id = searchParams.get("id");
  const [selected, setSelected] = useState<string>("blips");
  const [followersCount, setFollowersCount] = useState<number>(
    ohterUser?.followers.length || 0
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useSession();
  const router = useRouter();

  const handleChat = async () => {
    try {
      const chat = await axios.post(
        `${API_URL}/user/chat/verify`,
        {
          user1: user?.id,
          user2: ohterUser?._id,
        },
        { withCredentials: true }
      );
      if (chat.data.code === "not found") {
        await axios
          .post(`${API_URL}/user/chat/create`, {
            users: [user?.id, ohterUser?._id],
          })
          .then((res) => {
            notifyToast("success", "Chat criado", "Chat criado com sucesso");
            router.push(`/user_chat/${res.data.chat._id}`);
          })
          .catch((err) => {
            notifyToast(
              "error",
              "Erro ao criar chat",
              "Erro ao criar chat, tente novamente."
            );
          });
      }
      if (chat.data.code === "found") {
        // notifyToast('info', 'Chat já existe', 'Chat já existe, redirecionando...');
        router.push(`/user_chat/${chat.data.chat._id}`);
      }
    } catch (error: any) {
      notifyToast(
        "error",
        "Erro ao criar chat",
        "Erro ao criar chat, tente novamente."
      );
    }
  };

  const get_user = async () => {
    setLoading(true);
    await axios
      .get(`${API_URL}/user/${id}`)
      .then((res) => {
        setOtherUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        notifyToast(
          "error",
          "Erro ao buscar usuário",
          "Erro ao buscar usuário, tente novamente."
        );
        setLoading(false);
      });
  };
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

  const handleFollow = async () => {
    get_user_following();

    if (ohterUser?.followers.includes(user?.id)) {
      await axios
        .post(
          `${API_URL}/user/unfollow`,
          {
            user_id: user?.id,
            following_id: ohterUser?._id,
          },
          { withCredentials: true }
        )
        .then(() => {
          setFollowersCount(followersCount - 1);
          get_user();
          notifyToast(
            "success",
            "Usuário desseguido",
            "Usuário desseguido com sucesso"
          );
          return;
        })
        .catch(() => {
          notifyToast(
            "error",
            "Erro ao desseguir usuário",
            "Erro ao desseguir usuário, tente novamente."
          );
          return;
        });
    } else {
      await axios
        .patch(
          `${API_URL}/user/follow`,
          {
            user_id: user?.id,
            other_user_id: ohterUser?._id,
          },
          { withCredentials: true }
        )
        .then(() => {
          setFollowersCount(followersCount + 1);
          get_user();
          notifyToast(
            "success",
            "Usuário seguido",
            "Usuário seguido com sucesso"
          );
        })
        .catch(() => {
          notifyToast(
            "error",
            "Erro ao seguir usuário",
            "Erro ao seguir usuário, tente novamente."
          );
        });
    }
  };

  useFocusEffect(
    useCallback(() => {
      get_user();

      return () => {
        setSelected("blips");
      };
    }, [id])
  );

  return (
    <View className="w-full h-full">
      <View className="bg-steel-gray-800 p-4 flex flex-row justify-between items-center">
        {loading ? (
          <>
            <View className="flex-1">
              <Text className="font-bold text-2xl text-white">
                Carregando...
              </Text>
            </View>

            <View className="bg-white p-4 rounded-full w-20 h-20 flex justify-center items-center">
              <FontAwesome size={28} name="user" color={"#9688cc"} />
            </View>
          </>
        ) : (
          <>
            <View className="flex-1">
              <Text className="font-bold text-2xl text-white">
                {ohterUser?.name}
              </Text>
              <Text className="text-xl text-white">{ohterUser?.username}</Text>
              <Text className="text-sm text-white">
                {ohterUser?.followers.length || 0} seguidores
              </Text>
            </View>

            {ohterUser?.profile_photo_path ? (
              <View className="w-36 h-36 rounded-full overflow-hidden">
                <Image
                  source={{
                    uri: `${API_URL}/user/photo/${ohterUser?._id}`,
                  }}
                  style={{ width: 144, height: 144, borderRadius: 72 }}
                />
              </View>
            ) : (
              <View className="bg-white p-4 rounded-full w-36 h-36 flex justify-center items-center">
                <FontAwesome size={90} name="user" color={"#725ea4"} />
              </View>
            )}
          </>
        )}
      </View>

      <View className="flex flex-row p-4 justify-between gap-5">
        <Pressable
          onPress={handleFollow}
          className={`p-4 rounded-md w-[30%] ${
            ohterUser?.followers.includes(user?.id)
              ? "bg-gray-500"
              : "bg-steel-gray-700"
          }`}
        >
          <Text className="text-white font-bold text-center">
            {ohterUser?.followers.includes(user?.id) ? "Seguindo" : "Seguir"}
          </Text>
        </Pressable>

        <Pressable className="bg-steel-gray-700 p-4 rounded-md w-[30%]">
          <Text className="text-white font-bold text-center">Compartilhar</Text>
        </Pressable>

        <Pressable
          onPress={handleChat}
          className="bg-steel-gray-700 p-4 rounded-md w-[30%] flex flex-row items-center justify-center gap-2"
        >
          <FontAwesome name="comment" size={13} color="#fff" />
          <Text className="text-white font-bold">Chat</Text>
        </Pressable>
      </View>

      <View className="flex flex-row w-[100%] p-4">
        <Pressable
          onPress={() => setSelected("blips")}
          className={`p-2 w-28 flex justify-center items-center border-b-2 ${
            selected === "blips"
              ? "border-steel-gray-800"
              : "border-transparent"
          }`}
        >
          <Text className="font-bold">Blips</Text>
        </Pressable>

        <Pressable
          onPress={() => setSelected("curtidas")}
          className={`p-2 w-28 flex justify-center items-center border-b-2 ${
            selected === "curtidas"
              ? "border-steel-gray-800"
              : "border-transparent"
          }`}
        >
          <Text className="font-bold">Curtidas</Text>
        </Pressable>
      </View>

      <ScrollView className="p-4">
        {selected === "blips" &&
          (loading ? (
            <View className="flex flex-col items-center justify-center h-40">
              <ActivityIndicator
                animating={loading}
                size="large"
                color="#725ea4"
              />
            </View>
          ) : (
            <OBlips user_id={id} />
          ))}
        {selected === "curtidas" &&
          (loading ? (
            <View className="flex flex-col items-center justify-center h-40">
              <ActivityIndicator
                animating={loading}
                size="large"
                color="#725ea4"
              />
            </View>
          ) : (
            <Ocurtidas user_id={id} />
          ))}
      </ScrollView>
    </View>
  );
};

export default other_profile;
