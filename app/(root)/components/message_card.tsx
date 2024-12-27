import { View, Text } from 'react-native'
import React from 'react'

interface Message {
    user: string,
    content: string,
    createdAt: Date,
}


interface MessageCardProps {
    message: Message
}

const MessageCardSender = ({ message }: MessageCardProps) => {
  const date = new Date(message.createdAt);
  return (
    <View className='bg-steel-gray-500 rounded-2xl p-2 w-1/2'>
      <Text className='text-white text-lg text-right'>{message.content}</Text>
      <Text className='text-sm text-white italic text-right'>{date.toLocaleDateString('pt-br')}</Text>
    </View>
  )
}

export default MessageCardSender