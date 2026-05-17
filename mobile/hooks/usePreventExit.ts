// src/hooks/usePreventExit.ts
import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function usePreventExit() {
    const navigation = useNavigation();

    useEffect(() => {
        const onBackPress = () => {
            if (navigation.canGoBack()) {
                navigation.goBack(); // torna alla schermata precedente
            } else {
                // Non chiudere l'app
                Alert.alert('Attenzione', 'Non puoi uscire da qui');
            }
            return true; // blocca il comportamento di default
        };


        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => subscription.remove();
    }, [navigation]);
}
