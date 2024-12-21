import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useSession } from './context/AuthContext'
import { RegisterBody } from './types/common'

const register = () => {
  const { register } = useSession();
  const [ username, setUsername ] = useState('');
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword ] = useState('');

  const router = useRouter();

  const handleRegister = async() => {
    const user_data: RegisterBody = {
      username,
      name,
      email,
      password
    };

    await register(user_data);
  }

  return (
    <View className='flex justify-center h-full gap-5 w-full p-4'>

        <View>
            <Text className='font-bold text-2xl'>Orbit</Text>
            <Text>
                Crie sua conta no Orbit 🌌
            </Text>
            <Text>
                Conecte-se com o mundo, compartilhe o que importa e descubra novas perspectivas. 🚀
            </Text>
        </View>

      <View className='flex flex-col gap-6 bg-slate-200 p-4 rounded-lg'>
        <Text className='font-bold'>Nome de Usuário:</Text>
        <TextInput onChangeText={setUsername} className='w-full bg-white rounded-xl' />

        <Text className='font-bold'>Nome:</Text>
        <TextInput onChangeText={setName} className='w-full bg-white rounded-xl' />

        <Text className='font-bold'>Email:</Text>
        <TextInput onChangeText={setEmail} className='w-full bg-white rounded-xl' />

        <Text className='font-bold'>Senha:
          <Text className='text-red-700 font-normal'>
            {password !== confirmPassword && 'As senhas não coicidem.'}
          </Text>
        </Text>
        <TextInput 
          secureTextEntry
          onChangeText={setPassword} 
          className={`w-full bg-white rounded-xl ${confirmPassword !== password && 'border border-red-600'}`} 
        />

        <Text className='font-bold'>Confirme sua Senha: 
          <Text className='text-red-700 font-normal'>
            {password !== confirmPassword && 'As senhas não coicidem.'}
          </Text>
        </Text>
        <TextInput 
          secureTextEntry
          onChangeText={setConfirmPassword} 
          className={`w-full bg-white rounded-xl ${confirmPassword !== password && 'border border-red-600'}`} 
        />
        

        <Pressable onPress={handleRegister} className='bg-steel-gray-700 p-2 rounded-lg w-full'>
          <Text className='p-3 text-center text-white font-bold text-base'>Cadastrar</Text>
        </Pressable>
      </View>

      <View className='flex justify-center items-center gap-4'>
        <Text className='font-bold'>Já tem cadastro?</Text>
        <Pressable onPress={() => router.push('/')} className='bg-steel-gray-700 rounded-lg w-[30%]'>
          <Text className='p-3 text-center text-white font-bold text-base'>Entrar</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default register