import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';

import { useAppContext } from '../Context/AppContext';
import { COLORS } from '../constants/theme';

export default function JoinInviteCodeScreen({ navigation }) {
  const { joinListByInviteCode } = useAppContext();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) {
      Alert.alert('Missing Code', 'Please enter the invite code.');
      return;
    }

    setLoading(true);

    try {
      const joinedList = await joinListByInviteCode(code);

      Alert.alert(
        'Joined!',
        `You joined "${joinedList.title}" as ${joinedList.accessRole}.`,
        [
          {
            text: 'Open List',
            onPress: () =>
              navigation.replace('ListDetails', {
                listId: joinedList.id,
                listTitle: joinedList.title,
              }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Could Not Join', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Join Shared List</Text>

        <View style={styles.backBtn} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Text style={styles.icon}>🔑</Text>
        </View>

        <Text style={styles.mainTitle}>Enter Invite Code</Text>

        <Text style={styles.subtitle}>
          Ask the list owner for the invite code, then enter it here to join the
          shared grocery list.
        </Text>

        <Text style={styles.label}>Invite Code</Text>

        <TextInput
          style={styles.input}
          value={code}
          onChangeText={(text) => setCode(text.toUpperCase())}
          placeholder="Example: GROC-ABCD1234"
          placeholderTextColor={COLORS.mutedText}
          autoCapitalize="characters"
        />

        <TouchableOpacity
          style={[styles.joinBtn, loading && styles.disabledBtn]}
          onPress={handleJoin}
          disabled={loading}
        >
          <Text style={styles.joinText}>{loading ? 'Joining...' : 'Join List'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBackground,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 42,
    height: 42,
    justifyContent: 'center',
  },
  back: {
    fontSize: 32,
    color: COLORS.primaryText,
    fontWeight: '400',
    marginTop: -4,
  },
  title: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 44,
    alignItems: 'center',
  },
  iconBox: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: COLORS.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  icon: {
    fontSize: 34,
  },
  mainTitle: {
    color: COLORS.primaryText,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.secondaryText,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  label: {
    alignSelf: 'flex-start',
    color: COLORS.primaryText,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    color: COLORS.primaryText,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 18,
  },
  joinBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.6,
  },
  joinText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
  },
  cancelText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 18,
  },
});