import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Activity, 
  Eye,
  MessageCircle,
  Zap,
  Crown,
  ArrowUp,
  ArrowDown,
  Minus,
  Radio
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CafeActivityGrade } from "@/components/CafeActivityGrade";
import { toast } from "sonner";

interface CafeRanking {
  id: string;
  name: string;
  members: number;
  activityLevel: string;
  avgViews: number;
  avgEngagement: number;
  successRate: number;
  category: string;
  memberGrowth: number;
  dailyPosts: number;
  dailyComments: number;
  activeUsers: number;
  rankChange: number;
  previousRank: number;
  currentRank: number;
}

type SortBy = "members" | "activity" | "growth" | "engagement" | "success";

const Rankings = () => {
  const [cafes, setCafes] = useState<CafeRanking[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("members");
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // 실시간 데이터 로드
  const loadCafes = async () => {
    try {
      const { data, error } = await supabase
        .from('mom_cafe_channels')
        .select('*')
        .order('members', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedCafes: CafeRanking[] = data.map((cafe, index) => ({
          id: cafe.id,
          name: cafe.name,
          members: cafe.members,
          activityLevel: cafe.activity_level,
          avgViews: cafe.avg_views,
          avgEngagement: cafe.avg_engagement_rate,
          successRate: cafe.success_rate,
          category: cafe.category || "기타",
          memberGrowth: Math.random() * 25 + 5, // 임시 성장률
          dailyPosts: Math.floor(cafe.avg_views / 10),
          dailyComments: Math.floor(cafe.avg_views / 5),
          activeUsers: Math.floor(Math.random() * 500 + 100),
          rankChange: Math.floor(Math.random() * 5) - 2,
          previousRank: index + 1,
          currentRank: index + 1
        }));

        setCafes(formattedCafes);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("카페 데이터 로드 오류:", error);
      toast.error("데이터를 불러오는데 실패했습니다");
    }
  };

  // Realtime 구독 설정
  useEffect(() => {
    loadCafes();

    // Realtime 채널 구독
    const channel = supabase
      .channel('cafe-rankings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mom_cafe_channels'
        },
        (payload) => {
          console.log('실시간 업데이트:', payload);
          loadCafes();
          toast.success("순위가 업데이트되었습니다", { duration: 2000 });
        }
      )
      .subscribe();

    // 30초마다 활성도 시뮬레이션 업데이트
    const interval = setInterval(() => {
      if (isLive) {
        setCafes(prev => prev.map(cafe => ({
          ...cafe,
          activeUsers: Math.floor(Math.random() * 500 + 100),
          rankChange: Math.floor(Math.random() * 5) - 2
        })));
        setLastUpdate(new Date());
      }
    }, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [isLive]);

  // 정렬된 카페 목록
  const sortedCafes = [...cafes].sort((a, b) => {
    switch (sortBy) {
      case "members":
        return b.members - a.members;
      case "activity":
        return (b.dailyPosts + b.dailyComments) - (a.dailyPosts + a.dailyComments);
      case "growth":
        return b.memberGrowth - a.memberGrowth;
      case "engagement":
        return b.avgEngagement - a.avgEngagement;
      case "success":
        return b.successRate - a.successRate;
      default:
        return 0;
    }
  }).map((cafe, index) => ({
    ...cafe,
    currentRank: index + 1
  }));

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500 fill-yellow-500" />;
    if (rank === 2) return <Crown className="h-5 w-5 text-gray-400 fill-gray-400" />;
    if (rank === 3) return <Crown className="h-5 w-5 text-orange-600 fill-orange-600" />;
    return null;
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-emerald-500" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-rose-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">맘카페 실시간 순위</h1>
        <p className="text-muted-foreground">
          네이버 맘카페의 실시간 활성도와 순위를 확인하세요
        </p>
      </div>

      {/* 실시간 상태 카드 */}
      <Card className="border-2 border-accent/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="font-semibold">
                  {isLive ? '실시간 모니터링 중' : '일시정지'}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                총 {cafes.length}개 카페
              </Badge>
            </div>
            <Button
              variant={isLive ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              <Radio className="h-4 w-4 mr-2" />
              {isLive ? '모니터링 중지' : '모니터링 시작'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 정렬 옵션 */}
      <Card>
        <CardHeader>
          <CardTitle>정렬 기준</CardTitle>
          <CardDescription>원하는 기준으로 카페 순위를 확인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={sortBy === "members" ? "default" : "outline"}
              onClick={() => setSortBy("members")}
            >
              <Users className="h-4 w-4 mr-2" />
              회원 수
            </Button>
            <Button
              variant={sortBy === "activity" ? "default" : "outline"}
              onClick={() => setSortBy("activity")}
            >
              <Activity className="h-4 w-4 mr-2" />
              활동량
            </Button>
            <Button
              variant={sortBy === "growth" ? "default" : "outline"}
              onClick={() => setSortBy("growth")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              성장률
            </Button>
            <Button
              variant={sortBy === "engagement" ? "default" : "outline"}
              onClick={() => setSortBy("engagement")}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              참여율
            </Button>
            <Button
              variant={sortBy === "success" ? "default" : "outline"}
              onClick={() => setSortBy("success")}
            >
              <Zap className="h-4 w-4 mr-2" />
              성공률
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TOP 3 하이라이트 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedCafes.slice(0, 3).map((cafe, idx) => (
          <Card 
            key={cafe.id} 
            className={`border-2 ${
              idx === 0 ? 'border-yellow-500 bg-gradient-to-br from-yellow-50/50 to-transparent dark:from-yellow-950/20' :
              idx === 1 ? 'border-gray-400 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-950/20' :
              'border-orange-600 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/20'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getRankBadge(idx + 1)}
                    <Badge className={`text-xl font-bold ${
                      idx === 0 ? 'bg-yellow-500' :
                      idx === 1 ? 'bg-gray-400' : 'bg-orange-600'
                    }`}>
                      {idx + 1}위
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mb-2">{cafe.name}</CardTitle>
                  <Badge variant="outline">{cafe.category}</Badge>
                </div>
                <CafeActivityGrade 
                  activityLevel={cafe.activityLevel}
                  activityScore={cafe.successRate}
                  size="sm"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-background/50 border">
                <div className="text-xs text-muted-foreground mb-1">회원 수</div>
                <div className="text-xl font-bold">{(cafe.members / 1000).toFixed(0)}K</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">실시간 활성</div>
                  <div className="font-bold text-emerald-600">{cafe.activeUsers}명</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">성장률</div>
                  <div className="font-bold text-accent">+{cafe.memberGrowth.toFixed(1)}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 전체 순위 */}
      <Card>
        <CardHeader>
          <CardTitle>전체 카페 순위</CardTitle>
          <CardDescription>
            {sortBy === "members" && "회원 수 기준"}
            {sortBy === "activity" && "일일 활동량 기준"}
            {sortBy === "growth" && "30일 성장률 기준"}
            {sortBy === "engagement" && "평균 참여율 기준"}
            {sortBy === "success" && "캠페인 성공률 기준"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedCafes.map((cafe) => (
              <div 
                key={cafe.id}
                className={`p-4 rounded-lg border bg-card hover:shadow-md transition-all ${
                  cafe.currentRank <= 3 ? 'border-accent/30' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* 순위 */}
                  <div className="flex flex-col items-center min-w-[60px]">
                    <div className="flex items-center gap-1">
                      {getRankBadge(cafe.currentRank)}
                      <span className="text-2xl font-bold">{cafe.currentRank}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      {getRankChangeIcon(cafe.rankChange)}
                      {cafe.rankChange !== 0 && (
                        <span className={cafe.rankChange > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          {Math.abs(cafe.rankChange)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 카페 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg truncate">{cafe.name}</h3>
                      <Badge variant="outline" className="text-xs">{cafe.category}</Badge>
                      <CafeActivityGrade 
                        activityLevel={cafe.activityLevel}
                        activityScore={cafe.successRate}
                        size="sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">회원</div>
                          <div className="font-semibold">{(cafe.members / 1000).toFixed(0)}K</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">활동량</div>
                          <div className="font-semibold">{cafe.dailyPosts + cafe.dailyComments}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">성장률</div>
                          <div className="font-semibold text-accent">+{cafe.memberGrowth.toFixed(1)}%</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">평균 조회</div>
                          <div className="font-semibold">{cafe.avgViews.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-xs text-muted-foreground">실시간</div>
                          <div className="font-semibold text-emerald-600">{cafe.activeUsers}명</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 주요 지표 */}
                  <div className="hidden lg:flex flex-col gap-2 min-w-[120px] items-end">
                    <Badge variant="secondary" className="text-sm">
                      참여율 {cafe.avgEngagement.toFixed(1)}%
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      성공률 {cafe.successRate}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 통계 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>통계 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">총 회원 수</div>
              <div className="text-2xl font-bold">
                {(cafes.reduce((sum, c) => sum + c.members, 0) / 1000000).toFixed(1)}M
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">평균 성장률</div>
              <div className="text-2xl font-bold text-accent">
                +{(cafes.reduce((sum, c) => sum + c.memberGrowth, 0) / cafes.length).toFixed(1)}%
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">일일 총 활동</div>
              <div className="text-2xl font-bold">
                {Math.floor(cafes.reduce((sum, c) => sum + c.dailyPosts + c.dailyComments, 0) / 1000)}K
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground mb-1">실시간 활성 사용자</div>
              <div className="text-2xl font-bold text-emerald-600">
                {cafes.reduce((sum, c) => sum + c.activeUsers, 0).toLocaleString()}명
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rankings;
