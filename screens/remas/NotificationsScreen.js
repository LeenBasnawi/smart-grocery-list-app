// NotificationsScreen: expiry reminder and save settings — Remas
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

const EXPIRY_OPTIONS = [
  '1 day before expiry',
  '2 days before expiry',
  '3 days before expiry',
  '5 days before expiry',
  '1 week before expiry',
];

const DAY_OPTIONS = ['Today', 'Tomorrow', 'Custom'];

export default function NotificationsScreen({ navigation }) {
  const { notificationSettings, setNotificationSettings } = useAppContext();

  const [enabled, setEnabled] = useState(notificationSettings.enabled);
  const [reminderTime, setReminderTime] = useState(notificationSettings.reminderTime);
  const [selectedDay, setSelectedDay] = useState(notificationSettings.reminderDay);
  const [expiryOption, setExpiryOption] = useState(
    `${notificationSettings.expiryDaysBefore} days before expiry`
  );
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [customTime, setCustomTime] = useState('');

  const handleSave = () => {
    const daysBefore = parseInt(expiryOption.split(' ')[0]) || 2;
    setNotificationSettings({
      enabled,
      reminderTime,
      reminderDay: selectedDay,
      expiryDaysBefore: daysBefore,
    });
    Alert.alert('Settings Saved', 'Your notification preferences have been updated.');
  };

  const handleDaySelect = (day) => {
    if (day === 'Custom') {
      Alert.prompt
        ? Alert.prompt('Custom Day', 'Enter a date (e.g. Friday):', (text) => {
            setSelectedDay(text || 'Custom');
          })
        : setSelectedDay('Custom');
    } else {
      setSelectedDay(day);
    }
  };

  const formattedTime = reminderTime === '18:00' ? '6:00 PM' : reminderTime;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reminders & Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Permission status */}
        <View style={styles.permCard}>
          <Text style={styles.sectionLabel}>PERMISSIONS STATUS</Text>
          <View style={styles.permRow}>
            <View style={styles.permIcon}>
              <Text style={styles.permIconText}>🔔</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>Notifications</Text>
              <Text style={styles.permStatus}>Granted</Text>
            </View>
            <Text style={styles.checkmark}>✅</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.enableRow}>
            <Text style={styles.enableLabel}>Enable Notifications</Text>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
              thumbColor={enabled ? '#2E7D32' : '#BDBDBD'}
            />
          </View>
        </View>

        {/* Time-based reminder */}
        <View style={[styles.card, !enabled && styles.cardDisabled]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⏰</Text>
            <View>
              <Text style={styles.cardTitle}>Time-Based Reminder</Text>
              <Text style={styles.cardSubtitle}>Set a reminder at a specific time</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.timeBox}
            disabled={!enabled}
            onPress={() =>
              Alert.alert('Set Time', 'In production, a time picker would open here.')
            }
          >
            <Text style={styles.timeIcon}>⏰</Text>
            <Text style={styles.timeText}>{formattedTime}</Text>
          </TouchableOpacity>

          <View style={styles.dayRow}>
            {DAY_OPTIONS.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayBtn,
                  selectedDay === day && styles.dayBtnActive,
                  !enabled && styles.dayBtnDisabled,
                ]}
                onPress={() => enabled && handleDaySelect(day)}
              >
                <Text
                  style={[
                    styles.dayBtnText,
                    selectedDay === day && styles.dayBtnTextActive,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Expiry Reminder */}
        <View style={[styles.card, !enabled && styles.cardDisabled]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📅</Text>
            <View>
              <Text style={styles.cardTitle}>Expiry Reminder</Text>
              <Text style={styles.cardSubtitle}>Remind me before items expire</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.expiryDropdown}
            disabled={!enabled}
            onPress={() => enabled && setShowExpiryPicker(!showExpiryPicker)}
          >
            <Text style={styles.expiryText}>{expiryOption}</Text>
            <Text style={styles.dropdownArrow}>⌄</Text>
          </TouchableOpacity>

          {showExpiryPicker && (
            <View style={styles.expiryList}>
              {EXPIRY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.expiryOption,
                    expiryOption === opt && styles.expiryOptionActive,
                  ]}
                  onPress={() => {
                    setExpiryOption(opt);
                    setShowExpiryPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.expiryOptionText,
                      expiryOption === opt && styles.expiryOptionTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.expiryNote}>
            This applies to all items with a set expiration date.
          </Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2E7D32' },

  scrollContent: { padding: 16, paddingBottom: 40 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 1.2,
    marginBottom: 12,
  },

  permCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  permIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#E8F5E9',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permIconText: { fontSize: 20 },
  permTitle: { fontSize: 15, fontWeight: '700', color: '#212121' },
  permStatus: { fontSize: 12, color: '#2E7D32', fontWeight: '600' },
  checkmark: { fontSize: 20 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 14 },
  enableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  enableLabel: { fontSize: 16, fontWeight: '700', color: '#2E7D32' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardDisabled: { opacity: 0.5 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  cardIcon: { fontSize: 22 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#212121' },
  cardSubtitle: { fontSize: 12, color: '#9E9E9E' },

  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  timeIcon: { fontSize: 18 },
  timeText: { fontSize: 17, fontWeight: '700', color: '#212121' },

  dayRow: { flexDirection: 'row', gap: 10 },
  dayBtn: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dayBtnActive: { backgroundColor: '#2E7D32' },
  dayBtnDisabled: { opacity: 0.5 },
  dayBtnText: { fontSize: 13, fontWeight: '600', color: '#424242' },
  dayBtnTextActive: { color: '#fff' },

  expiryDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  expiryText: { fontSize: 14, color: '#212121' },
  dropdownArrow: { fontSize: 18, color: '#757575' },
  expiryList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
    overflow: 'hidden',
  },
  expiryOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  expiryOptionActive: { backgroundColor: '#E8F5E9' },
  expiryOptionText: { fontSize: 14, color: '#424242' },
  expiryOptionTextActive: { color: '#2E7D32', fontWeight: '700' },
  expiryNote: { fontSize: 12, color: '#9E9E9E' },

  saveBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
