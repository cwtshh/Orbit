import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useSession } from "@/app/context/AuthContext";
import { notifyToast } from "@/app/utils/Toast";
import { API_URL } from "@/app/utils/API_URL";

const search = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [debounce, setDebounce] = useState<any>("");
  const { user } = useSession();

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounce(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (debounce.trim()) {
        try {
          const response = await axios.get(
            `${API_URL}/user/search/${debounce}`
          );
          setResults(response.data);
        } catch (err: any) {
          notifyToast(
            "error",
            "Erro ao buscar usuários",
            "Erro ao buscar usuários, tente novamente."
          );
        }
      } else {
        setResults([]);
      }
    };
    fetchResults();
  }, [debounce]);

  const handleRedirect = (id: string) => {
    if (id === user?.id) {
      router.push("/profile");
      return;
    }

    router.push(`/other_profile/${id}`);
  };

  return (
    <View className="w-full">
      <View className="bg-steel-gray-800 p-4">
        <View className="bg-white rounded-lg p-2 h-[4em] flex flex-row gap-2 items-center justify-center">
          <FontAwesome name="search" size={20} color="grey" />
          <TextInput
            onChangeText={setQuery}
            className="flex-1 text-gray-700 font-bold"
            placeholder="Pesquisar usuário..."
          />
        </View>
      </View>

      <ScrollView className="p-4">
        {results.length > 0 ? (
          results.map((result: any, index: number) => {
            return (
              <Pressable key={index} onPress={() => handleRedirect(result._id)}>
                <View className="flex flex-row p-4 border-b border-gray-300 items-center">
                  {result.profile_photo_path ? (
                    <View className="rounded-full overflow-hidden w-14 h-14">
                      <Image
                        source={{
                          uri: `${API_URL}/user/photo/${result._id}`,
                        }}
                        style={{ width: 50, height: 50, borderRadius: 25 }} // Ajustado para 50px e borderRadius 25
                      />
                    </View>
                  ) : (
                    <View className="flex flex-col items-center justify-center w-14 h-14">
                      <FontAwesome name="user-circle" size={44} color="grey" />
                      {/* Tamanho do ícone reduzido para 30 */}
                    </View>
                  )}
                  <View className="ml-4">
                    {" "}
                    {/* Espaço entre imagem/ícone e o texto */}
                    <Text className="font-bold">{result.name}</Text>
                    <Text className="text-gray-500">@{result.username}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })
        ) : (
          <Text className="text-center text-xl font-bold">
            Nenhum resultado encontrado
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default search;
