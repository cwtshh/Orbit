import Toast from 'react-native-toast-message';

export const notifyToast = (type: string, text: string, text2: string) => {
    Toast.show({
        type: type,
        text1: text,
        text2: text2,
        visibilityTime: 4000,
        autoHide: true,
    });
};