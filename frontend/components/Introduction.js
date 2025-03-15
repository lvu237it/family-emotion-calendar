import React, { useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Platform,
  Text,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { useNavigation } from '@react-navigation/native';
import { useCommon } from '../contexts/CommonContext';

function Introduction() {
  const navigation = useNavigation();
  const { userLoggedIn, isLoading } = useCommon();

  const [fontsLoaded] = useFonts({
    AtlantixDisplaySsiDisplayItalic: require('../assets/fonts/Playwrite CU.ttf'),
  });

  useEffect(() => {
    if (!isLoading && userLoggedIn) {
      navigation.replace('Home');
    }
  }, [isLoading, userLoggedIn, navigation]);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#007bff' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <ImageBackground
        source={require('../assets/images/wallpaper-4k-4.jpg')}
        style={styles.backgroundImage}
        resizeMode='cover'
      >
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Chào mừng bạn đến với Family Calendars 😊
          </Text>
          <Text style={styles.descriptionIntroduction}>
            Hãy cùng mọi người tạo nên những ký ức thật vui vẻ nhé!
          </Text>
        </View>
      </ImageBackground>

      <TouchableOpacity
        style={styles.buttonIntroduction}
        onPress={() => navigation.navigate('CreateFamily')}
      >
        <Text style={styles.buttonText}>Bắt đầu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.haveAnAccount}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.haveAnAccountText}>
          Bạn đã có tài khoản? <Text style={styles.loginTitle}>Đăng nhập</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    width: '80%',
  },
  text: {
    fontFamily: 'Playwrite CU',
    fontSize: 23,
    textAlign: 'center',
    color: 'white',
    fontWeight: '900',
  },
  descriptionIntroduction: {
    width: '80%',
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '700',
    alignSelf: 'center',
    textAlign: 'center',
  },
  buttonIntroduction: {
    position: 'absolute',
    bottom: 80, // Cách mép dưới 50px, có thể chỉnh theo ý muốn
    alignSelf: 'center', // Canh giữa theo chiều ngang
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Nền nhẹ cho dễ nhìn
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25, // Bo góc cho đẹp
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  haveAnAccount: {
    position: 'absolute',
    bottom: 45,
    alignSelf: 'center', // Canh giữa theo chiều ngang
    // backgroundColor: 'rgba(255, 255, 255, 0.7)', // Nền nhẹ cho dễ nhìn
    // color: 'rgba(255, 255, 255, 0.7)',
  },
  haveAnAccountText: {
    color: 'white',
    fontSize: 16,
  },
  loginTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Introduction;
