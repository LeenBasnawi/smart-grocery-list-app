// components/shahd/IconSelectorButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function IconSelectorButton({ icon, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.box, isSelected && styles.boxSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>{icon}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  boxSelected: { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' },
  emoji: { fontSize: 24 },
});
