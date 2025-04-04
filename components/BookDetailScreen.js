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

export default function BookDetailScreen({ navigation, route }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [book, setBook] = useState(route.params.book);
  const [refreshing, setRefreshing] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "Nguyễn Văn A",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      comment:
        "Sách rất hay, nội dung ý nghĩa và dễ hiểu. Tôi đã học được nhiều điều từ cuốn sách này.",
      date: "15/05/2023",
    },
    {
      id: 2,
      user: "Trần Thị B",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      comment:
        "Cuốn sách giúp tôi hiểu thêm về văn hóa Nhật Bản và cách sống tích cực.",
      date: "20/04/2023",
    },
  ]);

  useEffect(() => {
    checkIsLoggedIn();
  }, [isLoggedIn]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
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
    setSelectedSize(1);
    setDialogVisible(true);
  };

  const addToCart = (book) => {};

  const updateCartItemQuantity = (itemId, newQuantity) => {};

  const removeFromCart = (itemId) => {};

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Tên sách" />
        <Appbar.Action icon="cart" onPress={() => setCartVisible(true)} />
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
              uri: "https://res.cloudinary.com/dfolztuvq/image/upload/31c423b4-87c1-4341-b64f-d3a1785fa60d_feacbd60-25ef-42f8-8615-5509c802ce51.jpeg?_a=DAGAACAVZAA0",
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
              <Text style={styles.ratingCount}>{reviews.length} đánh giá</Text>
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
                    onPress={() => {
                      if (userRating > 0 && userComment.trim() !== "") {
                        const newReview = {
                          id: reviews.length + 1,
                          user: "Bạn",
                          avatar:
                            "https://randomuser.me/api/portraits/lego/1.jpg",
                          rating: userRating,
                          comment: userComment,
                          date: new Date().toLocaleDateString("vi-VN"),
                        };
                        setReviews([newReview, ...reviews]);
                        setUserRating(0);
                        setUserComment("");
                      } else {
                        alert("Vui lòng chọn số sao và viết nhận xét");
                      }
                    }}
                  >
                    Gửi đánh giá
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
              {reviews.map((review) => (
                <Card key={review.id} style={styles.reviewCard}>
                  <Card.Content>
                    <View style={styles.reviewHeader}>
                      <Avatar.Image size={40} source={{ uri: review.avatar }} />
                      <View style={styles.reviewUser}>
                        <Text style={styles.userName}>{review.user}</Text>
                        <Text style={styles.reviewDate}>{review.date}</Text>
                      </View>
                    </View>

                    <View style={styles.reviewRating}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= review.rating ? "star" : "star-outline"}
                          size={16}
                          color="#FFD700"
                        />
                      ))}
                    </View>

                    <Text style={styles.reviewComment}>{review.comment}</Text>
                  </Card.Content>
                </Card>
              ))}
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
                setSelectedSize(Math.max(1, (selectedSize || 1) - 1))
              }
            >
              <Text style={[styles.quantityButtonText, styles.minusButton]}>
                -
              </Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{selectedSize || 1}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setSelectedSize((selectedSize || 1) + 1)}
            >
              <Text style={[styles.quantityButtonText, styles.plusButton]}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setDialogVisible(false)}>Hủy</Button>
          <Button
            onPress={() => {
              alert(`Đã thêm ${selectedSize} quyển sách vào giỏ hàng`);
              setDialogVisible(false);
            }}
            mode="contained"
          >
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
    width: "100%", // Đặt chiều rộng bằng 100% của màn hìn
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
  reviewCard: {
    marginBottom: 10,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewUser: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  reviewDate: {
    fontSize: 12,
    color: "#666",
  },
  reviewRating: {
    flexDirection: "row",
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
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
