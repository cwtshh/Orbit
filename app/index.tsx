import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Redirect, useRouter } from 'expo-router'
import { useSession } from './context/AuthContext'

const index = () => {
  const { login } = useSession();
  const router = useRouter();
  const [ username, setUsername ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleLogin = async() => {
    await login(username, password);
  }

  return (
    <View className='flex flex-col gap-5 justify-center h-full p-4'>

      <View className='w-[95%]'>
        <Text className='font-bold text-2xl'>Bem vindo ao Orbit 🪐</Text>
        <Text className=''>Conecte-se, compartilhe e explore ideias que orbitam ao seu redor. O universo das conversas está aqui!</Text>
      </View>

      <View className='flex flex-col gap-4 bg-slate-200 p-4 rounded-lg'>
        <Text className='font-bold'>Nome de usuário:</Text>
        <TextInput 
          onChangeText={setUsername}
          className='w-full bg-white rounded-xl' 
        />

        <Text className='font-bold'>Senha:</Text>
        <TextInput 
          secureTextEntry
          onChangeText={setPassword}
          className='w-full bg-white rounded-xl' 
        />

        <Pressable onPress={handleLogin} className='bg-steel-gray-700 p-2 rounded-lg w-full'>
          <Text className='p-3 text-center text-white font-bold text-base'>Entrar</Text>
        </Pressable>
      </View>

      <View className='flex justify-center items-center gap-4'>
        <Text className='font-bold'>Não tem conta?</Text>
        <Pressable onPress={() => router.push('./register')} className='bg-steel-gray-700 rounded-lg w-[30%]'>
          <Text className='p-3 text-center text-white font-bold text-base'>Cadastrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default index