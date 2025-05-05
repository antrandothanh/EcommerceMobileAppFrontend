import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";
import {
  Text,
  Button,
  Appbar,
  Dialog,
  Avatar,
  Card,
  Divider,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import CartDrawer from "./CartDrawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommentCard from "./CommentCard";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function BookDetailScreen({ navigation, route }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [book, setBook] = useState(route.params.book);
  const [bookReviews, setBookReviews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");

  useEffect(() => {
    checkIsLoggedIn();
  }, [isLoggedIn]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const cartSection = async () => {
    setCartVisible(true);
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      const GET_CART_API_URL = API_BASE_URL + "/cart";
      const cartResponse = await axios.get(GET_CART_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(cartResponse.data.result.cartItems);
    } else {
      setCartItems([]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReviews();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const fetchReviews = async () => {
    try {
      // Get all reviews from all books
      const API_GET_REVIEWS_URL = API_BASE_URL + "/ratings";
      const bookReviewsResponse = await axios.get(API_GET_REVIEWS_URL);
      // Filter reviews for book with book id.
      const bookId = route.params.book.id;
      const bookReviews = bookReviewsResponse.data.result.filter(
        (review) => review.bookId === bookId
      );
      // Get all users.
      const API_GET_USERS_URL = API_BASE_URL + "/users";
      const usersResponse = await axios.get(API_GET_USERS_URL);
      const bookReviewsData = bookReviews.map((review) => {
        const user = usersResponse.data.result.find(
          (user) => user.id === review.customerId
        );
        return {
          bookId: review.bookId,
          userName: user.name,
          score: review.score,
          comment: review.comment,
          createdAtFormatted: formatVNDate(review.createdAt),
        };
      });
      setBookReviews(bookReviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
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

  const formatVNDate = (date) => {
    // Because the type of date is string, we need to convert it to Date object
    const formattedDate = new Date(date).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    return formattedDate;
  };

  const checkIsLoggedIn = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      setIsLoggedIn(true);
      const userInfoString = await AsyncStorage.getItem("userInfo");
    } else {
      setIsLoggedIn(false);
    }
  };

  // Toggle description expansion
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Open quantity selection dialog
  const openQuantitySelection = () => {
    setSelectedQuantity(1);
    setDialogVisible(true);
  };

  const addToCart = async () => {
    const user = await AsyncStorage.getItem("userInfo");
    const token = await AsyncStorage.getItem("userToken");
    if (user) {
      setDialogVisible(false);
      const GET_CART_API_URL = API_BASE_URL + "/cart";
      const cartResponse = await axios.get(GET_CART_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const cart = cartResponse.data.result;
      const existingItem =
        cart.cartItems.find((item) => item.book.id === book.id) || null;
      if (existingItem) {
        const UPDATE_ITEM_API_URL =
          API_BASE_URL + "/cart-items/" + existingItem.id;
        const updateItemResponse = await axios.put(
          UPDATE_ITEM_API_URL,
          {
            quantity: existingItem.quantity + selectedQuantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const GET_CART_API_URL = API_BASE_URL + "/cart";
        const getCartResponse = await axios.get(GET_CART_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(getCartResponse.data.result.cartItems);
        alert("Đã thêm vào giỏ hàng");
      } else {
        const itemData = {
          book: book,
          quantity: selectedQuantity,
        };
        const CREATE_ITEM_API_URL = API_BASE_URL + "/cart-items";
        const createItemResponse = await axios.post(
          CREATE_ITEM_API_URL,
          itemData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const cartItem = createItemResponse.data.result;
        const GET_CART_API_URL = API_BASE_URL + "/cart";
        const getCartResponse = await axios.get(GET_CART_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const cart = getCartResponse.data.result;
        const listItems = [...cart.cartItems, cartItem];
        const UPDATE_CART_API_URL = API_BASE_URL + "/cart/" + cart.id;
        const updateCartResponse = await axios.put(
          UPDATE_CART_API_URL,
          {
            cartItems: listItems,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updatedCart = updateCartResponse.data.result;
        setCartItems(updatedCart.cartItems);
        alert("Đã thêm vào giỏ hàng");
      }
    } else {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
    }
  };

  const updateCartItemQuantity = (itemId, newQuantity) => {};

  const removeFromCart = (itemId) => {};

  const handleSendComment = async () => {
    if (userComment.trim() !== "" && userRating > 0) {
      try {
        const userInfoString = await AsyncStorage.getItem("userInfo");
        const userInfo = JSON.parse(userInfoString);
        const userId = userInfo.id;
        const bookId = route.params.book.id;
        const newReviewData = {
          customerId: userId,
          bookId: bookId,
          score: userRating,
          comment: userComment,
        };
        const API_URL = API_BASE_URL + "/ratings";
        const response = await axios.post(API_URL, newReviewData);
        alert("Bình luận của bạn đã được gửi thành công");
        setUserComment("");
        setUserRating(0);
        await onRefresh();
      } catch (error) {
        console.error("Error sending review:", error);
        alert("Đã có lỗi xảy ra khi viết bình luận. Vui lòng thử lại sau.");
      }
    } else {
      alert("Vui lòng nhập bình luận và chọn số sao trước khi gửi");
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={book.name} />
      </Appbar.Header>
      <ScrollView
        style={styles.scrollViewContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#000000"]} // Customize indicator color for Android
            tintColor="#000000" // Customize indicator color for iOS
          />
        }
      >
        <View style={styles.bookImageContainer}>
          <Image
            source={{
              uri: book.image,
            }}
            style={styles.bookImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.bookInfoContainer}>
          <Text style={styles.bookTitleText}>{book.name}</Text>

          <Text style={styles.priceText}>{formatVNCurrency(book.price)}</Text>

          <Button
            mode="contained"
            buttonColor="#28a745"
            onPress={openQuantitySelection}
            icon={({ size, color }) => (
              <Ionicons name="cart" size={size} color={color} />
            )}
          >
            Thêm vào giỏ hàng
          </Button>

          <View style={styles.infoTable}>
            <View style={styles.tableRow}>
              <Text style={styles.tableTitle}>Tác giả</Text>
              <Text style={styles.tableContent}>{book.author}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableTitle}>Nhà xuất bản</Text>
              <Text style={styles.tableContent}>{book.publisher}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableTitle}>Ngày xuất bản</Text>
              <Text style={styles.tableContent}>
                {formatVNDate(book.publicationDate)}
              </Text>
            </View>
          </View>
          <View style={styles.bookDescription}>
            <Text style={styles.descriptionTitle}>Mô tả sách</Text>
            <Text
              style={styles.descriptionText}
              numberOfLines={showFullDescription ? null : 3}
            >
              {book.description}
            </Text>
            <TouchableOpacity onPress={toggleDescription}>
              <Text style={styles.showMoreButton}>
                {showFullDescription ? "Thu gọn" : "Xem thêm"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Đánh giá & Nhận xét</Text>

            {/* Overall Rating */}
            <View style={styles.overallRating}>
              <Text style={styles.ratingNumber}>4.5</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={
                      star <= 4
                        ? "star"
                        : star === 5
                        ? "star-half"
                        : "star-outline"
                    }
                    size={24}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text style={styles.ratingCount}>
                {bookReviews.length} đánh giá
              </Text>
            </View>

            {/* Add Review */}
            {isLoggedIn ? (
              <Card style={styles.addReviewCard}>
                <Card.Content>
                  <Text style={styles.addReviewTitle}>
                    Thêm đánh giá của bạn
                  </Text>

                  {/* Rating Input */}
                  <View style={styles.ratingInput}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() => setUserRating(star)}
                      >
                        <Ionicons
                          name={star <= userRating ? "star" : "star-outline"}
                          size={32}
                          color="#FFD700"
                          style={styles.starInput}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Comment Input */}
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Viết nhận xét của bạn..."
                    multiline
                    numberOfLines={4}
                    value={userComment}
                    onChangeText={setUserComment}
                  />

                  <Button
                    mode="contained"
                    style={styles.submitButton}
                    onPress={handleSendComment}
                  >
                    Gửi bình luận
                  </Button>
                </Card.Content>
              </Card>
            ) : (
              <Card style={styles.addReviewCard}>
                <Card.Content style={styles.blurredContent}>
                  <View style={styles.loginAnnouncement}>
                    <Text style={styles.loginMessage}>
                      Vui lòng đăng nhập để đánh giá sách
                    </Text>
                    <Button
                      mode="contained"
                      style={styles.loginButton}
                      icon={({ size, color }) => (
                        <Ionicons
                          name="log-in-outline"
                          size={size}
                          color={color}
                        />
                      )}
                      onPress={() => navigation.navigate("SignIn")}
                    >
                      Đăng nhập
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            )}

            {/* Reviews List */}
            <View style={styles.reviewsList}>
              {bookReviews && bookReviews.length > 0 ? (
                bookReviews.map((review, index) => (
                  <CommentCard
                    key={index}
                    userName={review.userName}
                    createdAt={review.createdAtFormatted}
                    score={review.score}
                    comment={review.comment}
                  />
                ))
              ) : (
                <Text style={styles.noReviewsAnnouncement}>
                  Chưa có đánh giá nào.
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Select book quantity dialog */}
      <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
        <Dialog.Title>Chọn số lượng</Dialog.Title>
        <Dialog.Content>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                setSelectedQuantity(Math.max(1, (selectedQuantity || 1) - 1))
              }
            >
              <Text style={[styles.quantityButtonText, styles.minusButton]}>
                -
              </Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{selectedQuantity || 1}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setSelectedQuantity((selectedQuantity || 1) + 1)}
            >
              <Text style={[styles.quantityButtonText, styles.plusButton]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogVisible(false)}>Hủy</Button>
          <Button onPress={addToCart} mode="contained">
            Xác nhận
          </Button>
        </Dialog.Actions>
      </Dialog>

      {/* Cart drawer */}
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
  scrollViewContainer: {
    flex: 1,
  },
  appbar: {
    elevation: 0,
    backgroundColor: "#ffffff",
  },
  bookImageContainer: {
    height: 500,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: 10,
    paddingBottom: 10,
  },
  bookImage: {
    width: "100%",
    height: "100%",
  },
  bookInfoContainer: {
    padding: 16,
  },
  bookTitleText: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 8,
    lineHeight: 35,
  },
  priceText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#e91e63",
    marginBottom: 10,
  },
  infoTable: {
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableTitle: {
    flex: 1.5,
    fontWeight: "bold",
    color: "#555",
    lineHeight: 25,
  },
  tableContent: {
    flex: 2,
    lineHeight: 25,
  },
  bookDescription: {
    paddingVertical: 10,
  },
  descriptionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  descriptionText: {
    lineHeight: 25,
    color: "#555",
  },
  showMoreButton: {
    marginTop: 8,
    color: "#0347fe",
    fontWeight: "bold",
    textAlign: "center",
  },
  quantitySelector: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: "100%",
    borderRadius: 8,
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    height: "100%",
    width: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
  },
  quantityButtonText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  quantityText: {
    width: 80,
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  minusButton: {
    color: "#e91e63",
  },
  plusButton: {
    color: "#28a745",
  },

  // Review section styles
  reviewsSection: {
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  overallRating: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  ratingNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
  },
  starsContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  ratingCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  addReviewCard: {
    marginBottom: 20,
    elevation: 3,
  },
  addReviewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  ratingInput: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  starInput: {
    marginHorizontal: 5,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 5,
    backgroundColor: "#3da8b9",
  },
  reviewsList: {
    marginTop: 10,
  },
  noReviewsAnnouncement: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loginAnnouncement: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loginMessage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#3da8b9",
    borderRadius: 50,
  },
});
