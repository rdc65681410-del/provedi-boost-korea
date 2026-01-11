import { useState } from 'react';
import { Flame, CheckCircle } from 'lucide-react';
import { loadUserData, saveUserData } from '@/lib/storage';
import { BottomNav } from '@/components/BottomNav';
import { STREAK_REWARDS } from '@/constants/game';

export default function RewardsPage() {
  const [userData, setUserData] = useState(() => loadUserData());

  const handleCheckIn = () => {
    const today = new Date().toDateString();
    
    if (userData.lastCheckInDate === today) {
      // Already checked in today
      return;
    }

    // Update check-in data
    const currentDay = userData.checkInDays.filter((d) => d).length;
    if (currentDay < 7) {
      const newCheckInDays = [...userData.checkInDays];
      newCheckInDays[currentDay] = true;

      const reward = STREAK_REWARDS[currentDay];

      setUserData((prev) => {
        const updated = {
          ...prev,
          lastCheckInDate: today,
          checkInDays: newCheckInDays,
          currentStreak: currentDay + 1,
          totalAmount: prev.totalAmount + reward,
        };
        saveUserData(updated);
        return updated;
      });
    }
  };

  const canCheckIn = userData.lastCheckInDate !== new Date().toDateString();
  const checkedDays = userData.checkInDays.filter((d) => d).length;

  return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      <header className="mb-6">
        <h1 className="text-3xl font-black mb-2">출석 보상</h1>
        <p className="text-muted-foreground">매일 출석하고 보상을 받으세요</p>
      </header>

      {/* Streak Counter */}
      <div className="gradient-card rounded-3xl p-6 mb-6 border border-border text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Flame className="w-8 h-8 text-orange-500" />
          <h2 className="text-4xl font-black">{userData.currentStreak}일</h2>
        </div>
        <p className="text-muted-foreground">연속 출석 중</p>
      </div>

      {/* Check-in Calendar */}
      <div className="gradient-card rounded-3xl p-6 mb-6 border border-border">
        <h2 className="font-bold text-lg mb-4 text-center">이번 주 출석</h2>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {Array.from({ length: 7 }).map((_, index) => {
            const isChecked = userData.checkInDays[index];
            const isCurrent = index === checkedDays && canCheckIn;
            const isLocked = index > checkedDays;
            const reward = STREAK_REWARDS[index];

            return (
              <div
                key={index}
                className={`aspect-square rounded-2xl p-2 flex flex-col items-center justify-center text-center ${
                  isChecked
                    ? 'gradient-success text-white'
                    : isCurrent
                    ? 'gradient-gold text-white animate-pulse'
                    : isLocked
                    ? 'bg-secondary/50 text-muted-foreground'
                    : 'bg-secondary'
                }`}
              >
                <div className="text-2xl mb-1">
                  {isChecked ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : isCurrent ? (
                    '🎁'
                  ) : isLocked ? (
                    '🔒'
                  ) : (
                    '📅'
                  )}
                </div>
                <div className="text-xs font-bold mb-1">{index + 1}일</div>
                <div className="text-xs font-medium">
                  {isChecked ? '✓' : `+${reward}`}
                </div>
              </div>
            );
          })}
        </div>

        {canCheckIn ? (
          <button
            onClick={handleCheckIn}
            className="w-full gradient-gold text-white rounded-2xl py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            📅 출석 체크하기
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-secondary text-muted-foreground rounded-2xl py-4 font-bold text-lg"
          >
            ✅ 오늘 출석 완료
          </button>
        )}
      </div>

      {/* Rewards Info */}
      <div className="gradient-card rounded-3xl p-6 mb-6 border border-border">
        <h2 className="font-bold text-lg mb-4">출석 보상 안내</h2>
        <div className="space-y-2">
          {STREAK_REWARDS.map((reward, index) => {
            const isCompleted = userData.checkInDays[index];

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  isCompleted ? 'bg-success/20 text-success' : 'bg-secondary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{isCompleted ? '✅' : '📅'}</span>
                  <span className="font-medium">Day {index + 1}</span>
                </div>
                <span className="font-bold text-lg">+{reward}P</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="gradient-card rounded-3xl p-5 mb-6 border border-border">
        <h3 className="font-bold mb-3">💡 출석 팁</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• 매일 출석하면 누적 보상이 증가합니다</li>
          <li>• 7일 연속 출석 시 최대 200P 보상!</li>
          <li>• 하루라도 빠지면 처음부터 다시 시작됩니다</li>
          <li>• 알림을 켜두면 출석을 잊지 않아요</li>
        </ul>
      </div>

      <BottomNav />
    </div>
  );
}
