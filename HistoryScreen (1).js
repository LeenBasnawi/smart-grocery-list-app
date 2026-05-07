// screens/shahd/HistoryScreen.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import TabSwitcher from '../../components/shahd/TabSwitcher';
import HistoryItemCard from '../../components/shahd/HistoryItemCard';
import SecondaryButton from '../../components/shahd/SecondaryButton';

const TABS = ['Frequently Bought', 'Favorites'];

export default function HistoryScreen() {
  const { historyItems } = useAppContext();
  const [activeTab, setActiveTab] = useState('Frequently Bought');
  const [favorites, setFavorites] = useState(
    historyItems.reduce((acc, item) => ({ ...acc, [item.id]: item.isFavorite }), {})
  );

  const displayItems = activeTab === 'Favorites'
    ? historyItems.filter((item) => favorites[item.id])
    : historyItems;

  const handleToggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToList = (item) => {
    Alert.alert('Added!', `"${item.name}" has been added to your current list.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={displayItems}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Text style={styles.pageTitle}>History & Saved Items</Text>
            <TabSwitcher
              tabs={TABS}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </>
        }
        renderItem={({ item }) => (
          <HistoryItemCard
            item={item}
            isFavorite={favorites[item.id]}
            onFavoriteToggle={handleToggleFavorite}
            onAdd={handleAddToList}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyText}>No items here yet.</Text>
          </View>
        }
        ListFooterComponent={
          displayItems.length > 0 ? (
            <SecondaryButton
              label="Clear History"
              onPress={() => Alert.alert('Clear History', 'History cleared!')}
              style={styles.clearBtn}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2E7D32',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#9E9E9E' },
  clearBtn: { borderRadius: 50, marginTop: 6 },
});
