// localStorage utility for TUK app

import { UserData } from '@/types';
import { GAME_CONSTANTS } from '@/constants/game';

const STORAGE_KEY = 'tuk_user_data';

export const getInitialUserData = (): UserData => {
  const today = new Date().toDateString();
  
  return {
    username: '툭구리마스터',
    totalAmount: 3240,
    pendingAmount: 7,
    todayEarned: 0,
    dailyAttemptsRemaining: GAME_CONSTANTS.MAX_DAILY_ATTEMPTS,
    rainbowProgress: 0,
    currentStreak: 5,
    lastCheckInDate: null,
    checkInDays: [true, true, true, true, true, false, false],
    rank: 'BRONZE',
    referralCode: 'TUKGURI123',
    friends: [
      {
        id: '1',
        name: '친구1',
        joinDate: '2024-01-01',
        myBonus: 2340,
      },
      {
        id: '2',
        name: '친구2',
        joinDate: '2024-01-05',
        myBonus: 3120,
      },
      {
        id: '3',
        name: '친구3',
        joinDate: '2024-01-10',
        myBonus: 1890,
      },
      {
        id: '4',
        name: '친구4',
        joinDate: '2024-01-15',
        myBonus: 2560,
      },
      {
        id: '5',
        name: '친구5',
        joinDate: '2024-01-20',
        myBonus: 1960,
      },
    ],
    totalReferralBonus: 11870,
    adCompletionCount: 0,
  };
};

export const loadUserData = (): UserData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Reset daily attempts if it's a new day
      const lastDate = data.lastCheckInDate;
      const today = new Date().toDateString();
      
      if (lastDate !== today) {
        data.dailyAttemptsRemaining = GAME_CONSTANTS.MAX_DAILY_ATTEMPTS;
        data.todayEarned = 0;
      }
      
      return data;
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  
  return getInitialUserData();
};

export const saveUserData = (data: UserData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const resetUserData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting user data:', error);
  }
};
