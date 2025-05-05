import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { Appbar, Card, Text, Chip, ActivityIndicator, Divider } from 'react-native-paper';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyOrderScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                setError('Vui lòng đăng nhập để xem đơn hàng');
                setLoading(false);
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                setOrders(response.data.result);
                setError(null);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Không thể tải đơn hàng. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrders();
    }, [fetchOrders]);

    const formatVNCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        })
            .format(number)
            .replace('₫', 'đ');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return '#FFC107'; // Yellow
            case 'PROCESSING':
                return '#2196F3'; // Blue
            case 'SHIPPED':
                return '#9C27B0'; // Purple
            case 'DELIVERED':
                return '#4CAF50'; // Green
            case 'CANCELLED':
                return '#F44336'; // Red
            default:
                return '#757575'; // Grey
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xác nhận';
            case 'PROCESSING':
                return 'Đang xử lý';
            case 'SHIPPED':
                return 'Đang giao hàng';
            case 'DELIVERED':
                return 'Đã giao hàng';
            case 'CANCELLED':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const renderOrderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => {
                navigation.navigate('OrderDetail', { order: item });
            }}
        >
            <Card style={styles.orderItem}>
                <Card.Content>
                    <View style={styles.orderHeader}>
                        <Text variant="titleMedium" numberOfLines={1} style={styles.orderNumber}>Đơn hàng #{item.id}</Text>
                        <Chip 
                            mode="flat" 
                            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
                            textStyle={{ color: getStatusColor(item.status), fontWeight: 'bold' }}
                        >
                            {getStatusText(item.status)}
                        </Chip>
                    </View>
                    
                    <Divider style={styles.divider} />
                    
                    <Text variant="bodyMedium" style={styles.orderDate}>
                        Ngày đặt: {formatDate(item.createdAt)}
                    </Text>
                    
                    {item.items && (
                        <Text variant="bodyMedium">
                            Số lượng sản phẩm: {item.items.length}
                        </Text>
                    )}
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Appbar.Header style={styles.appbar}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Appbar.Content title="Đơn hàng của tôi" />
                </Appbar.Header>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    // Calculate total amount of all orders
    const calculateTotalAmount = () => {
        if (!orders || orders.length === 0) return 0;
        return orders.reduce((total, order) => {
            // Only include completed orders in the total
            if (order.status === 'DELIVERED') {
                return total + order.totalAmount;
            }
            return total;
        }, 0);
    };

    const totalAmount = calculateTotalAmount();

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Đơn hàng của tôi" />
            </Appbar.Header>
            
            {error ? (
                <View style={styles.centered}>
                    <Text variant="bodyLarge" style={styles.errorText}>{error}</Text>
                </View>
            ) : orders.length === 0 ? (
                <View style={styles.centered}>
                    <Text variant="bodyLarge">Bạn chưa có đơn hàng nào</Text>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={styles.flatList}
                    data={orders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#007AFF']}
                        />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appbar: {
        elevation: 0,
        backgroundColor: '#ffffff',
    },
    orderItem: {
        marginBottom: 16,
        borderRadius: 8,
    },
    flatList: {
        padding: 16,
        paddingBottom: 32,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderNumber: {
        fontWeight: 'bold',
        width: '50%',
    },
    statusChip: {
        height: 28,
    },
    divider: {
        marginVertical: 8,
    },
    orderDate: {
        marginBottom: 4,
        color: '#666',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    shippingInfo: {
        flex: 1,
        color: '#666',
    },
    totalPrice: {
        fontWeight: 'bold',
        color: '#e41e31',
    },
    errorText: {
        color: '#e41e31',
        textAlign: 'center',
        padding: 16,
    }
});

export default MyOrderScreen;
