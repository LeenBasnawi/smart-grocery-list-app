import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  BackHandler,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';

import { useAppContext } from '../Context/AppContext';
import { COLORS } from '../constants/theme';

const ROLE_OPTIONS = ['Viewer', 'Editor'];

export default function SharedMembersScreen({ navigation, route }) {
  const {
    groceryLists,
    removeMemberFromList,
    updateMemberRole,
    getListRole,
    canManageListMembers,
  } = useAppContext();

  const { width } = useWindowDimensions();
  const isSmallPhone = width < 370;

  const listId = route?.params?.listId;
  const listTitle = route?.params?.listTitle || 'Weekly Shopping List';
  const fromListDetails = route?.params?.fromListDetails || false;

  const [inviteVisible, setInviteVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const currentList = useMemo(() => {
    return groceryLists.find((list) => list.id === listId);
  }, [groceryLists, listId]);

  const userRole = getListRole(currentList);
  const canManage = canManageListMembers(currentList);

  const members =
    currentList?.members && currentList.members.length > 0
      ? currentList.members
      : [];

  const inviteCode = currentList?.inviteCode || 'NO CODE';

  const initials = (name) =>
    String(name || '?')
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const goBack = useCallback(() => {
    if (fromListDetails) {
      navigation.replace('ListDetails', {
        listId,
        listTitle,
      });
    } else {
      navigation.goBack();
    }
  }, [fromListDetails, navigation, listId, listTitle]);

  const handleDone = useCallback(() => {
    if (fromListDetails) {
      navigation.replace('ListDetails', {
        listId,
        listTitle,
      });
    } else {
      navigation.navigate('HomeDashboard');
    }
  }, [fromListDetails, navigation, listId, listTitle]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        goBack();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [goBack])
  );

  const handleInviteMember = () => {
    if (!canManage) {
      Alert.alert('Owner Only', 'Only the owner can invite members.');
      return;
    }

    setInviteVisible(true);
  };

  const copyInviteCode = async () => {
    if (!inviteCode || inviteCode === 'NO CODE') {
      Alert.alert('No Code', 'This list does not have an invite code yet.');
      return;
    }

    try {
      await Clipboard.setStringAsync(inviteCode);
      setInviteVisible(false);
      Alert.alert('Copied!', `Invite code ${inviteCode} copied to clipboard.`);
    } catch (error) {
      Alert.alert(
        'Copy Failed',
        'Could not copy the invite code. You can copy it manually.'
      );
    }
  };

  const openRoleModal = (member) => {
    if (!canManage) {
      Alert.alert('Owner Only', 'Only the owner can change member roles.');
      return;
    }

    if (member.role === 'Owner') return;

    setSelectedMember(member);
    setRoleModalVisible(true);
  };

  const handleRoleChange = (role) => {
    if (!selectedMember) return;

    updateMemberRole(listId, selectedMember.id, role);
    setRoleModalVisible(false);
    setSelectedMember(null);
  };

  const handleRemoveMember = (member) => {
    if (!canManage) {
      Alert.alert('Owner Only', 'Only the owner can remove members.');
      return;
    }

    removeMemberFromList(listId, member.id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, isSmallPhone && styles.containerSmall]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Shared Members</Text>

          <View style={styles.backBtn} />
        </View>

        <Text style={styles.listName} numberOfLines={1}>
          {listTitle.toUpperCase()}
        </Text>

        <View style={styles.roleBanner}>
          <Text style={styles.roleBannerText}>Your role: {userRole}</Text>
        </View>

        {currentList?.shared && canManage && (
          <View style={styles.inviteCodeCard}>
            <Text style={styles.inviteCodeLabel}>INVITE CODE</Text>
            <View style={styles.inviteCodeRow}>
              <Text style={styles.inviteCodeText}>{inviteCode}</Text>

              <TouchableOpacity style={styles.smallCopyBtn} onPress={copyInviteCode}>
                <Text style={styles.smallCopyText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <ScrollView
          style={styles.membersScroll}
          contentContainerStyle={styles.membersContent}
          showsVerticalScrollIndicator={false}
        >
          {members.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={[styles.avatar, { backgroundColor: member.color }]}>
                <Text style={styles.avatarText}>{initials(member.name)}</Text>
              </View>

              <View style={styles.memberInfo}>
                <Text style={styles.memberName} numberOfLines={1}>
                  {member.name}
                </Text>

                <Text style={styles.memberEmail} numberOfLines={1}>
                  {member.email || 'No email'}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.roleBox,
                  member.role === 'Owner' && styles.disabledRoleBox,
                  !canManage && styles.disabledRoleBox,
                ]}
                onPress={() => openRoleModal(member)}
                disabled={member.role === 'Owner' || !canManage}
              >
                <Text style={styles.roleText} numberOfLines={1}>
                  {member.role}
                </Text>

                {member.role !== 'Owner' && canManage && (
                  <Text style={styles.chevron}>⌄</Text>
                )}
              </TouchableOpacity>

              {member.role !== 'Owner' && canManage ? (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleRemoveMember(member)}
                >
                  <Text style={styles.deleteIcon}>🗑</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.deleteBtn}>
                  <Text style={[styles.deleteIcon, { opacity: 0.2 }]}>🗑</Text>
                </View>
              )}
            </View>
          ))}

          {canManage && (
            <TouchableOpacity style={styles.inviteBtn} onPress={handleInviteMember}>
              <Text style={styles.inviteIcon}>👥</Text>
              <Text style={styles.inviteText}>Invite Member</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>

        <Modal visible={inviteVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Invite via Code</Text>

                <TouchableOpacity onPress={() => setInviteVisible(false)}>
                  <Text style={styles.close}>×</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalDesc}>
                Give this code to another user. They can enter it from the Home
                Dashboard using Join a Shared List.
              </Text>

              <View style={styles.codeBox}>
                <Text style={styles.codeLabel}>INVITE CODE</Text>

                <View style={styles.codeRow}>
                  <Text style={styles.code}>{inviteCode}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.copyBtn} onPress={copyInviteCode}>
                <Text style={styles.copyText}>Copy Invite Code</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setInviteVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={roleModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.roleModalBox}>
              <Text style={styles.modalTitle}>Change Member Role</Text>

              {ROLE_OPTIONS.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleOption,
                    selectedMember?.role === role && styles.activeRoleOption,
                  ]}
                  onPress={() => handleRoleChange(role)}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      selectedMember?.role === role &&
                        styles.activeRoleOptionText,
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.cancelRoleBtn}
                onPress={() => setRoleModalVisible(false)}
              >
                <Text style={styles.cancelRoleText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.screenBackground },
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 84,
  },
  containerSmall: { paddingHorizontal: 14 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  backBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
  },
  back: {
    fontSize: 30,
    color: COLORS.primaryText,
    fontWeight: '400',
    marginTop: -4,
  },
  title: {
    flex: 1,
    color: COLORS.primaryText,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  listName: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  roleBanner: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  roleBannerText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  inviteCodeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginBottom: 12,
  },
  inviteCodeLabel: {
    color: COLORS.mutedText,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginBottom: 5,
  },
  inviteCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inviteCodeText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  smallCopyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  smallCopyText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '900',
  },
  membersScroll: { flex: 1 },
  membersContent: { paddingBottom: 18 },
  memberCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },
  memberInfo: {
    flex: 1,
    minWidth: 0,
    marginRight: 6,
  },
  memberName: {
    color: COLORS.primaryText,
    fontSize: 14,
    fontWeight: '900',
  },
  memberEmail: {
    color: COLORS.secondaryText,
    fontSize: 10,
    marginTop: 2,
  },
  roleBox: {
    minWidth: 66,
    maxWidth: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 7,
    marginRight: 4,
  },
  disabledRoleBox: { opacity: 0.75 },
  roleText: {
    color: COLORS.primaryText,
    fontSize: 11,
    fontWeight: '800',
    marginRight: 2,
  },
  chevron: {
    color: COLORS.mutedText,
    fontSize: 10,
  },
  deleteBtn: {
    width: 26,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 14,
    opacity: 0.7,
  },
  inviteBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  inviteIcon: {
    color: COLORS.secondary,
    fontSize: 17,
  },
  inviteText: {
    color: COLORS.primaryText,
    fontSize: 14,
    fontWeight: '800',
  },
  doneBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  doneText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: COLORS.primaryText,
    fontSize: 18,
    fontWeight: '900',
  },
  close: {
    color: COLORS.mutedText,
    fontSize: 28,
    fontWeight: '300',
  },
  modalDesc: {
    color: COLORS.secondaryText,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    marginBottom: 16,
  },
  codeBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#A7D8B6',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  codeLabel: {
    color: COLORS.mutedText,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  code: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  copyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  copyText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
  },
  modalCancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  modalCancelText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '900',
  },
  roleModalBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
  },
  roleOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activeRoleOption: {
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  roleOptionText: {
    color: COLORS.primaryText,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  activeRoleOptionText: {
    color: COLORS.primary,
    fontWeight: '900',
  },
  cancelRoleBtn: {
    marginTop: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelRoleText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '900',
  },
});