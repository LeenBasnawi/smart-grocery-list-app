// components/shahd/SecondaryButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SecondaryButton({ label, onPress, style, textStyle }) {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress} activeOpacity={0.85}>
      <Text style={[styles.label, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1.5,
    borderColor: '#F57C00',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  label: {
    color: '#F57C00',
    fontWeight: '700',
    fontSize: 15,
  },
});
