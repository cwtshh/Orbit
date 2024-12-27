import { View, Text } from 'react-native'
import React, { useCallback, useState } from 'react'
import axios from 'axios'
import { API_URL } from '@/app/utils/API_URL'
import { notifyToast } from '@/app/utils/Toast'
import { useFocusEffect } from 'expo-router'
import OPostCard from './other_user_post_card'

const OBlips = ({ user_id } : any) => {
    const [ posts, setPosts ] = useState<any[]>([]); 

    const get_user_posts = async() => {
        await axios.get(`${API_URL}/user/posts/user/${user_id}`).then((res) => {
            setPosts(res.data);
        }).catch((err) => {
            notifyToast('error', 'Erro ao buscar posts', 'Erro ao buscar posts, tente novamente.');
        })
    };

    useFocusEffect(useCallback(() => {
        get_user_posts();
    }, []))

    return (
        <View>
            {posts.length > 0 ? (
             posts.map((post: any, index: number) => {
                return (
                    <OPostCard key={index} post={post} />
                )
             })   
            ): (
                <Text className='text-cente text-xl font-bold'>Este usuário não tem posts</Text>
            )}
        </View>
    )
}

export default OBlips