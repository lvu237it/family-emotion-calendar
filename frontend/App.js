import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import Index from './components/IndexEmotionCalendar';
import Header from './components/Header';
import { Common } from './contexts/CommonContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './components/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Common>
      <NavigationContainer>
        <Stack.Navigator
        // initialRouteName='Home'
        >
          <Stack.Screen
            name='Home'
            component={Home}
            options={{ headerShown: false }} // Ẩn header nếu cần
          />
          {/* <Stack.Screen
            name='Introduction'
            component={Introduction}
            options={{ headerShown: false, title: 'Giới thiệu' }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </Common>
  );
}
