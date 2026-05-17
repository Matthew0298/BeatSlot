import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    GestureResponderEvent,
    ViewStyle,
    TextStyle,
} from 'react-native';

type Variant =
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'hero'
    | 'fitness'
    | 'glass';

type Size = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
    variant?: Variant;
    size?: Size;
    title?: string;
    onPress?: (event: GestureResponderEvent) => void;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    children?: React.ReactNode;
}

export default function Button({
                                   variant = 'default',
                                   size = 'default',
                                   title,
                                   onPress,
                                   disabled,
                                   style,
                                   textStyle,
                                   children,
                               }: ButtonProps) {
    const btnStyle = [
        styles.base,
        stylesVariants[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        style,
    ];

    const txtStyle = [
        styles.text,
        textVariants[variant],
        sizeText[size],
        disabled && styles.textDisabled,
        textStyle,
    ];

    return (
        <TouchableOpacity style={btnStyle} onPress={onPress} disabled={disabled}>
            {children ? children : <Text style={txtStyle}>{title}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    text: {
        fontWeight: '500',
    },
    disabled: {
        opacity: 0.5,
    },
    textDisabled: {
        color: '#9CA3AF',
    },
});

const stylesVariants: Record<Variant, ViewStyle> = {
    default: { backgroundColor: '#3B82F6' },
    destructive: { backgroundColor: '#EF4444' },
    outline: {
        backgroundColor: 'transparent',
        borderColor: '#D1D5DB',
        borderWidth: 1,
    },
    secondary: { backgroundColor: '#E5E7EB' },
    ghost: { backgroundColor: 'transparent' },
    link: { backgroundColor: 'transparent' },
    hero: {
        backgroundColor: '#3B82F6',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    fitness: {
        backgroundColor: '#8B5CF6',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    glass: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
};

const textVariants: Record<Variant, TextStyle> = {
    default: { color: '#fff' },
    destructive: { color: '#fff' },
    outline: { color: '#111827' },
    secondary: { color: '#111827' },
    ghost: { color: '#111827' },
    link: { color: '#3B82F6', textDecorationLine: 'underline' },
    hero: { color: '#fff', fontWeight: '600' },
    fitness: { color: '#fff', fontWeight: '600' },
    glass: { color: '#fff' },
};

const sizeStyles: Record<Size, ViewStyle> = {
    default: { height: 44 },
    sm: { height: 36, paddingHorizontal: 12 },
    lg: { height: 48, paddingHorizontal: 20 },
    icon: { height: 44, width: 44, paddingHorizontal: 0 },
};

const sizeText: Record<Size, TextStyle> = {
    default: { fontSize: 14 },
    sm: { fontSize: 13 },
    lg: { fontSize: 15 },
    icon: { fontSize: 14 },
};
