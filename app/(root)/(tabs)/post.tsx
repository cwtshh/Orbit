import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useSession } from '@/app/context/AuthContext'
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { notifyToast } from '@/app/utils/Toast';

const API_URL = 'https://5406-2804-14c-65d6-419e-00-113a.ngrok-free.app';

const post = () => {
  const { user } = useSession();
  const date = new Date();
  const router = useRouter();
  console.log(API_URL);
  const [ content, setContent ] = useState<string>('');
  
  const handlePost = async() => {
    await axios.post(`${API_URL}/user/post`, {
      user_id: user?.id,
      content: content
    }, {withCredentials: true}).then(() => {
      notifyToast('success', 'Postagem realizada com sucesso!', '');
      setContent('');
      router.push('/(root)/(tabs)/home');
    }).catch((err) => {
      notifyToast('error', 'Erro ao postar', 'Erro ao postar, tente novamente.');
      console.log(err);
    })
  }

  return (
    <View>
      <View className='p-4 flex flex-row items-center gap-4'>
        <View className='bg-steel-gray-600 p-4 rounded-full w-16 h-16 flex justify-center items-center'>
          <Text>
            <FontAwesome size={28} name="user" color={"#FFFFFF"} />
          </Text>
        </View>
        <View>
          <Text className='font-bold text-xl'>{user?.username}</Text>
          <Text className='text-sm'>{date.toLocaleDateString('pt-br')}</Text>
        </View>
      </View>

      <View className="p-4">
        <TextInput
          onChangeText={setContent}
          className="bg-slate-300 rounded-lg p-2 w-full h-44"
          placeholder="Digite o que quiser..."
          multiline={true} 
          numberOfLines={4} 
          textAlignVertical="top"
          maxLength={200}
        />
      </View>


      <View className='p-4 flex flex-col gap-4'>
        <Pressable onPress={handlePost} className='bg-steel-gray-700 p-4 rounded-md w-full flex justify-center items-center'>
          <Text className='text-white'>Postar</Text>
        </Pressable>

        <Text className='text-sm text-gray-500 italic'>
          Por favor, mantenha o respeito e a empatia. Evite postar qualquer conteúdo preconceituoso, ofensivo ou discriminatório. Vamos criar um ambiente acolhedor e respeitoso para todos!
        </Text>
      </View>
    </View>
  )
}

export default post