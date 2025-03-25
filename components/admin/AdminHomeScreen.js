import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Snackbar, Surface, List, Appbar, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

export default function AdminHomeScreen({ navigation }) {
    const [userInfo, setUserInfo] = useState({});
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const menuItems = [
        { title: 'Quản lí sách', icon: 'book-outline', onPress: () => { alert("Quản lí sách") } },
        { title: 'Quản lí thể loại', icon: 'library-outline', onPress: () => { navigation.navigate('AdminGenreManagement') } },
        { title: 'Quản lí đơn hàng', icon: 'cart-outline', onPress: () => { alert("Quản lí đơn hàng") } },
        { title: 'Quản lí người dùng', icon: 'people-outline', onPress: () => { alert("Quản lí người dùng") } },
        { title: 'Thống kê', icon: 'bar-chart-outline', onPress: () => { alert("Thống kê") } },
    ];

    useEffect(() => {
        // Get user info when component mounts
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        try {
            const userInfoString = await AsyncStorage.getItem('userInfo');
            if (userInfoString) {
                const userInfo = JSON.parse(userInfoString);
                setUserInfo(userInfo);
            }
        } catch (error) {
            console.error('Error getting user info:', error);
            setSnackbarMessage('Không thể lấy thông tin người dùng');
            setSnackbarVisible(true);
        }
    };

    const handleLogout = async () => {
        try {
            const API_URL = API_BASE_URL + '/auth/logout';

            // Get token from AsyncStorage
            const token = await AsyncStorage.getItem('userToken');

            const data = {
                'token': token
            };

            if (token) {
                const response = await axios.post(API_URL, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('userInfo');

                console.log('Logout response: ', response.data);

                // Navigate to SignIn screen
                navigation.navigate('SignIn');
            } else {
                console.error('Token not found');
                setSnackbarMessage('Không tìm thấy token đăng nhập');
                setSnackbarVisible(true);
            }
        } catch (error) {
            console.error('Error logging out: ', error);
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userInfo');
            navigation.navigate('SignIn');
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="Trang Quản Trị" />
            </Appbar.Header>

            <ScrollView style={styles.scrollView}>
                <View style={styles.welcomeContainer}>
                    <Text variant="headlineMedium" style={styles.welcomeText}>
                        Xin chào, ADMIN
                    </Text>
                </View>

                <Surface style={styles.menuContainer} elevation={1}>
                    <List.Section>
                        {menuItems.map((item) => (
                            <List.Item
                                key={item.title}
                                title={item.title}
                                left={props => <Ionicons {...props} name={item.icon} size={24} />}
                                right={props => <List.Icon {...props} icon="chevron-right" />}
                                onPress={item.onPress}
                            />
                        ))}
                    </List.Section>
                </Surface>

                <Surface style={[styles.menuContainer, styles.logoutContainer]} elevation={1}>
                    <Button
                        mode="contained"
                        icon="logout"
                        buttonColor="#e53935"
                        onPress={handleLogout}
                        style={styles.logoutButton}
                    >
                        Đăng xuất
                    </Button>
                </Surface>
            </ScrollView>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: 'Đóng',
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    appbar: {
        elevation: 0,
        backgroundColor: '#ffffff',
    },
    scrollView: {
        flex: 1,
    },
    welcomeContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    welcomeText: {
        fontWeight: 'bold',
    },
    roleText: {
        color: '#666666',
    },
    menuContainer: {
        margin: 16,
        backgroundColor: '#ffffff',
        borderRadius: 8,
    },
    logoutContainer: {
        padding: 16,
        marginTop: 8,
    },
    logoutButton: {
        width: '100%',
    },
});