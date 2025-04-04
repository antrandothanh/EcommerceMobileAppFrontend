import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import {
  Appbar,
  Searchbar,
  List,
  Text,
  FAB,
  Divider,
  Snackbar,
  Dialog,
  TextInput,
  Button,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_URL } from "../../config";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dropdown } from "react-native-element-dropdown";

export default function AdminBooksManagementScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [newBookName, setNewBookName] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookPublisher, setNewBookPublisher] = useState("");
  const [newBookPublicationDate, setNewBookPublicationDate] = useState(null);
  const [newBookPublicationDateString, setNewBookPublicationDateString] =
    useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [newBookPrice, setNewBookPrice] = useState("");
  const [newBookGenre, setNewBookGenre] = useState(null);
  const [newBookImage, setNewBookImage] = useState("");
  const [newBookImageURI, setNewBookImageURI] = useState(null);
  const [newBookDescription, setNewBookDescription] = useState("");
  const [editingBook, setEditingBook] = useState(null);
  const [isBookImageVisible, setIsBookImageVisible] = useState(false);
  const [genres, setGenres] = useState([]);
  const [isGenresDropdownFocus, setIsGenresDropdownFocus] = useState(false);

  // Fetch data when access to this screen for the first time
  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  // Reload books list when search query is changed or books list is changed
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) =>
          book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (book.author &&
            book.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (book.publisher &&
            book.publisher.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  // Fetch genres from database
  const fetchGenres = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setSnackbarMessage("Không tìm thấy token đăng nhập");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/genres`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGenres(response.data.result);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  // Handle image picker
  const handleImagePickerPress = async () => {
    try {
      if (isBookImageVisible) {
        setNewBookImageURI("");
        setIsBookImageVisible(false);
      } else {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 5],
          quality: 1,
        });
        if (!result.canceled) {
          setNewBookImageURI(result.assets[0].uri);
          setIsBookImageVisible(true);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setSnackbarMessage("Không thể chọn ảnh");
      setSnackbarVisible(true);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        setSnackbarMessage("Không tìm thấy token đăng nhập");
        setSnackbarVisible(true);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTimeout(() => {
        setSnackbarMessage("Đã tải danh sách sách");
        setSnackbarVisible(true);
        setBooks(response.data.result);
        setFilteredBooks(response.data.result);
        setLoading(false);
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching books:", error);
      setSnackbarMessage("Không thể tải danh sách sách");
      setSnackbarVisible(true);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBooks();
  };

  // Upload image to cloundinary server and return the image URL
  const uploadImageURL = async () => {
    try {
      // Check if the use logged in before
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setSnackbarMessage("Không tìm thấy token đăng nhập");
        setSnackbarVisible(true);
        return;
      }
      // Create form data for uploading image
      const formData = new FormData();
      const filename = newBookImageURI.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";
      formData.append("files", {
        uri: newBookImageURI,
        name: filename,
        type,
      });
      // Send form data to cloundinary server
      const response = await axios.post(
        `${API_BASE_URL}/uploadImages`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Set image URL from the cloundinary server to the state
      console.log("Response URL", response.data.result);
      return response.data.result[0];
    } catch (error) {
      console.error("Error uploading image:", error);
      setSnackbarMessage("Không thể tải ảnh lên");
      setSnackbarVisible(true);
    }
  };

  // Handle add new book feature
  const handleAddBook = async () => {
    // Check if all required fields are filled
    if (!newBookName.trim()) {
      setSnackbarMessage("Tên sách không được để trống");
      setSnackbarVisible(true);
      return;
    }
    if (!newBookAuthor.trim()) {
      setSnackbarMessage("Tác giả không được để trống");
      setSnackbarVisible(true);
      return;
    }
    if (!newBookPrice.trim()) {
      setSnackbarMessage("Giá sách không được để trống");
      setSnackbarVisible(true);
      return;
    }
    if (!newBookGenre) {
      setSnackbarMessage("Vui lòng chọn thể loại sách");
      setSnackbarVisible(true);
      return;
    }
    if (!newBookImageURI) {
      setSnackbarMessage("Vui lòng thêm ảnh bìa sách");
      setSnackbarVisible(true);
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setSnackbarMessage("Không tìm thấy token đăng nhập");
        setSnackbarVisible(true);
        return;
      }
      // Upload image to cloundinary server and get the image URL
      const imageURL = await uploadImageURL();
      // Create book data JSON object
      const bookData = {
        name: newBookName,
        author: newBookAuthor,
        publisher: newBookPublisher,
        publicationDate: newBookPublicationDate,
        description: newBookDescription,
        price: newBookPrice,
        genres: [newBookGenre],
        image: imageURL,
        ratings: [],
        isInStock: true,
      };
      const response = await axios.post(`${API_BASE_URL}/books`, bookData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setTimeout(() => {
        setDialogVisible(false);
        resetBookFormFields();
        setSnackbarMessage("Thêm sách thành công");
        setSnackbarVisible(true);
        setLoading(false);
      }, 1000);
      fetchBooks();
    } catch (error) {
      console.error("Error adding book:", error);
      setSnackbarMessage("Không thể thêm sách");
      setSnackbarVisible(true);
      setLoading(false);
    }
  };

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const handleSetDateTimePicker = (event, selectedDate) => {
    setNewBookPublicationDate(selectedDate);
    const formattedDate = selectedDate.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    setNewBookPublicationDateString(formattedDate);
    setShowPicker(false);
  };

  const resetBookFormFields = () => {
    setNewBookName("");
    setNewBookAuthor("");
    setNewBookPublisher("");
    setNewBookPublicationDateString("");
    setNewBookPublicationDate(null);
    setNewBookPrice("");
    setNewBookGenre([]);
    setNewBookImageURI(null);
    setNewBookDescription("");
  };

  const handleEditBook = async () => {
    if (!newBookName.trim()) {
      setSnackbarMessage("Tên sách không được để trống");
      setSnackbarVisible(true);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        setSnackbarMessage("Không tìm thấy token đăng nhập");
        setSnackbarVisible(true);
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/books/${editingBook.id}`,
        { name: newBookName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditDialogVisible(false);
      setNewBookName("");
      setEditingBook(null);
      setSnackbarMessage("Cập nhật sách thành công");
      setSnackbarVisible(true);
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
      setSnackbarMessage("Không thể cập nhật sách");
      setSnackbarVisible(true);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        setSnackbarMessage("Không tìm thấy token đăng nhập");
        setSnackbarVisible(true);
        return;
      }

      const response = await axios.delete(`${API_BASE_URL}/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSnackbarMessage("Xóa sách thành công");
      setSnackbarVisible(true);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      setSnackbarMessage("Không thể xóa sách");
      setSnackbarVisible(true);
    }
  };

  const openEditDialog = (book) => {
    setEditingBook(book);
    setNewBookName(book.name);
    setEditDialogVisible(true);
  };

  const renderBookItem = ({ item }) => (
    <List.Item
      title={item.name}
      right={(props) => (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => openEditDialog(item)}
            style={styles.actionButton}
          >
            <Ionicons name="pencil-outline" size={20} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteBook(item.id)}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      )}
      style={styles.listItem}
    />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Quản lý sách" />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Tìm kiếm tên sách, tác giả, nhà xuất bản"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchBarInput}
          mode="view"
        />
        <TouchableOpacity style={styles.filterTypeButton}>
          <Ionicons name="filter-outline" size={30} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery.trim() !== ""
                  ? "Không tìm thấy sách phù hợp"
                  : "Chưa có sách nào"}
              </Text>
            </View>
          }
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setDialogVisible(true)}
      />

      {/* Add new book dialog */}
      <Dialog
        style={styles.dialogStyle}
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
      >
        <Dialog.Title>Thêm sách mới</Dialog.Title>
        <Dialog.Content>
          <ScrollView style={styles.scrollView}>
            <TextInput
              label="Tên sách"
              value={newBookName}
              onChangeText={(text) => {
                setNewBookName(text);
              }}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Tác giả"
              value={newBookAuthor}
              onChangeText={setNewBookAuthor}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TextInput
              label="Nhà xuất bản"
              value={newBookPublisher}
              onChangeText={setNewBookPublisher}
              mode="outlined"
              style={styles.dialogInput}
            />
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <TextInput
                label="Ngày xuất bản"
                value={newBookPublicationDateString}
                mode="outlined"
                style={styles.dialogInput}
                placeholder="DD/MM/YYYY"
                editable={false}
                right={<TextInput.Icon icon="calendar" />}
              />
              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="default"
                  value={new Date()}
                  onChange={handleSetDateTimePicker}
                />
              )}
            </TouchableOpacity>
            <TextInput
              label="Giá"
              value={newBookPrice}
              onChangeText={setNewBookPrice}
              mode="outlined"
              style={styles.dialogInput}
            />
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
                setNewBookGenre(genre);
                setIsGenresDropdownFocus(false);
              }}
            />
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={handleImagePickerPress}
            >
              {newBookImageURI ? (
                <>
                  <Image
                    source={{ uri: newBookImageURI }}
                    style={styles.previewImage}
                  />
                  <Text>Chạm để xóa ảnh</Text>
                </>
              ) : (
                <Text>Thêm ảnh bìa sách</Text>
              )}
            </TouchableOpacity>
            <TextInput
              label="Mô tả sách"
              value={newBookDescription}
              onChangeText={setNewBookDescription}
              mode="outlined"
              style={styles.dialogInput}
              multiline={true}
              numberOfLines={10}
            />
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              resetBookFormFields();
              setDialogVisible(false);
            }}
          >
            Hủy
          </Button>
          <Button onPress={handleAddBook} disabled={loading}>
            {loading ? (
              <>
                <ActivityIndicator
                  animating={true}
                  color="#007AFF"
                  size="small"
                />
              </>
            ) : (
              "Thêm"
            )}
          </Button>
        </Dialog.Actions>
      </Dialog>

      {/* Edit Book Dialog */}
      <Dialog
        visible={editDialogVisible}
        onDismiss={() => setEditDialogVisible(false)}
      >
        <Dialog.Title>Chỉnh sửa sách</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Tên sách"
            value={newBookName}
            onChangeText={setNewBookName}
            mode="outlined"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setEditDialogVisible(false)}>Hủy</Button>
          <Button onPress={handleEditBook}>Lưu</Button>
        </Dialog.Actions>
      </Dialog>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "Đóng",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  searchBar: {
    flex: 0.8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    backgroundColor: "#f5f5f5",
  },
  searchBarInput: {
    fontSize: 14,
    height: 10,
  },
  dialogStyle: {
    borderRadius: 40,
    maxHeight: 1000,
    height: "80%",
  },
  scrollView: {
    height: "80%",
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
  filterTypeButton: {
    alignItems: "center",
    flex: 0.2,
  },
  listContent: {
    paddingBottom: 100, // avoid FAB overlap to flatlist
    marginHorizontal: 10,
  },
  listItem: {
    backgroundColor: "#ffffff",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginHorizontal: 8,
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
  },
  imagePickerButton: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: 180,
    height: 250,
  },
  previewImage: {
    width: 160,
    height: 200,
    marginBottom: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#2196F3",
  },
  dialogInput: {
    marginBottom: 10,
  },
});
