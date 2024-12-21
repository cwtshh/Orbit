import { View, Text } from 'react-native'
import React from 'react'
import { useSession } from '@/app/context/AuthContext'
import { FontAwesome } from '@expo/vector-icons';

const post = () => {
  const { user } = useSession();
  return (
    <View>
      <View className='p-4 flex flex-row items-center gap-4'>
        <View className='bg-steel-gray-600 p-4 rounded-full w-16 h-16 flex justify-center items-center'>
          <Text>
            <FontAwesome size={28} name="user" color={"#FFFFFF"} />
          </Text>
        </View>
        <Text className='font-bold text-xl'>{user?.username}</Text>
      </View>
    </View>
  )
}

export default post