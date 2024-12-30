import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
import { useSession } from "@/app/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import Blips from "../components/blips";
import Curtidas from "../components/curtidas";
import Seguindo from "../components/seguindo";
import { useFocusEffect, useRouter } from "expo-router";
import { Image } from "react-native";
import { API_URL } from "@/app/utils/API_URL";

const profile = () => {
  const [selected, setSelected] = useState<string>("blips");
  const { user } = useSession();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      return () => setSelected("blips");
    }, [])
  );

  return (
    <View className="w-full h-full">
      <View className="bg-steel-gray-800 p-4 flex flex-row justify-between items-center">
        {/* Contêiner de texto */}
        <View className="flex-1">
          <Text className="font-bold text-2xl text-white">{user?.name}</Text>
          <Text className="text-xl text-white">{user?.username}</Text>
          <Text className="text-sm text-white">1 seguidor</Text>
        </View>

        {/* Contêiner de imagem ou ícone */}
        {user?.profile_photo_path ? (
          <View className="w-36 h-36 rounded-full overflow-hidden">
            <Image
              source={{ uri: `${API_URL}/user/photo/${user?.id}` }}
              style={{
                width: "100%", // Faz com que a imagem ocupe 100% da largura do contêiner
                height: "100%", // Faz com que a imagem ocupe 100% da altura do contêiner
                borderRadius: 70, // Mantém o arredondamento de 50% do contêiner
                resizeMode: "cover", // Faz a imagem ser redimensionada de forma que a área central seja mantida
              }}
            />
          </View>
        ) : (
          <View className="bg-white rounded-full w-36 h-36 flex justify-center items-center">
            <FontAwesome
              className="font-bold"
              name="user"
              size={90}
              color="#725ea4"
            />
          </View>
        )}
      </View>

      <View className="flex flex-row p-4  justify-between gap-5">
        <Pressable
          onPress={() => router.push("/edit_profile")}
          className="bg-steel-gray-700 p-4 rounded-md w-[47%]"
        >
          <Text className="text-white font-bold">Editar Perfil</Text>
        </Pressable>

        <Pressable className="bg-steel-gray-700 p-4 rounded-md w-[47%]">
          <Text className="text-white font-bold">Compartilhar perfil</Text>
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

        <Pressable
          onPress={() => setSelected("seguindo")}
          className={`p-2 w-28 flex justify-center items-center border-b-2 ${
            selected === "seguindo"
              ? "border-steel-gray-800"
              : "border-transparent"
          }`}
        >
          <Text className="font-bold">Seguindo</Text>
        </Pressable>
      </View>

      <ScrollView className="">
        {selected === "blips" && (
          <>
            <Blips />
          </>
        )}
        {selected === "curtidas" && (
          <>
            <Curtidas />
          </>
        )}
        {selected === "seguindo" && (
          <>
            <Seguindo />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default profile;
