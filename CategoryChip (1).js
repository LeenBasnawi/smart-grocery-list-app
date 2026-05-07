// components/shahd/CategoryChip.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function CategoryChip({ label, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, isSelected && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  label: { fontSize: 14, fontWeight: '600', color: '#424242' },
  labelActive: { color: '#fff' },
});
