// components/shahd/MemberCard.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const ROLES = ['Owner', 'Editor', 'Viewer'];

// MemberAvatar sub-component
const MemberAvatar = ({ initials }) => (
  <View style={styles.avatar}>
    <Text style={styles.avatarText}>{initials}</Text>
  </View>
);

// RoleBadge sub-component
const RoleBadge = ({ label }) => (
  <View style={[styles.roleBadge, label === 'Owner' && styles.roleBadgeOwner]}>
    <Text style={[styles.roleText, label === 'Owner' && styles.roleTextOwner]}>{label}</Text>
  </View>
);

// RoleDropdown sub-component
const RoleDropdown = ({ selectedValue, onChange }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.dropdownTriggerText}>{selectedValue} ⌄</Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {ROLES.map((role) => (
              <TouchableOpacity
                key={role}
                style={[styles.dropdownOption, selectedValue === role && styles.dropdownOptionActive]}
                onPress={() => { onChange(role); setVisible(false); }}
              >
                <Text style={[styles.dropdownOptionText, selectedValue === role && styles.dropdownOptionTextActive]}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default function MemberCard({ member, onRoleChange, onDelete }) {
  const [role, setRole] = useState(member.role);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    onRoleChange && onRoleChange(member.id, newRole);
  };

  return (
    <View style={styles.card}>
      <MemberAvatar initials={member.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.email}>{member.email}</Text>
      </View>
      {member.role === 'Owner' ? (
        <RoleBadge label="Owner" />
      ) : (
        <RoleDropdown selectedValue={role} onChange={handleRoleChange} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#C8E6C9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 14, fontWeight: '800', color: '#2E7D32' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  email: { fontSize: 12, color: '#9E9E9E', marginTop: 2 },
  roleBadge: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roleBadgeOwner: { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' },
  roleText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  roleTextOwner: { color: '#2E7D32' },
  dropdownTrigger: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dropdownTriggerText: { fontSize: 13, fontWeight: '600', color: '#1F2937' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 160,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownOption: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownOptionActive: { backgroundColor: '#E8F5E9' },
  dropdownOptionText: { fontSize: 14, color: '#424242' },
  dropdownOptionTextActive: { color: '#2E7D32', fontWeight: '700' },
});
