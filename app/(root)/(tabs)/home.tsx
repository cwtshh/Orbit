import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { notifyToast } from '@/app/utils/Toast';
import { useFocusEffect } from 'expo-router';
import PostCard from '../components/postcard';
import { FontAwesome } from '@expo/vector-icons';
import { useSession } from '@/app/context/AuthContext';

const API_URL = 'https://5406-2804-14c-65d6-419e-00-113a.ngrok-free.app';

const home = () => {

  interface Post {
    id: number;
    content: string;
    user: {
        id: number;
        username: string;
    }
    likes: number;
    comments_count: number;
    createdAt: string;
  }

  const [posts, setPosts] = useState([]);
  const { logout } = useSession();

  const get_posts = async() => {
    await axios.get(`${API_URL}/user/posts`, { withCredentials: true }).then((res) => {
      setPosts(res.data.posts);
    }).catch(() => {
      console.log('Erro ao buscar posts');
      notifyToast('error', 'Erro ao buscar posts', 'Erro ao buscar posts, tente novamente.');
    })
  };

  useFocusEffect(useCallback(() => {
    get_posts();
  }, []));

  return (
    <View className='h-full w-full'>
      <View className='bg-steel-gray-800 p-4 flex flex-row justify-between items-center w-full'>
        <View className='flex flex-col gap-2 w-3/4'>
          <Text className='font-bold text-2xl text-white'>Orbit</Text>
          <Text className='text-white'>
            Conecte-se com o mundo! 🚀
          </Text>
        </View>
        <Pressable className='bg-steel-gray-700 rounded-lg p-4 flex flex-row gap-4' onPress={logout}>
          <FontAwesome name='sign-out' size={18} color='white' />
          <Text className='text-white font-bold'>Sair</Text>
        </Pressable>
      </View>

      <View className='p-4 flex flex-col gap-4'>
        <Text className='font-bold text-2xl'>Blips Recentes</Text>

        <ScrollView >
          {posts.length > 0 ? posts.map((post: Post, index: number) => {
            return(
              <View className='mb-4'>
                <PostCard key={index} post={post} />
              </View>
            )
          }) : (
            <Text>Nenhum post encontrado.</Text>
          )}
        </ScrollView>

      </View>
    </View>
  )
}

export default home