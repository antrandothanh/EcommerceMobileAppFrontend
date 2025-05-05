import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import {
  Avatar,
  Text,
  List,
  Surface,
  useTheme,
  Appbar,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import CartDrawer from "./CartDrawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";
import axios from "axios";

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();

  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [userInfo, setUserInfo] = useState({});

  const menuItems = [
    {
      title: "Thông tin cá nhân",
      icon: "person-outline",
      onPress: () => navigation.navigate("EditProfile"),
    },
    {
      title: "Đơn hàng của tôi",
      icon: "cart-outline",
      onPress: () => navigation.navigate("MyOrder"),
    },
    { title: "Sách yêu thích", icon: "heart-outline", onPress: () => {} },
    {
      title: "Cài đặt thông báo",
      icon: "notifications-outline",
      onPress: () => navigation.navigate("EditNotification"),
    },
    {
      title: "Trợ giúp & Hỗ trợ",
      icon: "help-circle-outline",
      onPress: () => {},
    },
  ];

  const addToCart = (book) => {
    // add to cart
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    // update cart items
  };

  const removeFromCart = (itemId) => {
    // remove cart items
  };

  const handleLogout = async () => {
    try {
      const API_URL = API_BASE_URL + "/auth/logout";

      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem("userToken");

      const data = {
        token: token,
      };

      if (token) {
        const response = await axios.post(API_URL, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userInfo");
        await AsyncStorage.removeItem("cart");
        setIsAuthenticated(false);
        // navigation.navigate("MainApp");
      } else {
        console.error("Token not found");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
      await AsyncStorage.removeItem("cart");
      setIsAuthenticated(false);
    }
  };

  // Render different content based on authentication status
  const renderContent = () => {
    if (isAuthenticated) {
      // Authenticated user view
      return (
        <ScrollView>
          <Surface style={styles.header} elevation={1}>
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={100}
                source={require("../assets/DefaultAvatar.jpg")}
              />
            </View>
            <View style={styles.userInfo}>
              <Text variant="headlineSmall" style={styles.name}>
                {userInfo.name}
              </Text>
              <Text variant="bodySmall" style={styles.joinDate}>
                Thành viên từ ngày: {userInfo.createdAt}
              </Text>
            </View>
          </Surface>

          <Surface style={styles.menuContainer} elevation={1}>
            <List.Section>
              {menuItems.map((item) => (
                <List.Item
                  key={item.title}
                  title={item.title}
                  left={(props) => (
                    <Ionicons {...props} name={item.icon} size={24} />
                  )}
                  right={(props) => (
                    <List.Icon {...props} icon="chevron-right" />
                  )}
                  onPress={item.onPress}
                />
              ))}
            </List.Section>
          </Surface>

          <Surface
            style={[styles.menuContainer, styles.logoutContainer]}
            elevation={1}
          >
            <List.Item
              title="Đăng xuất"
              left={(props) => (
                <Ionicons
                  {...props}
                  name="log-out-outline"
                  size={24}
                  color={theme.colors.error}
                />
              )}
              titleStyle={{ color: theme.colors.error }}
              onPress={handleLogout}
            />
          </Surface>
        </ScrollView>
      );
    } else {
      // Unauthenticated user view
      return (
        <View style={styles.unauthContainer}>
          <Text variant="headlineMedium" style={styles.welcomeText}>
            Chào mừng đến với Bookstore
          </Text>
          <Text variant="bodyMedium" style={styles.subText}>
            Đăng nhập hoặc đăng ký để tiếp tục
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.authButton, styles.loginButton]}
              onPress={() => {
                navigation.navigate("SignIn");
              }}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.authButton, styles.signupButton]}
              onPress={() => {
                navigation.navigate("SignUp");
              }}
            >
              <Text style={styles.signupButtonText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  const isLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        setIsAuthenticated(true);
        const userInfoString = await AsyncStorage.getItem("userInfo");
        const userInfo = JSON.parse(userInfoString);
        setUserInfo(userInfo);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking login status: ", error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Hồ Sơ" />
      </Appbar.Header>

      {renderContent()}

      <CartDrawer
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeFromCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  appbar: {
    elevation: 0,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 20,
    backgroundColor: "#ffffff",
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: "center",
    position: "relative",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  userInfo: {
    alignItems: "center",
    marginTop: 16,
  },
  name: {
    fontWeight: "bold",
  },
  email: {
    color: "#666666",
    marginTop: 4,
  },
  joinDate: {
    color: "#999999",
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  logoutContainer: {
    marginBottom: 32,
  },
  // Styles for unauthenticated view
  unauthContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subText: {
    color: "#666666",
    marginBottom: 32,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  authButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#2196F3",
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  signupButtonText: {
    color: "#2196F3",
    fontWeight: "bold",
    fontSize: 16,
  },
});
