import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { emotions } from '../utils/emotionUtils';

const EmotionModal = ({ isOpen, onClose, currentEmotion, onSave }) => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedEmotion(currentEmotion?.emoji || null);
      setNote(currentEmotion?.note || '');
    }
  }, [isOpen, currentEmotion]);

  const handleSave = () => {
    if (!selectedEmotion) return;
    onSave(selectedEmotion, note);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Hôm nay bạn thấy thế nào?</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons
              name='window-close'
              size={20}
              color='black'
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.emotionSelector}>
          {emotions.map((emotion) => (
            <Pressable
              key={emotion.emoji}
              style={[
                styles.emotionItem,
                selectedEmotion === emotion.emoji && styles.emotionItemSelected,
              ]}
              onPress={() => setSelectedEmotion(emotion.emoji)}
            >
              <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
              <Text style={styles.emotionLabel}>{emotion.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.noteContainer}>
          <Text style={styles.noteLabel}>Thêm ghi chú (không bắt buộc)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder='Bạn nghĩ ngày hôm nay của mình ra sao?'
            multiline
            numberOfLines={3}
            value={note}
            onChangeText={setNote}
          />
        </View>

        <View style={styles.modalFooter}>
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Huỷ</Text>
          </Pressable>
          <Pressable
            style={[
              styles.saveButton,
              !selectedEmotion && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!selectedEmotion}
          >
            <Text style={styles.saveButtonText}>Lưu</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  emotionSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 16,
  },
  emotionItem: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    margin: 8,
    backgroundColor: '#f0f0f0',
  },
  emotionItemSelected: {
    backgroundColor: '#007bff',
  },
  emotionEmoji: {
    fontSize: 32,
  },
  emotionLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  noteContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  noteInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#007bff',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
});

export default EmotionModal;
