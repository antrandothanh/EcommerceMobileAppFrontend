import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { Surface } from 'react-native-paper';

export default function SplashScreen({ navigation }) {
    const theme = useTheme();

    useEffect(() => {
        setTimeout(() => {
            // Navigate to main app after 5 seconds
            navigation.replace('MainApp');
        }, 5000);
    }, []);

    return (
        <Surface style={styles.container}>
            <Image
                source={require('../assets/LogoApp.png')} // Make sure to add your logo image in assets folder
                style={styles.logo}
                resizeMode="contain"
            />
            <Text variant="titleMedium" style={styles.slogan}>
                "Dẫu có bạc vàng trăm vạn lạng, chẳng bằng kinh sử một vài pho" - Lê Quý Đôn

            </Text>
            <ActivityIndicator
                animating={true}
                size="large"
                style={styles.loader}
                color={theme.colors.primary}
            />
        </Surface>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        elevation: 0,
    },
    logo: {
        width: 200,
        height: 200,
    },
    slogan: {
        marginTop: 20,
        marginBottom: 30,
        marginHorizontal: 20,
        textAlign: 'center',
    },
    loader: {
        marginTop: 20,
    },
});


