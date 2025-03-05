import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import {
    Text,
    TextInput,
    Button,
    Appbar,
    Surface,
    useTheme,
    Avatar,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileScreen = ({ navigation }) => {
    const theme = useTheme();
    const [userData, setUserData] = useState({
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0914678254',
        address: '27 Lê Quang Định, Phường 13, Quận Bình Thạnh, Tp. Hồ Chí Minh',
        profileImage: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedUserData = await AsyncStorage.getItem('userData');
            if (storedUserData) {
                setUserData(JSON.parse(storedUserData));
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setUserData({ ...userData, profileImage: result.assets[0].uri });
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleSave = async () => {
        if (!userData.fullName || !userData.email || !userData.phone) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (!isValidEmail(userData.email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            Alert.alert('Success', 'Profile updated successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Chỉnh sửa thông tin" />
            </Appbar.Header>

            <ScrollView>
                <Surface style={styles.imageContainer} elevation={0}>
                    <TouchableOpacity onPress={pickImage}>
                        {userData.profileImage ? (
                            <Avatar.Image
                                size={120}
                                source={{ uri: userData.profileImage }}
                            />
                        ) : (
                            <Avatar.Icon
                                size={120}
                                icon="account"
                                backgroundColor={theme.colors.surfaceVariant}
                            />
                        )}
                        <View style={styles.editIconContainer}>
                            <MaterialIcons name="edit" size={20} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </Surface>

                <Surface style={styles.formContainer} elevation={0}>
                    <Text variant="labelLarge" style={styles.label}>Họ và tên *</Text>
                    <TextInput
                        mode="outlined"
                        value={userData.fullName}
                        onChangeText={(text) => setUserData({ ...userData, fullName: text })}
                        placeholder="Nhập họ và tên"
                        style={styles.input}
                        activeOutlineColor="#007AFF"
                    />

                    <Text variant="labelLarge" style={styles.label}>Email *</Text>
                    <TextInput
                        mode="outlined"
                        value={userData.email}
                        onChangeText={(text) => setUserData({ ...userData, email: text })}
                        placeholder="Nhập email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                        activeOutlineColor="#007AFF"
                    />

                    <Text variant="labelLarge" style={styles.label}>Số điện thoại *</Text>
                    <TextInput
                        mode="outlined"
                        value={userData.phone}
                        onChangeText={(text) => setUserData({ ...userData, phone: text })}
                        placeholder="Nhập số điện thoại"
                        keyboardType="phone-pad"
                        style={styles.input}
                        activeOutlineColor="#007AFF"
                    />

                    <Text variant="labelLarge" style={styles.label}>Địa chỉ</Text>
                    <TextInput
                        mode="outlined"
                        value={userData.address}
                        onChangeText={(text) => setUserData({ ...userData, address: text })}
                        placeholder="Nhập địa chỉ"
                        multiline
                        numberOfLines={4}
                        style={[styles.input, styles.addressInput]}
                        activeOutlineColor="#007AFF"
                    />

                    <Button
                        mode="contained"
                        onPress={handleSave}
                        loading={loading}
                        disabled={loading}
                        style={styles.saveButton}
                        buttonColor="#007AFF"
                    >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </Surface>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    appbar: {
        elevation: 0,
        backgroundColor: '#ffffff',
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007AFF',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    formContainer: {
        padding: 20,
    },
    label: {
        marginBottom: 8,
        color: '#333',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    addressInput: {
        height: 100,
    },
    saveButton: {
        marginTop: 20,
        paddingVertical: 6,
    },
});

export default EditProfileScreen;
