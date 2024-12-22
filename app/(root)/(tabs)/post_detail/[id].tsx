import { View, Text, Pressable, ScrollView, TextInput } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import { useSearchParams } from 'expo-router/build/hooks'
import axios from 'axios'
import { notifyToast } from '@/app/utils/Toast'
import { API_URL } from '@/app/utils/API_URL'
import { useSession } from '@/app/context/AuthContext'
import CommentCard from '../../components/comment_card'

interface Post {
  _id: string,
  comments: Array<Comment>,
  likes: number,
  content: string,
  user: {
    _id: string,
    username: string,
    email: string,
    password: string,
    createdAt: string,
    updatedAt: string,
    __v: number
  },
  comments_count: number,
  createdAt: string,
}

interface Comment {
  content: string; 
  user: {
      _id: string,
      username: string,
      email: string,
      name: string,
  };
  post: string;
  createdAt: string;
};


const post_details = () => {
  const { user } = useSession(); 
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [ post, setPost ] = useState<Post | null>(null);
  const [ content, setContent ] = useState<string>('');
  const created_at = post?.createdAt ? new Date(post.createdAt) : new Date();

  const get_post = async() => {
    await axios.get(`${API_URL}/user/post/${id}`, { withCredentials: true}).then((res) => {
      setPost(res.data);
    }).catch(() => {
      notifyToast('error', 'Error', 'An error occurred while trying to get the post');
    })
  };

  const handleComment = async() => {
    await axios.post(`${API_URL}/user/post/comment`, {
      user_id: user?.id,
      post_id: id,
      content: content
    }, { withCredentials: true }).then(() => {
      setContent('');
      get_post();
      notifyToast('success', 'Success', 'Comment created successfully');
    }).catch(() => {
      notifyToast('error', 'Error', 'An error occurred while trying to create the comment');
    });
  };

  useFocusEffect(useCallback(() => {
    get_post();
  }, [id]));

  return (
    <View className='w-full h-full'>
      <View className='bg-steel-gray-800 p-4 flex flex-row justify-between items-center w-full'>
        <View className='flex flex-row gap-4 items-center'>
          <Pressable onPress={() => router.back()} className='flex flex-row gap-2 items-center'>
            <View className='bg-steel-gray-600 p-2 rounded-full'>
              <Text>
                <FontAwesome name='arrow-left' size={20} color='white' />
              </Text>
            </View>
          </Pressable>
          <Text className='font-bold text-2xl text-white'>Blip</Text>
        </View>
      </View>

      <ScrollView>
        <View className='flex flex-row gap-4 items-start p-4'>
          <View className='bg-steel-gray-800 p-4 flex flex-row justify-between items-center rounded-full'>
            <FontAwesome name='user' size={24} color='white' />
          </View>
          <View>
            <Text className='font-bold text-xl'>@{post?.user?.username}</Text>
            <Text className='text-gray-400'>
              {created_at.toLocaleDateString('pt-br')}
            </Text>
          </View>
        </View>

        <View className="p-4 w-full">
          <Text className="text-lg">
            {post?.content}
          </Text>
        </View>

        <View>
          <View className='flex flex-row gap-4 items-center justify-start p-4'>
            <Pressable className='flex flex-row items-center'>
              <FontAwesome name='heart' size={18} color='#9688cc' />
              <Text className='ml-1'>{post?.likes}</Text>
            </Pressable>
            <View className='flex flex-row items-center'>
              <FontAwesome name='comment' size={18} color='#9688cc' />
              <Text className='ml-1'>{post?.comments_count}</Text>
            </View>
          </View>
        </View>

        <View className='flex flex-col items-center justify-center w-full p-4'>
          <View className='bg-gray-400 h-1 w-full rounded-full' />
        </View>

        <View className='p-4 flex flex-row items-center gap-4'>
          <TextInput value={content} onChangeText={setContent} className='bg-gray-300 rounded-xl w-[80%]' placeholder='Escreva um comentário...' />
          <Pressable onPress={handleComment} className='bg-steel-gray-800 p-3 rounded-xl'>
            <Text className='text-white'>Enviar</Text>
          </Pressable>
        </View>

        <View className='p-4'>
          <Text className='font-bold text-xl'>Comentários</Text>
        </View>

        {post?.comments.map((comment: Comment, index: number) => {
          return(
            <CommentCard key={index} comment={comment} />
          )
        })}
        

      </ScrollView>
    </View>
  )
}

export default post_details