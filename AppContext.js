import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const AUTH_KEYS = {
  USERS: 'SMART_GROCERY_USERS',
  CURRENT_USER: 'SMART_GROCERY_CURRENT_USER',
};

const GLOBAL_KEYS = {
  INVITES: 'SMART_GROCERY_INVITES',
};

const LEGACY_KEYS = {
  LISTS: 'SMART_GROCERY_LISTS',
  ITEMS: 'SMART_GROCERY_ITEMS',
  PREFS: 'SMART_GROCERY_PREFS',
  PROFILE: 'SMART_GROCERY_PROFILE',
  NOTIFICATIONS: 'SMART_GROCERY_NOTIFICATIONS',
};

const DAY_MS = 24 * 60 * 60 * 1000;

const getUserDataKey = (email) =>
  `SMART_GROCERY_DATA_${String(email).toLowerCase()}`;

const defaultUserData = {
  groceryLists: [],
  groceryList: [],
  userPreferences: {
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
  },
  notificationSettings: {
    enabled: true,
    reminderTime: '18:00',
    reminderDay: 'Today',
    expiryDaysBefore: 2,
  },
};

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function generateInviteCode() {
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  const time = String(Date.now()).slice(-4);
  return `GROC-${random}${time}`;
}

function parseExpiryDate(expiryDate) {
  if (!expiryDate) return null;

  const parts = String(expiryDate).trim().split('/');
  if (parts.length !== 3) return null;

  const [monthText, dayText, yearText] = parts;
  const month = Number(monthText);
  const day = Number(dayText);
  const year = Number(yearText);

  if (!month || !day || !year) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const testDate = new Date(year, month - 1, day);

  if (
    testDate.getFullYear() !== year ||
    testDate.getMonth() !== month - 1 ||
    testDate.getDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function getTodayLocalDateOnly() {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

function toUtcDayNumber(dateParts) {
  return Math.floor(
    Date.UTC(dateParts.year, dateParts.month - 1, dateParts.day) / DAY_MS
  );
}

function getDaysUntilExpiry(expiryDate) {
  const expiryParts = parseExpiryDate(expiryDate);
  if (!expiryParts) return null;

  const todayParts = getTodayLocalDateOnly();

  return toUtcDayNumber(expiryParts) - toUtcDayNumber(todayParts);
}

function getExpiryLabel(expiryDate) {
  const days = getDaysUntilExpiry(expiryDate);

  if (days === null) return null;
  if (days < 0) return 'EXPIRED';
  if (days === 0) return 'EXPIRES TODAY';
  if (days === 1) return 'EXPIRES IN 1 DAY';

  return `EXPIRES IN ${days} DAYS`;
}

export const AppProvider = ({ children }) => {
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [groceryLists, setGroceryLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [groceryList, setGroceryList] = useState([]);

  const [userPreferences, setUserPreferences] = useState(
    defaultUserData.userPreferences
  );

  const [notificationSettings, setNotificationSettings] = useState(
    defaultUserData.notificationSettings
  );

  const [suggestions, setSuggestions] = useState([]);
  const [householdSize, setHouseholdSize] = useState(2);
  const [includeExpiringSoon, setIncludeExpiringSoon] = useState(true);

  const userProfile = currentUser
    ? {
        name: currentUser.name,
        email: currentUser.email,
        language: currentUser.language || 'English',
        notificationsEnabled: notificationSettings.enabled,
      }
    : {
        name: '',
        email: '',
        language: 'English',
        notificationsEnabled: true,
      };

  const getUsers = async () => {
    const savedUsers = await AsyncStorage.getItem(AUTH_KEYS.USERS);
    return savedUsers ? JSON.parse(savedUsers) : [];
  };

  const getInvites = async () => {
    const savedInvites = await AsyncStorage.getItem(GLOBAL_KEYS.INVITES);
    return savedInvites ? JSON.parse(savedInvites) : {};
  };

  const saveInvites = async (invites) => {
    await AsyncStorage.setItem(GLOBAL_KEYS.INVITES, JSON.stringify(invites));
  };

  const getOwnerMember = () => ({
    id: `member_${normalizeEmail(currentUser?.email || 'owner')}`,
    email: normalizeEmail(currentUser?.email),
    name: currentUser?.name || 'Owner',
    role: 'Owner',
    color: '#2E7D32',
  });

  const ensureOwnerMember = (list, members = []) => {
    const safeMembers = Array.isArray(members) ? members : [];
    const ownerEmail = normalizeEmail(list?.ownerEmail || currentUser?.email);

    const hasOwner = safeMembers.some(
      (member) =>
        member.role === 'Owner' || normalizeEmail(member.email) === ownerEmail
    );

    if (hasOwner) {
      return safeMembers.map((member) =>
        normalizeEmail(member.email) === ownerEmail
          ? { ...member, role: 'Owner' }
          : member
      );
    }

    return [
      {
        id: `member_${ownerEmail}`,
        email: ownerEmail,
        name: list?.ownerName || currentUser?.name || 'Owner',
        role: 'Owner',
        color: '#2E7D32',
      },
      ...safeMembers,
    ];
  };

  const getListRole = (list) => {
    if (!list || !currentUser?.email) return 'Viewer';

    const userEmail = normalizeEmail(currentUser.email);
    const ownerEmail = normalizeEmail(list.ownerEmail);

    if (ownerEmail && ownerEmail === userEmail) {
      return 'Owner';
    }

    const member = (list.members || []).find(
      (item) => normalizeEmail(item.email) === userEmail
    );

    return member?.role || list.accessRole || 'Viewer';
  };

  const canEditList = (list) => {
    const role = getListRole(list);
    return role === 'Owner' || role === 'Editor';
  };

  const canManageListMembers = (list) => {
    return getListRole(list) === 'Owner';
  };

  const resetLocalState = () => {
    setGroceryLists([]);
    setGroceryList([]);
    setSelectedListId(null);
    setUserPreferences(defaultUserData.userPreferences);
    setNotificationSettings(defaultUserData.notificationSettings);
  };

  const loadLegacyDataIfExists = async () => {
    const [legacyLists, legacyItems, legacyPrefs, legacyNotifications] =
      await Promise.all([
        AsyncStorage.getItem(LEGACY_KEYS.LISTS),
        AsyncStorage.getItem(LEGACY_KEYS.ITEMS),
        AsyncStorage.getItem(LEGACY_KEYS.PREFS),
        AsyncStorage.getItem(LEGACY_KEYS.NOTIFICATIONS),
      ]);

    const hasLegacyData =
      !!legacyLists || !!legacyItems || !!legacyPrefs || !!legacyNotifications;

    if (!hasLegacyData) return null;

    return {
      groceryLists: legacyLists ? JSON.parse(legacyLists) : [],
      groceryList: legacyItems ? JSON.parse(legacyItems) : [],
      userPreferences: legacyPrefs
        ? JSON.parse(legacyPrefs)
        : defaultUserData.userPreferences,
      notificationSettings: legacyNotifications
        ? JSON.parse(legacyNotifications)
        : defaultUserData.notificationSettings,
    };
  };

  const saveUserDataForEmail = async (email, data) => {
    await AsyncStorage.setItem(getUserDataKey(email), JSON.stringify(data));
  };

  const loadDataForEmail = async (email) => {
    const savedData = await AsyncStorage.getItem(getUserDataKey(email));
    return savedData ? JSON.parse(savedData) : null;
  };

  const loadUserData = async (email) => {
    try {
      const cleanEmail = normalizeEmail(email);
      let parsedData = await loadDataForEmail(cleanEmail);

      if (!parsedData) {
        const legacyData = await loadLegacyDataIfExists();

        if (legacyData) {
          parsedData = legacyData;
          await saveUserDataForEmail(cleanEmail, legacyData);
        } else {
          parsedData = defaultUserData;
          await saveUserDataForEmail(cleanEmail, defaultUserData);
        }
      }

      setGroceryLists(parsedData.groceryLists || []);
      setGroceryList(parsedData.groceryList || []);
      setUserPreferences(
        parsedData.userPreferences || defaultUserData.userPreferences
      );
      setNotificationSettings(
        parsedData.notificationSettings || defaultUserData.notificationSettings
      );
    } catch (error) {
      console.log('User data loading error:', error);
      resetLocalState();
    }
  };

  const saveCurrentUserData = async (nextLists = groceryLists, nextItems = groceryList) => {
    if (!currentUser?.email) return;

    const data = {
      groceryLists: nextLists,
      groceryList: nextItems,
      userPreferences,
      notificationSettings,
    };

    await saveUserDataForEmail(currentUser.email, data);
  };

  const registerInviteForList = async (list) => {
    if (!list.shared || !list.inviteCode || !list.ownerEmail) return;

    const invites = await getInvites();

    invites[String(list.inviteCode).trim().toUpperCase()] = {
      listId: list.id,
      ownerEmail: normalizeEmail(list.ownerEmail),
      listTitle: list.title,
    };

    await saveInvites(invites);
  };

  const syncSharedListMetaAcrossMembers = async (updatedList) => {
    if (!updatedList?.shared) return;

    const users = await getUsers();
    const memberEmails = (updatedList.members || [])
      .map((member) => normalizeEmail(member.email))
      .filter(Boolean);

    const targetEmails = Array.from(
      new Set([normalizeEmail(updatedList.ownerEmail), ...memberEmails])
    ).filter(Boolean);

    await Promise.all(
      users
        .filter((user) => targetEmails.includes(normalizeEmail(user.email)))
        .map(async (user) => {
          const email = normalizeEmail(user.email);
          const data = (await loadDataForEmail(email)) || defaultUserData;

          const role =
            email === normalizeEmail(updatedList.ownerEmail)
              ? 'Owner'
              : updatedList.members?.find(
                  (m) => normalizeEmail(m.email) === email
                )?.role || 'Viewer';

          const listForUser = {
            ...updatedList,
            accessRole: role,
          };

          const hasList = (data.groceryLists || []).some(
            (list) => list.id === updatedList.id
          );

          const nextLists = hasList
            ? (data.groceryLists || []).map((list) =>
                list.id === updatedList.id ? { ...list, ...listForUser } : list
              )
            : [listForUser, ...(data.groceryLists || [])];

          await saveUserDataForEmail(email, {
            ...data,
            groceryLists: nextLists,
          });
        })
    );
  };

  const syncSharedItemAcrossMembers = async (listId, item, action = 'upsert') => {
    const sourceList = groceryLists.find((list) => list.id === listId);
    if (!sourceList?.shared) return;

    const users = await getUsers();
    const memberEmails = (sourceList.members || [])
      .map((member) => normalizeEmail(member.email))
      .filter(Boolean);

    const targetEmails = Array.from(
      new Set([normalizeEmail(sourceList.ownerEmail), ...memberEmails])
    ).filter(Boolean);

    await Promise.all(
      users
        .filter((user) => {
          const email = normalizeEmail(user.email);
          return targetEmails.includes(email) && email !== normalizeEmail(currentUser?.email);
        })
        .map(async (user) => {
          const email = normalizeEmail(user.email);
          const data = (await loadDataForEmail(email)) || defaultUserData;

          let nextItems = data.groceryList || [];

          if (action === 'delete') {
            nextItems = nextItems.filter((oldItem) => oldItem.id !== item.id);
          } else {
            const exists = nextItems.some((oldItem) => oldItem.id === item.id);

            nextItems = exists
              ? nextItems.map((oldItem) =>
                  oldItem.id === item.id ? { ...oldItem, ...item } : oldItem
                )
              : [...nextItems, item];
          }

          await saveUserDataForEmail(email, {
            ...data,
            groceryList: nextItems,
          });
        })
    );
  };

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedCurrentUser = await AsyncStorage.getItem(
          AUTH_KEYS.CURRENT_USER
        );

        if (savedCurrentUser) {
          const user = JSON.parse(savedCurrentUser);
          setCurrentUser(user);
          await loadUserData(user.email);
        }
      } catch (error) {
        console.log('Auth loading error:', error);
      } finally {
        setIsStorageReady(true);
      }
    };

    loadAuth();
  }, []);

  useEffect(() => {
    if (!isStorageReady || !currentUser?.email) return;

    const saveData = async () => {
      try {
        await saveCurrentUserData();
      } catch (error) {
        console.log('User data saving error:', error);
      }
    };

    saveData();
  }, [
    groceryLists,
    groceryList,
    userPreferences,
    notificationSettings,
    currentUser,
    isStorageReady,
  ]);

  useEffect(() => {
    const baseSuggestions = [
      {
        id: '1',
        name: 'Whole Milk',
        usageNote: 'Usually bought every 7 days',
        quantity: 2,
        status: 'RUNNING LOW',
        tags: ['dairy'],
        protein: false,
        sugar: true,
        fiber: false,
        salt: false,
        gluten: false,
        type: 'meal',
      },
      {
        id: '2',
        name: 'Hass Avocados',
        usageNote: 'High fiber healthy fat option',
        quantity: 3,
        status: null,
        tags: ['vegetables'],
        protein: false,
        sugar: false,
        fiber: true,
        salt: false,
        gluten: false,
        type: 'snack',
      },
      {
        id: '3',
        name: 'Chicken Breast',
        usageNote: 'High protein choice for main meals',
        quantity: 1,
        status: null,
        tags: ['meat'],
        protein: true,
        sugar: false,
        fiber: false,
        salt: false,
        gluten: false,
        type: 'meal',
      },
      {
        id: '4',
        name: 'Greek Yogurt',
        usageNote: 'High protein, low sugar option',
        quantity: 2,
        status: null,
        tags: ['dairy'],
        protein: true,
        sugar: false,
        fiber: false,
        salt: false,
        gluten: false,
        type: 'snack',
      },
      {
        id: '5',
        name: 'Oats',
        usageNote: 'High fiber breakfast option',
        quantity: 1,
        status: null,
        tags: ['other'],
        protein: false,
        sugar: false,
        fiber: true,
        salt: false,
        gluten: true,
        type: 'meal',
      },
      {
        id: '6',
        name: 'Unsalted Almonds',
        usageNote: 'Healthy snack, high fiber',
        quantity: 1,
        status: null,
        tags: ['other'],
        protein: true,
        sugar: false,
        fiber: true,
        salt: false,
        gluten: false,
        type: 'snack',
      },
      {
        id: '7',
        name: 'Canned Tuna',
        usageNote: 'High protein but higher in salt',
        quantity: 2,
        status: null,
        tags: ['meat'],
        protein: true,
        sugar: false,
        fiber: false,
        salt: true,
        gluten: false,
        type: 'meal',
      },
      {
        id: '8',
        name: 'Bananas',
        usageNote: 'Quick snack option',
        quantity: 4,
        status: null,
        tags: ['vegetables'],
        protein: false,
        sugar: true,
        fiber: true,
        salt: false,
        gluten: false,
        type: 'snack',
      },
    ];

    let filtered = baseSuggestions;

    if (userPreferences.healthGoals.highProtein) {
      filtered = filtered.filter((item) => item.protein);
    }

    if (userPreferences.healthGoals.lowSugar) {
      filtered = filtered.filter((item) => !item.sugar);
    }

    if (userPreferences.healthGoals.highFiber) {
      filtered = filtered.filter((item) => item.fiber);
    }

    if (userPreferences.healthGoals.lowSalt) {
      filtered = filtered.filter((item) => !item.salt);
    }

    if (userPreferences.allergies.lactoseIntolerance) {
      filtered = filtered.filter((item) => !item.tags.includes('dairy'));
    }

    if (userPreferences.allergies.glutenSensitivity) {
      filtered = filtered.filter((item) => !item.gluten);
    }

    const mealsPerDay = userPreferences.mealPlanning.mealsPerDay || 3;
    const snackFrequency = userPreferences.mealPlanning.snackFrequency || 1;

    if (snackFrequency <= 0) {
      filtered = filtered.filter((item) => item.type !== 'snack');
    }

    const adjustedSuggestions = filtered.map((item) => {
      const householdMultiplier = Math.max(1, householdSize / 2);
      const mealMultiplier =
        item.type === 'meal' ? Math.max(1, mealsPerDay / 3) : 1;
      const snackMultiplier =
        item.type === 'snack' ? Math.max(1, snackFrequency) : 1;

      return {
        ...item,
        quantity: Math.max(
          1,
          Math.ceil(
            item.quantity *
              householdMultiplier *
              mealMultiplier *
              snackMultiplier
          )
        ),
      };
    });

    setSuggestions(adjustedSuggestions);
  }, [userPreferences, householdSize]);

  const register = async ({ name, email, password }) => {
    const cleanEmail = normalizeEmail(email);
    const users = await getUsers();

    const exists = users.find((user) => normalizeEmail(user.email) === cleanEmail);

    if (exists) {
      throw new Error('This email is already registered.');
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      language: 'English',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];

    await AsyncStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(updatedUsers));
    await AsyncStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(newUser));

    const legacyData = await loadLegacyDataIfExists();
    const firstData = legacyData || defaultUserData;

    await saveUserDataForEmail(cleanEmail, firstData);

    setCurrentUser(newUser);
    setGroceryLists(firstData.groceryLists || []);
    setGroceryList(firstData.groceryList || []);
    setUserPreferences(firstData.userPreferences || defaultUserData.userPreferences);
    setNotificationSettings(
      firstData.notificationSettings || defaultUserData.notificationSettings
    );

    return newUser;
  };

  const login = async ({ email, password }) => {
    const cleanEmail = normalizeEmail(email);
    const users = await getUsers();

    const user = users.find(
      (item) => normalizeEmail(item.email) === cleanEmail && item.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    await AsyncStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(user));

    setCurrentUser(user);
    await loadUserData(user.email);

    return user;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_KEYS.CURRENT_USER);
    setCurrentUser(null);
    resetLocalState();
  };

  const updateUserProfile = async (updates) => {
    if (!currentUser) return;

    const users = await getUsers();
    const updatedUser = { ...currentUser, ...updates };

    const updatedUsers = users.map((user) =>
      user.id === currentUser.id ? updatedUser : user
    );

    await AsyncStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(updatedUsers));
    await AsyncStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(updatedUser));

    setCurrentUser(updatedUser);
  };

  const createGroceryList = (listData) => {
    const isShared = !!listData.shared;
    const inviteCode = isShared ? generateInviteCode() : null;

    const newList = {
      id: `list_${Date.now()}`,
      title: listData.title,
      store: listData.store || '',
      shared: isShared,
      color: listData.color || '#2E7D32',
      icon: listData.icon || 'cart',
      categories: listData.categories || ['Grocery'],
      inviteCode,
      ownerEmail: normalizeEmail(currentUser?.email),
      ownerName: currentUser?.name || 'Owner',
      accessRole: 'Owner',
      members: isShared ? [getOwnerMember()] : [],
      createdAt: new Date().toISOString(),
    };

    setGroceryLists((prev) => [newList, ...prev]);
    setSelectedListId(newList.id);

    if (isShared) {
      registerInviteForList(newList);
    }

    return newList;
  };

  const updateGroceryList = (listId, updates) => {
    const oldList = groceryLists.find((list) => list.id === listId);
    if (!oldList) return;

    if (!canEditList(oldList)) {
      return;
    }

    let updatedList;

    const nextLists = groceryLists.map((list) => {
      if (list.id !== listId) return list;

      updatedList = {
        ...list,
        ...updates,
      };

      if (updates.shared) {
        updatedList.inviteCode = updatedList.inviteCode || generateInviteCode();
        updatedList.ownerEmail =
          updatedList.ownerEmail || normalizeEmail(currentUser?.email);
        updatedList.ownerName = updatedList.ownerName || currentUser?.name || 'Owner';
        updatedList.members = ensureOwnerMember(updatedList, updatedList.members || []);
        updatedList.accessRole = getListRole(updatedList);
      }

      if (updates.shared === false) {
        updatedList.members = [];
        updatedList.inviteCode = null;
        updatedList.accessRole = 'Owner';
      }

      return updatedList;
    });

    setGroceryLists(nextLists);

    if (updatedList?.shared) {
      registerInviteForList(updatedList);
      syncSharedListMetaAcrossMembers(updatedList);
    }
  };

  const deleteGroceryList = (listId) => {
    const list = groceryLists.find((item) => item.id === listId);
    if (!list) return;

    if (list.shared && getListRole(list) !== 'Owner') {
      setGroceryLists((prev) => prev.filter((item) => item.id !== listId));
      setGroceryList((prev) => prev.filter((item) => item.listId !== listId));
      return;
    }

    setGroceryLists((prev) => prev.filter((item) => item.id !== listId));
    setGroceryList((prev) => prev.filter((item) => item.listId !== listId));

    if (selectedListId === listId) {
      setSelectedListId(null);
    }
  };

  const addMemberToList = (listId, member) => {
    const list = groceryLists.find((item) => item.id === listId);
    if (!list || !canManageListMembers(list)) return;

    let updatedList;

    const nextLists = groceryLists.map((item) => {
      if (item.id !== listId) return item;

      const currentMembers = ensureOwnerMember(item, item.members || []);
      const cleanMember = {
        ...member,
        email: normalizeEmail(member.email),
        id: member.id || `member_${normalizeEmail(member.email)}`,
      };

      const exists = currentMembers.some(
        (m) => normalizeEmail(m.email) === normalizeEmail(cleanMember.email)
      );

      const nextMembers = exists
        ? currentMembers.map((m) =>
            normalizeEmail(m.email) === normalizeEmail(cleanMember.email)
              ? { ...m, ...cleanMember }
              : m
          )
        : [...currentMembers, cleanMember];

      updatedList = {
        ...item,
        shared: true,
        inviteCode: item.inviteCode || generateInviteCode(),
        members: nextMembers,
      };

      return updatedList;
    });

    setGroceryLists(nextLists);

    if (updatedList) {
      registerInviteForList(updatedList);
      syncSharedListMetaAcrossMembers(updatedList);
    }
  };

  const joinListByInviteCode = async (code) => {
    if (!currentUser?.email) {
      throw new Error('Please login first.');
    }

    const cleanCode = String(code || '').trim().toUpperCase();

    if (!cleanCode) {
      throw new Error('Please enter an invite code.');
    }

    const invites = await getInvites();
    const invite = invites[cleanCode];

    if (!invite) {
      throw new Error('Invalid invite code.');
    }

    const ownerEmail = normalizeEmail(invite.ownerEmail);
    const currentEmail = normalizeEmail(currentUser.email);

    if (ownerEmail === currentEmail) {
      throw new Error('This is your own list.');
    }

    const ownerData = await loadDataForEmail(ownerEmail);

    if (!ownerData) {
      throw new Error('The owner list was not found.');
    }

    const ownerList = (ownerData.groceryLists || []).find(
      (list) => list.id === invite.listId
    );

    if (!ownerList) {
      throw new Error('This shared list does not exist anymore.');
    }

    const newMember = {
      id: `member_${currentEmail}`,
      email: currentEmail,
      name: currentUser.name || currentEmail,
      role: 'Viewer',
      color: '#94A3B8',
    };

    const ownerListWithMember = {
      ...ownerList,
      shared: true,
      inviteCode: cleanCode,
      members: ensureOwnerMember(ownerList, ownerList.members || []),
    };

    const memberExists = ownerListWithMember.members.some(
      (member) => normalizeEmail(member.email) === currentEmail
    );

    if (!memberExists) {
      ownerListWithMember.members = [...ownerListWithMember.members, newMember];
    }

    const joinedList = {
      ...ownerListWithMember,
      accessRole:
        ownerListWithMember.members.find(
          (member) => normalizeEmail(member.email) === currentEmail
        )?.role || 'Viewer',
    };

    const ownerNextLists = (ownerData.groceryLists || []).map((list) =>
      list.id === ownerList.id ? ownerListWithMember : list
    );

    await saveUserDataForEmail(ownerEmail, {
      ...ownerData,
      groceryLists: ownerNextLists,
    });

    const currentData = {
      groceryLists,
      groceryList,
      userPreferences,
      notificationSettings,
    };

    const alreadyJoined = groceryLists.some((list) => list.id === joinedList.id);

    const nextLists = alreadyJoined
      ? groceryLists.map((list) =>
          list.id === joinedList.id ? { ...list, ...joinedList } : list
        )
      : [joinedList, ...groceryLists];

    const ownerItems = (ownerData.groceryList || []).filter(
      (item) => item.listId === ownerList.id
    );

    const existingItemIds = new Set(groceryList.map((item) => item.id));

    const nextItems = [
      ...groceryList,
      ...ownerItems.filter((item) => !existingItemIds.has(item.id)),
    ];

    setGroceryLists(nextLists);
    setGroceryList(nextItems);

    await saveUserDataForEmail(currentEmail, {
      ...currentData,
      groceryLists: nextLists,
      groceryList: nextItems,
    });

    await syncSharedListMetaAcrossMembers(ownerListWithMember);

    return joinedList;
  };

  

  const removeMemberFromList = (listId, memberId) => {
    const list = groceryLists.find((item) => item.id === listId);
    if (!list || !canManageListMembers(list)) return;

    let updatedList;

    const nextLists = groceryLists.map((item) => {
      if (item.id !== listId) return item;

      const filteredMembers = (item.members || []).filter(
        (member) => member.id !== memberId && member.role !== 'Owner'
      );

      updatedList = {
        ...item,
        members: ensureOwnerMember(item, filteredMembers),
      };

      return updatedList;
    });

    setGroceryLists(nextLists);

    if (updatedList) {
      syncSharedListMetaAcrossMembers(updatedList);
    }
  };

  const updateMemberRole = (listId, memberId, newRole) => {
    const list = groceryLists.find((item) => item.id === listId);
    if (!list || !canManageListMembers(list)) return;

    let updatedList;

    const nextLists = groceryLists.map((item) => {
      if (item.id !== listId) return item;

      updatedList = {
        ...item,
        members: ensureOwnerMember(item, item.members || []).map((member) => {
          if (member.id !== memberId) return member;
          if (member.role === 'Owner') return member;

          return {
            ...member,
            role: newRole,
          };
        }),
      };

      return updatedList;
    });

    setGroceryLists(nextLists);

    if (updatedList) {
      syncSharedListMetaAcrossMembers(updatedList);
    }
  };

  const getItemsForList = (listId) => {
    return groceryList.filter((item) => item.listId === listId);
  };

  const addToGroceryList = (item) => {
    const targetListId = item.listId || selectedListId || 'default_list';
    const targetList = groceryLists.find((list) => list.id === targetListId);

    if (targetList && !canEditList(targetList)) {
      return false;
    }

    const now = new Date().toISOString();

    const newItem = {
      ...item,
      id: item.id || `item_${Date.now()}`,
      listId: targetListId,
      checked: item.checked || false,
      favorite: item.favorite || false,
      createdAt: item.createdAt || now,
      updatedAt: now,
    };

    const nextItems = [...groceryList, newItem];

    setGroceryList(nextItems);

    if (targetList?.shared) {
      syncSharedItemAcrossMembers(targetListId, newItem, 'upsert');
    }

    return true;
  };

  const removeFromGroceryList = (itemId) => {
    const item = groceryList.find((oldItem) => oldItem.id === itemId);
    if (!item) return false;

    const list = groceryLists.find((target) => target.id === item.listId);

    if (list && !canEditList(list)) {
      return false;
    }

    setGroceryList((prev) => prev.filter((oldItem) => oldItem.id !== itemId));

    if (list?.shared) {
      syncSharedItemAcrossMembers(list.id, item, 'delete');
    }

    return true;
  };

  const updateGroceryItem = (itemId, updates) => {
    const oldItem = groceryList.find((item) => item.id === itemId);
    if (!oldItem) return false;

    const list = groceryLists.find((target) => target.id === oldItem.listId);

    if (list && !canEditList(list)) {
      return false;
    }

    const updatedItem = {
      ...oldItem,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setGroceryList((prev) =>
      prev.map((item) => (item.id === itemId ? updatedItem : item))
    );

    if (list?.shared) {
      syncSharedItemAcrossMembers(list.id, updatedItem, 'upsert');
    }

    return true;
  };

  const toggleGroceryItem = (itemId) => {
    const oldItem = groceryList.find((item) => item.id === itemId);
    if (!oldItem) return false;

    const list = groceryLists.find((target) => target.id === oldItem.listId);

    if (list && !canEditList(list)) {
      return false;
    }

    const updatedItem = {
      ...oldItem,
      checked: !oldItem.checked,
      updatedAt: new Date().toISOString(),
    };

    setGroceryList((prev) =>
      prev.map((item) => (item.id === itemId ? updatedItem : item))
    );

    if (list?.shared) {
      syncSharedItemAcrossMembers(list.id, updatedItem, 'upsert');
    }

    return true;
  };

  const toggleFavoriteItem = (itemId) => {
    const oldItem = groceryList.find((item) => item.id === itemId);
    if (!oldItem) return false;

    const list = groceryLists.find((target) => target.id === oldItem.listId);

    if (list && !canEditList(list)) {
      return false;
    }

    const updatedItem = {
      ...oldItem,
      favorite: !oldItem.favorite,
      updatedAt: new Date().toISOString(),
    };

    setGroceryList((prev) =>
      prev.map((item) => (item.id === itemId ? updatedItem : item))
    );

    if (list?.shared) {
      syncSharedItemAcrossMembers(list.id, updatedItem, 'upsert');
    }

    return true;
  };

  const getRecentItems = () => {
    return [...groceryList]
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      )
      .slice(0, 20);
  };

  const getFavoriteItems = () => {
    return groceryList.filter((item) => item.favorite);
  };

  const getFrequentlyBoughtItems = () => {
    const grouped = {};

    groceryList.forEach((item) => {
      const key = item.name.trim().toLowerCase();

      if (!grouped[key]) {
        grouped[key] = {
          ...item,
          count: 0,
        };
      }

      grouped[key].count += 1;
    });

    return Object.values(grouped).sort((a, b) => b.count - a.count);
  };

  const getExpiringSoonItems = (
    daysBefore = notificationSettings.expiryDaysBefore
  ) => {
    return groceryList
      .map((item) => {
        const daysLeft = getDaysUntilExpiry(item.expiryDate);
        const expiryLabel = getExpiryLabel(item.expiryDate);

        return {
          ...item,
          daysLeft,
          expiryLabel,
        };
      })
      .filter((item) => item.daysLeft !== null)
      .filter((item) => item.daysLeft <= daysBefore)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  };

  const getExpiryInfo = (expiryDate) => {
    const daysLeft = getDaysUntilExpiry(expiryDate);

    return {
      daysLeft,
      label: getExpiryLabel(expiryDate),
      isExpired: daysLeft !== null && daysLeft < 0,
      isExpiringToday: daysLeft === 0,
      isExpiringSoon:
        daysLeft !== null &&
        daysLeft >= 0 &&
        daysLeft <= notificationSettings.expiryDaysBefore,
    };
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
        isStorageReady,

        currentUser,
        userProfile,
        register,
        login,
        logout,
        updateUserProfile,

        userPreferences,
        setUserPreferences,
        updatePreferences,

        groceryLists,
        setGroceryLists,
        selectedListId,
        setSelectedListId,
        createGroceryList,
        updateGroceryList,
        deleteGroceryList,

        getListRole,
        canEditList,
        canManageListMembers,
        joinListByInviteCode,
        addMemberToList,
        removeMemberFromList,
        updateMemberRole,

        groceryList,
        setGroceryList,
        getItemsForList,
        addToGroceryList,
        removeFromGroceryList,
        updateGroceryItem,
        toggleGroceryItem,
        toggleFavoriteItem,
        getRecentItems,
        getFavoriteItems,
        getFrequentlyBoughtItems,

        getExpiringSoonItems,
        getExpiryInfo,

        suggestions,
        householdSize,
        setHouseholdSize,
        includeExpiringSoon,
        setIncludeExpiringSoon,

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

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
};