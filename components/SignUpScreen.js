import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text, Title, HelperText, useTheme, Snackbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

const SignUpScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // API URL
    const API_URL = 'http://192.168.1.226:8080/api/users';

    // Validation functions
    const validateName = () => {
        if (!name.trim()) {
            setNameError('Yêu cầu nhập tên');
            return false;
        }
        setNameError('');
        return true;
    };

    const validatePhone = () => {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phone.trim()) {
            setPhoneError('Yêu cầu nhập số điện thoại');
            return false;
        } else if (!phoneRegex.test(phone)) {
            setPhoneError('Số điện thoại không hợp lệ');
            return false;
        }
        setPhoneError('');
        return true;
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setEmailError('Yêu cầu nhập email');
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError('Email không hợp lệ');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError('Yêu cầu nhập mật khẩu');
            return false;
        } else if (password.length < 5) {
            setPasswordError('Mật khẩu phải ít nhất 5 ký tự');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const validateConfirmPassword = () => {
        if (!confirmPassword) {
            setConfirmPasswordError('Yêu cầu xác nhận lại mật khẩu');
            return false;
        } else if (confirmPassword !== password) {
            setConfirmPasswordError('Không trùng với mật khẩu phía trên');
            return false;
        }
        setConfirmPasswordError('');
        return true;
    };

    // Sign up function
    const handleSignUp = async () => {
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        // If all fields are valid, proceed with registration
        if (isNameValid && isPhoneValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            setLoading(true);

            try {
                const userData = {
                    name,
                    email,
                    password,
                    phone,
                    "roles": ["CUSTOMER"]
                };

                const response = await axios.post(API_URL, userData);

                console.log('Registration successful:', response.data);

                // Show success message
                setSnackbarMessage('Đăng ký thành công!');
                setSnackbarVisible(true);

                // Keep loading state for 3 seconds after successful registration
                setTimeout(() => {
                    // Clear form after successful registration
                    setName('');
                    setPhone('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');

                    // Set stop loading state
                    setLoading(false);

                    // Navigate to Sign In
                    navigation.navigate('SignIn');
                }, 3000);

            } catch (error) {
                console.error('Registration error:', error);
                let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại sau.';
                setSnackbarMessage(errorMessage);
                setSnackbarVisible(true);
                setLoading(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Title style={styles.title}>Hãy trở thành thành viên của chúng tôi</Title>

                    <TextInput
                        label="Tên"
                        value={name}
                        onChangeText={setName}
                        onBlur={validateName}
                        mode="outlined"
                        style={styles.input}
                        error={!!nameError}
                        left={<TextInput.Icon icon="account" />}
                    />
                    {nameError ? <HelperText style={styles.myHelperText} type="error">{nameError}</HelperText> : null}

                    <TextInput
                        label="Số điện thoại"
                        value={phone}
                        onChangeText={setPhone}
                        onBlur={validatePhone}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={!!phoneError}
                        left={<TextInput.Icon icon="email" />}
                    />
                    {phoneError ? <HelperText style={styles.myHelperText} type="error">{phoneError}</HelperText> : null}

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        onBlur={validateEmail}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={!!emailError}
                        left={<TextInput.Icon icon="email" />}
                    />
                    {emailError ? <HelperText style={styles.myHelperText} type="error">{emailError}</HelperText> : null}

                    <TextInput
                        label="Mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        onBlur={validatePassword}
                        mode="outlined"
                        style={styles.input}
                        secureTextEntry={secureTextEntry}
                        error={!!passwordError}
                        left={<TextInput.Icon icon="lock" />}
                        right={
                            <TextInput.Icon
                                icon={secureTextEntry ? 'eye-off' : 'eye'}
                                onPress={() => setSecureTextEntry(!secureTextEntry)}
                            />
                        }
                    />
                    {passwordError ? <HelperText style={styles.myHelperText} type="error">{passwordError}</HelperText> : null}

                    <TextInput
                        label="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onBlur={validateConfirmPassword}
                        mode="outlined"
                        style={styles.input}
                        secureTextEntry={secureConfirmTextEntry}
                        error={!!confirmPasswordError}
                        left={<TextInput.Icon icon="lock-check" />}
                        right={
                            <TextInput.Icon
                                icon={secureConfirmTextEntry ? 'eye-off' : 'eye'}
                                onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                            />
                        }
                    />
                    {confirmPasswordError ? <HelperText style={styles.myHelperText} type="error">{confirmPasswordError}</HelperText> : null}

                    <Button
                        mode="contained"
                        onPress={handleSignUp}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        buttonColor='#007AFF'
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </Button>

                    {loading && (
                        <ActivityIndicator
                            animating={true}
                            color="#007AFF"
                            style={styles.loader}
                            size="small"
                        />
                    )}

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Đã có tài khoản?</Text>
                        <TouchableOpacity onPress={() => { navigation.navigate("SignIn") }}>
                            <Text style={styles.loginLink}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.backToHomeContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("MainApp")}>
                            <Text style={styles.backToHomeLink}>Quay lại trang chủ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {!loading ? (
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={5000}
                    action={{
                        label: 'Đóng',
                        onPress: () => setSnackbarVisible(false),
                    }}
                >
                    {snackbarMessage}
                </Snackbar>
            ) : null}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        marginBottom: 8,
    },
    button: {
        marginTop: 16,
        paddingVertical: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        marginRight: 5,
    },
    loginLink: {
        fontWeight: 'bold',
        color: '#007AFF',
    },
    backToHomeContainer: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 10,
    },
    backToHomeLink: {
        fontWeight: 'bold',
        color: 'red',
    },
    myHelperText: {
        color: 'red',
        marginBottom: 15,
    },
    loader: {
        marginTop: 10,
    },
});

export default SignUpScreen;