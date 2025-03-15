import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { useCommon } from '../contexts/CommonContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

function CreateFamily() {
  const [isModalVisible, setModalVisible] = useState(true); // State để điều khiển hiển thị modal
  const [familyNameInput, setFamilyNameInput] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current; // Animation value
  const navigation = useNavigation(); // Lấy đối tượng navigation

  const {
    axios,
    myip,
    exampleFamilyId,
    userMenuOpen,
    setUserMenuOpen,
    myFamily,
    setMyFamily,
    myFamilyMembers,
    setMyFamilyMembers,
    emotionCalendarDataTotal,
    userId,
    setUserId,
    AsyncStorage,
    apiBaseUrl,
    myFamilyIdToSeparate,
    setMyFamilyIdToSeparate,
  } = useCommon();

  const handleBackIntroduction = () => {
    navigation.goBack();
  };

  const handleCreateFamily = async () => {
    if (!familyNameInput.trim()) {
      alert('Vui lòng nhập tên gia đình');
      return;
    }

    try {
      const response = await axios.post(
        `http://${apiBaseUrl}/families/register-family`,
        { familyName: familyNameInput }
      );
      setMyFamily(response.data);
      setMyFamilyIdToSeparate(response.data.familyName);

      // setModalVisible(false); // Đóng modal trước
      navigation.navigate('RegisterPersonalAccount'); // Sau đó chuyển hướng
    } catch (error) {
      console.error(
        'Error creating family:',
        error.response?.data || error.message
      ); // Log lỗi chi tiết
      alert('Có lỗi xảy ra khi tạo gia đình. Vui lòng thử lại.'); // Hiển thị thông báo lỗi
    }
  };

  useEffect(() => {
    console.log('myfamilyidtoéparate', myFamilyIdToSeparate);
  }, [myFamilyIdToSeparate]);

  return (
    // <Modal
    //   isVisible={isModalVisible}
    //   onBackdropPress={() => setModalVisible(false)} // Đóng modal khi nhấn ra ngoài
    //   style={styles.modal}
    // >
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
        <TouchableOpacity
          onPress={handleBackIntroduction}
          style={styles.backWrapper}
        >
          <MaterialIcons
            style={styles.backIcon}
            name='arrow-back'
            size={22}
            color='black'
          />
          <Text style={styles.textBackIcon}>Quay lại</Text>
        </TouchableOpacity>

        <Text style={styles.titleCreateFamily}>
          Đầu tiên, hãy nghĩ ra một cái tên độc đáo cho gia đình bạn 🤔
        </Text>
        <TextInput
          style={styles.input}
          placeholder='Nhập tên gia đình'
          placeholderTextColor='#999'
          value={familyNameInput}
          onChangeText={setFamilyNameInput}
        />

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateFamily}
        >
          <Text style={styles.createButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
    // </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end', // Đưa modal xuống dưới cùng
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    height: '66%', // Chiều cao 2/3 màn hình
    borderTopLeftRadius: 20, // Bo góc phía trên bên trái
    borderTopRightRadius: 20, // Bo góc phía trên bên phải
    padding: 25,
    justifyContent: 'flex-start', // Căn nội dung từ trên xuống
  },
  backWrapper: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
    // paddingVertical: 'auto',
    // alignContent: 'center',
  },
  backIcon: {},
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
});

export default CreateFamily;
