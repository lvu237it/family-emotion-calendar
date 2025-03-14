import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';

function Introduction() {
  return (
    <SafeAreaView style={styles.container}>
      {/* <Header />
      <Index />
      <StatusBar style='auto' /> */}
    </SafeAreaView>
  );
}

export default Introduction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
