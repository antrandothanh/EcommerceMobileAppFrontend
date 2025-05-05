import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import {
  Appbar,
  Text,
  Surface,
  Divider,
  Chip,
  Button,
} from "react-native-paper";
import { API_BASE_URL } from "../config";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OrderDetailScreen = ({ navigation, route }) => {
  const [order, setOrder] = useState(route.params.order);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setError("Vui lòng đăng nhập để xem chi tiết đơn hàng");
        setRefreshing(false);
        return;
      }
      console.log("Order:", order);
      setError(null);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrderDetail();
  };

  const formatVNCurrency = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(number)
      .replace("₫", "đ");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#FFC107"; // Yellow
      case "PROCESSING":
        return "#2196F3"; // Blue
      case "SHIPPED":
        return "#9C27B0"; // Purple
      case "DELIVERED":
        return "#4CAF50"; // Green
      case "CANCELLED":
        return "#F44336"; // Red
      default:
        return "#757575"; // Grey
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "PROCESSING":
        return "Đang xử lý";
      case "SHIPPED":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng (COD)";
      case "banking":
        return "Chuyển khoản ngân hàng";
      default:
        return method;
    }
  };

  const handleCancelOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setError("Vui lòng đăng nhập để hủy đơn hàng");
        return;
      }

      // Only allow cancellation if order is in PENDING state
      if (order.status !== "PENDING") {
        setError("Chỉ có thể hủy đơn hàng ở trạng thái chờ xác nhận");
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        // Refresh order details
        fetchOrderDetail();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      setError("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Chi tiết đơn hàng" />
        </Appbar.Header>
        <View style={styles.centered}>
          <Text variant="bodyLarge" style={styles.errorText}>
            {error}
          </Text>
          <Button
            mode="contained"
            onPress={onRefresh}
            style={styles.retryButton}
          >
            Thử lại
          </Button>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Chi tiết đơn hàng" />
        </Appbar.Header>
        <View style={styles.centered}>
          <Text variant="bodyLarge">Không tìm thấy thông tin đơn hàng</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={`Đơn hàng #${order.id}`} />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
          />
        }
      >
        {/* Order Status */}
        <Surface style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Trạng thái đơn hàng
            </Text>
            <Chip
              mode="flat"
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(order.status) + "20" },
              ]}
              textStyle={{
                color: getStatusColor(order.status),
                fontWeight: "bold",
              }}
            >
              {getStatusText(order.status)}
            </Chip>
          </View>
          <Text variant="bodyMedium" style={styles.orderDate}>
            Ngày đặt: {formatDate(order.createdAt)}
          </Text>
          {order.status === "PENDING" && (
            <Button
              mode="outlined"
              onPress={handleCancelOrder}
              style={styles.cancelButton}
              textColor="#F44336"
            >
              Hủy đơn hàng
            </Button>
          )}
        </Surface>

        {/* Shipping Information */}
        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Thông tin giao hàng
          </Text>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.infoLabel}>
              Người nhận:
            </Text>
            <Text variant="bodyMedium" style={styles.infoValue}>
              An
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.infoLabel}>
              Số điện thoại:
            </Text>
            <Text variant="bodyMedium" style={styles.infoValue}>
              123
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="bodyMedium" style={styles.infoLabel}>
              Phương thức thanh toán:
            </Text>
            <Text variant="bodyMedium" style={styles.infoValue}>
              {getPaymentMethodText(order.paymentMethod)}
            </Text>
          </View>
        </Surface>

        {/* Order Items */}
        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Sản phẩm đã đặt
          </Text>
          {order.items && order.items.map((item, index) => (
              <View key={item.id || index}>
                <View style={styles.orderItem}>
                  <View style={styles.orderItemDetails}>
                    <Text variant="bodyMedium" style={styles.bookTitle}>
                      {item.bookName || item.book?.name}
                    </Text>
                    <Text variant="bodySmall" style={styles.itemQuantity}>
                      SL: {item.quantity} x {formatVNCurrency(item.price || item.book?.price)}
                    </Text>
                  </View>
                  <Text variant="titleMedium" style={styles.itemTotal}>
                    {formatVNCurrency((item.price || item.book?.price) * item.quantity)}
                  </Text>
                </View>
                {index < order.items.length - 1 && (
                  <Divider style={styles.itemDivider} />
                )}
              </View>
            ))
          }
        </Surface>

        {/* Order Summary */}
        <Surface style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Tổng cộng
          </Text>
          <View style={styles.summaryRow}>
            <Text variant="bodyMedium">Tạm tính</Text>
            <Text variant="bodyMedium">
              {formatVNCurrency(order.subtotal || order.totalAmount)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text variant="bodyMedium">Phí vận chuyển</Text>
            <Text variant="bodyMedium">
              {formatVNCurrency(order.shippingFee || 0)}
            </Text>
          </View>
          <Divider style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text variant="titleMedium" style={styles.totalLabel}>
              Thành tiền
            </Text>
            <Text variant="titleMedium" style={styles.totalAmount}>
              {formatVNCurrency(order.totalAmount)}
            </Text>
          </View>
        </Surface>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appbar: {
    elevation: 0,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  statusChip: {
    height: 28,
  },
  orderDate: {
    color: "#666",
    marginBottom: 16,
  },
  cancelButton: {
    marginTop: 8,
    borderColor: "#F44336",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    width: 140,
    color: "#666",
  },
  infoValue: {
    flex: 1,
    fontWeight: "500",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  orderItemDetails: {
    flex: 1,
    marginRight: 16,
  },
  bookTitle: {
    fontWeight: "500",
  },
  bookAuthor: {
    color: "#666",
    marginTop: 2,
  },
  itemQuantity: {
    marginTop: 4,
  },
  itemTotal: {
    fontWeight: "bold",
  },
  itemDivider: {
    marginVertical: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryDivider: {
    marginVertical: 12,
  },
  totalLabel: {
    fontWeight: "bold",
  },
  totalAmount: {
    fontWeight: "bold",
    color: "#e41e31",
  },
  errorText: {
    color: "#e41e31",
    textAlign: "center",
    marginBottom: 16,
    padding: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
  },
});

export default OrderDetailScreen;
