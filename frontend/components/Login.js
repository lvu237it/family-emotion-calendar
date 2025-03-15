import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCommon } from '../contexts/CommonContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';

function Login() {
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State để quản lý trạng thái loading
  const [isSuccessLogin, setIsSuccessLogin] = useState(false); // State để quản lý trạng thái thành công

  const slideAnim = useRef(new Animated.Value(0)).current; // Animation value
  const navigation = useNavigation(); // Lấy đối tượng navigation

  const {
    axios,
    AsyncStorage,
    apiBaseUrl,
    setUserLoggedIn,
    userId,
    setUserId,
  } = useCommon();

  const handleBackIntroduction = () => {
    navigation.goBack();
  };

  const handleLogin = async () => {
    if (!emailLogin.trim() || !passwordLogin.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // Bắt đầu hiệu ứng loading
    setIsLoading(true);

    try {
      const response = await axios.post(`http://${apiBaseUrl}/users/login`, {
        email: emailLogin,
        password: passwordLogin,
      });

      // Cập nhật thông tin người dùng đã đăng nhập
      setUserLoggedIn(response.data.data);
      // setUserId(response.data.data._id);

      // Lưu thông tin người dùng vào AsyncStorage
      await AsyncStorage.setItem(
        'userLoggedIn',
        JSON.stringify(response.data.data)
      );

      // Kết thúc hiệu ứng loading và hiển thị trạng thái thành công
      setIsLoading(false);
      setIsSuccessLogin(true);

      // Đợi thêm 2 giây để hiển thị thông báo thành công trước khi chuyển hướng
      setTimeout(() => {
        navigation.navigate('Home');
      }, 2000); // Chuyển hướng sau 2 giây
    } catch (error) {
      // Xử lý lỗi từ server
      // console.error('Error logging in:', error.response?.data || error.message);

      // Hiển thị thông báo lỗi từ server
      const errorMessage =
        error.response?.data?.message ||
        'Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);

      // Kết thúc hiệu ứng loading
      setIsLoading(false);
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
            transform: [{ translateY: slideAnim }], // Áp dụng hiệu ứng trượt
          },
        ]}
      >
        {isLoading ? (
          // Hiển thị hiệu ứng loading
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color='#007bff' />
            <Text style={styles.loadingText}>Đang đăng nhập...</Text>
          </View>
        ) : isSuccessLogin ? (
          // Hiển thị trạng thái thành công
          <View style={styles.successContainer}>
            <Feather name='check-circle' size={60} color='#4CAF50' />
            <Text style={styles.successText}>Đăng nhập thành công!</Text>
          </View>
        ) : (
          // Hiển thị form đăng nhập
          <>
            <TouchableOpacity
              onPress={handleBackIntroduction}
              style={styles.backWrapper}
            >
              <MaterialIcons name='arrow-back' size={22} color='black' />
              <Text style={styles.textBackIcon}>Quay lại</Text>
            </TouchableOpacity>

            <Text style={styles.titleCreateFamily}>
              Chào mừng bạn đã trở lại 😊
            </Text>
            <TextInput
              style={styles.input}
              placeholder='Nhập email'
              placeholderTextColor='#999'
              value={emailLogin}
              onChangeText={setEmailLogin}
              keyboardType='email-address'
            />
            <TextInput
              style={styles.input}
              placeholder='Nhập mật khẩu'
              placeholderTextColor='#999'
              value={passwordLogin}
              onChangeText={setPasswordLogin}
              secureTextEntry // Ẩn mật khẩu
            />

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleLogin}
              disabled={isLoading} // Vô hiệu hóa nút khi đang loading
            >
              <Text style={styles.createButtonText}>Đăng nhập</Text>
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    height: '74%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    justifyContent: 'flex-start',
  },
  backWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  textBackIcon: {
    fontSize: 16,
  },
  titleCreateFamily: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 30,
    color: '#333',
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
});

export default Login;
