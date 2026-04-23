// screens/asayel/SmartSuggestionsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Switch,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';

// ── Suggestion Card ────────────────────────────────────────────────────────────
const SuggestionCard = ({ item, onAdd, onChangeQty }) => (
  <View style={styles.card}>
    <View style={styles.cardImagePlaceholder}>
      <Text style={styles.cardEmoji}>
        {item.tags?.includes('dairy') ? '🥛'
          : item.tags?.includes('produce') ? '🥑'
          : item.tags?.includes('bakery') ? '🍞'
          : item.tags?.includes('meat') ? '🍗'
          : '🛒'}
      </Text>
    </View>
    <View style={styles.cardBody}>
      <View style={styles.cardTitleRow}>
        <Text style={styles.productName}>{item.name}</Text>
        {item.status === 'RUNNING LOW' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>RUNNING LOW</Text>
          </View>
        )}
      </View>
      <Text style={styles.usageNote}>{item.usageNote}</Text>
      <View style={styles.qtyRow}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => onChangeQty(item.id, -1)}
        >
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{item.quantity}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => onChangeQty(item.id, 1)}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
    <TouchableOpacity style={styles.addBtn} onPress={() => onAdd(item)}>
      <Text style={styles.addBtnText}>+ Add</Text>
    </TouchableOpacity>
  </View>
);

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function SmartSuggestionsScreen({ navigation }) {
  const {
    suggestions,
    householdSize,
    setHouseholdSize,
    includeExpiringSoon,
    setIncludeExpiringSoon,
    addToGroceryList,
  } = useAppContext();

  // local quantity state (overrides context quantity for UI only)
  const [quantities, setQuantities] = useState({});

  const getQty = (id, base) => quantities[id] ?? base;

  const handleChangeQty = (id, delta) => {
    setQuantities((prev) => {
      const base = suggestions.find((s) => s.id === id)?.quantity ?? 1;
      const current = prev[id] ?? base;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleAdd = (item) => {
    addToGroceryList({
      id: item.id,
      name: item.name,
      quantity: getQty(item.id, item.quantity),
      unit: 'unit',
      category: item.tags?.[0] ?? 'general',
      expiryDate: null,
      notes: '',
    });
    Alert.alert('Added!', `${item.name} added to your grocery list.`);
  };

  const handleAddAll = () => {
    suggestions.forEach((item) => {
      addToGroceryList({
        id: item.id,
        name: item.name,
        quantity: getQty(item.id, item.quantity),
        unit: 'unit',
        category: item.tags?.[0] ?? 'general',
        expiryDate: null,
        notes: '',
      });
    });
    Alert.alert('Done!', 'All suggestions added to your grocery list!');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Suggestions</Text>
      </View>

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Title */}
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>Suggested for{'\n'}Next Week</Text>
              <Text style={styles.subtitle}>
                Based on your shopping habits and usage patterns
              </Text>
            </View>

            {/* Controls */}
            <View style={styles.controlsCard}>
              <View style={styles.controlRow}>
                <View>
                  <Text style={styles.controlLabel}>Household Size</Text>
                  <Text style={styles.controlSub}>Adjusts portion logic</Text>
                </View>
                <View style={styles.counterRow}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => setHouseholdSize(Math.max(1, householdSize - 1))}
                  >
                    <Text style={styles.counterBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{householdSize}</Text>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => setHouseholdSize(householdSize + 1)}
                  >
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>Include items expiring soon</Text>
                <Switch
                  value={includeExpiringSoon}
                  onValueChange={setIncludeExpiringSoon}
                  trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
                  thumbColor={includeExpiringSoon ? '#2E7D32' : '#BDBDBD'}
                />
              </View>
            </View>

            {/* Section label */}
            <Text style={styles.sectionLabel}>HIGHLY RECOMMENDED</Text>

            {suggestions.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🎯</Text>
                <Text style={styles.emptyText}>
                  No suggestions match your current dietary preferences.
                </Text>
                <TouchableOpacity
                  style={styles.prefLink}
                  onPress={() => navigation?.navigate('DietaryGoals')}
                >
                  <Text style={styles.prefLinkText}>Adjust Preferences →</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <SuggestionCard
            item={{ ...item, quantity: getQty(item.id, item.quantity) }}
            onAdd={handleAdd}
            onChangeQty={handleChangeQty}
          />
        )}
        ListFooterComponent={
          suggestions.length > 0 ? (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.tuneBtn}
                onPress={() => navigation?.navigate('DietaryGoals')}
              >
                <Text style={styles.tuneBtnText}>⚙ Tune Preferences</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addAllBtn} onPress={handleAddAll}>
                <Text style={styles.addAllBtnText}>✦ Add All to List</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  backArrow: { fontSize: 22, color: '#2E7D32', marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2E7D32' },

  listContent: { paddingBottom: 32 },

  titleSection: { padding: 20 },
  mainTitle: { fontSize: 28, fontWeight: '800', color: '#212121', lineHeight: 34 },
  subtitle: { fontSize: 13, color: '#757575', marginTop: 6 },

  controlsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLabel: { fontSize: 15, fontWeight: '600', color: '#212121' },
  controlSub: { fontSize: 12, color: '#9E9E9E', marginTop: 2 },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  counterBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnText: { fontSize: 18, color: '#212121', fontWeight: '700' },
  counterValue: { fontSize: 18, fontWeight: '700', color: '#212121', minWidth: 24, textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 14 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 1.2,
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  emptyState: { alignItems: 'center', padding: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { textAlign: 'center', color: '#757575', fontSize: 14, marginBottom: 16 },
  prefLink: { padding: 10 },
  prefLinkText: { color: '#2E7D32', fontWeight: '700', fontSize: 14 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImagePlaceholder: {
    width: 56,
    height: 56,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardEmoji: { fontSize: 28 },
  cardBody: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  productName: { fontSize: 15, fontWeight: '700', color: '#212121', flexShrink: 1 },
  statusBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: { fontSize: 10, color: '#E65100', fontWeight: '800' },
  usageNote: { fontSize: 12, color: '#757575', marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 26,
    height: 26,
    backgroundColor: '#F5F5F5',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: '#212121' },
  qtyValue: { fontSize: 16, fontWeight: '700', color: '#212121', minWidth: 20, textAlign: 'center' },
  addBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 8,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  footer: { padding: 20, gap: 14 },
  tuneBtn: { alignItems: 'center', paddingVertical: 10 },
  tuneBtnText: { color: '#E65100', fontWeight: '700', fontSize: 14 },
  addAllBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addAllBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
