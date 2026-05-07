// components/shahd/ListCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Badge shown on card (e.g. URGENT)
const Badge = ({ label }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

// Small category icons row on card
const CategoryPreview = ({ icons, extra, categoryLabel }) => (
  <View style={styles.categoryRow}>
    {icons.map((icon, idx) => (
      <View key={idx} style={styles.categoryIcon}>
        <Text style={styles.categoryEmoji}>{icon}</Text>
      </View>
    ))}
    {extra > 0 && <Text style={styles.extraText}>+{extra} categories</Text>}
    {extra === 0 && categoryLabel !== '' && (
      <Text style={styles.categoryLabel}>{categoryLabel}</Text>
    )}
  </View>
);

export default function ListCard({ list, onPress, onEdit }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{list.name}</Text>
          {list.isUrgent && <Badge label="URGENT" />}
        </View>
        <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.editIcon}>✎</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.itemCount}>{list.itemCount} items</Text>

      <CategoryPreview
        icons={list.categories}
        extra={list.extraCategories}
        categoryLabel={list.category}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  title: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  badge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#F57C00' },
  editIcon: { fontSize: 20, color: '#9E9E9E' },
  itemCount: { fontSize: 13, color: '#6B7280', marginBottom: 14 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoryIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEmoji: { fontSize: 16 },
  extraText: { fontSize: 13, color: '#9E9E9E', marginLeft: 4 },
  categoryLabel: { fontSize: 13, color: '#F57C00', marginLeft: 6 },
});
