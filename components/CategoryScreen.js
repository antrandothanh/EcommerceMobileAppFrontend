import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import { Appbar, Button, Menu, Text, Card } from "react-native-paper";
import CartDrawer from "./CartDrawer";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CategoryScreen({ navigation }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState({
    id: 0,
    name: "Tất cả",
  });
  const [books, setBooks] = useState(null);
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isGenresDropdownFocus, setIsGenresDropdownFocus] = useState(false);

  useEffect(() => {
    fetchGenres();
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [selectedGenre]);

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
      if (selectedGenre.id !== 0) {
        const filteredBooks = response.data.result.filter(
          (book) => book.genres[0].id === selectedGenre.id
        );
        setBooks(filteredBooks);
      }
    } catch (error) {
      console.error("Cannot fetch books:", error);
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
        <Appbar.Content title="Danh Mục" />
      </Appbar.Header>

      <View style={styles.categoryTypeContainer}>
        <Dropdown
          style={[
            styles.dropdown,
            isGenresDropdownFocus && { borderColor: "blue" },
          ]}
          placeholderStyle={{ fontSize: 16 }}
          selectedTextStyle={{ fontSize: 16 }}
          inputSearchStyle={{ fontSize: 16 }}
          data={genres}
          search
          maxHeight={300}
          labelField="name"
          valueField="id"
          placeholder={!isGenresDropdownFocus ? "Chọn thể loại" : "..."}
          searchPlaceholder="Tìm kiếm..."
          onFocus={() => setIsGenresDropdownFocus(true)}
          onBlur={() => setIsGenresDropdownFocus(false)}
          onChange={(item) => {
            const genre = {
              id: item.id,
              name: item.name,
            };
            setSelectedGenre(genre);
            // console.log(genre);
            setIsGenresDropdownFocus(false);
          }}
        />
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
  dropdown: {
    height: 50,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
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
