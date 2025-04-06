import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Card, Avatar } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CommentCard({
  userName,
  createdAt,
  score,
  comment,
}) {
  return (
    <Card style={styles.reviewCard}>
      <Card.Content>
        <View style={styles.reviewHeader}>
          <Avatar.Image size={40} source={require('../assets/DefaultAvatar.jpg')} />
          <View style={styles.reviewUser}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.reviewDate}>{createdAt}</Text>
          </View>
        </View>

        <View style={styles.reviewRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= score ? "star" : "star-outline"}
              size={16}
              color="#FFD700"
            />
          ))}
        </View>

        <Text style={styles.reviewComment}>{comment}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
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
});
