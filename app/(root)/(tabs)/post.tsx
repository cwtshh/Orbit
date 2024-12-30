import { View, Text, TextInput, Pressable, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { useSession } from "@/app/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import { notifyToast } from "@/app/utils/Toast";
import { API_URL } from "@/app/utils/API_URL";
import * as ImagePicker from "expo-image-picker";

const post = () => {
  const { user } = useSession();
  const date = new Date();
  const router = useRouter();
  const [content, setContent] = useState<string>("");
  const [imageUri, setImageUri] = useState<string>("");

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      notifyToast(
        "error",
        "Erro ao postar",
        "É necessário permissão para acessar a galeria."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!content) {
      notifyToast("error", "Erro ao postar", "Preencha todos os campos.");
    }
    await axios
      .post(
        `${API_URL}/user/post`,
        {
          user_id: user?.id,
          content: content,
        },
        { withCredentials: true }
      )
      .then(() => {
        setContent("");
        notifyToast("success", "Postagem realizada com sucesso!", "");
        router.push("/(root)/(tabs)/home");
      })
      .catch((err) => {
        notifyToast(
          "error",
          "Erro ao postar",
          "Erro ao postar, tente novamente."
        );
      });
  };

  const handlePostWithPhoto = async () => {
    if (!content || !imageUri) {
      notifyToast("error", "Erro ao postar", "Preencha todos os campos.");
      return;
    }
    const formData = new FormData();
    if (user?.id) {
      formData.append("user_id", user.id);
    }
    formData.append("content", content);
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: `photo-${Date.now()}|${user?.id}.jpg`,
    } as any);

    await axios
      .post(`${API_URL}/user/post/photo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then(() => {
        setContent("");
        setImageUri("");
        notifyToast("success", "Postagem realizada com sucesso!", "");
        router.push("/(root)/(tabs)/home");
      })
      .catch((err) => {
        notifyToast(
          "error",
          "Erro ao postar",
          "Erro ao postar, tente novamente."
        );
      });
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       setContent("");
  //       setImageUri("");
  //     };
  //   }, [])
  // );

  return (
    <View>
      <View className="p-4 flex flex-row items-center gap-4">
        <View className="bg-steel-gray-600 p-4 rounded-full w-16 h-16 flex justify-center items-center">
          <Text>
            <FontAwesome size={28} name="user" color={"#FFFFFF"} />
          </Text>
        </View>
        <View>
          <Text className="font-bold text-xl">{user?.username}</Text>
          <Text className="text-sm">{date.toLocaleDateString("pt-br")}</Text>
        </View>
      </View>

      <View className="p-4">
        <TextInput
          onChangeText={setContent}
          value={content}
          className="bg-slate-300 rounded-lg p-2 w-full h-44"
          placeholder="Digite o que quiser..."
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={200}
        />
      </View>

      {imageUri ? (
        <View className="flex flex-col items-center gap-4">
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: 200, height: 200 }}
            />
            <Pressable
              onPress={() => setImageUri("")}
              className="bg-red-500 p-2 rounded-full"
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                justifyContent: "center",
                alignItems: "center",
                width: 40,
                height: 40,
              }}
            >
              <Text>
                <FontAwesome size={24} name="trash" color={"#fff"} />
              </Text>
            </Pressable>
          </View>

          <View>
            <Pressable className="bg-steel-gray-700 p-4 rounded-md w-full flex justify-center items-center">
              <Text
                onPress={pickImage}
                className="text-white font-bold text-xl"
              >
                Alterar foto
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View className="p-4">
          <Pressable
            onPress={pickImage}
            className="flex flex-row items-center gap-4 w-full"
          >
            <Text className="text-2xl">
              <FontAwesome size={24} name="image" color={"#725ea4"} />
            </Text>
            <Text className="text-gray-500 font-bold text-xl">
              Adicionar foto
            </Text>
          </Pressable>
        </View>
      )}

      <View className="p-4 flex flex-col gap-4">
        <Pressable
          onPress={imageUri ? handlePostWithPhoto : handlePost}
          className="bg-steel-gray-700 p-4 rounded-md w-full flex justify-center items-center"
        >
          <Text className="text-white">Postar</Text>
        </Pressable>

        <Text className="text-sm text-gray-500 italic">
          Por favor, mantenha o respeito e a empatia. Evite postar qualquer
          conteúdo preconceituoso, ofensivo ou discriminatório. Vamos criar um
          ambiente acolhedor e respeitoso para todos!
        </Text>
      </View>
    </View>
  );
};

export default post;
