import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Button, IconButton, Surface } from 'react-native-paper';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen({ navigation }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found');
        setLoading(false);
        setCartItems([]);
        setTotalPrice(0);
        return;
      }
      const GET_CART_API_URL = `${API_BASE_URL}/cart`;
      const response = await axios.get(GET_CART_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.result) {
        setCartItems(response.data.result.cartItems || []);
        calculateTotal(response.data.result.cartItems || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.book.price * item.quantity;
    });
    setTotalPrice(total);
  };

  const formatVNCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    })
      .format(number)
      .replace('₫', 'đ');
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      if (newQuantity >= 1) {
        const UPDATE_ITEM_API_URL = `${API_BASE_URL}/cart-items/${itemId}`;
        await axios.put(
          UPDATE_ITEM_API_URL,
          { quantity: newQuantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        // Update local state
        const updatedItems = cartItems.map((item) => {
          if (item.id === itemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const DELETE_ITEM_API_URL = `${API_BASE_URL}/cart-items/${itemId}`;
      await axios.delete(DELETE_ITEM_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state
      const updatedItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }
    
    navigation.navigate('Checkout', {
      cartItems: cartItems,
      totalPrice: totalPrice
    });
  };

  const renderCartItem = ({ item }) => (
    <Card style={styles.cartItem}>
      <Card.Content style={styles.cartItemContent}>
        <Card.Cover
          source={{ uri: item.book.image }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text numberOfLines={2} style={styles.itemTitle}>
            {item.book.name}
          </Text>
          <Text style={styles.itemPrice}>
            {formatVNCurrency(item.book.price * item.quantity)}
          </Text>
          <View style={styles.quantityContainer}>
            <IconButton
              icon="minus"
              size={20}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            />
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <IconButton
              icon="plus"
              size={20}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
            />
          </View>
        </View>
        <IconButton
          icon="delete"
          size={20}
          onPress={() => removeItem(item.id)}
          style={styles.deleteButton}
        />
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <View style={styles.headerContent}>
          <Text variant="headlineSmall" style={styles.title}>
            Giỏ hàng
          </Text>
          <IconButton
            icon="refresh"
            size={24}
            onPress={fetchCart}
            disabled={loading}
            style={styles.refreshButton}
          />
        </View>
      </Surface>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text>Giỏ hàng trống</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cartList}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={fetchCart} />
            }
          />

          <Surface style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text variant="titleMedium">Tổng cộng:</Text>
              <Text variant="titleMedium" style={styles.totalAmount}>
                {formatVNCurrency(totalPrice)}
              </Text>
            </View>
            <Button
              mode="contained"
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              Thanh toán
            </Button>
          </Surface>
        </>
      )}
    </View>
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
  refreshButton: {
    margin: 0,
  },
  cartList: {
    padding: 16,
  },
  cartItem: {
    marginBottom: 12,
  },
  cartItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 100,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#e41e31',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalAmount: {
    color: '#e41e31',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
  },
});