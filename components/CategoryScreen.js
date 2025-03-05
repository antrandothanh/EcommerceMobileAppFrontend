import React, { useState } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
} from "react-native";
import {
    Appbar,
    Button,
    Menu,
    Text,
    Card,
} from "react-native-paper";

const searchCategories = [
    { label: "Tất Cả", value: "all" },
    { label: "Kinh Dị", value: "horror" },
    { label: "Trinh Thám", value: "detective" },
    { label: "Tiểu Thuyết", value: "novel" },
    { label: "Thần Thoại", value: "myth" },
    { label: "Văn Học Việt Nam", value: "vietnameseLiturature" },
    { label: "Truyện Tranh", value: "comic" },
];

// Sample book data
const sampleBooks = [
    {
        id: "1",
        title: "Đắc Nhân Tâm",
        author: "Dale Carnegie",
        price: "86.000đ",
        image:
            "https://salt.tikicdn.com/cache/280x280/ts/product/df/7d/da/d340edda2b0eacb7ddc47537cddb5e08.jpg",
    },
    {
        id: "2",
        title: "Nhà Giả Kim",
        author: "Paulo Coelho",
        price: "79.000đ",
        image:
            "https://salt.tikicdn.com/cache/280x280/ts/product/66/5f/5a/7666a0fc1666b3155a0c9a612360e105.jpg",
    },
    {
        id: "3",
        title: "Cây Cam Ngọt Của Tôi",
        author: "José Mauro de Vasconcelos",
        price: "108.000đ",
        image:
            "https://salt.tikicdn.com/cache/280x280/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg",
    },
    {
        id: "4",
        title: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
        author: "Nguyễn Nhật Ánh",
        price: "125.000đ",
        image:
            "https://salt.tikicdn.com/cache/280x280/ts/product/2e/ae/d3/2e9446ea8fec0b8a2fe00d02dc5a57a2.jpg",
    },
    {
        id: "5",
        title: "Skidibi Toilet",
        author: "Nguyễn Nhật Ánh",
        price: "125.000đ",
        image:
            "https://salt.tikicdn.com/cache/280x280/ts/product/2e/ae/d3/2e9446ea8fec0b8a2fe00d02dc5a57a2.jpg",
    },
    {
        id: "6",
        title: "Skidibi Toilet",
        author: "Nguyễn Nhật Ánh",
        price: "125.000đ",
        image:
            "https://salt.tikicdn.com/cache/280x280/ts/product/2e/ae/d3/2e9446ea8fec0b8a2fe00d02dc5a57a2.jpg",
    },
    {
        id: "7",
        title: "Skidibi Toilet",
        author: "Nguyễn Nhật Ánh",
        price: "125.000đ",
        image:
            "https://salt.tikicdn.com/cache/280x280/ts/product/2e/ae/d3/2e9446ea8fec0b8a2fe00d02dc5a57a2.jpg",
    },
    {
        id: "8",
        title: "Skidibi Toilet",
        author: "Nguyễn Nhật Ánh",
        price: "125.000đ",
        image:
            "https://salt.tikicdn.com/cache/280x280/ts/product/2e/ae/d3/2e9446ea8fec0b8a2fe00d02dc5a57a2.jpg",
    },
];

export default function CategoryScreen() {
    const [visible, setVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(searchCategories[0]);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);


    const renderBookItem = ({ item }) => (
        <TouchableOpacity style={styles.bookItem}>
            <Card style={styles.bookCard}>
                <Card.Cover source={{ uri: item.image }} style={styles.bookImage} />
                <Card.Content>
                    <Text numberOfLines={2} style={styles.bookTitle}>
                        {item.title}
                    </Text>
                    <Text style={styles.bookAuthor}>{item.author}</Text>
                    <Text style={styles.bookPrice}>{item.price}</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="Danh Mục" />
                <Appbar.Action icon="cart" onPress={() => { }} />
            </Appbar.Header>

            <View style={styles.categoryTypeContainer}>
                <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                        <Button
                            mode="outlined"
                            onPress={openMenu}
                            style={styles.dropdownButton}
                        >
                            {selectedCategory.label}
                        </Button>
                    }
                >
                    {searchCategories.map((category) => (
                        <Menu.Item
                            key={category.value}
                            onPress={() => {
                                setSelectedCategory(category);
                                closeMenu();
                            }}
                            title={category.label}
                        />
                    ))}
                </Menu>
            </View>

            <FlatList
                data={sampleBooks}
                renderItem={renderBookItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.bookList}
            />
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
    categoryTypeContainer: {
        flexDirection: "row",
        padding: 16,
        justifyContent: "center",
        backgroundColor: "#ffffff",
    },
    dropdownButton: {
        width: 200,
    },
    bookList: {
        padding: 8,
    },
    bookItem: {
        flex: 1,
        padding: 8,
    },
    bookCard: {
        elevation: 4,
    },
    bookImage: {
        height: 200,
        resizeMode: "cover",
    },
    bookTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 8,
    },
    bookAuthor: {
        fontSize: 12,
        color: "#666666",
        marginTop: 4,
    },
    bookPrice: {
        fontSize: 14,
        color: "#e41e31",
        fontWeight: "bold",
        marginTop: 4,
    },
});
