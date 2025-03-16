import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CardStyleInterpolators } from '@react-navigation/stack';
import Home from './components/Home';
import Introduction from './components/Introduction';
import Login from './components/Login';
import CreateFamily from './components/CreateFamily';
import RegisterPersonalAccount from './components/RegisterPersonalAccount';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Introduction'
        screenOptions={{
          gestureEnabled: false, // Disable swipe gesture for all screens by default
        }}
      >
        <Stack.Screen
          name='Introduction'
          component={Introduction}
          options={{
            headerShown: false,
            title: 'Giới thiệu',
            gestureEnabled: true, // Enable swipe gesture only for Introduction screen
          }}
        />
        <Stack.Screen
          name='Login'
          component={Login}
          options={{
            headerShown: false,
            title: 'Đăng nhập',
            gestureEnabled: true, // Enable swipe gesture only for Login screen
          }}
        />
        <Stack.Screen
          name='CreateFamily'
          component={CreateFamily}
          options={{
            headerShown: false,
            title: 'Tạo gia đình',
            gestureEnabled: true, // Enable swipe gesture only for CreateFamily screen
          }}
        />
        <Stack.Screen
          name='RegisterPersonalAccount'
          component={RegisterPersonalAccount}
          options={{
            headerShown: false,
            title: 'Đăng ký tài khoản cá nhân',
            gestureEnabled: true, // Enable swipe gesture only for RegisterPersonalAccount screen
          }}
        />
        <Stack.Screen
          name='Home'
          component={Home}
          options={{
            headerShown: false,
            gestureEnabled: false, // Explicitly disable swipe gesture for Home screen
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
