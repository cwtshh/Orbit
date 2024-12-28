import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'expo-router/build/hooks'
import axios from 'axios';
import { API_URL } from '@/app/utils/API_URL';
import { notifyToast } from '@/app/utils/Toast';
import { FontAwesome } from '@expo/vector-icons';
import { useSession } from '@/app/context/AuthContext';
import { ScrollView } from 'react-native';
import { io } from 'socket.io-client';
import MessageCardSender from '../../components/message_card';
import MessageCardReciver from '../../components/message_card_reciver';
import { useFocusEffect } from 'expo-router';

interface User {
    _id: string,
    name: string,
    email: string,
    username: string
}

interface Message {
    user: string,
    content: string,
    createdAt: Date,
}

interface Chat {
    users: User[],
    messages: Message[],
    createdAt: Date,
}

const user_chat = () => {
    const chat_id = useSearchParams().get('id');
    const [ chat, setChat ] = useState<Chat>({
        users: [],
        messages: [],
        createdAt: new Date(),
    });
    const { user } = useSession();
    const router = useRouter();
    const other_user = chat.users.filter((u) => u._id !== user?.id)[0] || { _id: '', name: '', email: '', username: '' };
    const ws = new WebSocket(API_URL);
    const [ socket, setSocket ] = useState<any>(null);
    const [ message, setMessage ] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const [ loading, setLoading ] = useState(false);

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };
    useEffect(() => {
        scrollToBottom();
    }, [chat.messages]);

    const get_chat = async() => {
        setLoading(true);
        await axios.get(`${API_URL}/user/chat/${chat_id}`).then((res) => {
            setChat(res.data.chat);
            setLoading(false);
        }).catch((err) => {
            notifyToast('error', 'Error', 'Failed to get chat');
            router.back();
        })
    };

    useFocusEffect(useCallback(() => {
        get_chat();
    }, [chat_id]))

    useFocusEffect(
        useCallback(() => {
            const socket_connection = io(API_URL.replace('https', 'ws'));
            setSocket(socket_connection);
    
            socket_connection.emit('register', user?.id);

            socket_connection.emit('join_chat', chat_id);
    
            socket_connection.on('send_message_response', (response: any) => {
                if (response.data.chat_id === chat_id) {
                    setChat((prev_chat: Chat) => ({
                        ...prev_chat,
                        messages: [
                            ...prev_chat.messages,
                            {
                                user: response.data.sender_id,
                                content: response.data.message,
                                createdAt: new Date(),
                            },
                        ],
                    }));
                }
            });
    
            // Ouça o evento new_message para atualizar quando o outro usuário enviar uma mensagem
            socket_connection.on('new_message', (response: any) => {
                if (response.chat_id === chat_id) {
                    const new_message = {
                        user: response.sender_id,
                        content: response.message,
                        createdAt: new Date(),
                    }
                    if(new_message.user !== user?.id) {
                        setChat((prev_chat: Chat) => ({
                            ...prev_chat,
                            messages: [
                                ...prev_chat.messages,
                                new_message,
                            ],
                        }));
                    }
                }
            });
    
            return () => {
                socket_connection.disconnect();
            };
        }, [chat_id, user])
    );
    

    const handleSendMessage = useCallback(async () => {
        if (message.trim() !== '') {
            const new_message_data = {
                chat_id,
                message,
                sender_id: user?.id,
                reciver_id: other_user._id,
            };
    
            try {
                // Garantir que a mensagem só será enviada uma vez
                if (socket) {
                    socket.emit('send_message', new_message_data);
                    // Limpar a mensagem após o envio
                    setMessage('');
                }
            } catch (error) {
                notifyToast('error', 'Error', 'Failed to send message');
            }
        }
    }, [message, socket, user?.id, other_user._id]);
    


    return (
        <View className='flex flex-col h-full'>
            {/* Header */}
            <View className='bg-steel-gray-800 p-4 flex flex-row gap-4 items-center w-full'>
                <Pressable onPress={() => router.back()} className='bg-white rounded-full p-2 w-12 h-12 flex items-center justify-center'>
                    <FontAwesome name='arrow-left' size={24} color='#725ea4' onPress={() => router.back()} />
                </Pressable>
                <View className='bg-white rounded-full p-2 w-12 h-12 flex items-center justify-center'>
                    <FontAwesome name='user' size={18} color='#725ea4' />
                </View>

                {loading === true ? (
                    <ActivityIndicator animating={loading} size='large' color='white' />
                ) : (
                    <View>
                        <Text className='text-white text-lg'>{other_user.name}</Text>
                        <Text className='text-white text-sm'>@{other_user.username}</Text>
                    </View>
                )}

                
            </View>


            {/* ScrollView de mensagens com gap */}
            { loading ? (
                <View className='flex-1 flex items-center justify-center w-full h-full'>
                    <ActivityIndicator animating={loading} size='large' color='#725ea4' />
                </View>
            ) : (
                <ScrollView
                ref={scrollViewRef}
                className='flex-1 p-4'
                >
                    {chat.messages.length > 0 ? (
                        chat.messages.map((message: Message, index: number) => {
                            const isSender = message.user === user?.id;
                            return (
                                <View
                                    key={index}
                                    className={`flex flex-row ${isSender ? 'justify-end' : ''} mb-4`} // Adicionando gap entre as mensagens
                                >
                                    {isSender ? (
                                        <MessageCardSender message={message} />
                                    ) : (
                                        <MessageCardReciver message={message} />
                                    )}
                                </View>
                            );
                        })
                    ) : (
                        <View className='flex-1 flex items-center justify-center w-full h-full'>
                            <Text className='text-center text-gray-400'>Envie uma mensagem!</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            

            {/* Input de mensagem */}
            <View className="border-t border-gray-300 p-4 flex flex-row items-center w-full">
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    className="bg-gray-100 p-3 rounded-full flex-1"
                    placeholder="Type a message..."
                    placeholderTextColor="#A0A0A0"
                />
                <Pressable onPress={handleSendMessage} className="bg-white rounded-full p-3 flex items-center justify-center ml-2">
                    <FontAwesome name="send" size={18} color="#725ea4" />
                </Pressable>
            </View>
        </View>

    )
}

export default user_chat