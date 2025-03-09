import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Switch, Appbar, Text, Surface, IconButton, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function EditNotificationScreen({ navigation }) {

    const [orderConfirm, setOrderConfirm] = useState(true);
    const [orderDelivery, setOrderDelivery] = useState(true);
    const [promotion, setPromotion] = useState(true);

    const toggleSwitch = (key) => {
        if (key === "orderConfirm") {
            setOrderConfirm(!orderConfirm);
        } else if (key === "orderDelivery") {
            setOrderDelivery(!orderDelivery);
        } else if (key === "promotion") {
            setPromotion(!promotion);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Cài đặt thông báo" />
            </Appbar.Header>
            <ScrollView style={styles.scrollView}>
                <Surface style={styles.surface} elevation={0}>
                    <View style={styles.setting}>
                        <View style={styles.settingInfo}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="notifications-outline" size={24} />
                            </View>
                            <View>
                                <Text variant="titleMedium">Xác nhận đơn hàng</Text>
                                <Text variant="bodySmall" style={styles.subtitle}>Nhận thông báo khi đơn hàng được xác nhận</Text>
                            </View>
                        </View>
                        <Switch
                            value={orderConfirm}
                            onValueChange={() => toggleSwitch('orderConfirm')}
                        />
                    </View>
                </Surface>

                <Divider />

                <Surface style={styles.surface} elevation={0}>
                    <View style={styles.setting}>
                        <View style={styles.settingInfo}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="car-outline" size={24} />
                            </View>
                            <View>
                                <Text variant="titleMedium">Giao hàng</Text>
                                <Text variant="bodySmall" style={styles.subtitle}>Nhận thông báo khi đơn hàng được giao</Text>
                            </View>
                        </View>
                        <Switch
                            value={orderDelivery}
                            onValueChange={() => toggleSwitch('orderDelivery')}
                        />
                    </View>
                </Surface>

                <Divider />

                <Surface style={styles.surface} elevation={0}>
                    <View style={styles.setting}>
                        <View style={styles.settingInfo}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="pricetag-outline" size={24} />
                            </View>
                            <View>
                                <Text variant="titleMedium">Khuyến mãi</Text>
                                <Text variant="bodySmall" style={styles.subtitle}>Nhận thông báo về các chương trình khuyến mãi mới</Text>
                            </View>
                        </View>
                        <Switch
                            value={promotion}
                            onValueChange={() => toggleSwitch('promotion')}
                        />
                    </View>
                </Surface>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        padding: 16,
    },
    surface: {
        marginBottom: 16,
    },
    iconContainer: {
        marginRight: 20,
    },
    setting: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 50,
    },
    subtitle: {
        color: '#666',
    },
});
