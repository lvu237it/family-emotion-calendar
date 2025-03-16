import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';

const FamilyDiscussion = ({
  discussion,
  familyMembers,
  userId,
  onAddComment,
  isToday,
}) => {
  const [comment, setComment] = useState('');
  const commentsEndRef = useRef(null);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [discussion]);

  const scrollToBottom = () => {
    commentsEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (comment.trim() === '') return;
    onAddComment(comment);
    setComment('');
  };

  const findMember = (id) => {
    return (
      familyMembers.find((member) => member.id === id) || {
        name: 'Unknown',
        avatar: 'https://via.placeholder.com/150',
      }
    );
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name='message-circle' size={18} color='black' />
        <Text style={styles.headerTitle}>Thảo luận cùng gia đình</Text>
      </View>

      <ScrollView style={styles.commentsContainer}>
        {discussion.comments.length === 0 ? (
          <View style={styles.noComments}>
            <Text style={styles.noCommentsText}>
              Chưa có bình luận nào. Bạn hãy bắt đầu cuộc thảo luận này nhé!
            </Text>
          </View>
        ) : (
          <View style={styles.commentsList}>
            {discussion.comments.map((comment, index) => {
              const member = findMember(comment.userId);
              const isCurrentUser = comment.userId === userId;

              return (
                <View
                  key={index}
                  style={[
                    styles.commentContainer,
                    isCurrentUser
                      ? styles.commentContainerRight
                      : styles.commentContainerLeft,
                  ]}
                >
                  <View style={styles.commentContent}>
                    <View style={styles.commentAvatarContainer}>
                      <Image
                        source={{ uri: member.avatar }}
                        style={styles.commentAvatar}
                      />
                    </View>
                    <View
                      style={[
                        styles.commentBubble,
                        isCurrentUser
                          ? styles.commentBubbleRight
                          : styles.commentBubbleLeft,
                      ]}
                    >
                      <Text
                        style={[
                          styles.commentAuthor,
                          isCurrentUser
                            ? styles.commentAuthorRight
                            : styles.commentAuthorLeft,
                        ]}
                      >
                        {isCurrentUser ? 'You' : member.name} ·{' '}
                        {formatTime(comment.timestamp)}
                      </Text>
                      <Text style={styles.commentText}>{comment.text}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {isToday && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder='Bạn nói gì đi...'
            value={comment}
            onChangeText={setComment}
          />
          <Pressable
            style={styles.commentButton}
            onPress={handleSubmit}
            disabled={!comment.trim()}
          >
            <Feather name='send' size={18} color='white' />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  commentsContainer: {
    maxHeight: 384,
    padding: 16,
  },
  noComments: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  noCommentsText: {
    color: '#666',
  },
  commentsList: {
    gap: 16,
  },
  commentContainer: {
    flexDirection: 'row',
  },
  commentContainerRight: {
    justifyContent: 'flex-end',
  },
  commentContainerLeft: {
    justifyContent: 'flex-start',
  },
  commentContent: {
    flexDirection: 'row',
    maxWidth: '80%',
  },
  commentAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  commentAvatar: {
    width: '100%',
    height: '100%',
  },
  commentBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  commentBubbleRight: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    marginRight: 8,
  },
  commentBubbleLeft: {
    backgroundColor: '#f0f0f0',
    marginLeft: 8,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  commentAuthorRight: {
    textAlign: 'right',
  },
  commentAuthorLeft: {
    textAlign: 'left',
  },
  commentText: {
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  commentInput: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
  },
  commentButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#007bff',
  },
});

export default FamilyDiscussion;
