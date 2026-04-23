// navigation/AppNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

// Asayel's screens
import ProductLookupScreen from '../screens/asayel/ProductLookupScreen';
import SmartSuggestionsScreen from '../screens/asayel/SmartSuggestionsScreen';
import DietaryGoalsScreen from '../screens/asayel/DietaryGoalsScreen';

// Remas's screens
import AddEditItemScreen from '../screens/remas/AddEditItemScreen';
import NotificationsScreen from '../screens/remas/NotificationsScreen';
import ProfileSettingsScreen from '../screens/remas/ProfileSettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ── Tab icon component ─────────────────────────────────────────────────────────
const TabIcon = ({ emoji, label, focused }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={{ fontSize: 20 }}>{emoji}</Text>
    <Text
      style={{
        fontSize: 10,
        fontWeight: focused ? '700' : '400',
        color: focused ? '#2E7D32' : '#9E9E9E',
        marginTop: 2,
      }}
    >
      {label}
    </Text>
  </View>
);

// ── Home Stack (ProductLookup + AddEditItem) ───────────────────────────────────
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProductLookup" component={ProductLookupScreen} />
      <Stack.Screen name="AddEditItem" component={AddEditItemScreen} />
    </Stack.Navigator>
  );
}

// ── Suggestions Stack ──────────────────────────────────────────────────────────
function SuggestionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SmartSuggestions" component={SmartSuggestionsScreen} />
      <Stack.Screen name="DietaryGoals" component={DietaryGoalsScreen} />
    </Stack.Navigator>
  );
}

// ── Profile Stack ──────────────────────────────────────────────────────────────
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
      <Stack.Screen name="DietaryGoals" component={DietaryGoalsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

// ── Main Tab Navigator ─────────────────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: 70,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Suggestions"
        component={SuggestionsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💡" label="Suggestions" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔔" label="Alerts" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
