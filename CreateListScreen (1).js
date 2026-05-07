// screens/shahd/CreateListScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  StyleSheet, SafeAreaView, Switch, Alert,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import TopBar from '../../components/shahd/TopBar';
import PrimaryButton from '../../components/shahd/PrimaryButton';
import SecondaryButton from '../../components/shahd/SecondaryButton';
import CategoryChip from '../../components/shahd/CategoryChip';
import ColorPickerCircle from '../../components/shahd/ColorPickerCircle';
import IconSelectorButton from '../../components/shahd/IconSelectorButton';

const CATEGORIES = ['Grocery', 'Household', 'Meat', 'Vegetables', 'Bakery', 'Dairy'];
const COLORS = ['#2E7D32', '#F57C00', '#1565C0', '#7B1FA2', '#9E9E9E'];
const ICONS = ['🛒', '🧺', '🍎', '🏠', '🏪'];

export default function CreateListScreen({ navigation }) {
  const { addGroceryList } = useAppContext();
  const [listName, setListName] = useState('Weekly Shopping List');
  const [storeName, setStoreName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Grocery');
  const [selectedColor, setSelectedColor] = useState('#2E7D32');
  const [selectedIcon, setSelectedIcon] = useState('🛒');
  const [isShared, setIsShared] = useState(false);

  const handleCreate = () => {
    if (!listName.trim()) { Alert.alert('Error', 'Please enter a list name.'); return; }
    const newList = {
      id: `list_${Date.now()}`,
      name: listName.trim(),
      storeName: storeName.trim(),
      category: selectedCategory,
      color: selectedColor,
      icon: selectedIcon,
      isShared,
      isUrgent: false,
      itemCount: 0,
      categories: [selectedIcon],
      extraCategories: 0,
    };
    addGroceryList(newList);
    Alert.alert('Success!', `"${newList.name}" created.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar title="Create New List" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* List Name */}
        <Text style={styles.fieldLabel}>List Name</Text>
        <TextInput
          style={styles.input}
          value={listName}
          onChangeText={setListName}
          placeholder="Enter list name"
          placeholderTextColor="#BDBDBD"
        />

        {/* Store Name */}
        <Text style={styles.fieldLabel}>Store Name (optional)</Text>
        <TextInput
          style={styles.input}
          value={storeName}
          onChangeText={setStoreName}
          placeholder="Enter store name"
          placeholderTextColor="#BDBDBD"
        />

        {/* Category */}
        <Text style={styles.fieldLabel}>Select Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              isSelected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
            />
          ))}
        </ScrollView>

        {/* Color */}
        <Text style={styles.fieldLabel}>Choose Color</Text>
        <View style={styles.colorRow}>
          {COLORS.map((color) => (
            <ColorPickerCircle
              key={color}
              color={color}
              isSelected={selectedColor === color}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>

        {/* Icon */}
        <Text style={styles.fieldLabel}>Choose Icon</Text>
        <View style={styles.iconRow}>
          {ICONS.map((icon) => (
            <IconSelectorButton
              key={icon}
              icon={icon}
              isSelected={selectedIcon === icon}
              onPress={() => setSelectedIcon(icon)}
            />
          ))}
        </View>

        {/* Share Toggle */}
        <View style={styles.shareRow}>
          <View style={styles.shareIconContainer}>
            <Text style={styles.shareIconEmoji}>👥</Text>
          </View>
          <Text style={styles.shareLabel}>Share this list with others</Text>
          <Switch
            value={isShared}
            onValueChange={setIsShared}
            trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
            thumbColor={isShared ? '#2E7D32' : '#BDBDBD'}
          />
        </View>

        <PrimaryButton label="Create List" onPress={handleCreate} style={styles.createBtn} />
        <SecondaryButton label="Cancel" onPress={() => navigation.goBack()} style={styles.cancelBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 10, marginTop: 16 },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#fff',
  },
  chipRow: { gap: 10, paddingBottom: 4 },
  colorRow: { flexDirection: 'row', gap: 14, marginTop: 4 },
  iconRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 14,
    padding: 14,
    marginTop: 24,
    gap: 12,
  },
  shareIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIconEmoji: { fontSize: 18 },
  shareLabel: { flex: 1, fontSize: 15, color: '#424242', fontWeight: '500' },
  createBtn: { marginTop: 28 },
  cancelBtn: { marginTop: 12 },
});
