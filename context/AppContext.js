import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ── User Preferences (Dietary Goals) ──────────────────────────────
  const [userPreferences, setUserPreferences] = useState({
    healthGoals: {
      highProtein: false,
      lowSugar: true,
      highFiber: false,
      lowSalt: false,
    },
    allergies: {
      lactoseIntolerance: false,
      glutenSensitivity: false,
    },
    mealPlanning: {
      mealsPerDay: 3,
      snackFrequency: 1,
    },
  });

  // ── Grocery List State ─────────────────────────────────────────────
  const [groceryList, setGroceryList] = useState([]);

  // ── Suggestions State (reacts to dietary preferences) ─────────────
  const [suggestions, setSuggestions] = useState([]);
  const [householdSize, setHouseholdSize] = useState(2);
  const [includeExpiringSoon, setIncludeExpiringSoon] = useState(true);

  // ── Profile ────────────────────────────────────────────────────────
  const [userProfile, setUserProfile] = useState({
    name: 'Leen Basnawi',
    email: 'leen@example.com',
    language: 'English',
    notificationsEnabled: true,
  });

  // ── Notifications ──────────────────────────────────────────────────
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: true,
    reminderTime: '18:00',
    reminderDay: 'Today',
    expiryDaysBefore: 2,
  });

  // ── Derive suggestions from dietary preferences ────────────────────
  useEffect(() => {
    const baseSuggestions = [
      {
        id: '1',
        name: 'Whole Milk',
        image: null,
        usageNote: 'Usually bought every 7 days',
        quantity: 2,
        status: 'RUNNING LOW',
        tags: ['dairy'],
        protein: false,
        sugar: true,
      },
      {
        id: '2',
        name: 'Hass Avocados',
        image: null,
        usageNote: 'Usually lasts 4 days',
        quantity: 3,
        status: null,
        tags: ['produce'],
        protein: false,
        sugar: false,
      },
      {
        id: '3',
        name: 'Sourdough Loaf',
        image: null,
        usageNote: 'Predictive usage alert',
        quantity: 1,
        status: 'RUNNING LOW',
        tags: ['bakery'],
        protein: false,
        sugar: false,
      },
      {
        id: '4',
        name: 'Chicken Breast',
        image: null,
        usageNote: 'High protein choice',
        quantity: 1,
        status: null,
        tags: ['meat'],
        protein: true,
        sugar: false,
      },
      {
        id: '5',
        name: 'Greek Yogurt',
        image: null,
        usageNote: 'High protein, low sugar option',
        quantity: 2,
        status: null,
        tags: ['dairy'],
        protein: true,
        sugar: false,
      },
      {
        id: '6',
        name: 'Oat Milk',
        image: null,
        usageNote: 'Lactose-free alternative',
        quantity: 1,
        status: null,
        tags: ['dairy-free'],
        protein: false,
        sugar: false,
      },
    ];

    let filtered = baseSuggestions;

    // Filter by dietary goals
    if (userPreferences.healthGoals.highProtein) {
      filtered = filtered.filter((item) => item.protein);
    }
    if (userPreferences.healthGoals.lowSugar) {
      filtered = filtered.filter((item) => !item.sugar);
    }
    if (userPreferences.allergies.lactoseIntolerance) {
      filtered = filtered.filter((item) => !item.tags.includes('dairy'));
    }
    if (userPreferences.allergies.glutenSensitivity) {
      filtered = filtered.filter((item) => !item.tags.includes('bakery'));
    }

    setSuggestions(filtered);
  }, [userPreferences]);

  // ── Grocery List helpers ───────────────────────────────────────────
  const addToGroceryList = (item) => {
    setGroceryList((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromGroceryList = (itemId) => {
    setGroceryList((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateGroceryItem = (itemId, updates) => {
    setGroceryList((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, ...updates } : i))
    );
  };

  const updatePreferences = (section, key, value) => {
    setUserPreferences((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  return (
    <AppContext.Provider
      value={{
        userPreferences,
        setUserPreferences,
        updatePreferences,
        groceryList,
        addToGroceryList,
        removeFromGroceryList,
        updateGroceryItem,
        suggestions,
        householdSize,
        setHouseholdSize,
        includeExpiringSoon,
        setIncludeExpiringSoon,
        userProfile,
        setUserProfile,
        notificationSettings,
        setNotificationSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
