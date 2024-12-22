import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'expo-router/build/hooks'
import { FontAwesome } from '@expo/vector-icons'
import axios from 'axios'
import { notifyToast } from '@/app/utils/Toast'

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
}

const API_URL = 'https://8f6f-2804-14c-65d6-419e-00-113a.ngrok-free.app';

const other_profile = () => {
  const searchParams = useSearchParams();
  const [ ohterUser, setOtherUser ] = useState<OtherUser>();
  const id = searchParams.get('id');

  const get_user = async() => {
    await axios.get(`${API_URL}/user/${id}`).then((res) => {
      setOtherUser(res.data);
    }).catch((err) => {
      notifyToast('error', 'Erro ao buscar usuário', 'Erro ao buscar usuário, tente novamente.');
    })
  };

  useEffect(() => {
    get_user();
  }, []);
  

  return (
    <View>
      <View className='w-full h-full'>
        <View className='bg-steel-gray-800 p-4 flex flex-row justify-between items-center'>
          <View className='w-[40%]'>
            <Text className='font-bold text-2xl text-white'>{ohterUser?.name}</Text>
            <Text className='text-xl text-white'>{ohterUser?.username}</Text>
            <Text className='text-sm text-white'>{ohterUser?.followers.length} seguidores</Text>
          </View>

          <View className='bg-white p-4 rounded-full w-20 h-20 flex justify-center items-center'>
            <Text className=''>
              <FontAwesome size={28} name="user" color={"#9688cc"} />
            </Text>
          </View>
        </View>


                    <View className='flex flex-row p-4  justify-between gap-5'>
                        <Pressable className='bg-steel-gray-700 p-4 rounded-md w-[47%]'>
                            <Text className='text-white font-bold'>Editar Perfil</Text>
                        </Pressable>
        
                        <Pressable className='bg-steel-gray-700 p-4 rounded-md w-[47%]'>
                            <Text className='text-white font-bold'>Compartilhar perfil</Text>
                        </Pressable>
                    </View>

      </View>



    </View>
  )
}

export default other_profile