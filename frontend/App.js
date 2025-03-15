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
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen
          name='Introduction'
          component={Introduction}
          options={{ headerShown: false, title: 'Giới thiệu' }}
        />
        <Stack.Screen
          name='Login'
          component={Login}
          options={{ headerShown: false, title: 'Đăng nhập' }}
        />
        <Stack.Screen
          name='CreateFamily'
          component={CreateFamily}
          options={{ headerShown: false, title: 'Tạo gia đình' }}
        />
        <Stack.Screen
          name='RegisterPersonalAccount'
          component={RegisterPersonalAccount}
          options={{ headerShown: false, title: 'Đăng ký tài khoản cá nhân' }}
        />
        <Stack.Screen
          name='Home'
          component={Home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
