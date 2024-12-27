import { View, Text } from 'react-native'
import React, { useCallback, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/app/utils/API_URL'
import { useSession } from '@/app/context/AuthContext'
import { notifyToast } from '@/app/utils/Toast'
import { useFocusEffect } from 'expo-router'
import PostCard from './postcard'

const Curtidas = () => {
  const { user } = useSession();
  const [ likedPosts, setLikedPosts ] = useState([]);

  const get_user_likes = async() => {
    await axios.get(`${API_URL}/user/likes/${user?.id}`, { withCredentials: true }).then((res) => {
      setLikedPosts(res.data);
    }).catch((err) => {
      notifyToast('error', 'Error', 'An error occurred while trying to fetch liked posts');
    });
  };

  useFocusEffect(useCallback(() => {
    get_user_likes();
  }, []))

  return (
    <View className='p-4'>
      {likedPosts.length > 0 ? (
        likedPosts.map((post, index) => {
          return (
            <View key={index} className='mb-4'>
              <PostCard post={post} trigger_reload={() => null} />
            </View>
          )
        })
      ) : (
        <Text className='text-center text-xl font-bold'>
          Você ainda não curtiu nenhum blip.
        </Text>
      )}
    </View>
  )
}

export default Curtidas