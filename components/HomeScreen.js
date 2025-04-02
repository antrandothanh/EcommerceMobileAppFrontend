import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function HomeScreen() {
  // Mock data for top seller books
  // const sampleBooks = [
  //   {
  //     id: "1",
  //     title: "Đắc Nhân Tâm",
  //     author: "Dale Carnegie",
  //     price: "86.000đ",
  //     image:
  //       "https://salt.tikicdn.com/cache/280x280/ts/product/df/7d/da/d340edda2b0eacb7ddc47537cddb5e08.jpg",
  //   },
  //   {
  //     id: "2",
  //     title: "Nhà Giả Kim",
  //     author: "Paulo Coelho",
  //     price: "79.000đ",
  //     image:
  //       "https://res.cloudinary.com/dfolztuvq/image/upload/79c63b21-f65b-4913-8370-ba8a5aa44c23_AcThuTieuTu_TuyetNhan.jpg?_a=DAGAACAVZAA0",
  //   },
  //   {
  //     id: "3",
  //     title: "Cây Cam Ngọt Của Tôi",
  //     author: "José Mauro de Vasconcelos",
  //     price: "108.000đ",
  //     image:
  //       "https://res.cloudinary.com/dfolztuvq/image/upload/02e69e8d-9dc0-4289-91d1-d25402a53722_9094a5a9-106f-4a7a-9c57-434bad87a3d9.jpeg?_a=DAGAACAVZAA0",
  //   },
  //   {
  //     id: "4",
  //     title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
  //     author: "Nguyễn Nhật Ánh",
  //     price: "125.000đ",
  //     image:
  //       "https://salt.tikicdn.com/cache/280x280/ts/product/2e/ae/d3/2e9446ea8fec0b8a2fe00d02dc5a57a2.jpg",
  //   },
  // ];

  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState(books);
  const [books, setBooks] = useState([]);
  const [literatureBooks, setLiteratureBooks] = useState([]);
  const [selfHelpBooks, setSelfHelpBooks] = useState([]);
  const [businessBooks, setBusinessBooks] = useState([]);
  const [childrenBooks, setChildrenBooks] = useState([]);
  const [referenceBooks, setReferenceBooks] = useState([]);
  const [parentingBooks, setParentingBooks] = useState([]);
  const [learningLanguageBooks, setLearningLanguageBooks] = useState([]);
  const [biographyAndMemoirBooks, setBiographyAndMemoirBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/books`);
      setBooks(response.data.result);
      setCartItems(response.data.result);

      // get literature books
      const literatureBooks = response.data.result.filter(
        (book) => book.genres[0].name === "Văn học"
      );
      setLiteratureBooks(literatureBooks);

      // get self-help books
      const selfHelpBooks = response.data.result.filter(
        (book) => book.genres[0].name === "Tâm lí - kĩ năng sống"
      );
      setSelfHelpBooks(selfHelpBooks);

      // get business books
      const businessBooks = response.data.result.filter(
        (book) => book.genres[0].name === "Kinh tế"
      );
      setBusinessBooks(businessBooks);

      // get children books
      const childrenBooks = response.data.result.filter(
        (book) => book.genres[0].name === "Sách thiếu nhi"
      );
      setChildrenBooks(childrenBooks);

      // get reference books
      const referenceBooks = response.data.result.filter(
        (book) => book.genres[0].name === "Giáo khoa - tham khảo"
      );
      setReferenceBooks(referenceBooks);

      // get parenting books
      const parentingBooks = response.data.result.filter(
        (book) => book.genres[0].name === "Nuôi dạy con"
      );
      setParentingBooks(parentingBooks);

      // get learning language books
      const learningLanguageBooks = response.data.result.filter(
        (book) => book.genres[0].name === "Sách học Ngoại Ngữ"
      );
      setLearningLanguageBooks(learningLanguageBooks);

      // get biography and memoir books
      const biographyAndMemoirBooks = response.data.result.filter(
        (book) => book.genres[0].name === "Tiểu sử - hồi kí"
      );
      setBiographyAndMemoirBooks(biographyAndMemoirBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const formatVNCurrency = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(number)
      .replace("₫", "đ");
  };

  const addToCart = (book) => {};

  const updateCartItemQuantity = (itemId, newQuantity) => {};

  const removeFromCart = (itemId) => {};

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Card style={styles.bookCard}>
        <Card.Cover source={{ uri: item.image }} style={styles.bookImage} />
        <Card.Content>
          <Text numberOfLines={1} style={styles.bookTitle}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.bookAuthor}>
            {item.author}
          </Text>
          <Text style={styles.bookPrice}>{formatVNCurrency(item.price)}</Text>
        </Card.Content>
      </Card>
    </View>
  );

  const BookSection = ({ title, data }) => (
    <View style={styles.section}>
      <Text variant="titleLarge" style={styles.sectionTitle}>
        {title}
      </Text>
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noBookText}>No books</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Trang Chủ" />
        <Appbar.Action icon="cart" onPress={() => setCartVisible(true)} />
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
        <BookSection title="Sách Bán Chạy" data={books} />
        <BookSection title="Sách Mới Phát Hành" data={books} />
        <BookSection title="Sách Văn Học" data={literatureBooks} />
        <BookSection title="Sách Tâm Lí - Kĩ Năng Sống" data={selfHelpBooks} />
        <BookSection title="Sách Kinh Tế" data={businessBooks} />
        <BookSection title="Sách Thiếu Nhi" data={childrenBooks} />
        <BookSection title="Sách Giáo Khoa - Tham Khảo" data={referenceBooks} />
        <BookSection title="Sách Tiểu Sử - Hồi Kí" data={biographyAndMemoirBooks} />
        <BookSection title="Sách Nuôi Dạy Con" data={parentingBooks} />
        <BookSection title="Sách Học Ngoại Ngữ" data={learningLanguageBooks} />
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
    width: 160,
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
  noBookText: {
    fontSize: 16,
    color: "#666666",
    fontStyle: "italic",
    padding: 10,
    textAlign: "center",
  },
});
