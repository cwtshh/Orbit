import { View, Text, ScrollView } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useSession } from '@/app/context/AuthContext';
import axios from 'axios';
import { notifyToast } from '@/app/utils/Toast';
import PostCard from './postcard';
import { useFocusEffect } from 'expo-router';
import { API_URL } from '@/app/utils/API_URL';

const Blips = () => {
  const { user } = useSession();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar os posts do usuário
  const get_user_posts = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/posts/user/${user?.id}`);
      setPosts(res.data);
    } catch (err) {
      notifyToast('error', 'Error', 'An error occurred while trying to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  // Recarrega os posts sempre que a tela for focada
  useFocusEffect(
    useCallback(() => {
      get_user_posts();
    }, [])
  );

  return (
    <View className='p-4'>
      {isLoading ? (
        <View className="items-center justify-center">
          <Text className="text-white">Carregando...</Text>
        </View>
      ) : posts.length > 0 ? (
        posts.map((post: any, index: number) => (
          <View key={index} className="mb-4">
            <PostCard post={post} trigger_reload={() => null} />
          </View>
        ))
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-white text-xl font-bold">
            Você ainda não tem blips.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Blips;
