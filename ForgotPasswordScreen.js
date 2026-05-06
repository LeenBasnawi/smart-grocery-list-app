import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleResetLink = () => {
    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    navigation.navigate('CheckEmail', { email });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoCircle}>
          <Feather name="shopping-bag" size={28} color="#2E8B35" />
        </View>

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we’ll send{'\n'}you a reset link
        </Text>

        <Text style={styles.label}>Email Address</Text>
        <View style={[styles.inputBox, error && styles.inputError]}>
          <Feather name="mail" size={15} color="#8EA1B8" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g., alex@example.com"
            placeholderTextColor="#9AA7B8"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.primaryButton} onPress={handleResetLink}>
          <Text style={styles.primaryText}>Send Reset Link ▷</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.bottomText}>
            Back to <Text style={styles.orange}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    paddingHorizontal: 30,
    paddingTop: 90,
    paddingBottom: 30,
    minHeight: '100%',
  },
  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#EAF5EA',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  title: {
    color: '#2E8B35',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 13,
    marginBottom: 34,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  inputBox: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D7DEE8',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 13,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 11,
    marginBottom: 10,
  },
  primaryButton: {
    height: 52,
    backgroundColor: '#2E8B35',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E8B35',
    shadowOpacity: 0.22,
    shadowRadius: 7,
    elevation: 4,
    marginTop: 4,
    marginBottom: 26,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  bottomText: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 13,
  },
  orange: {
    color: '#F46B08',
    fontWeight: '700',
  },
});