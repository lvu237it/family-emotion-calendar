import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useCommon } from '../contexts/CommonContext';

function RegisterPersonalAccount() {
  const [isModalVisible, setModalVisible] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State để quản lý trạng thái loading

  const {
    axios,
    myFamily,
    myFamilyMembers,
    AsyncStorage,
    apiBaseUrl,
    myFamilyIdToSeparate,
    setMyFamilyIdToSeparate,
    userLoggedIn,
    setUserLoggedIn,
    isSuccessCreateAccount,
    setIsSuccessCreateAccount,
  } = useCommon();

  const slideAnim = useRef(new Animated.Value(0)).current; // Animation value
  const navigation = useNavigation(); // Lấy đối tượng navigation

  const handleCreatePersonalAccount = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`http://${apiBaseUrl}/users/register-user`, {
        username,
        email,
        password,
        familyId: myFamily?._id,
      });

      // Thêm delay để loading mượt mà hơn
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsLoading(false);
      setIsSuccessCreateAccount(true);

      // Đợi hiển thị thành công
      await new Promise((resolve) => setTimeout(resolve, 1500));

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error registering account:', error);
      setIsLoading(false);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message ||
          'Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.'
      );
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/wallpaper-4k-4.jpg')}
      style={styles.backgroundImage}
      resizeMode='cover'
    >
      <Animated.View
        style={[
          styles.modalContent,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#007bff' />
            <Text style={styles.loadingText}>Đang tạo tài khoản...</Text>
          </View>
        ) : isSuccessCreateAccount ? (
          <View style={styles.successContainer}>
            <Feather name='check-circle' size={60} color='#4CAF50' />
            <Text style={styles.successText}>Tạo tài khoản thành công!</Text>
            <Text style={styles.loadingText}>Đang chuyển hướng...</Text>
          </View>
        ) : (
          <>
            <View style={styles.createAccountTitleWrapper}>
              <Text style={styles.titleCreateFamily}>
                Tiếp theo, hãy tạo tài khoản cá nhân của bạn{' '}
                <Feather
                  style={styles.iconPen}
                  name='pen-tool'
                  size={18}
                  color='black'
                />
                . Sau đó, bạn có thể mời thêm các thành viên trong gia đình của
                mình 😊
              </Text>
            </View>

            <TextInput
              style={styles.input}
              placeholder='Nhập tên của bạn'
              placeholderTextColor='#999'
              value={username}
              onChangeText={setUsername}
              autoCapitalize='none'
              autoComplete='off'
            />
            <TextInput
              style={styles.input}
              placeholder='Nhập email'
              placeholderTextColor='#999'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
              autoComplete='off'
              textContentType='emailAddress'
            />
            <TextInput
              style={styles.input}
              placeholder='Nhập mật khẩu'
              placeholderTextColor='#999'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType='none'
              autoComplete='off'
              autoCapitalize='none'
            />

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreatePersonalAccount}
              disabled={isLoading}
            >
              <Text style={styles.createButtonText}>Hoàn tất</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end', // Đưa modal xuống dưới cùng
  },
  modalContent: {
    backgroundColor: 'white',
    height: '80%', // Chiều cao 2/3 màn hình
    borderTopLeftRadius: 20, // Bo góc phía trên bên trái
    borderTopRightRadius: 20, // Bo góc phía trên bên phải
    padding: 25,
    justifyContent: 'flex-start', // Căn nội dung từ trên xuống
  },
  createAccountTitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleCreateFamily: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  iconPen: {
    // Style cho icon pen
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007bff',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  successSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default RegisterPersonalAccount;
