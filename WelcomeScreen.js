import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>⌂</Text>
        </View>

        <Text style={styles.title}>
          Smart <Text style={styles.orange}>Grocery List</Text>
        </Text>

        <Text style={styles.subtitle}>
          Plan smarter. Shop better. Save{'\n'}time.
        </Text>

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
          }}
          style={styles.heroImage}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.primaryText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Join 50,000+ happy shoppers</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 32,
    paddingTop: 55,
    paddingBottom: 35,
    alignItems: 'center',
  },
  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  logoIcon: {
    fontSize: 30,
    color: '#2E7D32',
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    color: '#1F8F3A',
    fontWeight: '400',
    marginBottom: 16,
  },
  orange: {
    color: '#F46B08',
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 28,
  },
  heroImage: {
    width: '100%',
    height: 230,
    borderRadius: 18,
    resizeMode: 'cover',
    marginBottom: 34,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 18,
    backgroundColor: '#2E8B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#F46B08',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  secondaryText: {
    color: '#F46B08',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    color: '#A6B0C2',
    fontSize: 12,
  },
});