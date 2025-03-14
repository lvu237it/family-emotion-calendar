import Header from './Header';
import Index from './Index';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';

function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Index />
      <StatusBar style='auto' />
    </SafeAreaView>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
