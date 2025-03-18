import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCommon } from '../contexts/CommonContext';

export default function UserProfile() {
  const navigation = useNavigation(); // Hook để điều hướng
  const { userLoggedIn } = useCommon(); // Lấy thông tin người dùng từ context

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>⬅ Quay lại</Text>
      </TouchableOpacity>

      {/* Ảnh đại diện */}
      <Image
        source={{
          uri: userLoggedIn?.avatar || 'https://via.placeholder.com/100',
        }}
        style={styles.avatar}
      />

      {/* Tên người dùng */}
      <Text style={styles.username}>
        {userLoggedIn?.username || 'Tên người dùng'}
      </Text>

      {/* Email */}
      <Text style={styles.email}>
        📧 Email: {userLoggedIn?.email || 'Không có email'}
      </Text>

      {/* Số điện thoại */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});
