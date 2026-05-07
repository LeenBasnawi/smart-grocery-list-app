// components/shahd/TopBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TopBar({ title, onBack, rightIcon, onRightPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.leftBtn}
      >
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <TouchableOpacity
        onPress={onRightPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.rightBtn}
      >
        {rightIcon ? (
          <Text style={styles.rightIcon}>{rightIcon}</Text>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  leftBtn: { width: 32 },
  backArrow: { fontSize: 22, color: '#2E7D32' },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: '#2E7D32', textAlign: 'center' },
  rightBtn: { width: 32, alignItems: 'flex-end' },
  rightIcon: { fontSize: 22, color: '#212121' },
});
