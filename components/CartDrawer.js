import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { Surface, Text, IconButton, Button, Card } from 'react-native-paper';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.80;

export default function CartDrawer({ visible, onClose, cartItems = [], onUpdateQuantity, onRemoveItem }) {
  const translateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsComponentMounted(true);
    }
    
    Animated.timing(translateX, {
      toValue: visible ? 0 : DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (!visible) {
        setIsComponentMounted(false);
      }
    });
  }, [visible]);

  const renderCartItem = ({ item }) => (
    <Card style={styles.cartItem}>
      <Card.Content style={styles.cartItemContent}>
        <Card.Cover source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text numberOfLines={2} style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemPrice}>{item.price}</Text>
          <View style={styles.quantityContainer}>
            <IconButton
              icon="minus"
              size={20}
              onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            />
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <IconButton
              icon="plus"
              size={20}
              onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
            />
          </View>
        </View>
        <IconButton
          icon="delete"
          size={20}
          onPress={() => onRemoveItem(item.id)}
          style={styles.deleteButton}
        />
      </Card.Content>
    </Card>
  );

  if (!isComponentMounted && !visible) return null;

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('đ', '').replace('.', ''));
    return sum + price * item.quantity;
  }, 0);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <Surface style={styles.header}>
          <Text variant="titleMedium" style={styles.title}>Giỏ hàng</Text>
          <IconButton icon="close" size={24} onPress={onClose} />
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
              keyExtractor={item => item.id}
              contentContainerStyle={styles.cartList}
            />

            <Surface style={styles.footer}>
              <View style={styles.totalContainer}>
                <Text variant="titleMedium">Tổng cộng:</Text>
                <Text variant="titleMedium" style={styles.totalAmount}>
                  {totalAmount.toLocaleString()}đ
                </Text>
              </View>
              <Button
                mode="contained"
                style={styles.checkoutButton}
                onPress={() => { }}
              >
                Thanh toán
              </Button>
            </Surface>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontWeight: 'bold',
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