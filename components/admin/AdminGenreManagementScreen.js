import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Appbar, Searchbar, List, Text, FAB, Divider, Snackbar, Dialog, TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

export default function AdminGenreManagementScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [genres, setGenres] = useState([]);
    const [filteredGenres, setFilteredGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [newGenreName, setNewGenreName] = useState('');
    const [editingGenre, setEditingGenre] = useState(null);

    useEffect(() => {
        fetchGenres();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredGenres(genres);
        } else {
            const filtered = genres.filter(genre =>
                genre.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredGenres(filtered);
        }
    }, [searchQuery, genres]);

    const fetchGenres = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');

            if (!token) {
                setSnackbarMessage('Không tìm thấy token đăng nhập');
                setSnackbarVisible(true);
                setLoading(false);
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/genres`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTimeout(() => {
                setSnackbarMessage('Đã tải danh sách thể loại');
                setSnackbarVisible(true);
                setGenres(response.data.result);
                setFilteredGenres(response.data.result);
                setLoading(false);
                setRefreshing(false);
            }, 1000);
        } catch (error) {
            setSnackbarMessage('Không thể tải danh sách thể loại');
            setSnackbarVisible(true);
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchGenres();
    };

    const handleAddGenre = async () => {
        if (!newGenreName.trim()) {
            setSnackbarMessage('Tên thể loại không được để trống');
            setSnackbarVisible(true);
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');

            if (!token) {
                setSnackbarMessage('Không tìm thấy token đăng nhập');
                setSnackbarVisible(true);
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/genres`,
                { name: newGenreName },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setDialogVisible(false);
            setNewGenreName('');
            setSnackbarMessage('Thêm thể loại thành công');
            setSnackbarVisible(true);
            fetchGenres();
        } catch (error) {
            setSnackbarMessage('Không thể thêm thể loại');
            setSnackbarVisible(true);
        }
    };

    const handleEditGenre = async () => {
        if (!newGenreName.trim()) {
            setSnackbarMessage('Tên thể loại không được để trống');
            setSnackbarVisible(true);
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');

            if (!token) {
                setSnackbarMessage('Không tìm thấy token đăng nhập');
                setSnackbarVisible(true);
                return;
            }

            const response = await axios.put(`${API_BASE_URL}/genres/${editingGenre.id}`,
                { name: newGenreName },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setEditDialogVisible(false);
            setNewGenreName('');
            setEditingGenre(null);
            setSnackbarMessage('Cập nhật thể loại thành công');
            setSnackbarVisible(true);
            fetchGenres();
        } catch (error) {
            setSnackbarMessage('Không thể cập nhật thể loại');
            setSnackbarVisible(true);
        }
    };

    const handleDeleteGenre = async (genreId) => {
        try {
            const token = await AsyncStorage.getItem('userToken');

            if (!token) {
                setSnackbarMessage('Không tìm thấy token đăng nhập');
                setSnackbarVisible(true);
                return;
            }

            const response = await axios.delete(`${API_BASE_URL}/genres/${genreId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setSnackbarMessage('Xóa thể loại thành công');
            setSnackbarVisible(true);
            fetchGenres();
        } catch (error) {
            setSnackbarMessage('Không thể xóa thể loại này do có sách liên quan.');
            setSnackbarVisible(true);
        }
    };

    const openEditDialog = (genre) => {
        setEditingGenre(genre);
        setNewGenreName(genre.name);
        setEditDialogVisible(true);
    };

    const renderGenreItem = ({ item }) => (
        <List.Item
            title={item.name}
            right={props => (
                <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => openEditDialog(item)} style={styles.actionButton}>
                        <Ionicons name="pencil-outline" size={20} color="#2196F3" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteGenre(item.id)} style={styles.actionButton}>
                        <Ionicons name="trash-outline" size={20} color="#F44336" />
                    </TouchableOpacity>
                </View>
            )}
            style={styles.listItem}
        />
    );

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Quản lý thể loại" />
            </Appbar.Header>

            <Searchbar
                placeholder="Tìm kiếm thể loại"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                </View>
            ) : (
                <FlatList
                    data={filteredGenres}
                    renderItem={renderGenreItem}
                    keyExtractor={item => item.id.toString()}
                    ItemSeparatorComponent={() => <Divider />}
                    contentContainerStyle={styles.listContent}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {searchQuery.trim() !== '' ? 'Không tìm thấy thể loại phù hợp' : 'Chưa có thể loại nào'}
                            </Text>
                        </View>
                    }
                />
            )}

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => setDialogVisible(true)}
            />

            {/* Add Genre Dialog */}
            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                <Dialog.Title>Thêm thể loại mới</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Tên thể loại"
                        value={newGenreName}
                        onChangeText={text => setNewGenreName(text)}
                        mode="outlined"
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setDialogVisible(false)}>Hủy</Button>
                    <Button onPress={handleAddGenre}>Thêm</Button>
                </Dialog.Actions>
            </Dialog>

            {/* Edit Genre Dialog */}
            <Dialog visible={editDialogVisible} onDismiss={() => setEditDialogVisible(false)}>
                <Dialog.Title>Chỉnh sửa thể loại</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        label="Tên thể loại"
                        value={newGenreName}
                        onChangeText={setNewGenreName}
                        mode="outlined"
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setEditDialogVisible(false)}>Hủy</Button>
                    <Button onPress={handleEditGenre}>Lưu</Button>
                </Dialog.Actions>
            </Dialog>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: 'Đóng',
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    appbar: {
        elevation: 0,
        backgroundColor: '#ffffff',
    },
    searchBar: {
        margin: 16,
        elevation: 2,
        borderRadius: 100,
    },
    listContent: {
        paddingBottom: 100, // avoid FAB overlap to flatlist
        marginHorizontal: 10,
    },
    listItem: {
        backgroundColor: '#ffffff',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        marginHorizontal: 8,
        padding: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        height: 200,
    },
    emptyText: {
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#2196F3',
    },
});