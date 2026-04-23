// ProfileSettingsScreen: user profile, language, navigation links — Remas
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';

const LANGUAGES = ['English', 'Arabic', 'French', 'Spanish', 'German'];

export default function ProfileSettingsScreen({ navigation }) {
  const { userProfile, setUserProfile, notificationSettings, setNotificationSettings } =
    useAppContext();

  const [editingProfile, setEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState(userProfile.name);
  const [draftEmail, setDraftEmail] = useState(userProfile.email);
  const [showLangModal, setShowLangModal] = useState(false);

  const initials = userProfile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSaveProfile = () => {
    if (!draftName.trim()) {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }
    setUserProfile((prev) => ({ ...prev, name: draftName, email: draftEmail }));
    setEditingProfile(false);
    Alert.alert('Saved!', 'Your profile has been updated.');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => Alert.alert('Logged out', 'You have been logged out.'),
      },
    ]);
  };

  const handleLanguageSelect = (lang) => {
    setUserProfile((prev) => ({ ...prev, language: lang }));
    setShowLangModal(false);
  };

  const toggleNotifications = () => {
    setNotificationSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
    setUserProfile((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar + Name */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          {editingProfile ? (
            <View style={styles.editFields}>
              <TextInput
                style={styles.editInput}
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Full name"
                placeholderTextColor="#9E9E9E"
              />
              <TextInput
                style={styles.editInput}
                value={draftEmail}
                onChangeText={setDraftEmail}
                placeholder="Email address"
                placeholderTextColor="#9E9E9E"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.editBtns}>
                <TouchableOpacity
                  style={styles.cancelEditBtn}
                  onPress={() => { setEditingProfile(false); setDraftName(userProfile.name); setDraftEmail(userProfile.email); }}
                >
                  <Text style={styles.cancelEditText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveEditBtn} onPress={handleSaveProfile}>
                  <Text style={styles.saveEditText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileEmail}>{userProfile.email}</Text>
              <TouchableOpacity
                style={styles.editProfileBtn}
                onPress={() => setEditingProfile(true)}
              >
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setShowLangModal(true)}
            >
              <Text style={styles.settingIcon}>🌐</Text>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingValue}>{userProfile.language}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => navigation?.navigate('Notifications')}
            >
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingValue}>
                {notificationSettings.enabled ? 'Enabled' : 'Disabled'}
              </Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PREFERENCES</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => navigation?.navigate('DietaryGoals')}
            >
              <Text style={styles.settingIcon}>🍽</Text>
              <Text style={styles.settingLabel}>Dietary Goals & Preferences</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>→</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        visible={showLangModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLangModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLangModal(false)}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Language</Text>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.modalOption,
                  userProfile.language === lang && styles.modalOptionActive,
                ]}
                onPress={() => handleLanguageSelect(lang)}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    userProfile.language === lang && styles.modalOptionTextActive,
                  ]}
                >
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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

  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#2E7D32' },
  profileName: { fontSize: 20, fontWeight: '800', color: '#212121', marginBottom: 4 },
  profileEmail: { fontSize: 13, color: '#757575', marginBottom: 14 },
  editProfileBtn: {
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  editProfileText: { color: '#2E7D32', fontWeight: '700', fontSize: 13 },

  editFields: { width: '100%', gap: 10 },
  editInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#212121',
    width: '100%',
  },
  editBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelEditBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#9E9E9E',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelEditText: { color: '#757575', fontWeight: '600' },
  saveEditBtn: {
    flex: 1,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  saveEditText: { color: '#fff', fontWeight: '700' },

  section: { marginBottom: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 1.2,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 15,
  },
  settingIcon: { fontSize: 18, marginRight: 12 },
  settingLabel: { flex: 1, fontSize: 15, color: '#212121', fontWeight: '500' },
  settingValue: { fontSize: 14, color: '#757575', marginRight: 6 },
  chevron: { fontSize: 20, color: '#BDBDBD' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 18 },

  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E65100',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 4,
  },
  logoutIcon: { fontSize: 18, color: '#E65100' },
  logoutText: { color: '#E65100', fontWeight: '700', fontSize: 15 },

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
    width: '75%',
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
    paddingHorizontal: 8,
  },
  modalOptionActive: { backgroundColor: '#E8F5E9' },
  modalOptionText: { fontSize: 15, color: '#424242' },
  modalOptionTextActive: { color: '#2E7D32', fontWeight: '700' },
});
