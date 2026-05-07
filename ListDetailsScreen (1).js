// screens/shahd/ListDetailsScreen.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import TopBar from '../../components/shahd/TopBar';
import SearchBar from '../../components/shahd/SearchBar';
import CategoryChip from '../../components/shahd/CategoryChip';
import GroceryItemRow from '../../components/shahd/GroceryItemRow';
import FloatingActionButton from '../../components/shahd/FloatingActionButton';

const FILTER_TABS = ['All', 'Vegetables', 'Meat', 'Dairy'];

export default function ListDetailsScreen({ route, navigation }) {
  const { listId = 'list_1', listName = 'Weekly Shopping' } = route?.params ?? {};
  const { listItems, toggleListItem } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const items = listItems[listId] ?? [];

  const filteredItems = items.filter((item) => {
    const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group by category
  const grouped = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const sections = Object.entries(grouped);

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        title={listName}
        onBack={() => navigation.goBack()}
        rightIcon="⎘"
        onRightPress={() => navigation.navigate('SharedMembers', { listId, listName })}
      />

      {/* Search */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search items..."
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map((tab) => (
          <CategoryChip
            key={tab}
            label={tab}
            isSelected={activeFilter === tab}
            onPress={() => setActiveFilter(tab)}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>✦ Smart Suggest</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>⫼ Scan or Lookup</Text>
        </TouchableOpacity>
      </View>

      {/* Items */}
      <FlatList
        data={[{ key: 'content' }]}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={() => (
          <>
            {sections.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyText}>No items found.</Text>
              </View>
            ) : (
              sections.map(([category, data]) => (
                <View key={category}>
                  {/* SelectionHeader */}
                  <Text style={styles.sectionHeader}>
                    {category.toUpperCase()} ({data.length})
                  </Text>
                  {data.map((item) => (
                    <GroceryItemRow
                      key={item.id}
                      name={item.name}
                      quantity={item.quantity}
                      isChecked={item.checked}
                      onToggle={() => toggleListItem(listId, item.id)}
                      onEdit={() => {}}
                      statusLabel={item.expiry}
                    />
                  ))}
                </View>
              ))
            )}
          </>
        )}
      />

      <FloatingActionButton onPress={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  searchWrap: { paddingHorizontal: 16, marginBottom: 12 },
  filterRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 14 },
  actionBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#F57C00',
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnText: { fontSize: 13, fontWeight: '700', color: '#F57C00' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 6,
  },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#9E9E9E' },
});
