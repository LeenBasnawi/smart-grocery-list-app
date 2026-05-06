import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function CheckEmailScreen({ navigation, route }) {
  const email = route?.params?.email;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Smart Grocery List</Text>

          <View style={{ width: 22 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.checkCircle}>
            <Feather name="check-circle" size={58} color="#2E8B35" />
          </View>

          <Text style={styles.title}>Check Your Email</Text>

          <Text style={styles.subtitle}>
            We’ve sent a password reset link to{'\n'}
            {email ? email : 'your email address'}.{'\n'}
            Please check your inbox and follow{'\n'}
            the instructions to reset your password.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryText}>Back to Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.resend}>Resend Email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: {
    minHeight: '100%',
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '800',
  },
  content: {
    alignItems: 'center',
    paddingTop: 110,
  },
  checkCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
  },
  title: {
    color: '#2E8B35',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    color: '#64748B',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 42,
  },
  primaryButton: {
    width: '100%',
    height: 54,
    backgroundColor: '#2E8B35',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E8B35',
    shadowOpacity: 0.22,
    shadowRadius: 7,
    elevation: 4,
    marginBottom: 28,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  resend: {
    color: '#F46B08',
    fontSize: 12,
    fontWeight: '600',
  },
});