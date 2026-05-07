import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';

import { useAppContext } from '../Context/AppContext';
import AppHeader from '../components/AppHeader';
import { SearchBar } from '../components/AppInputs';
import { PrimaryButton, SecondaryButton } from '../components/AppButtons';
import { ProductResultCard } from '../components/AppCards';
import { searchProducts, lookupProductByBarcode } from '../services/productApi';
import { COLORS } from '../constants/theme';

export default function ProductLookupScreen({ navigation, route }) {
  const { addToGroceryList, selectedListId } = useAppContext();

  const listId = route?.params?.listId || selectedListId;
  const listTitle = route?.params?.listTitle;
  const scannedCode = route?.params?.scannedCode;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [lastMode, setLastMode] = useState('search');

  const normalizeCategory = (category) => {
    const text = String(category || '').toLowerCase();

    if (
      text.includes('dairy') ||
      text.includes('milk') ||
      text.includes('egg')
    ) {
      return 'Dairy';
    }

    if (text.includes('meat') || text.includes('chicken')) {
      return 'Meat';
    }

    return 'Vegetables';
  };

  const runNameSearch = useCallback(
    async (customQuery) => {
      const searchTerm = (customQuery ?? query).trim();

      if (!searchTerm) {
        Alert.alert('Missing Search', 'Please enter a product name.');
        return;
      }

      setLastMode('search');
      setLoading(true);
      setError(null);
      setSearched(true);

      try {
        const data = await searchProducts(searchTerm);
        setResults(data);
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  const runBarcodeLookup = useCallback(async (barcode) => {
    if (!barcode) return;

    setLastMode('barcode');
    setLoading(true);
    setError(null);
    setSearched(true);
    setQuery(barcode);

    try {
      const product = await lookupProductByBarcode(barcode);
      setResults([product]);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (scannedCode) {
      runBarcodeLookup(scannedCode);
    }
  }, [scannedCode, runBarcodeLookup]);

  const handleBarcode = () => {
    navigation.navigate('BarcodeScanner', {
      listId,
      listTitle,
    });
  };

  const handleAdd = (item) => {
    addToGroceryList({
      id: `product_${item.id}_${Date.now()}`,
      listId,
      name: item.name,
      quantity: 1,
      unit: item.size || 'unit',
      category: normalizeCategory(item.category),
      expiryDate: null,
      notes: item.barcode ? `Barcode: ${item.barcode}` : '',
    });

    Alert.alert('Added!', `${item.name} added to your grocery list.`);
  };

  const handleSelect = (item) => {
    navigation.navigate('AddEditItem', {
      listId,
      listTitle,
      item: {
        id: `product_${item.id}_${Date.now()}`,
        listId,
        name: item.name,
        quantity: 1,
        unit: item.size || 'unit',
        category: normalizeCategory(item.category),
        expiryDate: '',
        notes: item.barcode ? `Barcode: ${item.barcode}` : '',
      },
    });
  };

  const handleRetry = () => {
    if (lastMode === 'barcode') {
      runBarcodeLookup(query);
    } else {
      runNameSearch();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Product Lookup" navigation={navigation} />

      <View style={styles.searchSection}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search milk, egg, chicken..."
        />

        <View style={styles.gap} />

        <PrimaryButton label="Search" onPress={() => runNameSearch()} />

        <View style={styles.gap} />

        <SecondaryButton label="⫼ Scan via Barcode" onPress={handleBarcode} />
      </View>

      {searched && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsLabel}>Results</Text>

          {!loading && !error && (
            <Text style={styles.resultsCount}>
              {results.length} {results.length === 1 ? 'ITEM FOUND' : 'ITEMS FOUND'}
            </Text>
          )}
        </View>
      )}

      {loading && (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Searching products...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerState}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && searched && results.length === 0 && (
        <View style={styles.centerState}>
          <Text style={styles.emptyIcon}>🔎</Text>
          <Text style={styles.emptyText}>No matching products found.</Text>
        </View>
      )}

      {!loading && !error && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductResultCard
              item={item}
              onAdd={handleAdd}
              onSelect={handleSelect}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  searchSection: {
    backgroundColor: COLORS.background,
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 18 : 16,
    marginBottom: 8,
  },
  gap: {
    height: 10,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resultsLabel: {
    color: COLORS.primaryText,
    fontSize: 18,
    fontWeight: '800',
  },
  resultsCount: {
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: '700',
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.secondaryText,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '800',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.secondaryText,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});