// components/shahd/ColorPickerCircle.js
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

export default function ColorPickerCircle({ color, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[
        styles.dot,
        { backgroundColor: color },
        isSelected && styles.dotSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    />
  );
}

const styles = StyleSheet.create({
  dot: { width: 42, height: 42, borderRadius: 21 },
  dotSelected: { borderWidth: 3, borderColor: '#1F2937' },
});
