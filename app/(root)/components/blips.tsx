import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/app/context/AuthContext'
import axios from 'axios';
import { notifyToast } from '@/app/utils/Toast';
import PostCard from './postcard';
import { useFocusEffect } from 'expo-router';

const API_URL = 'https://8f6f-2804-14c-65d6-419e-00-113a.ngrok-free.app';

const Blips = () => {
  const { user } = useSession();
  const [ posts, setPosts ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);

  const get_user_posts = async() => {
    await axios.get(`${API_URL}/user/posts/user/${user?.id}`).then((res) => {
      setPosts(res.data);
      setIsLoading(false);
    }).catch((err) => {
      notifyToast('error', 'Error', 'An error occurred while trying to fetch posts');
      setIsLoading(false);
    });
  };

  useFocusEffect(useCallback(() => {
    get_user_posts();
  }, []));

  return (
    <View className='w-full h-full'>
      {isLoading ? (
        <Text>Carregando...</Text>
      ): (
        posts.length > 0 ? (
          posts.map((post: any, index: number) => {
            return(
              <PostCard key={index} post={post} trigger_reload={() => null} />
            )
          })
        ) : (
          <>
            <Text className='text-center text-xl font-bold'>Você ainda não tem blips.</Text>
          </>
        )
      )}
    </View>
  )
}

export default Blips