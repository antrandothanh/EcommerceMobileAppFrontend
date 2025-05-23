import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { Text, Card, Surface, Appbar } from "react-native-paper";
import CartDrawer from "./CartDrawer";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [literatureBooks, setLiteratureBooks] = useState([]);
  const [selfHelpBooks, setSelfHelpBooks] = useState([]);
  const [businessBooks, setBusinessBooks] = useState([]);
  const [childrenBooks, setChildrenBooks] = useState([]);
  const [referenceBooks, setReferenceBooks] = useState([]);
  const [parentingBooks, setParentingBooks] = useState([]);
  const [learningLanguageBooks, setLearningLanguageBooks] = useState([]);
  const [biographyAndMemoirBooks, setBiographyAndMemoirBooks] = useState([]);
  // Add refreshing state
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/books`);
      setBooks(response.data.result);

      // get literature books
      const literatureBooks = response.data.result.filter(
        (book) => book.genres[0].name === "Văn học"
      );
      setLiteratureBooks(literatureBooks);

      // get self-help books
      const selfHelpBooks = response.data.result.filter(
        (book) => book.genres[0].name === "Tâm lý - kỹ năng sống"
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
        (book) => book.genres[0].name === "Tiểu sử - hồi ký"
      );
      setBiographyAndMemoirBooks(biographyAndMemoirBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      setRefreshing(false);
    }
  };

  // Add onRefresh function
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchBooks();
      setRefreshing(false);
    }, 2000);
  };

  const formatVNCurrency = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(number)
      .replace("₫", "đ");
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {};

  const removeFromCart = (itemId) => {};

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem} key={item.id}>
      <Card
        style={styles.bookCard}
        onPress={() => navigation.navigate("BookDetail", { book: item })}
      >
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
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#000000"]} // Customize indicator color for Android
            tintColor="#000000" // Customize indicator color for iOS
            size={"large"}
          />
        }
      >
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
        <BookSection title="Sách Tâm Lý - Kỹ Năng Sống" data={selfHelpBooks} />
        <BookSection title="Sách Kinh Tế" data={businessBooks} />
        <BookSection title="Sách Thiếu Nhi" data={childrenBooks} />
        <BookSection title="Sách Giáo Khoa - Tham Khảo" data={referenceBooks} />
        <BookSection
          title="Sách Tiểu Sử - Hồi Kí"
          data={biographyAndMemoirBooks}
        />
        <BookSection title="Sách Nuôi Dạy Con" data={parentingBooks} />
        <BookSection title="Sách Học Ngoại Ngữ" data={learningLanguageBooks} />
      </ScrollView>

      <CartDrawer
        visible={cartVisible}
        onClose={() => setCartVisible(false)}
        cartItems={cartItems}
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
