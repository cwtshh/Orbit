import { View, Text } from 'react-native'
import React from 'react'

const home = () => {
  return (
    <View>
      <View className='bg-steel-gray-800 p-4'>
        <Text className='font-bold text-2xl text-white'>Orbit</Text>
        <Text className='text-white'>
          Conecte-se com o mundo! 🚀
        </Text>
      </View>

      <View className='p-4'>
        <Text className='font-bold text-2xl'>Blips Recentes</Text>
        

      </View>
    </View>
  )
}

export default home