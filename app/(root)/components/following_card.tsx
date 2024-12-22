import { View, Text } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';

interface User {
    id: string,
    name: string,
    username: string,
}

interface FollowingCardProps {
    user: User;
}

const FollowingCard = ({ user }: FollowingCardProps) => {
  return (
    <View className='bg-slate-200 p-4 flex flex-row gap-4 items-center'>
      <View className='flex flex-row gap-4 items-center bg-steel-gray-700 p-4 rounded-full'>
        <FontAwesome name='user' size={24} color='white' />
      </View>
      <View>
        <Text className='font-bold text-lg'>{user.username}</Text>
        <Text className='text-gray-500 text-sm'>{user.name}</Text>
      </View>
    </View>
  )
}

export default FollowingCard