import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAppContext } from '../Context/AppContext';
import TabIcon from '../components/TabIcon';
import { COLORS } from '../constants/theme';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import CheckEmailScreen from '../screens/CheckEmailScreen';

import HomeDashboardScreen from '../screens/HomeDashboardScreen';
import CreateNewListScreen from '../screens/CreateNewListScreen';
import ListDetailsScreen from '../screens/ListDetailsScreen';
import SharedMembersScreen from '../screens/SharedMembersScreen';
import AddEditItemScreen from '../screens/AddEditItemScreen';
import ProductLookupScreen from '../screens/ProductLookupScreen';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';
import JoinInviteCodeScreen from '../screens/JoinInviteCodeScreen';

import SmartSuggestionsScreen from '../screens/SmartSuggestionsScreen';
import DietaryGoalsScreen from '../screens/DietaryGoalsScreen';

import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileSettingsScreen from '../screens/ProfileSettingsScreen';
import HistorySavedItemsScreen from '../screens/HistoryScreen';

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="CheckEmail" component={CheckEmailScreen} />
    </AuthStack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDashboard" component={HomeDashboardScreen} />
      <Stack.Screen name="CreateNewList" component={CreateNewListScreen} />
      <Stack.Screen name="ListDetails" component={ListDetailsScreen} />
      <Stack.Screen name="SharedMembers" component={SharedMembersScreen} />
      <Stack.Screen name="JoinInviteCode" component={JoinInviteCodeScreen} />
      <Stack.Screen name="AddEditItem" component={AddEditItemScreen} />
      <Stack.Screen name="ProductLookup" component={ProductLookupScreen} />
      <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
      <Stack.Screen name="SmartSuggestions" component={SmartSuggestionsScreen} />
      <Stack.Screen name="DietaryGoals" component={DietaryGoalsScreen} />
    </Stack.Navigator>
  );
}

function SuggestionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SmartSuggestions" component={SmartSuggestionsScreen} />
      <Stack.Screen name="DietaryGoals" component={DietaryGoalsScreen} />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HistorySavedItems" component={HistorySavedItemsScreen} />
    </Stack.Navigator>
  );
}

function AlertsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
      <Stack.Screen name="DietaryGoals" component={DietaryGoalsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 68,
          paddingTop: 7,
          paddingBottom: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⌂" label="Home" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Suggestions"
        component={SuggestionsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="♡" label="Suggestions" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="History"
        component={HistoryStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="↺" label="History" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Alerts"
        component={AlertsStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="♧" label="Alerts" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="♙" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isStorageReady, currentUser } = useAppContext();

  if (!isStorageReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return currentUser ? <MainTabs /> : <AuthNavigator />;
}