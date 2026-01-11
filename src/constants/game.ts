// TUK (툭) App Constants

export const GAME_CONSTANTS = {
  TAPS_FOR_SUCCESS: 5,
  MAX_DAILY_ATTEMPTS: 30,
  RAINBOW_TRIGGER_COUNT: 10,
  AD_COUNTDOWN_SECONDS: 15,
  MIN_TAP_VALUE: 1,
  MAX_TAP_VALUE: 2,
  TAP_VALUE_WEIGHTS: { 1: 0.6, 2: 0.4 }, // 60% chance for +1, 40% for +2
} as const;

export const STREAK_REWARDS = [10, 20, 30, 50, 70, 100, 200] as const;

export const RANK_TIERS = {
  BRONZE: {
    name: '브론즈',
    min: 0,
    max: 20000,
    icon: 'Zap',
    color: 'orange',
    bonus: 0,
  },
  SILVER: {
    name: '실버',
    min: 20000,
    max: 50000,
    icon: 'Star',
    color: 'gray',
    bonus: 5,
  },
  GOLD: {
    name: '골드',
    min: 50000,
    max: 100000,
    icon: 'Crown',
    color: 'yellow',
    bonus: 10,
  },
  DIAMOND: {
    name: '다이아',
    min: 100000,
    max: Infinity,
    icon: 'Gem',
    color: 'cyan',
    bonus: 15,
  },
} as const;

export const MISSION_TYPES = {
  TAP: { icon: 'Zap', color: 'purple' },
  AD: { icon: 'Play', color: 'green' },
  FRIEND: { icon: 'Users', color: 'blue' },
  CHECKIN: { icon: 'Calendar', color: 'orange' },
} as const;

export const RAINBOW_MILESTONES = [2, 4, 6, 8, 10] as const;

export const REFERRAL_REWARDS = {
  SIGNUP_BONUS: 500,
  COMMISSION_RATE: 0.1, // 10%
} as const;
