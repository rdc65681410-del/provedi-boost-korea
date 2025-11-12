import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, TrendingUp, Users, AlertCircle, Calendar, Bell, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for heatmap
const generateHeatmapData = () => {
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return days.map(day => ({
    day,
    hours: hours.map(hour => ({
      hour,
      activity: Math.floor(Math.random() * 100) + 1,
    })),
  }));
};

const heatmapData = generateHeatmapData();

const optimalTimes = [
  { time: "오전 10:00 - 11:00", score: 95, reason: "주부들의 아침 루틴 종료 후 활동 시작", posts: 1250, engagement: "매우 높음" },
  { time: "오후 2:00 - 3:00", score: 92, reason: "점심 후 휴식 시간, 활발한 댓글 활동", posts: 1180, engagement: "높음" },
  { time: "오후 8:00 - 9:00", score: 88, reason: "저녁 식사 후 여유 시간", posts: 1050, engagement: "높음" },
  { time: "오후 1:00 - 2:00", score: 85, reason: "점심 시간대 짧은 휴식", posts: 980, engagement: "보통" },
];

const avoidTimes = [
  { time: "오전 6:00 - 8:00", reason: "아침 준비 시간, 활동 거의 없음" },
  { time: "오후 5:00 - 7:00", reason: "저녁 준비 및 가족 저녁 식사 시간" },
  { time: "오후 11:00 - 오전 6:00", reason: "수면 시간" },
];

const weeklyPatterns = [
  { day: "월요일", activity: 75, avgPosts: 850, peakHour: "10시" },
  { day: "화요일", activity: 82, avgPosts: 920, peakHour: "14시" },
  { day: "수요일", activity: 88, avgPosts: 980, peakHour: "10시" },
  { day: "목요일", activity: 85, avgPosts: 950, peakHour: "14시" },
  { day: "금요일", activity: 78, avgPosts: 880, peakHour: "15시" },
  { day: "토요일", activity: 65, avgPosts: 720, peakHour: "11시" },
  { day: "일요일", activity: 60, avgPosts: 680, peakHour: "20시" },
];

const Timing = () => {
  const [selectedDay, setSelectedDay] = useState<string>("전체");

  const getActivityColor = (activity: number) => {
    if (activity >= 80) return "bg-accent border-accent";
    if (activity >= 60) return "bg-primary border-primary";
    if (activity >= 40) return "bg-chart-3/60 border-chart-3";
    if (activity >= 20) return "bg-muted border-border";
    return "bg-muted/30 border-border";
  };

  const getActivityLabel = (activity: number) => {
    if (activity >= 80) return "매우 높음";
    if (activity >= 60) return "높음";
    if (activity >= 40) return "보통";
    if (activity >= 20) return "낮음";
    return "매우 낮음";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-accent";
    if (score >= 80) return "text-primary";
    return "text-chart-3";
  };

  const isOptimalTime = (activity: number) => activity >= 80;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">시간 최적화</h1>
        <p className="text-muted-foreground">AI 분석을 통한 최적의 포스팅 시간을 확인하세요</p>
      </div>

      {/* Current Status Alert */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">지금은 최적의 시간입니다!</h3>
              <p className="text-sm text-muted-foreground">
                현재 시간대는 활동량이 높은 시간입니다. 지금 포스팅하면 평균 대비 <span className="font-semibold text-primary">38% 더 높은</span> 조회수를 기대할 수 있습니다.
              </p>
            </div>
            <Button className="shrink-0">
              지금 포스팅
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="heatmap" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="heatmap">히트맵</TabsTrigger>
          <TabsTrigger value="optimal">최적 시간</TabsTrigger>
          <TabsTrigger value="weekly">주간 패턴</TabsTrigger>
        </TabsList>

        {/* Heatmap Tab */}
        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>활동 히트맵</CardTitle>
                  <CardDescription>시간대별 카페 활동량을 한눈에 확인하세요</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  {/* Legend - 상단 우측 배치 */}
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                    <span className="text-xs font-medium text-muted-foreground">활동량:</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded border bg-muted/30 border-border" />
                        <span className="text-xs text-muted-foreground">매우 낮음</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded border bg-muted border-border" />
                        <span className="text-xs text-muted-foreground">낮음</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded border bg-chart-3/60 border-chart-3" />
                        <span className="text-xs text-muted-foreground">보통</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded border bg-primary border-primary" />
                        <span className="text-xs text-muted-foreground">높음</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded border bg-accent border-accent" />
                        <span className="text-xs text-muted-foreground">매우 높음</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Day filter */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedDay === "전체" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDay("전체")}
                  >
                    전체
                  </Button>
                  {heatmapData.map(({ day }) => (
                    <Button
                      key={day}
                      variant={selectedDay === day ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDay(day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>

                {/* Heatmap */}
                <TooltipProvider>
                  <div className="overflow-x-auto pb-4">
                    <div className="min-w-[1200px] space-y-3">
                      {/* Hour labels */}
                      <div className="grid grid-cols-[80px_1fr] gap-3">
                        <div className="text-sm font-semibold text-muted-foreground">요일 / 시간</div>
                        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(24, minmax(40px, 1fr))" }}>
                          {Array.from({ length: 24 }, (_, i) => (
                            <div key={i} className="text-xs font-medium text-center text-foreground">
                              {i}시
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Heatmap rows */}
                      {heatmapData
                        .filter(d => selectedDay === "전체" || d.day === selectedDay)
                        .map(({ day, hours }, dayIdx) => (
                          <div 
                            key={day} 
                            className="grid grid-cols-[80px_1fr] gap-3 animate-fade-in"
                            style={{ animationDelay: `${dayIdx * 0.05}s` }}
                          >
                            <div className="text-sm font-bold flex items-center text-foreground">
                              {day}요일
                            </div>
                            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(24, minmax(40px, 1fr))" }}>
                              {hours.map(({ hour, activity }) => (
                                <Tooltip key={`${day}-${hour}`}>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`relative aspect-square rounded-md border-2 cursor-pointer transition-all hover:scale-110 hover:z-10 hover:shadow-lg ${getActivityColor(activity)} group`}
                                    >
                                      {/* 최적 시간대 표시 */}
                                      {isOptimalTime(activity) && (
                                        <div className="absolute -top-1 -right-1">
                                          <Star className="h-3 w-3 text-accent fill-accent drop-shadow" />
                                        </div>
                                      )}
                                      {/* 호버 시 활동량 표시 */}
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-foreground drop-shadow">
                                          {activity}%
                                        </span>
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-card border-border">
                                    <div className="text-center space-y-1">
                                      <p className="font-bold text-foreground">{day}요일 {hour}시</p>
                                      <p className="text-lg font-bold text-primary">{activity}%</p>
                                      <p className="text-xs text-muted-foreground">활동량: {getActivityLabel(activity)}</p>
                                      {isOptimalTime(activity) && (
                                        <Badge className="mt-1 bg-accent text-accent-foreground">
                                          <Star className="h-3 w-3 mr-1" />
                                          최적 시간
                                        </Badge>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </div>
                        ))}

                      {/* 하단 설명 */}
                      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Star className="h-5 w-5 text-accent mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">히트맵 활용 팁</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• 각 셀에 마우스를 올려 정확한 활동량을 확인할 수 있습니다</li>
                              <li>• <Star className="h-3 w-3 inline text-accent fill-accent" /> 별표가 있는 시간대는 80% 이상의 높은 활동량을 보이는 최적 시간입니다</li>
                              <li>• 진한 색상일수록 활동량이 높습니다</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimal Times Tab */}
        <TabsContent value="optimal" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Optimal posting times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  추천 포스팅 시간
                </CardTitle>
                <CardDescription>활동량이 높은 시간대입니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {optimalTimes.map((slot, idx) => (
                  <div key={idx} className="p-4 border rounded-lg space-y-2 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{slot.time}</div>
                        <div className="text-sm text-muted-foreground mt-1">{slot.reason}</div>
                      </div>
                      <Badge variant="outline" className={getScoreColor(slot.score)}>
                        {slot.score}점
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="text-muted-foreground">{slot.posts}개 게시물</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-muted-foreground">{slot.engagement}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-2" size="sm">
                      이 시간에 예약
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Times to avoid */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  피해야 할 시간
                </CardTitle>
                <CardDescription>활동량이 낮은 시간대입니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {avoidTimes.map((slot, idx) => (
                  <div key={idx} className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div className="font-semibold text-foreground">{slot.time}</div>
                    <div className="text-sm text-muted-foreground mt-1">{slot.reason}</div>
                  </div>
                ))}

                {/* Notifications Card */}
                <Card className="border-primary/20 bg-primary/5 mt-6">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Bell className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">알림 설정</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          최적의 포스팅 시간 30분 전에 알림을 받으세요
                        </p>
                        <Button size="sm" variant="outline">
                          알림 켜기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Weekly Pattern Tab */}
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                주간 활동 패턴
              </CardTitle>
              <CardDescription>요일별 평균 활동량과 최적 시간을 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyPatterns.map((pattern, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold">{pattern.day}</div>
                      <Badge variant="outline">{pattern.activity}% 활동량</Badge>
                    </div>
                    
                    {/* Activity bar */}
                    <div className="w-full bg-secondary rounded-full h-2 mb-3">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${pattern.activity}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <div className="text-muted-foreground">
                        평균 <span className="font-semibold text-foreground">{pattern.avgPosts}개</span> 게시물
                      </div>
                      <div className="text-muted-foreground">
                        피크 시간: <span className="font-semibold text-foreground">{pattern.peakHour}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 border border-primary/20 rounded-lg bg-primary/5">
                <h4 className="font-semibold text-foreground mb-2">💡 인사이트</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 수요일이 가장 활발한 요일입니다 (88% 활동량)</li>
                  <li>• 주말(토,일)은 상대적으로 활동량이 낮습니다</li>
                  <li>• 평일 오전 10시와 오후 2시가 전반적으로 피크 시간입니다</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Timing;
