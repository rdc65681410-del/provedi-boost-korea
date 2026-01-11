// TUK (툭) App Type Definitions

export interface UserData {
  username: string;
  totalAmount: number;
  pendingAmount: number;
  todayEarned: number;
  dailyAttemptsRemaining: number;
  rainbowProgress: number;
  currentStreak: number;
  lastCheckInDate: string | null;
  checkInDays: boolean[];
  rank: RankTier;
  referralCode: string;
  friends: Friend[];
  totalReferralBonus: number;
  adCompletionCount: number;
}

export type RankTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';

export interface Friend {
  id: string;
  name: string;
  joinDate: string;
  myBonus: number;
}

export interface FloatingNumber {
  id: string;
  value: number;
  x: number;
  y: number;
}

export interface Mission {
  id: string;
  type: 'daily' | 'weekly' | 'special';
  category: 'TAP' | 'AD' | 'FRIEND' | 'CHECKIN';
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
  claimed: boolean;
}

export interface RankingUser {
  rank: number;
  username: string;
  amount: number;
  isMe?: boolean;
}
