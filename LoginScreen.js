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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const validateLogin = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = () => {
    if (!validateLogin()) return;

    Alert.alert('Success', 'Signed in successfully.');
    // navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoCircle}>
          <Feather name="shopping-bag" size={24} color="#2E8B35" />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue managing your{'\n'}grocery lists
        </Text>

        <Text style={styles.label}>Email Address</Text>
        <View style={[styles.inputBox, errors.email && styles.inputError]}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#9AA7B8"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors({ ...errors, email: null });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        <Text style={styles.label}>Password</Text>
        <View style={[styles.inputBox, errors.password && styles.inputError]}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#9AA7B8"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: null });
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={18}
              color="#8EA1B8"
            />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleSignIn}>
          <Text style={styles.primaryText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialText}>Apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.bottomText}>
            Don’t have an account? <Text style={styles.orange}>Sign Up</Text>
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
    paddingTop: 46,
    paddingBottom: 22,
    minHeight: '100%',
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EAF5EA',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#2E8B35',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 7,
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 7,
  },
  inputBox: {
    height: 48,
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
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 13,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 11,
    marginBottom: 9,
  },
  forgot: {
    textAlign: 'right',
    color: '#F46B08',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 22,
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
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  line: { flex: 1, height: 1, backgroundColor: '#E5EAF0' },
  dividerText: {
    color: '#A6B0C2',
    fontSize: 10,
    marginHorizontal: 12,
    fontWeight: '700',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 14,
  },
  socialButton: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#E0E5EC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  bottomText: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 12,
    marginTop: 42,
  },
  orange: {
    color: '#F46B08',
    fontWeight: '700',
  },
});