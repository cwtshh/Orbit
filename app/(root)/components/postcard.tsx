import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useSession } from '@/app/context/AuthContext';
import axios from 'axios';
import { notifyToast } from '@/app/utils/Toast';
import { useRouter } from 'expo-router';
import { API_URL } from '@/app/utils/API_URL';

interface Post {
  _id: number;
  content: string;
  user: {
      id: number;
      username: string;
  }
  likes: number;
  comments_count: number;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  trigger_reload: () => void | null;
}

const PostCard = ({ post, trigger_reload }: PostCardProps) => {
    const created_at = new Date(post.createdAt);
    const [ likes, setLikes ] = useState<number>(post.likes);
    const { user } = useSession();
    const router = useRouter();

    const handlePostLike = async() => {
      await axios.patch(`${API_URL}/user/post/like`, {
        user_id: user?.id,
        post_id: post._id
      }).then(() => {
        setLikes(likes + 1);
        notifyToast('success', 'Post liked', '');
      }).catch((err) => {
        notifyToast('error', 'Error', 'An error occurred while trying to like the post');
      })
    };
  
    return (
      <Pressable onPress={() => router.push(`/post_detail/${post._id}`)}>
        <View className="border p-4 rounded-xl border-gray-50 bg-steel-gray-100">
          <View className="flex flex-row gap-4 items-start">
            <View className="bg-steel-gray-800 p-2 rounded-full w-10 h-10 flex items-center justify-center">
              <FontAwesome name="user" size={24} color="white" />
            </View>
            <View>
              <View className='flex flex-row items-center gap-2'>
                  <Text className="font-bold text-xl">{post.user.username}</Text>
                  {post.user.username === user?.username && (
                      <Text className="text-sm text-gray-500">Você</Text>
                  )}
              </View>
              <Text>{created_at.toLocaleDateString('pt-br')}</Text>
            </View>
          </View>
    
          <View className="mt-4">
            <Text className="text-lg">{post.content}</Text>
          </View>

          <View className="flex flex-row gap-4 items-center justify-start mt-4">
            <Pressable onPress={handlePostLike} className="flex flex-row items-center">
              <FontAwesome name="heart" size={18} color="#9688cc" />
              <Text className="ml-1">{likes}</Text>
            </Pressable>
            <View className="flex flex-row items-center">
              <FontAwesome name="comment" size={18} color="#9688cc" />
              <Text className="ml-1">{post.comments_count}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

export default PostCard;