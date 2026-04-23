// screens/asayel/ProductLookupScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';

// ── Fake product API (replace with real endpoint) ─────────────────────────────
const searchProducts = async (query) => {
  await new Promise((res) => setTimeout(res, 900)); // simulate latency

  const MOCK_DB = [
    {
      id: 'p1',
      name: 'Organic Whole Milk',
      brand: 'Horizon',
      size: '64 fl oz',
      category: 'DAIRY',
      badge: 'Best Seller',
      image: 'https://via.placeholder.com/80x80/e8f5e9/388e3c?text=🥛',
    },
    {
      id: 'p2',
      name: 'Hass Avocados',
      brand: 'Fresh Farm',
      size: '2 ct',
      category: 'PRODUCE',
      badge: 'In stock nearby',
      image: 'https://via.placeholder.com/80x80/e8f5e9/388e3c?text=🥑',
    },
    {
      id: 'p3',
      name: 'Steel Cut Oats',
      brand: "Bob's Mill",
      size: '24 oz',
      category: 'PANTRY',
      badge: 'Limited availability',
      image: 'https://via.placeholder.com/80x80/e8f5e9/388e3c?text=🌾',
    },
    {
      id: 'p4',
      name: 'Chicken Breast',
      brand: 'Nature Farm',
      size: '1 kg',
      category: 'MEAT',
      badge: null,
      image: 'https://via.placeholder.com/80x80/e8f5e9/388e3c?text=🍗',
    },
    {
      id: 'p5',
      name: 'Greek Yogurt',
      brand: 'Chobani',
      size: '32 oz',
      category: 'DAIRY',
      badge: 'Best Seller',
      image: 'https://via.placeholder.com/80x80/e8f5e9/388e3c?text=🫙',
    },
  ];

  if (!query.trim()) throw new Error('Please enter a product name.');

  const results = MOCK_DB.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  if (results.length === 0) throw new Error('No products found.');
  return results;
};

// ── Badge color helper ─────────────────────────────────────────────────────────
const badgeColor = (badge) => {
  if (!badge) return null;
  if (badge === 'Best Seller') return '#E65100';
  if (badge.includes('Limited')) return '#BF360C';
  return '#2E7D32';
};

// ── Single product card ────────────────────────────────────────────────────────
const ProductCard = ({ item, onAdd }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.productImage} />
    <View style={styles.cardBody}>
      <View style={styles.categoryPill}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productMeta}>
        {item.brand} • {item.size}
      </Text>
      {item.badge && (
        <Text style={[styles.badge, { color: badgeColor(item.badge) }]}>
          ⊙ {item.badge}
        </Text>
      )}
    </View>
    <View style={styles.cardActions}>
      <TouchableOpacity style={styles.btnOutline}>
        <Text style={styles.btnOutlineText}>Select</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnFilled} onPress={() => onAdd(item)}>
        <Text style={styles.btnFilledText}>Add to List</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function ProductLookupScreen({ navigation }) {
  const { addToGroceryList } = useAppContext();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await searchProducts(query);
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleBarcode = () => {
    // Device feature: barcode scan
    // Real implementation: use expo-barcode-scanner
    Alert.alert(
      'Barcode Scanner',
      'Camera would open here.\n\n(Requires expo-barcode-scanner)',
      [
        {
          text: 'Simulate Scan',
          onPress: () => {
            setQuery('Organic Whole Milk');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAdd = (item) => {
    addToGroceryList({
      id: item.id,
      name: item.name,
      quantity: 1,
      unit: item.size,
      category: item.category,
      expiryDate: null,
      notes: '',
    });
    Alert.alert('Added!', `${item.name} added to your grocery list.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Lookup</Text>
      </View>

      {/* Search Box */}
      <View style={styles.searchSection}>
        <View style={styles.inputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Search product by name..."
            placeholderTextColor="#9E9E9E"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.barcodeBtn} onPress={handleBarcode}>
          <Text style={styles.barcodeBtnText}>⫼ Scan via Barcode</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {searched && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsLabel}>Results</Text>
          {!loading && !error && (
            <Text style={styles.resultsCount}>{results.length} ITEMS FOUND</Text>
          )}
        </View>
      )}

      {loading && (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Searching products...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerState}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleSearch}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard item={item} onAdd={handleAdd} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  backArrow: { fontSize: 22, color: '#2E7D32', marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2E7D32' },

  searchSection: { backgroundColor: '#fff', padding: 16, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#212121' },
  searchBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  barcodeBtn: {
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeBtnText: { color: '#2E7D32', fontWeight: '600', fontSize: 15 },

  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resultsLabel: { fontSize: 18, fontWeight: '700', color: '#212121' },
  resultsCount: { fontSize: 12, color: '#757575', fontWeight: '600' },

  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadingText: { marginTop: 12, color: '#757575', fontSize: 14 },
  errorIcon: { fontSize: 40, marginBottom: 8 },
  errorText: { fontSize: 15, color: '#C62828', textAlign: 'center', marginBottom: 16 },
  retryBtn: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: '#fff', fontWeight: '700' },

  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  productImage: { width: 80, height: 80, borderRadius: 10, marginBottom: 8 },
  cardBody: { flex: 1, marginBottom: 10 },
  categoryPill: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  categoryText: { fontSize: 11, color: '#2E7D32', fontWeight: '700' },
  productName: { fontSize: 16, fontWeight: '700', color: '#212121', marginBottom: 2 },
  productMeta: { fontSize: 13, color: '#757575', marginBottom: 4 },
  badge: { fontSize: 12, fontWeight: '600' },
  cardActions: { flexDirection: 'row', gap: 10 },
  btnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOutlineText: { color: '#2E7D32', fontWeight: '600', fontSize: 14 },
  btnFilled: {
    flex: 1,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnFilledText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
