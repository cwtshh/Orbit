import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useSession } from '@/app/context/AuthContext'
import { FontAwesome } from '@expo/vector-icons';
import Blips from '../components/blips';
import Curtidas from '../components/curtidas';

const profile = () => {
    const [ selected, setSelected ] = useState<string>('blips');
    const { user } = useSession();

    return (
        <View className='w-full h-full'>
            <View className='bg-steel-gray-800 p-4 flex flex-row justify-between items-center'>
                <View className='w-[40%]'>
                    <Text className='font-bold text-2xl text-white'>{user?.name}</Text>
                    <Text className='text-xl text-white'>{user?.username}</Text>
                    <Text className='text-sm text-white'>1 seguidor</Text>
                </View>
                <View className='bg-white p-4 rounded-full w-20 h-20 flex justify-center items-center'>
                    <Text className=''>
                        <FontAwesome size={28} name="user" color={"#9688cc"} />
                    </Text>
                </View>
            </View>

            <View className='flex flex-row p-4  justify-between gap-5'>
                <Pressable className='bg-steel-gray-700 p-4 rounded-md w-[47%]'>
                    <Text className='text-white font-bold'>Editar Perfil</Text>
                </Pressable>

                <Pressable className='bg-steel-gray-700 p-4 rounded-md w-[47%]'>
                    <Text className='text-white font-bold'>Compartilhar perfil</Text>
                </Pressable>
            </View>


        <View className='flex flex-row w-[100%] p-4'>
            <Pressable onPress={() => setSelected('blips')} className={`p-2 w-28 flex justify-center items-center border-b-2 ${selected === 'blips' ? 'border-steel-gray-800' : 'border-transparent'}`}>
                <Text className='font-bold'>Blips</Text>
            </Pressable>

            <Pressable onPress={() => setSelected('curtidas')} className={`p-2 w-28 flex justify-center items-center border-b-2 ${selected === 'curtidas' ? 'border-steel-gray-800' : 'border-transparent'}`}>
                <Text className='font-bold'>Curtidas</Text>
            </Pressable>
        </View>

        <View className='p-4'>
            {selected === 'blips' ? (
                <>
                    <Blips />
                </>
            ) : (
                <>
                    <Curtidas />
                </>
            )}
        </View>
    </View>
  )
}

export default profile