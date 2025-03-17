import { useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

function BottomBar() {
  return (
    <>
      <View style={styles.bottomBarContainer}>
        <TouchableOpacity>
          <Feather name='home' size={28} color='black' />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons name='family-restroom' size={28} color='black' />
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign name='pluscircleo' size={28} color='black' />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name='book-open-page-variant-outline'
            size={28}
            color='black'
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign name='user' size={28} color='black' />
        </TouchableOpacity>
      </View>
    </>
  );
}

export default BottomBar;

const styles = StyleSheet.create({
  bottomBarContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    gap: 40,
    justifyContent: 'space-between',
  },
});
