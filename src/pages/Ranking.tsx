import { Crown, Medal, Award } from 'lucide-react';
import { loadUserData } from '@/lib/storage';
import { BottomNav } from '@/components/BottomNav';
import { RankingUser } from '@/types';

export default function RankingPage() {
  const userData = loadUserData();

  // Mock ranking data
  const rankings: RankingUser[] = [
    { rank: 1, username: '랭킹1위', amount: 125000 },
    { rank: 2, username: '돈많은사람', amount: 98500 },
    { rank: 3, username: '부자되기', amount: 87600 },
    { rank: 4, username: '열심히탭', amount: 75200 },
    { rank: 5, username: '매일출석', amount: 68900 },
    { rank: 6, username: userData.username, amount: userData.totalAmount, isMe: true },
    { rank: 7, username: '툭마스터', amount: 52100 },
    { rank: 8, username: '광고왕', amount: 48700 },
    { rank: 9, username: '친구많아', amount: 45300 },
    { rank: 10, username: '꾸준히', amount: 42800 },
  ];

  const topThree = rankings.slice(0, 3);
  const restOfRankings = rankings.slice(3);

  const getPodiumIcon = (rank: number) => {
    const icons = [
      { Icon: Crown, color: 'text-yellow-500', bgColor: 'bg-yellow-500/20' },
      { Icon: Medal, color: 'text-gray-400', bgColor: 'bg-gray-400/20' },
      { Icon: Award, color: 'text-orange-600', bgColor: 'bg-orange-600/20' },
    ];
    return icons[rank - 1];
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      <header className="mb-6">
        <h1 className="text-3xl font-black mb-2">랭킹</h1>
        <p className="text-muted-foreground">전체 사용자 순위를 확인하세요</p>
      </header>

      {/* My Rank */}
      <div className="gradient-card rounded-3xl p-5 mb-6 border border-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-2xl">😎</span>
            </div>
            <div>
              <p className="font-bold text-lg">{userData.username}</p>
              <p className="text-sm text-muted-foreground">내 순위</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-primary">#{6}</p>
            <p className="text-sm text-gold font-bold">
              {userData.totalAmount.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="gradient-card rounded-3xl p-6 mb-6 border border-border">
        <h2 className="font-bold text-lg mb-6 text-center">🏆 Top 3</h2>
        
        <div className="flex items-end justify-center gap-4 mb-6">
          {/* 2nd Place */}
          <div className="flex-1 text-center">
            <div className="mb-3">
              {(() => {
                const { Icon, color, bgColor } = getPodiumIcon(2);
                return (
                  <div className={`w-16 h-16 mx-auto rounded-full ${bgColor} flex items-center justify-center mb-2`}>
                    <Icon className={`w-8 h-8 ${color}`} />
                  </div>
                );
              })()}
              <p className="font-bold truncate">{topThree[1].username}</p>
              <p className="text-sm text-gold">
                {topThree[1].amount.toLocaleString()}원
              </p>
            </div>
            <div className="bg-gradient-to-t from-gray-500/30 to-gray-500/10 rounded-t-2xl h-24 flex items-center justify-center">
              <span className="text-2xl font-black text-gray-400">2</span>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex-1 text-center">
            <div className="mb-3">
              {(() => {
                const { Icon, color, bgColor } = getPodiumIcon(1);
                return (
                  <div className={`w-20 h-20 mx-auto rounded-full ${bgColor} flex items-center justify-center mb-2 animate-pulse`}>
                    <Icon className={`w-10 h-10 ${color}`} />
                  </div>
                );
              })()}
              <p className="font-bold truncate">{topThree[0].username}</p>
              <p className="text-sm text-gold">
                {topThree[0].amount.toLocaleString()}원
              </p>
            </div>
            <div className="bg-gradient-to-t from-yellow-500/30 to-yellow-500/10 rounded-t-2xl h-32 flex items-center justify-center">
              <span className="text-3xl font-black text-yellow-500">1</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex-1 text-center">
            <div className="mb-3">
              {(() => {
                const { Icon, color, bgColor } = getPodiumIcon(3);
                return (
                  <div className={`w-16 h-16 mx-auto rounded-full ${bgColor} flex items-center justify-center mb-2`}>
                    <Icon className={`w-8 h-8 ${color}`} />
                  </div>
                );
              })()}
              <p className="font-bold truncate">{topThree[2].username}</p>
              <p className="text-sm text-gold">
                {topThree[2].amount.toLocaleString()}원
              </p>
            </div>
            <div className="bg-gradient-to-t from-orange-600/30 to-orange-600/10 rounded-t-2xl h-20 flex items-center justify-center">
              <span className="text-2xl font-black text-orange-600">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Ranking List */}
      <div className="gradient-card rounded-3xl p-5 mb-6 border border-border">
        <h2 className="font-bold text-lg mb-4">전체 랭킹</h2>
        <div className="space-y-2">
          {restOfRankings.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                user.isMe
                  ? 'gradient-primary border-2 border-primary'
                  : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              <div className="w-10 text-center">
                <span
                  className={`text-lg font-black ${
                    user.isMe ? 'text-white' : 'text-muted-foreground'
                  }`}
                >
                  #{user.rank}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-bold truncate ${
                    user.isMe ? 'text-white' : ''
                  }`}
                >
                  {user.username}
                  {user.isMe && ' (나)'}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${
                    user.isMe ? 'text-gold text-shadow-glow' : 'text-gold'
                  }`}
                >
                  {user.amount.toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
