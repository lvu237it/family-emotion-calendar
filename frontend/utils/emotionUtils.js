import { useState, useEffect } from 'react';

// List of emotions with emojis and labels
export const emotions = [
  { emoji: '😊', label: 'Vui', color: 'bg-yellow-100' },
  { emoji: '😢', label: 'Buồn', color: 'bg-blue-100' },
  { emoji: '😡', label: 'Giận', color: 'bg-red-100' },
  { emoji: '😴', label: 'Mệt', color: 'bg-gray-100' },
  { emoji: '😂', label: 'Haha', color: 'bg-green-100' },
  { emoji: '😮', label: 'Wow', color: 'bg-purple-100' },
  { emoji: '😰', label: 'Lo sợ', color: 'bg-orange-100' },
  { emoji: '❤️', label: 'Yêu đời', color: 'bg-pink-100' },
  { emoji: '😌', label: 'Chill', color: 'bg-teal-100' },
  { emoji: '🤔', label: 'Hmm', color: 'bg-indigo-100' },
];

// Function to format date as YYYY-MM-DD
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Function to get today's date as YYYY-MM-DD
export const getTodayDate = () => formatDate(new Date());

// Function to determine if a date is in the past
export const isPastDate = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  return date < today;
};

// Function to determine if a date is today
export const isToday = (dateString) => {
  return dateString === getTodayDate();
};

// Function to format date for display (e.g., "Monday, October 21")
export const formatDisplayDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

// Function to determine the majority emotion for a family
export const getMajorityEmotion = (members) => {
  const emotionCounts = {};

  // Count emotions
  Object.values(members).forEach((member) => {
    if (member.emoji) {
      emotionCounts[member.emoji] = (emotionCounts[member.emoji] || 0) + 1;
    }
  });

  // Find the majority
  let majorityEmoji = null;
  let maxCount = 0;

  Object.entries(emotionCounts).forEach(([emoji, count]) => {
    if (count > maxCount) {
      maxCount = count;
      majorityEmoji = emoji;
    }
  });

  return majorityEmoji;
};

// Function to categorize emotions into positive, neutral, negative
export const categorizeEmotion = (emoji) => {
  const positive = ['😊', '😂', '❤️', '😌'];
  const negative = ['😢', '😡', '😰'];
  const neutral = ['😴', '😮', '🤔'];

  if (positive.includes(emoji)) return 'positive';
  if (negative.includes(emoji)) return 'negative';
  return 'neutral';
};

// Hook to create fade in animation
export function useFadeIn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return {
    opacity: visible ? 1 : 0,
    transition: 'opacity 300ms ease-in-out',
  };
}
