import { Text, View } from 'react-native';
import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useSession } from '../context/AuthContext';

export default function AppLayout() {
    const { user, isLoading } = useSession();

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (!user) {
        return <Redirect href={'../register'}/>;
    }

    return (
        <>
            <View className="h-full w-full" style={{ flex: 1 }} >
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                </Stack>
            </View>
        </>
    );
}
