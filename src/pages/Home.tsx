import { useState, useEffect } from 'react';
import { Bell, Settings, Zap, TrendingUp, Star, Crown, Gem, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadUserData, saveUserData } from '@/lib/storage';
import { UserData, FloatingNumber } from '@/types';
import { GAME_CONSTANTS, RANK_TIERS, RAINBOW_MILESTONES } from '@/constants/game';
import { BottomNav } from '@/components/BottomNav';
import { SuccessOverlay } from '@/components/modals/SuccessOverlay';
import { RewardConfirmation } from '@/components/modals/RewardConfirmation';
import { CreditConfirmation } from '@/components/modals/CreditConfirmation';
import { RainbowBonus } from '@/components/modals/RainbowBonus';

export default function HomePage() {
  const [userData, setUserData] = useState<UserData>(() => loadUserData());
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [currentTapSession, setCurrentTapSession] = useState(0);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showRewardConfirmation, setShowRewardConfirmation] = useState(false);
  const [showCreditConfirmation, setShowCreditConfirmation] = useState(false);
  const [showRainbowBonus, setShowRainbowBonus] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    saveUserData(userData);
  }, [userData]);

  const handleTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (userData.dailyAttemptsRemaining <= 0 || isButtonDisabled) return;

    // Calculate tap value (60% for +1, 40% for +2)
    const random = Math.random();
    const tapValue = random < GAME_CONSTANTS.TAP_VALUE_WEIGHTS[1] ? 1 : 2;

    // Get tap position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add floating number
    const newFloating: FloatingNumber = {
      id: `${Date.now()}-${Math.random()}`,
      value: tapValue,
      x,
      y,
    };
    setFloatingNumbers((prev) => [...prev, newFloating]);

    // Remove after animation
    setTimeout(() => {
      setFloatingNumbers((prev) => prev.filter((f) => f.id !== newFloating.id));
    }, 600);

    // Update state
    const newTapCount = currentTapSession + 1;
    setCurrentTapSession(newTapCount);
    
    setUserData((prev) => ({
      ...prev,
      pendingAmount: prev.pendingAmount + tapValue,
    }));

    // Check if we've reached 5 taps
    if (newTapCount >= GAME_CONSTANTS.TAPS_FOR_SUCCESS) {
      setShowSuccessOverlay(true);
      setCurrentTapSession(0);
    }
  };

  const handleConfirmReward = () => {
    setShowSuccessOverlay(false);
    setShowRewardConfirmation(true);
  };

  const handleRewardComplete = () => {
    setShowRewardConfirmation(false);
    
    // Check if we should show rainbow bonus
    const newAdCount = userData.adCompletionCount + 1;
    const shouldShowRainbow = newAdCount % GAME_CONSTANTS.RAINBOW_TRIGGER_COUNT === 0;
    
    if (shouldShowRainbow) {
      setShowRainbowBonus(true);
    } else {
      confirmCredit();
    }
    
    setUserData((prev) => ({
      ...prev,
      adCompletionCount: newAdCount,
      rainbowProgress: newAdCount % GAME_CONSTANTS.RAINBOW_TRIGGER_COUNT,
      dailyAttemptsRemaining: prev.dailyAttemptsRemaining - 1,
    }));
  };

  const handleRainbowBonus = () => {
    setUserData((prev) => ({
      ...prev,
      pendingAmount: prev.pendingAmount * 2, // Double the reward
    }));
    setShowRainbowBonus(false);
    confirmCredit();
  };

  const confirmCredit = () => {
    setUserData((prev) => ({
      ...prev,
      totalAmount: prev.totalAmount + prev.pendingAmount,
      todayEarned: prev.todayEarned + prev.pendingAmount,
      pendingAmount: 0,
    }));
    setShowCreditConfirmation(true);
    setTimeout(() => setShowCreditConfirmation(false), 2500);
  };

  const getCurrentRank = () => {
    const ranks = Object.values(RANK_TIERS);
    return ranks.find(
      (rank) => userData.totalAmount >= rank.min && userData.totalAmount < rank.max
    ) || RANK_TIERS.DIAMOND;
  };

  const currentRank = getCurrentRank();
  const nextRank = Object.values(RANK_TIERS).find(r => r.min > currentRank.min);
  const rankProgress = nextRank 
    ? ((userData.totalAmount - currentRank.min) / (nextRank.min - currentRank.min)) * 100
    : 100;

  const getRankIcon = (iconName: string) => {
    const icons = { Zap, Star, Crown, Gem };
    return icons[iconName as keyof typeof icons] || Zap;
  };

  const RankIcon = getRankIcon(currentRank.icon);

  return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl gradient-card flex items-center justify-center text-success text-lg font-bold">
            툭
          </div>
          <div>
            <p className="text-sm font-medium">{userData.username}님</p>
            <p className="text-xs text-muted-foreground">오늘도 돈 벌러 오셨군요! 💰</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Balance Display */}
      <div className="gradient-card rounded-3xl p-6 mb-6 border border-border">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-success text-sm">🛡️ 99.9% 지급 보장</span>
        </div>
        <p className="text-center text-sm text-muted-foreground mb-2">내 보유 금액</p>
        <h1 className="text-center text-5xl font-black text-gold text-shadow-glow mb-4">
          ✨ {userData.totalAmount.toLocaleString()}원 ✨
        </h1>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="bg-success/20 text-success px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            오늘 +{userData.todayEarned.toLocaleString()}원
          </div>
          {userData.pendingAmount > 0 && (
            <div className="bg-gold/20 text-gold px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Star className="w-4 h-4" />
              +{userData.pendingAmount.toLocaleString()}원 적립 중
            </div>
          )}
        </div>
      </div>

      {/* Tap Area */}
      <div className="gradient-card rounded-3xl p-6 mb-6 border border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-3xl" />
        
        <div className="relative">
          {/* Mascot */}
          <div className="flex items-center justify-center mb-4 relative h-80">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-8xl"
            >
              🦝
            </motion.div>
            
            {/* Floating Numbers */}
            <AnimatePresence>
              {floatingNumbers.map((floating) => (
                <motion.div
                  key={floating.id}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -80, scale: 1.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute text-gold font-black text-2xl pointer-events-none"
                  style={{ left: floating.x, top: floating.y }}
                >
                  +{floating.value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Tap Button */}
          <motion.button
            whileTap={{ scale: userData.dailyAttemptsRemaining > 0 ? 1.08 : 1 }}
            onClick={handleTap}
            disabled={userData.dailyAttemptsRemaining <= 0}
            className="w-full gradient-primary rounded-2xl py-6 text-white font-bold text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div>툭! 누르고 돈 벌기</div>
            {userData.pendingAmount > 0 && (
              <div className="text-sm mt-1">+{userData.pendingAmount}원 모이는 중</div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Daily Attempts & Rainbow Progress */}
      <div className="gradient-card rounded-3xl p-5 mb-6 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <span className="font-medium">남은 기회</span>
          </div>
          <span className="font-bold text-lg">
            {userData.dailyAttemptsRemaining}/{GAME_CONSTANTS.MAX_DAILY_ATTEMPTS}회
          </span>
        </div>
        <div className="bg-secondary rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="bg-accent h-full transition-all duration-300"
            style={{
              width: `${(userData.dailyAttemptsRemaining / GAME_CONSTANTS.MAX_DAILY_ATTEMPTS) * 100}%`,
            }}
          />
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌈</span>
              <span className="font-medium">무지개 툭구리</span>
            </div>
            <span className="font-bold">
              {userData.rainbowProgress}/{GAME_CONSTANTS.RAINBOW_TRIGGER_COUNT}회
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            {RAINBOW_MILESTONES.map((milestone, idx) => {
              const isReached = userData.rainbowProgress >= milestone;
              const isFinal = idx === RAINBOW_MILESTONES.length - 1;
              
              return (
                <div key={milestone} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                      isReached
                        ? 'gradient-rainbow text-white'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {isReached ? (isFinal ? '★' : '✓') : '○'}
                  </div>
                  <span className="text-xs text-muted-foreground">{milestone}</span>
                </div>
              );
            })}
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-3">
            광고 10회 시청하면 2배 보너스!
          </p>
        </div>
      </div>

      {/* User Rank Badge */}
      <div className="gradient-card rounded-3xl p-5 mb-6 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <RankIcon className={`w-6 h-6 text-${currentRank.color}-500`} />
            <span className="font-bold text-lg">툭구리마스터</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-accent/20 text-accent font-bold text-sm">
            {currentRank.name}
          </span>
        </div>
        
        <div className="bg-secondary rounded-full h-3 mb-2 overflow-hidden">
          <div
            className="gradient-gold h-full transition-all duration-300"
            style={{ width: `${rankProgress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {nextRank ? `${nextRank.name}까지 ${(nextRank.min - userData.totalAmount).toLocaleString()}원` : '최고 등급'}
          </span>
          <span className="text-accent font-bold">보너스 +{currentRank.bonus}%</span>
        </div>
      </div>

      {/* Friend Invite */}
      <div className="gradient-card rounded-3xl p-5 mb-6 border border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-bold">친구 초대</span>
          </div>
          <span className="text-gold font-bold">+{userData.totalReferralBonus.toLocaleString()}원</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">친구도 나도 함께 돈 벌기</p>
        
        <div className="bg-secondary rounded-xl p-3 mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span>🎁</span>
            <span>가입 즉시 500P 지급</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>📈</span>
            <span>친구 수익의 10% 무제한</span>
          </div>
        </div>
        
        <div className="text-center mb-3">
          <p className="text-xs text-muted-foreground mb-2">내 초대 코드</p>
          <div className="flex items-center justify-center gap-2">
            <code className="px-4 py-2 bg-secondary rounded-lg font-mono font-bold text-lg">
              {userData.referralCode}
            </code>
            <button className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
              📋
            </button>
          </div>
        </div>
        
        <button className="w-full gradient-success rounded-2xl py-3 text-white font-bold shadow-lg mb-3">
          👥 친구에게 공유하기
        </button>
        
        <button className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-left flex items-center justify-between px-2">
          <span>내 친구 {userData.friends.length}명</span>
          <span>▶</span>
        </button>
      </div>

      <BottomNav />
      
      {/* Modals */}
      <SuccessOverlay
        isOpen={showSuccessOverlay}
        onClose={() => setShowSuccessOverlay(false)}
        pendingAmount={userData.pendingAmount}
        onConfirm={handleConfirmReward}
      />
      
      <RewardConfirmation
        isOpen={showRewardConfirmation}
        onComplete={handleRewardComplete}
        pendingAmount={userData.pendingAmount}
      />
      
      <CreditConfirmation
        isOpen={showCreditConfirmation}
        amount={userData.pendingAmount}
      />
      
      <RainbowBonus
        isOpen={showRainbowBonus}
        onClaim={handleRainbowBonus}
        onClose={() => {
          setShowRainbowBonus(false);
          confirmCredit();
        }}
      />
    </div>
  );
}
