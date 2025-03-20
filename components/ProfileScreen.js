import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import {
  Avatar,
  Text,
  List,
  Surface,
  useTheme,
  Appbar
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import CartDrawer from './CartDrawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';
import axios from 'axios';

// Sample book data
const sampleBooks = [
  {
    id: "1",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    price: "86.000đ",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/df/7d/da/d340edda2b0eacb7ddc47537cddb5e08.jpg",
  },
  {
    id: "2",
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    price: "79.000đ",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/66/5f/5a/7666a0fc1666b3155a0c9a612360e105.jpg",
  },
  {
    id: "3",
    title: "Cây Cam Ngọt Của Tôi",
    author: "José Mauro de Vasconcelos",
    price: "108.000đ",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg",
  },
  {
    id: "4",
    title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
    author: "Nguyễn Nhật Ánh",
    price: "125.000đ",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/2e/ae/d3/2e9446ea8fec0b8a2fe00d02dc5a57a2.jpg",
  },
  {
    id: "5",
    title: "Skidibi Toilet",
    author: "Nguyễn Nhật Ánh",
    price: "125.000đ",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/2e/ae/d3/2e9446ea8fec0b8a2fe00d02dc5a57a2.jpg",
  },
  {
    id: "6",
    title: "Skidibi Toilet",
    author: "Nguyễn Nhật Ánh",
    price: "125.000đ",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/2e/ae/d3/2e9446ea8fec0b8a2fe00d02dc5a57a2.jpg",
  },
  {
    id: "7",
    title: "Skidibi Toilet",
    author: "Nguyễn Nhật Ánh",
    price: "125.000đ",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/2e/ae/d3/2e9446ea8fec0b8a2fe00d02dc5a57a2.jpg",
  },
  {
    id: "8",
    title: "Skidibi Toilet",
    author: "Nguyễn Nhật Ánh",
    price: "125.000đ",
    image:
      "https://salt.tikicdn.com/cache/280x280/ts/product/2e/ae/d3/2e9446ea8fec0b8a2fe00d02dc5a57a2.jpg",
  },
];

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();

  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState(sampleBooks);

  const [userInfo, setUserInfo] = useState({});

  const menuItems = [
    {
      title: 'Chỉnh sửa thông tin cá nhân',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile')
    },
    { title: 'Đơn hàng của tôi', icon: 'cart-outline', onPress: () => navigation.navigate('MyOrder') },
    { title: 'Sách yêu thích', icon: 'heart-outline', onPress: () => { } },
    { title: 'Cài đặt thông báo', icon: 'notifications-outline', onPress: () => navigation.navigate('EditNotification') },
    { title: 'Trợ giúp & Hỗ trợ', icon: 'help-circle-outline', onPress: () => { } },
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
        "token": token
      };

      if (token) {
        const response = await axios.post(API_URL, data, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userEmail");

        console.log("Logout response: ", response.data);

        setIsAuthenticated(false);
        // navigation.navigate("MainApp");
      } else {
        console.error("Token not found");
      }
    } catch (error) {
      console.error("Error logging out: ", error);
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userEmail");
      setIsAuthenticated(false);
    }
  }

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
                source={{ uri: userInfo.avatar }}
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
                  left={props => <Ionicons {...props} name={item.icon} size={24} />}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  onPress={item.onPress}
                />
              ))}
            </List.Section>
          </Surface>

          <Surface style={[styles.menuContainer, styles.logoutContainer]} elevation={1}>
            <List.Item
              title="Đăng xuất"
              left={props => <Ionicons {...props} name="log-out-outline" size={24} color={theme.colors.error} />}
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
          <Text variant="headlineMedium" style={styles.welcomeText}>Chào mừng đến với Bookstore</Text>
          <Text variant="bodyMedium" style={styles.subText}>Đăng nhập hoặc đăng ký để tiếp tục</Text>

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
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem("userToken");

      if (token) {
        setIsAuthenticated(true);
        await fetchUserInfo();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking login status: ", error);
      setIsAuthenticated(false);
    }
  }

  const fetchUserInfo = async () => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem("userToken");
      console.log("Token: ", token);

      // Get user info
      const API_GET_INFO_URL = API_BASE_URL + "/users/my-info";
      const response = await axios.get(API_GET_INFO_URL, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      const createdDate = new Date(response.data.result.createdAt);
      
      const formattedDate = createdDate.toLocaleDateString('vi-VN', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });

      const userInfo = {
        id: response.data.result.id,
        name: response.data.result.name,
        phone: response.data.result.phone,
        email: response.data.result.email,
        avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random",
        createdAt: formattedDate
      }

      console.log("User info: ", userInfo);

      setUserInfo(userInfo);

    } catch (error) {
      console.error("Error getting user info: ", error);
    }
  }

  useEffect(() => {
    // Check if user logged in. If it is true, fetch user info
    isLoggedIn();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Hồ Sơ" />
        {isAuthenticated ? (
          <Appbar.Action icon="cart" onPress={() => setCartVisible(true)} />
        ) : null}
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
    backgroundColor: '#f5f5f5',
  },
  appbar: {
    elevation: 0,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  name: {
    fontWeight: 'bold',
  },
  email: {
    color: '#666666',
    marginTop: 4,
  },
  joinDate: {
    color: '#999999',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  logoutContainer: {
    marginBottom: 32,
  },
  // Styles for unauthenticated view
  unauthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subText: {
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  authButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#2196F3',
  },
  loginButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  signupButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

