import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Appbar,
  Surface,
  useTheme,
  Avatar,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config";

const EditProfileScreen = ({ navigation }) => {
  const theme = useTheme();
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    createdAt: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      const userInfo = JSON.parse(userInfoString);
      console.log("User info:", userInfo);
      setUser(userInfo);
    } catch (error) {
      console.error("Error fetch user:", error);
    }
  };

//   const handleSave = async () => {
//     if (!user.name || !user.email || !user.phone) {
//       Alert.alert("Error", "Please fill in all required fields");
//       return;
//     }

//     if (!isValidEmail(user.email)) {
//       Alert.alert("Error", "Please enter a valid email address");
//       return;
//     }

//     setLoading(true);
//     try {
//       await AsyncStorage.setItem("userInfo", JSON.stringify(user));
//       const API_URL = API_BASE_URL + `/users/${user.id}`;
//       Alert.alert("Success", "Profile updated successfully");
//       navigation.goBack();
//     } catch (error) {
//       console.error("Error saving profile:", error);
//       Alert.alert("Error", "Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Chỉnh sửa thông tin" />
      </Appbar.Header>

      <ScrollView>
        <Surface style={styles.imageContainer} elevation={0}>
          <View>
            <Avatar.Image
              size={120}
              source={require("../assets/DefaultAvatar.jpg")}
            />
          </View>
        </Surface>

        <Surface style={styles.formContainer} elevation={0}>
          <Text variant="labelLarge" style={styles.label}>
            Họ và tên
          </Text>
          <TextInput
            mode="outlined"
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text.trim() })}
            placeholder="Nhập họ và tên"
            editable={false}
            style={styles.input}
            activeOutlineColor="#007AFF"
          />

          <Text variant="labelLarge" style={styles.label}>
            Email
          </Text>
          <TextInput
            mode="outlined"
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text.trim() })}
            placeholder="Nhập email"
            keyboardType="email-address"
            editable={false}
            autoCapitalize="none"
            style={styles.input}
            activeOutlineColor="#007AFF"
          />

          <Text variant="labelLarge" style={styles.label}>
            Số điện thoại
          </Text>
          <TextInput
            mode="outlined"
            value={user.phone}
            onChangeText={(text) => setUser({ ...user, phone: text.trim() })}
            placeholder="Nhập số điện thoại"
            editable={false}
            keyboardType="phone-pad"
            style={styles.input}
            activeOutlineColor="#007AFF"
          />

          <Text variant="labelLarge" style={styles.label}>
            Ngày tạo tài khoản
          </Text>
          <TextInput
            mode="outlined"
            value={user.createdAt}
            placeholder="Ngày tạo tài khoản"
            editable={false}
            style={styles.input}
            activeOutlineColor="#007AFF"
          />

          {/* <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.saveButton}
            buttonColor="#007AFF"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button> */}
        </Surface>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appbar: {
    elevation: 0,
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  formContainer: {
    padding: 20,
  },
  label: {
    marginBottom: 8,
    color: "#333",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  addressInput: {
    height: 100,
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 6,
  },
});

export default EditProfileScreen;
