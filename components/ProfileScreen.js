import React, { useState } from 'react';
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

  // Mock user data - in a real app, this would come from your auth/user context
  const user = {
    id: '001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random',
    joinDate: '01/01/2024',
  };

  const menuItems = [
    {
      title: 'Chỉnh sửa thông tin cá nhân',
      icon: 'person-outline',
      onPress: () => navigation.navigate('EditProfile')
    },
    { title: 'Đơn hàng của tôi', icon: 'cart-outline', onPress: () => navigation.navigate('MyOrder') },
    { title: 'Sách yêu thích', icon: 'heart-outline', onPress: () => { } },
    { title: 'Cài đặt thông báo', icon: 'notifications-outline', onPress: () => { } },
    { title: 'Trợ giúp & Hỗ trợ', icon: 'help-circle-outline', onPress: () => { } },
  ];

  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState(sampleBooks);

  const addToCart = (book) => {
    // add to cart
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    // update cart items
  };

  const removeFromCart = (itemId) => {
    // remove cart items
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Hồ Sơ" />
        <Appbar.Action icon="cart" onPress={() => setCartVisible(true)} />
      </Appbar.Header>

      <ScrollView>
        <Surface style={styles.header} elevation={1}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={100}
              source={{ uri: user.avatar }}
            />
          </View>
          <View style={styles.userInfo}>
            <Text variant="headlineSmall" style={styles.name}>
              {user.name}
            </Text>
            <Text variant="bodySmall" style={styles.joinDate}>
              Thành viên từ: {user.joinDate}
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
            onPress={() => { }}
          />
        </Surface>
      </ScrollView>

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
});

