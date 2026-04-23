// screens/asayel/DietaryGoalsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';

// ── Toggle Row ─────────────────────────────────────────────────────────────────
const ToggleRow = ({ label, value, onChange }) => (
  <View style={styles.toggleRow}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
      thumbColor={value ? '#2E7D32' : '#BDBDBD'}
    />
  </View>
);

// ── Counter Row ────────────────────────────────────────────────────────────────
const CounterRow = ({ label, value, onDecrement, onIncrement, min = 1 }) => (
  <View style={styles.counterRow}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <View style={styles.counter}>
      <TouchableOpacity
        style={styles.counterBtn}
        onPress={onDecrement}
        disabled={value <= min}
      >
        <Text style={[styles.counterBtnText, value <= min && { color: '#BDBDBD' }]}>−</Text>
      </TouchableOpacity>
      <Text style={styles.counterValue}>{value}</Text>
      <TouchableOpacity style={styles.counterBtn} onPress={onIncrement}>
        <Text style={styles.counterBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function DietaryGoalsScreen({ navigation }) {
  const { userPreferences, setUserPreferences } = useAppContext();

  // Local copy — only commits to context on Save
  const [localPrefs, setLocalPrefs] = useState({ ...userPreferences });

  const setGoal = (key, value) =>
    setLocalPrefs((p) => ({
      ...p,
      healthGoals: { ...p.healthGoals, [key]: value },
    }));

  const setAllergy = (key, value) =>
    setLocalPrefs((p) => ({
      ...p,
      allergies: { ...p.allergies, [key]: value },
    }));

  const setMeal = (key, delta) =>
    setLocalPrefs((p) => ({
      ...p,
      mealPlanning: {
        ...p.mealPlanning,
        [key]: Math.max(1, p.mealPlanning[key] + delta),
      },
    }));

  const handleSave = () => {
    setUserPreferences(localPrefs);
    Alert.alert(
      'Preferences Saved!',
      'Your Smart Suggestions will update to match your dietary goals.',
      [{ text: 'OK', onPress: () => navigation?.goBack() }]
    );
  };

  const handleReset = () => {
    Alert.alert('Reset Preferences', 'This will restore all defaults.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          const defaults = {
            healthGoals: {
              highProtein: false,
              lowSugar: false,
              highFiber: false,
              lowSalt: false,
            },
            allergies: { lactoseIntolerance: false, glutenSensitivity: false },
            mealPlanning: { mealsPerDay: 3, snackFrequency: 1 },
          };
          setLocalPrefs(defaults);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dietary Goals & Preferences</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Health Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Goals</Text>
          <ToggleRow
            label="High Protein"
            value={localPrefs.healthGoals.highProtein}
            onChange={(v) => setGoal('highProtein', v)}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Low Sugar"
            value={localPrefs.healthGoals.lowSugar}
            onChange={(v) => setGoal('lowSugar', v)}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="High Fiber"
            value={localPrefs.healthGoals.highFiber}
            onChange={(v) => setGoal('highFiber', v)}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Low Salt"
            value={localPrefs.healthGoals.lowSalt}
            onChange={(v) => setGoal('lowSalt', v)}
          />
        </View>

        {/* Allergies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies & Restrictions</Text>
          <ToggleRow
            label="Lactose Intolerance"
            value={localPrefs.allergies.lactoseIntolerance}
            onChange={(v) => setAllergy('lactoseIntolerance', v)}
          />
          <View style={styles.divider} />
          <ToggleRow
            label="Gluten Sensitivity"
            value={localPrefs.allergies.glutenSensitivity}
            onChange={(v) => setAllergy('glutenSensitivity', v)}
          />
          <Text style={styles.helperText}>
            These preferences will filter smart suggestions.
          </Text>
        </View>

        {/* Meal Planning */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Planning</Text>
          <CounterRow
            label="Meals per day"
            value={localPrefs.mealPlanning.mealsPerDay}
            onDecrement={() => setMeal('mealsPerDay', -1)}
            onIncrement={() => setMeal('mealsPerDay', 1)}
          />
          <View style={styles.divider} />
          <CounterRow
            label="Snack frequency"
            value={localPrefs.mealPlanning.snackFrequency}
            onDecrement={() => setMeal('snackFrequency', -1)}
            onIncrement={() => setMeal('snackFrequency', 1)}
          />
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Text style={styles.resetBtnText}>Reset to Default</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#2E7D32', flex: 1 },

  scrollContent: { padding: 16, paddingBottom: 40 },

  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#212121', marginBottom: 14 },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleLabel: { fontSize: 15, color: '#212121', fontWeight: '500' },

  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  counter: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  counterBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnText: { fontSize: 18, fontWeight: '700', color: '#2E7D32' },
  counterValue: { fontSize: 18, fontWeight: '700', color: '#212121', minWidth: 24, textAlign: 'center' },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },
  helperText: { fontSize: 12, color: '#9E9E9E', marginTop: 10 },

  saveBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  resetBtn: {
    borderWidth: 1.5,
    borderColor: '#E65100',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetBtnText: { color: '#E65100', fontWeight: '700', fontSize: 15 },
});
