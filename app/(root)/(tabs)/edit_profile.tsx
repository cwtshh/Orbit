import { View, Text, Pressable, TextInput, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useSession } from "@/app/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { notifyToast } from "@/app/utils/Toast";
import { useFocusEffect } from "expo-router";
import { API_URL } from "@/app/utils/API_URL";

const edit_profile = () => {
  const { user, edit_profile } = useSession();
  const oldName = user?.name;
  const oldEmail = user?.email;
  const oldImage = user?.profile_photo_path || "";
  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [imageUri, setImageUri] = useState<string>("");
  const [userImage, setUserImage] = useState<string>(
    user?.profile_photo_path || ""
  );

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
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
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("user_id", user?.id || "");
    formData.append("name", name);
    formData.append("email", email);
    formData.append(
      "file",
      imageUri
        ? ({
            uri: imageUri,
            name: `${user?.id}-profile_photo.jpg`,
            type: "image/jpeg",
          } as any)
        : null
    );
    await edit_profile(formData);
  };

  useFocusEffect(
    useCallback(() => {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setUserImage(user?.profile_photo_path || "");
      setImageUri("");
    }, [])
  );

  return (
    <View>
      <View className="bg-steel-gray-800 p-4 flex flex-col gap-4 justify-center items-center">
        <Text className="font-bold text-2xl text-white">@{user?.username}</Text>
        {/* {userImage ? (
          <View className="flex flex-row items-center justify-center bg-white rounded-full w-36 h-36 p-2">
            <Image
              source={{ uri: userImage }}
              style={{ width: 140, height: 140, borderRadius: 70 }}
            />
          </View>
        ) : (
          <View className="flex flex-row items-center justify-center bg-white rounded-full w-36 h-36 p-2">
            <FontAwesome
              className="font-bold"
              name="user"
              size={90}
              color="#725ea4"
            />
          </View>
        )} */}
        {!imageUri ? (
          !userImage ? (
            <View className="flex flex-row items-center justify-center bg-white rounded-full w-36 h-36 p-2">
              <FontAwesome
                className="font-bold"
                name="user"
                size={90}
                color="#725ea4"
              />
            </View>
          ) : (
            <View className="flex flex-row items-center justify-center bg-white rounded-full w-36 h-36 p-2">
              <Image
                source={{ uri: `${API_URL}/user/photo/${user?.id}` }}
                style={{ width: 140, height: 140, borderRadius: 70 }}
              />
            </View>
          )
        ) : (
          <View className="flex flex-row items-center justify-center bg-white rounded-full w-36 h-36 p-2">
            <Image
              source={{ uri: imageUri }}
              style={{ width: 140, height: 140, borderRadius: 70 }}
            />
          </View>
        )}
        <Pressable
          onPress={pickImage}
          className="bg-steel-gray-700 rounded-lg p-4 flex flex-row gap-4"
        >
          <FontAwesome name="camera" size={24} color="white" />
          <Text className="text-white font-bold">Alterar foto</Text>
        </Pressable>
      </View>

      <View className="p-4 flex flex-col gap-4">
        <Text className="font-bold text-2xl">Informações</Text>

        <View className="flex flex-col gap-4">
          <Text className="font-bold">Nome:</Text>
          <TextInput
            onChangeText={setName}
            value={name}
            className="w-full bg-white rounded-xl h-12"
          />
        </View>

        <View className="flex flex-col gap-4">
          <Text className="font-bold">Email:</Text>
          <TextInput
            onChangeText={setEmail}
            value={email}
            className="w-full bg-white rounded-xl h-12"
          />
        </View>

        <Pressable
          onPress={handleUpdateProfile}
          disabled={name === oldName && email === oldEmail && imageUri === ""}
          className="bg-steel-gray-700 p-2 rounded-lg w-full disabled:bg-gray-500"
        >
          <Text className="p-3 text-center text-white font-bold text-base">
            Salvar
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default edit_profile;
