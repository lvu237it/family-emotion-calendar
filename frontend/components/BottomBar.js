import { useRef, useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCommon } from '../contexts/CommonContext';

function BottomBar() {
  const route = useRoute();

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
    displayFamilyInformation,
    setDisplayFamilyInformation,
    handleClickFamilyInformation,
    displayHome,
    setDisplayHome,
  } = useCommon();

  const navigation = useNavigation();

  const handleFamilyPress = () => {
    setDisplayFamilyInformation(true);
  };

  return (
    <>
      <View style={styles.bottomBarContainer}>
        <TouchableOpacity
          onPress={() => {
            setDisplayFamilyInformation(false);
            navigation.navigate('Home');
          }}
        >
          <Feather name='home' size={28} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFamilyPress}>
          <MaterialIcons name='family-restroom' size={28} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('AddMembersToFamily')}
        >
          <AntDesign name='pluscircleo' size={28} color='black' />
        </TouchableOpacity>

        <TouchableOpacity>
          <MaterialCommunityIcons
            name='book-open-page-variant-outline'
            size={28}
            color='black'
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
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
