import { Crown, Copy, Share2 } from 'lucide-react';
import { loadUserData } from '@/lib/storage';
import { BottomNav } from '@/components/BottomNav';
import { REFERRAL_REWARDS } from '@/constants/game';

export default function FriendsPage() {
  const userData = loadUserData();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userData.referralCode);
    // TODO: Show toast notification
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '툭 - 돈 버는 앱',
        text: `내 초대 코드: ${userData.referralCode}\n가입하고 500원 받아가세요!`,
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      <header className="mb-6">
        <h1 className="text-3xl font-black mb-2">친구 초대</h1>
        <p className="text-muted-foreground">친구도 나도 함께 돈 벌기</p>
      </header>

      {/* Total Stats */}
      <div className="gradient-card rounded-3xl p-6 mb-6 border border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">총 초대한 친구</p>
            <p className="text-3xl font-black text-primary">{userData.friends.length}명</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">총 보너스</p>
            <p className="text-3xl font-black text-gold">
              {userData.totalReferralBonus.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>

      {/* Referral Benefits */}
      <div className="gradient-card rounded-3xl p-6 mb-6 border border-border">
        <h2 className="font-bold text-lg mb-4">초대 혜택</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-secondary/50 rounded-xl p-3">
            <span className="text-2xl">🎁</span>
            <div>
              <p className="font-medium">가입 즉시 500P 지급</p>
              <p className="text-sm text-muted-foreground">
                친구가 가입하면 둘 다 {REFERRAL_REWARDS.SIGNUP_BONUS}원씩!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-secondary/50 rounded-xl p-3">
            <span className="text-2xl">📈</span>
            <div>
              <p className="font-medium">친구 수익의 {REFERRAL_REWARDS.COMMISSION_RATE * 100}% 무제한</p>
              <p className="text-sm text-muted-foreground">
                친구가 돈을 벌면 나도 평생 수익!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="gradient-card rounded-3xl p-6 mb-6 border border-border">
        <h2 className="font-bold text-lg mb-4 text-center">내 초대 코드</h2>
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-6 mb-4 text-center border border-primary/30">
          <code className="text-3xl font-mono font-black tracking-wider">
            {userData.referralCode}
          </code>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyCode}
            className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 rounded-xl py-3 font-medium transition-colors"
          >
            <Copy className="w-5 h-5" />
            복사하기
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 gradient-primary text-white rounded-xl py-3 font-medium"
          >
            <Share2 className="w-5 h-5" />
            공유하기
          </button>
        </div>
      </div>

      {/* Friends List */}
      <div className="gradient-card rounded-3xl p-6 mb-6 border border-border">
        <h2 className="font-bold text-lg mb-4">내 친구 목록</h2>
        <div className="space-y-3">
          {userData.friends.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-6xl mb-3">😢</p>
              <p className="text-muted-foreground">아직 초대한 친구가 없어요</p>
            </div>
          ) : (
            userData.friends.map((friend, index) => (
              <div
                key={friend.id}
                className="flex items-center gap-4 bg-secondary/50 rounded-xl p-4"
              >
                <div className="flex-shrink-0 w-10 text-center">
                  {index === 0 ? (
                    <Crown className="w-6 h-6 text-gold mx-auto" />
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{friend.name}</p>
                  <p className="text-sm text-muted-foreground">
                    가입일: {new Date(friend.joinDate).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gold">
                    +{friend.myBonus.toLocaleString()}원
                  </p>
                  <p className="text-xs text-muted-foreground">내 보너스</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
