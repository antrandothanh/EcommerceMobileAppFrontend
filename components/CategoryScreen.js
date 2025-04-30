import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { Appbar, Button, Menu, Text, Card } from "react-native-paper";
import CartDrawer from "./CartDrawer";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function CategoryScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState({
    id: 0,
    name: "Tất cả",
  });
  const [books, setBooks] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState(books);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  useEffect(() => {
    fetchGenres();
    fetchBooks();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/genres`);
      const fetchedGenres = response.data.result;
      let genresData = [
        {
          id: 0,
          name: "Tất cả",
        },
      ];
      genresData.push(...fetchedGenres);
      setGenres(genresData);
      setSelectedGenre(genresData[0]);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const fetchBooks = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/books`);
        setBooks(response.data.result);
      } catch (error) {
        console.error("Cannot fetch books:", error);
      }
  }

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
    <TouchableOpacity style={styles.bookItem}>
      <Card style={styles.bookCard}>
        <Card.Cover source={{ uri: item.image }} style={styles.bookImage} />
        <Card.Content>
          <Text numberOfLines={2} style={styles.bookTitle}>
            {item.name}
          </Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
          <Text style={styles.bookPrice}>{item.price}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Danh Mục" />
        <Appbar.Action icon="cart" onPress={() => setCartVisible(true)} />
      </Appbar.Header>

      <View style={styles.categoryTypeContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Button
              mode="outlined"
              onPress={openMenu}
              style={styles.dropdownButton}
            >
              {selectedGenre.name}
            </Button>
          }
        >
          {genres.map((genre) => (
            <Menu.Item
              key={genre.id}
              onPress={() => {
                setSelectedGenre(genre);
                closeMenu();
              }}
              title={genre.name}
            />
          ))}
        </Menu>
      </View>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
  categoryTypeContainer: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  dropdownButton: {
    width: 200,
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
