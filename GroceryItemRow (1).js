// components/shahd/GroceryItemRow.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Checkbox sub-component
const Checkbox = ({ checked, onToggle }) => (
  <TouchableOpacity
    style={[styles.checkbox, checked && styles.checkboxChecked]}
    onPress={onToggle}
  >
    {checked && <Text style={styles.checkmark}>✓</Text>}
  </TouchableOpacity>
);

// ItemStatusBadge sub-component
const ItemStatusBadge = ({ label }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

export default function GroceryItemRow({ name, quantity, isChecked, onToggle, onEdit, statusLabel }) {
  return (
    <View style={styles.row}>
      <Checkbox checked={isChecked} onToggle={onToggle} />
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, isChecked && styles.nameChecked]}>{name}</Text>
          {statusLabel && <ItemStatusBadge label={statusLabel} />}
        </View>
        <Text style={[styles.qty, isChecked && styles.qtyChecked]}>{quantity}</Text>
      </View>
      <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.editIcon}>✎</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxChecked: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  checkmark: { fontSize: 14, color: '#fff', fontWeight: '800' },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  name: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  nameChecked: { textDecorationLine: 'line-through', color: '#9E9E9E' },
  qty: { fontSize: 13, color: '#6B7280' },
  qtyChecked: { color: '#BDBDBD' },
  badge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#F57C00' },
  editIcon: { fontSize: 18, color: '#BDBDBD' },
});
