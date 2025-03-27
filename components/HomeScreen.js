import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Text, Card, Surface, Appbar } from "react-native-paper";
import CartDrawer from "./CartDrawer";

export default function HomeScreen() {
  // Mock data for top seller books
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
  ];
  
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState(sampleBooks);

  

  const addToCart = (book) => {
    
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    
  };

  const removeFromCart = (itemId) => {
    
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Card style={styles.bookCard}>
        <Card.Cover source={{ uri: item.image }} style={styles.bookImage} />
        <Card.Content>
          <Text numberOfLines={1} style={styles.bookTitle}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={styles.bookAuthor}>
            {item.author}
          </Text>
          <Text style={styles.bookPrice}>{item.price}</Text>
        </Card.Content>
      </Card>
    </View>
  );

  const BookSection = ({ title, data }) => (
    <View style={styles.section}>
      <Text variant="titleLarge" style={styles.sectionTitle}>
        {title}
      </Text>
      <FlatList
        data={data}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Trang Chủ" />
        <Appbar.Action 
          icon="cart" 
          onPress={() => setCartVisible(true)}
        />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        {/* Banner Section */}
        <Surface style={styles.bannerContainer} elevation={1}>
          <Image
            source={require("../assets/Banner.png")}
            style={styles.banner}
            resizeMode="contain"
          />
        </Surface>
        
        {/* Book Section */}
        <BookSection title="Sách Bán Chạy" data={sampleBooks} />
        <BookSection title="Sách Mới Phát Hành" data={sampleBooks} />
        <BookSection title="Kinh Dị Hay Nhất" data={sampleBooks} />
        <BookSection title="Tiểu Thuyết Hay Nhất" data={sampleBooks} />
        <BookSection title="Trinh Thám Hay Nhất" data={sampleBooks} />
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
    backgroundColor: "#f5f5f5",
  },
  appbar: {
    elevation: 0,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    width: "100%",
    height: 150,
    marginBottom: 20,
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  bookItem: {
    flex: 1,
  },
  bookCard: {
    width: 160,
    marginRight: 16,
    marginBottom: 8,
  },
  bookImage: {
    height: 200,
    resizeMode: "cover",
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
  },
  bookAuthor: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },
  bookPrice: {
    fontSize: 14,
    color: "#e41e31",
    fontWeight: "bold",
    marginTop: 4,
  },
});
