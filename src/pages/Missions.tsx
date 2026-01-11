import { useState } from 'react';
import { Zap, Play, Users, Calendar, CheckCircle } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { Mission } from '@/types';

export default function MissionsPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'special'>('daily');

  // Mock missions data
  const missions: Mission[] = [
    {
      id: '1',
      type: 'daily',
      category: 'TAP',
      title: '툭 10회 누르기',
      description: '오늘 10번 탭하면 보너스 지급!',
      progress: 7,
      target: 10,
      reward: 50,
      completed: false,
      claimed: false,
    },
    {
      id: '2',
      type: 'daily',
      category: 'AD',
      title: '광고 3회 시청',
      description: '광고를 3번 끝까지 시청하세요',
      progress: 2,
      target: 3,
      reward: 100,
      completed: false,
      claimed: false,
    },
    {
      id: '3',
      type: 'daily',
      category: 'CHECKIN',
      title: '출석 체크',
      description: '오늘의 출석 체크를 완료하세요',
      progress: 1,
      target: 1,
      reward: 30,
      completed: true,
      claimed: false,
    },
    {
      id: '4',
      type: 'weekly',
      category: 'TAP',
      title: '주간 100회 탭',
      description: '이번 주에 100번 탭하기',
      progress: 53,
      target: 100,
      reward: 500,
      completed: false,
      claimed: false,
    },
    {
      id: '5',
      type: 'weekly',
      category: 'FRIEND',
      title: '친구 3명 초대',
      description: '이번 주에 친구 3명 초대하기',
      progress: 1,
      target: 3,
      reward: 1000,
      completed: false,
      claimed: false,
    },
    {
      id: '6',
      type: 'special',
      category: 'TAP',
      title: '무지개 툭구리 5회 달성',
      description: '무지개 툭구리를 5번 만나세요',
      progress: 2,
      target: 5,
      reward: 2000,
      completed: false,
      claimed: false,
    },
  ];

  const filteredMissions = missions.filter((m) => m.type === activeTab);

  const getIcon = (category: Mission['category']) => {
    const icons = {
      TAP: Zap,
      AD: Play,
      FRIEND: Users,
      CHECKIN: Calendar,
    };
    return icons[category];
  };

  const getIconColor = (category: Mission['category']) => {
    const colors = {
      TAP: 'text-purple-500',
      AD: 'text-green-500',
      FRIEND: 'text-blue-500',
      CHECKIN: 'text-orange-500',
    };
    return colors[category];
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-4">
      <header className="mb-6">
        <h1 className="text-3xl font-black mb-2">미션</h1>
        <p className="text-muted-foreground">미션을 완료하고 보상을 받으세요</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'daily'
              ? 'gradient-primary text-white'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          }`}
        >
          일일
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'weekly'
              ? 'gradient-primary text-white'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          }`}
        >
          주간
        </button>
        <button
          onClick={() => setActiveTab('special')}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'special'
              ? 'gradient-primary text-white'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          }`}
        >
          특별
        </button>
      </div>

      {/* Missions List */}
      <div className="space-y-4 mb-6">
        {filteredMissions.map((mission) => {
          const Icon = getIcon(mission.category);
          const iconColor = getIconColor(mission.category);
          const progress = (mission.progress / mission.target) * 100;

          return (
            <div
              key={mission.id}
              className="gradient-card rounded-2xl p-5 border border-border"
            >
              <div className="flex items-start gap-4 mb-3">
                <div className={`p-3 bg-secondary rounded-xl ${iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1">{mission.title}</h3>
                  <p className="text-sm text-muted-foreground">{mission.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-gold font-black text-lg">
                    +{mission.reward.toLocaleString()}원
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">진행도</span>
                  <span className="font-bold">
                    {mission.progress} / {mission.target}
                  </span>
                </div>
                <div className="bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {mission.completed && !mission.claimed ? (
                <button className="w-full gradient-success text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  보상 받기
                </button>
              ) : mission.claimed ? (
                <button
                  disabled
                  className="w-full bg-secondary text-muted-foreground rounded-xl py-3 font-bold"
                >
                  완료
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-secondary/50 text-muted-foreground rounded-xl py-3 font-bold"
                >
                  진행 중
                </button>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
