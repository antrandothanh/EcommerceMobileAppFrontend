import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Appbar,
  Searchbar,
  Button,
  Menu,
  Text,
  Card,
} from "react-native-paper";
import CartDrawer from "./CartDrawer";
import axios from "axios";
import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefreshing] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const onChangeSearch = (query) => setSearchQuery(query);

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchedBooks(books);
    } else {
      const filtered = books.filter(
        (book) =>
          book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (book.author &&
            book.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (book.publisher &&
            book.publisher.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchedBooks(filtered);
    }
  }, [searchQuery, books]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/books`);
      // console.log(response.data);
      setTimeout(() => {
        setBooks(response.data.result);
        setSearchedBooks(response.data.result);
        setLoading(false);
        setRefreshing(false);
        setSnackBarVisible(false);
        setSnackBarMessage("");
      }, 1000);
    } catch (error) {
      setSnackBarMessage("Không thể tải sách");
      setSnackBarVisible(true);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addToCart = (book) => {
    // add to cart
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {
    // update cart items
  };

  const removeFromCart = (itemId) => {
    // remove cart items
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Card
        style={styles.bookCard}
        onPress={() => navigation.navigate("BookDetail", { book: item })}
      >
        <Card.Cover source={{ uri: item.image }} style={styles.bookImage} />
        <Card.Content>
          <Text numberOfLines={2} style={styles.bookTitle}>
            {item.name}
          </Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
          <Text style={styles.bookPrice}>{item.price}</Text>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Tìm kiếm" />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Tìm kiếm..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <FlatList
        data={searchedBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        numColumns={width > 500 ? 4 : 2}
        contentContainerStyle={styles.bookList}
      />

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
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
    borderRadius: 0,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  dropdownButton: {
    width: 135,
  },
  bookList: {
    padding: 8,
  },
  bookItem: {
    flex: 1,
    padding: 8,
  },
  bookCard: {
    elevation: 4,
    height: 320,
    width: 160,
  },
  bookImage: {
    height: 200,
    backgroundColor: "#f9f9f9",
  },
  cardContent: {
    padding: 8,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    height: 40,
  },
  bookAuthor: {
    fontSize: 12,
    color: "#666666",
    marginTop: 4,
  },
  bookPrice: {
    fontSize: 16,
    color: "#e41e31",
    fontWeight: "bold",
    marginTop: 8,
  },
});
