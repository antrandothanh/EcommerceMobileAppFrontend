import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Title,
  HelperText,
  useTheme,
  Snackbar,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [userInfo, setUserInfo] = useState({});

  // Validation functions
  const validateEmail = () => {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!email.trim()) {
    //     setEmailError('Yêu cầu nhập email');
    //     return false;
    // } else if (!emailRegex.test(email)) {
    //     setEmailError('Email không hợp lệ');
    //     return false;
    // }
    if (!email.trim()) {
      setEmailError("Vui lòng nhập email");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Sign in function
  const handleSignIn = async () => {
    const isEmailValid = validateEmail();
    if (isEmailValid) {
      setLoading(true);
      try {
        const data = {
          username: email,
          password: password,
        };
        const API_URL = API_BASE_URL + "/auth/token";
        const response = await axios.post(API_URL, data);
        if (response.data.result.authenticated) {
          const token = response.data.result.token;
          await AsyncStorage.setItem("userToken", token);
          const userInfo = await fetchUserInfo();
          await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
          if (data.username !== "admin") {
            const GET_CART_API_URL = API_BASE_URL + "/cart";
            const cartResponse = await axios.get(GET_CART_API_URL, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (!cartResponse.data.result) {
              const CREATE_CART_API_URL = API_BASE_URL + "/cart";
              const cartResponse = await axios.post(CREATE_CART_API_URL, null, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            }
          }
          setTimeout(() => {
            setEmail("");
            setPassword("");
            setLoading(false);
            if (userInfo.role === "CUSTOMER") {
              navigation.navigate("MainApp");
            } else if (userInfo.role === "ADMIN") {
              navigation.navigate("AdminHome");
            }
          }, 3000);
        }
      } catch (error) {
        // console.error("Login error:", error);
        let errorMessage =
          "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập và thử lại sau.";
        setSnackbarMessage(errorMessage);
        setSnackbarVisible(true);
        setLoading(false);
      }
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const API_GET_INFO_URL = API_BASE_URL + "/users/my-info";
      const response = await axios.get(API_GET_INFO_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const createdDate = new Date(response.data.result.createdAt);
      const formattedDate = createdDate.toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      const userInfo = {
        id: response.data.result.id,
        name: response.data.result.name,
        phone: response.data.result.phone,
        email: response.data.result.email,
        createdAt: formattedDate,
        role: response.data.result.roles[0].name,
      };
      setUserInfo(userInfo);
      return userInfo;
    } catch (error) {
      console.error("Error getting user info: ", error);
    }
  };

  const handleForgetPassword = () => {
    // TODO: add forget password function
    console.log("Forget password pressed");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Title style={styles.title}>Đăng nhập</Title>

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
          {emailError ? (
            <HelperText style={styles.myHelperText} type="error">
              {emailError}
            </HelperText>
          ) : null}

          <TextInput
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry={secureTextEntry}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={secureTextEntry ? "eye-off" : "eye"}
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              />
            }
          />

          <View style={styles.forgetPasswordContainer}>
            <TouchableOpacity onPress={handleForgetPassword}>
              <Text style={styles.forgetPasswordLink}>Quên mật khẩu</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={handleSignIn}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            buttonColor="#007AFF"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>

          {loading && (
            <ActivityIndicator
              animating={true}
              color="#007AFF"
              style={styles.loader}
              size="small"
            />
          )}

          <View style={styles.signUpContainer}>
            <Text style={styles.loginText}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.loginLink}>Đăng ký</Text>
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
            label: "Đóng",
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
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
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
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    marginRight: 5,
  },
  loginLink: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  backToHomeContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
  },
  backToHomeLink: {
    fontWeight: "bold",
    color: "red",
  },
  forgetPasswordContainer: {
    marginTop: 10,
  },
  forgetPasswordLink: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  myHelperText: {
    color: "red",
    marginBottom: 15,
  },
  loader: {
    marginTop: 10,
  },
});

export default SignInScreen;
