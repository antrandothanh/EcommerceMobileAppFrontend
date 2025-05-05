import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button, Surface, IconButton, RadioButton, Divider } from 'react-native-paper';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CheckoutScreen({ navigation, route }) {
  const { cartItems, totalPrice } = route.params;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setUserInfo(userInfo);
        setName(userInfo.name || '');
        setPhone(userInfo.phone || '');
        setAddress(userInfo.address || '');
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const formatVNCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    })
      .format(number)
      .replace('₫', 'đ');
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ giao hàng');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Lỗi', 'Bạn cần đăng nhập để đặt hàng');
        setLoading(false);
        return;
      }

      // Send order to API
      const CREATE_ORDER_API_URL = `${API_BASE_URL}/orders/cod`;
      const response = await axios.post(CREATE_ORDER_API_URL, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        // Clear cart after successful order
        cartItems.forEach((item) => {
          const DELETE_ITEM_API_URL = `${API_BASE_URL}/cart-items/${item.id}`;
          axios.delete(DELETE_ITEM_API_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        });

        Alert.alert(
          'Thành công',
          'Đặt hàng thành công!',
          [{ text: 'OK', onPress: () => navigation.navigate('MainApp', { screen: 'Home' }) }]
        );
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Lỗi', 'Không thể đặt hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text variant="headlineSmall" style={styles.title}>
            Thanh toán
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </Surface>

      <ScrollView style={styles.scrollView}>
        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Thông tin giao hàng
          </Text>
          <TextInput
            label="Họ tên"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            mode="outlined"
          />
          <TextInput
            label="Địa chỉ giao hàng"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            multiline
            numberOfLines={3}
            mode="outlined"
          />
        </Surface>

        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Phương thức thanh toán
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setPaymentMethod(value)}
            value={paymentMethod}
          >
            <View style={styles.radioItem}>
              <RadioButton value="cod" />
              <Text>Thanh toán khi nhận hàng (COD)</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="banking" />
              <Text>Chuyển khoản ngân hàng</Text>
            </View>
          </RadioButton.Group>
        </Surface>

        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Thông tin đơn hàng
          </Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemDetails}>
                <Text numberOfLines={1} style={styles.orderItemTitle}>
                  {item.book.name}
                </Text>
                <Text style={styles.orderItemQuantity}>
                  SL: {item.quantity} x {formatVNCurrency(item.book.price)}
                </Text>
              </View>
              <Text style={styles.orderItemPrice}>
                {formatVNCurrency(item.book.price * item.quantity)}
              </Text>
            </View>
          ))}
          <Divider style={styles.divider} />
          <View style={styles.totalRow}>
            <Text variant="titleMedium">Tổng cộng:</Text>
            <Text variant="titleMedium" style={styles.totalAmount}>
              {formatVNCurrency(totalPrice)}
            </Text>
          </View>
        </Surface>
      </ScrollView>

      <Surface style={styles.footer}>
        <Button
          mode="contained"
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={loading}
        >
          Đặt hàng
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderItemDetails: {
    flex: 1,
    marginRight: 8,
  },
  orderItemTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderItemQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    color: '#e41e31',
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  placeOrderButton: {
    backgroundColor: '#007AFF',
  },
});