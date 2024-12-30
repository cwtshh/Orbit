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

const MessageCardReciver = ({ message }: MessageCardProps) => {
  const date = new Date(message.createdAt);
  return (
    <View
      className="bg-steel-gray-700 p-2 w-1/2"
      style={{
        borderRadius: 16,           // Raio padrão
        borderBottomLeftRadius: 4,  // Canto inferior esquerdo mais quadrado
      }}
    >
      <Text className="text-white text-lg text-left">
        {message.content}
      </Text>
      <Text className="text-sm text-white italic text-right">
        {date.toLocaleDateString('pt-br', { hour: '2-digit', minute: '2-digit'})}
      </Text>
    </View>
  )
}

export default MessageCardReciver