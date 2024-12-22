import { View, Text } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import post from '../(tabs)/post';

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

interface CommentCardProps {
    comment: Comment;
}

const CommentCard = ({ comment } : CommentCardProps) => {

    const created_at = new Date(comment.createdAt);
  return (
    <View className='p-4'>

        <View className='border border-gray-200 rounded-lg p-4 bg-slate-200 flex flex-row gap-4'>
            <View className='bg-steel-gray-700 rounded-full w-12 h-12 flex items-center justify-center'>
                <FontAwesome name='user' size={24} color='white' />
            </View>

            <View className='flex flex-col gap-4'>
                <View>
                    <Text className='font-bold text-lg'>{comment.user.username}</Text>
                    <Text className='text-gray-500 text-sm'>{created_at.toLocaleDateString('pt-br')}</Text>
                </View>
                <Text>{comment.content}</Text>
            </View>
        </View>
    </View>
  )
}

export default CommentCard