import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';

import { useAppContext } from '../Context/AppContext';
import AppHeader from '../components/AppHeader';
import { PrimaryButton, SecondaryButton } from '../components/AppButtons';
import { PreferenceToggleRow, CounterRow, Divider } from '../components/AppControls';
import { SettingsCard } from '../components/AppCards';
import { COLORS } from '../constants/theme';

export default function DietaryGoalsScreen({ navigation }) {
  const { userPreferences, setUserPreferences } = useAppContext();
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
          setLocalPrefs({
            healthGoals: {
              highProtein: false,
              lowSugar: false,
              highFiber: false,
              lowSalt: false,
            },
            allergies: {
              lactoseIntolerance: false,
              glutenSensitivity: false,
            },
            mealPlanning: {
              mealsPerDay: 3,
              snackFrequency: 1,
            },
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Dietary Goals & Preferences" navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SettingsCard>
          <Text style={styles.sectionTitle}>Health Goals</Text>

          <PreferenceToggleRow
            label="High Protein"
            value={localPrefs.healthGoals.highProtein}
            onToggle={(v) => setGoal('highProtein', v)}
          />
          <Divider />

          <PreferenceToggleRow
            label="Low Sugar"
            value={localPrefs.healthGoals.lowSugar}
            onToggle={(v) => setGoal('lowSugar', v)}
          />
          <Divider />

          <PreferenceToggleRow
            label="High Fiber"
            value={localPrefs.healthGoals.highFiber}
            onToggle={(v) => setGoal('highFiber', v)}
          />
          <Divider />

          <PreferenceToggleRow
            label="Low Salt"
            value={localPrefs.healthGoals.lowSalt}
            onToggle={(v) => setGoal('lowSalt', v)}
          />
        </SettingsCard>

        <SettingsCard>
          <Text style={styles.sectionTitle}>Allergies & Restrictions</Text>

          <PreferenceToggleRow
            label="Lactose Intolerance"
            value={localPrefs.allergies.lactoseIntolerance}
            onToggle={(v) => setAllergy('lactoseIntolerance', v)}
          />
          <Divider />

          <PreferenceToggleRow
            label="Gluten Sensitivity"
            value={localPrefs.allergies.glutenSensitivity}
            onToggle={(v) => setAllergy('glutenSensitivity', v)}
          />

          <Text style={styles.helperText}>
            These preferences will filter smart suggestions.
          </Text>
        </SettingsCard>

        <SettingsCard>
          <Text style={styles.sectionTitle}>Meal Planning</Text>

          <CounterRow
            label="Meals per day"
            value={localPrefs.mealPlanning.mealsPerDay}
            onDecrement={() => setMeal('mealsPerDay', -1)}
            onIncrement={() => setMeal('mealsPerDay', 1)}
          />
          <Divider />

          <CounterRow
            label="Snack frequency"
            value={localPrefs.mealPlanning.snackFrequency}
            onDecrement={() => setMeal('snackFrequency', -1)}
            onIncrement={() => setMeal('snackFrequency', 1)}
          />
        </SettingsCard>

        <PrimaryButton label="Save Preferences" onPress={handleSave} />
        <View style={styles.gap} />
        <SecondaryButton label="Reset to Default" onPress={handleReset} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: COLORS.primaryText,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 14,
  },
  helperText: {
    color: COLORS.secondaryText,
    fontSize: 12,
    marginTop: 10,
  },
  gap: {
    height: 12,
  },
});