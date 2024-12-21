import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
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
        name='profile'
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={"#9688cc"} />,
        }}
      />
    </Tabs>
  );
}
