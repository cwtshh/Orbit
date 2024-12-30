import { createContext, useContext, PropsWithChildren, useState, useEffect } from 'react';
import { User, RegisterBody} from '../types/common';
import { useRouter } from 'expo-router';
import { notifyToast } from '../utils/Toast';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '../utils/API_URL';
import { usePushNotifications } from '../pushNotifications/usePushNotifications';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
    register: (user_data: RegisterBody) => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    login: () => {},
    logout: () => {},
    register: () => {},
    user: null,
    isLoading: false,
});

export const useSession = () => {
    const value = useContext(AuthContext);
    return value;
};

export const SessionProvider = ({ children }: PropsWithChildren<{}>) => {
    const [ user, setUser ] = useState<User | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ token, setToken ] = useState<string | null>(null);

    const router = useRouter();

    const login = async(username: string, password: string) => {
        if(username === '' || password === '') {
            notifyToast('error', 'Erro', 'Preencha todos os campos.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/user/login`, {
                username,
                password
            }, { withCredentials: true });
            await SecureStore.setItemAsync('token', response.data.token);
            await SecureStore.setItemAsync('user_data', JSON.stringify(response.data.user))
            notifyToast('success', 'Sucesso', 'Login feito com sucesso.');
            setUser(response.data.user);

            router.push('/(root)/(tabs)/home');

            router.push('/home');
        } catch (error) {
            notifyToast('error', 'Erro', 'Erro ao fazer login.');
        }

    };

    const logout = async() => {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user_data');
        setUser(null);
        router.push('/');
    };

    const register = async(user_data: RegisterBody) => {
        if(user_data.email === '' || user_data.name === '' || user_data.password === '' || user_data.username === '') {
            notifyToast('error', 'Erro', 'Preencha todos os campos.');
            return;
        }
        await axios.post(`${API_URL}/user/register`, user_data).then(() => {
            notifyToast('success', 'Sucesso', 'Usuário registrado com sucesso.');
            router.push('/');
        }).catch((err) => {
            notifyToast('error', 'Erro', 'Erro ao registrar usuário.');
        });
    };

    useEffect(() => {
        const checkUser = async() => {
            const token = await SecureStore.getItemAsync('token');
            const user_data = await SecureStore.getItemAsync('user_data');
            if(token && user_data) {
                setUser(JSON.parse(user_data));
                setToken(token);
                router.push('/(root)/(tabs)/home');
            }
        };

        checkUser();
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            register,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
};