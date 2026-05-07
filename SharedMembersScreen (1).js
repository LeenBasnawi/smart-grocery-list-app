// screens/shahd/SharedMembersScreen.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, Modal,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { useAppContext } from '../../context/AppContext';
import TopBar from '../../components/shahd/TopBar';
import MemberCard from '../../components/shahd/MemberCard';
import PrimaryButton from '../../components/shahd/PrimaryButton';

// InviteCodeBox sub-component
const InviteCodeBox = ({ code, onCopy }) => (
  <View style={styles.codeBox}>
    <Text style={styles.codeLabel}>INVITE CODE</Text>
    <View style={styles.codeRow}>
      <Text style={styles.codeValue}>{code}</Text>
      <TouchableOpacity style={styles.copyIcon} onPress={onCopy}>
        <Text style={styles.copyIconText}>⧉</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// CircularIconButton sub-component
const CircularIconButton = ({ emoji, bgColor, onPress }) => (
  <TouchableOpacity style={[styles.circularBtn, { backgroundColor: bgColor }]} onPress={onPress}>
    <Text style={styles.circularBtnText}>{emoji}</Text>
  </TouchableOpacity>
);

// InvitePopupCard (modal content)
const InvitePopupCard = ({ onClose }) => (
  <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
    <TouchableOpacity style={styles.modalBox} activeOpacity={1}>
      <TouchableOpacity style={styles.modalClose} onPress={onClose}>
        <Text style={styles.modalCloseText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.modalTitle}>Invite via Code</Text>
      <Text style={styles.modalSubtitle}>
        Share this unique code with your family or roommates to collaborate on this list.
      </Text>

      <InviteCodeBox code="GROC-882" onCopy={() => {}} />

      <Text style={styles.orLabel}>OR SHARE VIA</Text>
      <View style={styles.shareIconsRow}>
        <CircularIconButton emoji="💬" bgColor="#2E7D32" onPress={() => {}} />
        <CircularIconButton emoji="✉️" bgColor="#1565C0" onPress={() => {}} />
        <CircularIconButton emoji="⎘" bgColor="#F5F5F5" onPress={() => {}} />
      </View>

      <PrimaryButton label="Copy Invite Link" onPress={onClose} />
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function SharedMembersScreen({ route, navigation }) {
  const { listId = 'list_1', listName = 'Weekly Shopping List' } = route?.params ?? {};
  const { listMembers } = useAppContext();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const members = listMembers[listId] ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <TopBar title="Shared Members" onBack={() => navigation.goBack()} />

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* List Info Card */}
            <View style={styles.listInfoCard}>
              <View style={styles.listIconContainer}>
                <Text style={styles.listIcon}>🧺</Text>
              </View>
              <View>
                <Text style={styles.listInfoTitle}>{listName}</Text>
                <Text style={styles.listInfoSubtitle}>Manage who can access this list</Text>
              </View>
            </View>
            <Text style={styles.sectionLabel}>Members</Text>
          </>
        }
        renderItem={({ item }) => (
          <MemberCard
            member={item}
            onRoleChange={(id, newRole) => {}}
            onDelete={(id) => {}}
          />
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <PrimaryButton
              label="👥  Invite Member"
              onPress={() => setShowInviteModal(true)}
            />
            <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Invite Modal */}
      <Modal
        visible={showInviteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <InvitePopupCard onClose={() => setShowInviteModal(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  listContent: { paddingHorizontal: 16, paddingBottom: 40 },
  listInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  listIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listIcon: { fontSize: 22 },
  listInfoTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  listInfoSubtitle: { fontSize: 13, color: '#9E9E9E', marginTop: 2 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9E9E9E', letterSpacing: 1.2, marginBottom: 12 },
  footer: { paddingTop: 16, gap: 12 },
  doneBtn: { alignItems: 'center', paddingVertical: 12 },
  doneBtnText: { fontSize: 15, fontWeight: '700', color: '#2E7D32' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingTop: 20 },
  modalClose: { alignSelf: 'flex-end', padding: 4, marginBottom: 8 },
  modalCloseText: { fontSize: 18, color: '#9E9E9E' },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1F2937', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20, lineHeight: 20 },
  codeBox: {
    borderWidth: 2,
    borderColor: '#C8E6C9',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F7FFF8',
  },
  codeLabel: { fontSize: 11, fontWeight: '700', color: '#9E9E9E', letterSpacing: 1.5, marginBottom: 10 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  codeValue: { fontSize: 32, fontWeight: '900', color: '#2E7D32', letterSpacing: 2 },
  copyIcon: { backgroundColor: '#E8F5E9', borderRadius: 8, padding: 8 },
  copyIconText: { fontSize: 18, color: '#2E7D32' },
  orLabel: { fontSize: 11, fontWeight: '700', color: '#9E9E9E', letterSpacing: 1.5, textAlign: 'center', marginBottom: 16 },
  shareIconsRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24 },
  circularBtn: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  circularBtnText: { fontSize: 22, color: '#fff' },
});
