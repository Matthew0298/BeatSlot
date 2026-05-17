// src/components/InputField.tsx
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

type Props = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric';
};

export default function InputField({
                                       label,
                                       value,
                                       onChangeText,
                                       placeholder = '',
                                       secureTextEntry = false,
                                       keyboardType = 'default',
                                   }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 8,
    },
    label: {
        fontWeight: '600',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: 'white',
    },
});
