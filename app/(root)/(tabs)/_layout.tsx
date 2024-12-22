import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, Tabs } from 'expo-router';
import React from 'react';


export default function TabLayout() {
  return (

    <>
      <Tabs screenOptions={{ tabBarActiveTintColor: "#9688cc", headerShown: false }} >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={"#9688cc"} />,
          }}
        />
        <Tabs.Screen
          name='post'
          options={{
            title: 'Novo Post',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={"#9688cc"} />,
          }}
        />
        <Tabs.Screen
          name='search'
          options={{
            title: 'Buscar',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="search" color={"#9688cc"} />,
          }}
        />
        <Tabs.Screen 
          name='profile'
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={"#9688cc"} />,
          }}
        />

        <Tabs.Screen 
          name='other_profile/[id]'
          options={{
            href: null
          }}
        />
      </Tabs>
    </>
  );
}
