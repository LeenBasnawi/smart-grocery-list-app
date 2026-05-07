import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';

import { useAppContext } from '../Context/AppContext';
import { COLORS } from '../constants/theme';

const EXPIRY_OPTIONS = [
  '1 day before expiry',
  '2 days before expiry',
  '3 days before expiry',
  '5 days before expiry',
  '1 week before expiry',
];

const DAY_OPTIONS = ['Today', 'Tomorrow', 'Custom'];

function parseDaysFromOption(option) {
  if (option.includes('week')) return 7;

  return parseInt(option.split(' ')[0], 10) || 2;
}

export default function NotificationsScreen() {
  const {
    notificationSettings,
    setNotificationSettings,
    getExpiringSoonItems,
  } = useAppContext();

  const [enabled, setEnabled] = useState(notificationSettings.enabled);
  const [reminderTime, setReminderTime] = useState(
    notificationSettings.reminderTime
  );
  const [selectedDay, setSelectedDay] = useState(
    notificationSettings.reminderDay
  );
  const [expiryOption, setExpiryOption] = useState(
    notificationSettings.expiryDaysBefore === 7
      ? '1 week before expiry'
      : `${notificationSettings.expiryDaysBefore} days before expiry`
  );
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);

  const daysBefore = useMemo(() => {
    return parseDaysFromOption(expiryOption);
  }, [expiryOption]);

  const expiringItems = useMemo(() => {
    return getExpiringSoonItems(daysBefore);
  }, [getExpiringSoonItems, daysBefore]);

  const handleSave = () => {
    setNotificationSettings({
      enabled,
      reminderTime,
      reminderDay: selectedDay,
      expiryDaysBefore: daysBefore,
    });

    Alert.alert(
      'Settings Saved',
      `Your expiry reminder is set to ${expiryOption}.`
    );
  };

  const handleDaySelect = (day) => {
    if (day === 'Custom') {
      setSelectedDay('Custom');
    } else {
      setSelectedDay(day);
    }
  };

  const formattedTime = reminderTime === '18:00' ? '6:00 PM' : reminderTime;

  const renderExpiryStatus = (item) => {
    if (item.daysLeft < 0) return 'Expired';
    if (item.daysLeft === 0) return 'Expires today';
    if (item.daysLeft === 1) return 'Expires in 1 day';

    return `Expires in ${item.daysLeft} days`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reminders & Notifications</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.permCard}>
          <Text style={styles.sectionLabel}>PERMISSIONS STATUS</Text>

          <View style={styles.permRow}>
            <View style={styles.permIcon}>
              <Text style={styles.permIconText}>🔔</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>Notifications</Text>
              <Text style={styles.permStatus}>
                {enabled ? 'Enabled in app' : 'Disabled in app'}
              </Text>
            </View>

            <Text style={styles.checkmark}>{enabled ? '✅' : '⚪'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.enableRow}>
            <Text style={styles.enableLabel}>Enable Notifications</Text>

            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: '#E0E0E0', true: '#A5D6A7' }}
              thumbColor={enabled ? COLORS.primary : '#BDBDBD'}
            />
          </View>
        </View>

        <View style={[styles.card, !enabled && styles.cardDisabled]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⏰</Text>

            <View>
              <Text style={styles.cardTitle}>Time-Based Reminder</Text>
              <Text style={styles.cardSubtitle}>
                Set a reminder at a specific time
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.timeBox}
            disabled={!enabled}
            onPress={() =>
              Alert.alert(
                'Set Time',
                'For this prototype, the reminder time is displayed only.'
              )
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

        <View style={[styles.card, !enabled && styles.cardDisabled]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📅</Text>

            <View>
              <Text style={styles.cardTitle}>Expiry Reminder</Text>
              <Text style={styles.cardSubtitle}>
                Remind me before items expire
              </Text>
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

        <View style={styles.expiringCard}>
          <View style={styles.expiringHeader}>
            <Text style={styles.expiringTitle}>Items Expiring Soon</Text>
            <Text style={styles.expiringCount}>{expiringItems.length}</Text>
          </View>

          {expiringItems.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>✅</Text>
              <Text style={styles.emptyText}>
                No items are expiring within {daysBefore} day
                {daysBefore === 1 ? '' : 's'}.
              </Text>
            </View>
          ) : (
            expiringItems.map((item) => (
              <View key={item.id} style={styles.expiringItem}>
                <View style={styles.expiringDot} />

                <View style={styles.expiringInfo}>
                  <Text style={styles.expiringItemName} numberOfLines={1}>
                    {item.name}
                  </Text>

                  <Text style={styles.expiringMeta}>
                    {item.category || 'Other'} • {item.quantity} {item.unit}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    item.daysLeft < 0 && styles.expiredBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.daysLeft < 0 && styles.expiredText,
                    ]}
                  >
                    {renderExpiryStatus(item)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.screenBackground },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 16,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.mutedText,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  permCard: {
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  permIconText: {
    fontSize: 20,
  },
  permTitle: {
    color: COLORS.primaryText,
    fontSize: 15,
    fontWeight: '900',
  },
  permStatus: {
    color: COLORS.primary,
    fontSize: 12,
    marginTop: 3,
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  enableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  enableLabel: {
    color: COLORS.primaryText,
    fontSize: 15,
    fontWeight: '800',
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardDisabled: {
    opacity: 0.55,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  cardTitle: {
    color: COLORS.primaryText,
    fontSize: 15,
    fontWeight: '900',
  },
  cardSubtitle: {
    color: COLORS.secondaryText,
    fontSize: 12,
    marginTop: 2,
  },
  timeBox: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  timeText: {
    color: COLORS.primaryText,
    fontSize: 14,
    fontWeight: '800',
  },
  dayRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dayBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayBtnDisabled: {
    opacity: 0.6,
  },
  dayBtnText: {
    color: COLORS.secondaryText,
    fontSize: 12,
    fontWeight: '700',
  },
  dayBtnTextActive: {
    color: COLORS.white,
    fontWeight: '900',
  },
  expiryDropdown: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expiryText: {
    fontSize: 14,
    color: COLORS.primaryText,
    fontWeight: '800',
  },
  dropdownArrow: {
    color: COLORS.mutedText,
    fontSize: 18,
  },
  expiryList: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  expiryOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  expiryOptionActive: {
    backgroundColor: COLORS.lightGreen,
  },
  expiryOptionText: {
    color: COLORS.primaryText,
    fontSize: 13,
    fontWeight: '700',
  },
  expiryOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '900',
  },
  expiryNote: {
    color: COLORS.secondaryText,
    fontSize: 12,
    marginTop: 10,
  },
  expiringCard: {
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  expiringHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiringTitle: {
    color: COLORS.primaryText,
    fontSize: 16,
    fontWeight: '900',
  },
  expiringCount: {
    color: COLORS.white,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    fontWeight: '900',
    overflow: 'hidden',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  expiringItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  expiringDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
    marginRight: 10,
  },
  expiringInfo: {
    flex: 1,
    minWidth: 0,
  },
  expiringItemName: {
    color: COLORS.primaryText,
    fontSize: 14,
    fontWeight: '900',
  },
  expiringMeta: {
    color: COLORS.secondaryText,
    fontSize: 12,
    marginTop: 3,
  },
  statusBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  statusText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '900',
  },
  expiredBadge: {
    backgroundColor: '#FEE2E2',
  },
  expiredText: {
    color: COLORS.danger,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },
});