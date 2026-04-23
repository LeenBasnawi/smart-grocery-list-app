// Final review: all screens connected to AppContext — Remas
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';

const CATEGORIES = [
  'Dairy', 'Produce', 'Meat', 'Pantry', 'Bakery',
  'Frozen', 'Beverages', 'Snacks', 'Household', 'Other',
];

const UNITS = ['kg', 'g', 'lb', 'oz', 'l', 'ml', 'cup', 'unit', 'pack', 'dozen'];

// ── Dropdown Modal ─────────────────────────────────────────────────────────────
const DropdownModal = ({ visible, options, onSelect, onClose, title }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>{title}</Text>
        <FlatList
          data={options}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => { onSelect(item); onClose(); }}
            >
              <Text style={styles.modalOptionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </TouchableOpacity>
  </Modal>
);

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function AddEditItemScreen({ route, navigation }) {
  const { addToGroceryList, updateGroceryItem, removeFromGroceryList } = useAppContext();

  // If editing, receive existing item via route params
  const existingItem = route?.params?.item ?? null;
  const isEditing = !!existingItem;

  const [itemName, setItemName] = useState(existingItem?.name ?? '');
  const [quantity, setQuantity] = useState(existingItem?.quantity?.toString() ?? '');
  const [unit, setUnit] = useState(existingItem?.unit ?? 'kg');
  const [category, setCategory] = useState(existingItem?.category ?? '');
  const [expiryDate, setExpiryDate] = useState(existingItem?.expiryDate ?? '');
  const [notes, setNotes] = useState(existingItem?.notes ?? '');

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!itemName.trim()) e.itemName = 'Item name is required.';
    if (!quantity.trim() || isNaN(Number(quantity))) e.quantity = 'Enter a valid quantity.';
    if (!category) e.category = 'Please select a category.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const item = {
      id: existingItem?.id ?? `item_${Date.now()}`,
      name: itemName.trim(),
      quantity: parseFloat(quantity),
      unit,
      category,
      expiryDate: expiryDate.trim() || null,
      notes: notes.trim(),
    };

    if (isEditing) {
      updateGroceryItem(item.id, item);
      Alert.alert('Updated!', `${item.name} has been updated.`, [
        { text: 'OK', onPress: () => navigation?.goBack() },
      ]);
    } else {
      addToGroceryList(item);
      Alert.alert('Added!', `${item.name} added to your grocery list.`, [
        { text: 'OK', onPress: () => navigation?.goBack() },
      ]);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      `Remove "${itemName}" from your list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeFromGroceryList(existingItem.id);
            navigation?.goBack();
          },
        },
      ]
    );
  };

  const handleScanOrLookup = () => {
    Alert.alert(
      'Scan or Lookup',
      'Would you like to scan a barcode or search by name?',
      [
        { text: 'Scan Barcode', onPress: () => setItemName('Chicken Breast') },
        { text: 'Search Product', onPress: () => navigation?.navigate('ProductLookup') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Item' : 'Add Item'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          {/* Item Name */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Item Name</Text>
            <TouchableOpacity style={styles.scanBtn} onPress={handleScanOrLookup}>
              <Text style={styles.scanBtnText}>⫼ Scan or Lookup</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, errors.itemName && styles.inputError]}
            placeholder="Enter item name"
            placeholderTextColor="#BDBDBD"
            value={itemName}
            onChangeText={setItemName}
          />
          {errors.itemName && <Text style={styles.errorMsg}>{errors.itemName}</Text>}

          {/* Quantity + Unit */}
          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Quantity</Text>
              <TextInput
                style={[styles.input, errors.quantity && styles.inputError]}
                placeholder="e.g. 1"
                placeholderTextColor="#BDBDBD"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
              {errors.quantity && <Text style={styles.errorMsg}>{errors.quantity}</Text>}
            </View>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Unit</Text>
              <TouchableOpacity
                style={styles.dropdownInput}
                onPress={() => setShowUnitModal(true)}
              >
                <Text style={styles.dropdownText}>{unit}</Text>
                <Text style={styles.dropdownArrow}>⌄</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Category */}
          <Text style={styles.fieldLabel}>Category</Text>
          <TouchableOpacity
            style={[styles.dropdownInput, errors.category && styles.inputError, { marginBottom: 4 }]}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={[styles.dropdownText, !category && { color: '#BDBDBD' }]}>
              {category || 'Select Category'}
            </Text>
            <Text style={styles.dropdownArrow}>⚙</Text>
          </TouchableOpacity>
          {errors.category && <Text style={styles.errorMsg}>{errors.category}</Text>}

          {/* Expiry Date */}
          <Text style={styles.fieldLabel}>
            Expiry Date <Text style={styles.optional}>(Optional)</Text>
          </Text>
          <View style={styles.dateInputRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="mm/dd/yyyy"
              placeholderTextColor="#BDBDBD"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
            <Text style={styles.calendarIcon}>📅</Text>
          </View>

          {/* Notes */}
          <Text style={styles.fieldLabel}>
            Notes <Text style={styles.optional}>(Optional)</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Add notes (optional)"
            placeholderTextColor="#BDBDBD"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>💾 Save Item</Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>🗑 Delete Item</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modals */}
      <DropdownModal
        visible={showCategoryModal}
        options={CATEGORIES}
        onSelect={setCategory}
        onClose={() => setShowCategoryModal(false)}
        title="Select Category"
      />
      <DropdownModal
        visible={showUnitModal}
        options={UNITS}
        onSelect={setUnit}
        onClose={() => setShowUnitModal(false)}
        title="Select Unit"
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

  scrollContent: { padding: 16, paddingBottom: 40 },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#424242', marginBottom: 6, marginTop: 12 },
  optional: { fontWeight: '400', color: '#9E9E9E' },

  scanBtn: {
    borderWidth: 1.5,
    borderColor: '#E65100',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  scanBtnText: { color: '#E65100', fontSize: 12, fontWeight: '700' },

  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#212121',
    marginBottom: 4,
  },
  inputError: { borderWidth: 1.5, borderColor: '#C62828' },
  errorMsg: { fontSize: 12, color: '#C62828', marginBottom: 4 },

  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },

  dropdownInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dropdownText: { fontSize: 15, color: '#212121' },
  dropdownArrow: { fontSize: 16, color: '#757575' },

  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  calendarIcon: { fontSize: 22 },

  notesInput: { height: 100, paddingTop: 12 },

  saveBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  deleteBtn: {
    borderWidth: 1.5,
    borderColor: '#E65100',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteBtnText: { color: '#E65100', fontWeight: '700', fontSize: 15 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '80%',
    maxHeight: '60%',
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionText: { fontSize: 15, color: '#212121' },
});
