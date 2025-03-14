import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import Index from './components/Index';
import Header from './components/Header';
import { Common } from './contexts/CommonContext';

export default function App() {
  return (
    <Common>
      <SafeAreaView style={styles.container}>
        <Header />
        <Index />
        {/* <StatusBar style='auto' /> */}
      </SafeAreaView>
    </Common>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
