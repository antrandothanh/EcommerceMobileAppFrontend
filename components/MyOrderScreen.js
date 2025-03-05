import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Appbar, Card, Title, Text } from 'react-native-paper';

const MyOrderScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Sample JSON data
        const sampleOrders = [
            { id: 1, date: '2023-10-01', total: 100.00 },
            { id: 2, date: '2023-10-02', total: 150.50 },
            { id: 3, date: '2023-10-03', total: 200.75 },
            { id: 4, date: '2023-10-03', total: 200.75 },
            { id: 5, date: '2023-10-03', total: 200.75 },
            { id: 6, date: '2023-10-03', total: 200.75 },
            { id: 7, date: '2023-10-03', total: 200.75 },
            { id: 8, date: '2023-10-03', total: 200.75 },
            { id: 9, date: '2023-10-03', total: 200.75 },
            { id: 10, date: '2023-10-03', total: 200.75 },
            { id: 11, date: '2023-10-03', total: 200.75 },
            { id: 12, date: '2023-10-03', total: 200.75 },
            { id: 13, date: '2023-10-03', total: 200.75 },
            { id: 14, date: '2023-10-03', total: 200.75 },
            { id: 15, date: '2023-10-03', total: 200.75 },
            { id: 16, date: '2023-10-03', total: 200.75 },
            { id: 17, date: '2023-10-03', total: 200.75 },
            { id: 18, date: '2023-10-03', total: 200.75 },
            { id: 19, date: '2023-10-03', total: 200.75 },
            { id: 20, date: '2023-10-03', total: 200.75 },
        ];
        setOrders(sampleOrders);
    }, []);

    const renderOrderItem = ({ item }) => (
        <Card style={styles.orderItem}>
            <Card.Content>
                <Text variant="titleMedium">Mã đơn hàng: {item.id}</Text>
                <Text variant="bodyMedium">Ngày: {item.date}</Text>
                <Text variant="bodyMedium">Tổng tiền: ${item.total}</Text>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Đơn hàng của tôi" />
            </Appbar.Header>
            <FlatList
                contentContainerStyle={styles.flatList}
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '##f5f5f5',
    },
    appbar: {
        elevation: 0,
        backgroundColor: '#ffffff',
    },
    orderItem: {
        marginBottom: 16,
    },
    flatList: {
        padding: 16,
    }
});

export default MyOrderScreen;
