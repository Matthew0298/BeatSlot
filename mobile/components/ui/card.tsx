import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';

export function Card({ style, children, ...props }: ViewProps) {
    return (
        <View style={[styles.card, style]} {...props}>
            {children}
        </View>
    );
}

export function CardHeader({ style, children }: ViewProps) {
    return <View style={[styles.header, style]}>{children}</View>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
    return <Text style={styles.title}>{children}</Text>;
}

export function CardDescription({ children }: { children: React.ReactNode }) {
    return <Text style={styles.description}>{children}</Text>;
}

export function CardContent({ style, children }: ViewProps) {
    return <View style={[styles.content, style]}>{children}</View>;
}

export function CardFooter({ style, children }: ViewProps) {
    return <View style={[styles.footer, style]}>{children}</View>;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 12,
    },
    header: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    description: {
        fontSize: 12,
        color: '#6B7280',
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    footer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
});
