import { View, Text } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useSession } from '@/app/context/AuthContext';

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

interface PostCardProps {
    post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
    const created_at = new Date(post.createdAt);
    const { user } = useSession();
  
    return (
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
          <View className="flex flex-row items-center">
            <FontAwesome name="heart" size={18} color="#9688cc" />
            <Text className="ml-1">{post.likes}</Text>
          </View>
          <View className="flex flex-row items-center">
            <FontAwesome name="comment" size={18} color="#9688cc" />
            <Text className="ml-1">{post.comments_count}</Text>
          </View>
        </View>
      </View>
    );
  };

export default PostCard;