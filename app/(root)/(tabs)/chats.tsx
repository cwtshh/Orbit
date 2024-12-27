import { View, Text, Pressable, TextInput, ScrollView } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import React, { useState } from 'react'

const chats = () => {
    const [ userChats, setUserChats ] = useState([]);


    return (
        <View>
            <View className='bg-steel-gray-800 p-4 flex flex-row justify-between items-center w-full'>
                <View className='flex flex-col gap-2 w-3/4'>
                <Text className='font-bold text-2xl text-white'>Chats</Text>
                </View>
            </View>


            <View className='w-full h-full p-4'>
                <View className="flex flex-row items-center gap-4 px-4 h-14 border border-gray-300 rounded-full">
                    <FontAwesome name="search" size={18} color="#9688cc" />
                    <TextInput
                        placeholder="Procure por chats..."
                        className="flex-1 text-sm text-black"
                        placeholderTextColor="#A0A0A0"
                    />
                </View>
            </View>

            <ScrollView>

                
            </ScrollView>
        </View>
    );
}

export default chats