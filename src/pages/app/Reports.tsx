import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MessageCircle,
  ThumbsUp,
  DollarSign,
  Calendar,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Target
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from "recharts";

const Reports = () => {
  const [dateRange, setDateRange] = useState("30days");

  // 전체 성과 데이터
  const overallStats = {
    totalCampaigns: 12,
    activeCampaigns: 5,
    totalPosts: 148,
    totalViews: 324580,
    totalEngagement: 18924,
    totalReactions: 12580,
    avgROI: 342,
    engagementRate: 5.8,
  };

  // 주간 트렌드 데이터
  const weeklyTrend = [
    { date: "11/24", views: 12500, engagement: 720, reactions: 520 },
    { date: "11/25", views: 15200, engagement: 890, reactions: 680 },
    { date: "11/26", views: 18300, engagement: 1050, reactions: 820 },
    { date: "11/27", views: 16800, engagement: 960, reactions: 740 },
    { date: "11/28", views: 21400, engagement: 1240, reactions: 950 },
    { date: "11/29", views: 19600, engagement: 1120, reactions: 860 },
    { date: "11/30", views: 23100, engagement: 1340, reactions: 1020 },
  ];

  // 채널별 성과
  const channelPerformance = [
    { 
      name: "맘스홀릭베이비",
      posts: 24,
      views: 89200,
      engagement: 5240,
      comments: 3420,
      likes: 4850,
      roi: 390,
      rating: "A+",
      trend: "up"
    },
    { 
      name: "베베하우스",
      posts: 18,
      views: 67400,
      engagement: 3890,
      comments: 2560,
      likes: 3640,
      roi: 368,
      rating: "A",
      trend: "up"
    },
    { 
      name: "우리아이맘",
      posts: 15,
      views: 52300,
      engagement: 2980,
      comments: 1980,
      likes: 2820,
      roi: 325,
      rating: "A",
      trend: "stable"
    },
    { 
      name: "송파맘카페",
      posts: 12,
      views: 41200,
      engagement: 2340,
      comments: 1520,
      likes: 2180,
      roi: 298,
      rating: "B+",
      trend: "down"
    },
    { 
      name: "대치동맘모임",
      posts: 9,
      views: 28600,
      engagement: 1580,
      comments: 980,
      likes: 1420,
      roi: 285,
      rating: "B+",
      trend: "stable"
    },
  ];

  // 콘텐츠 타입별 분석
  const contentTypeData = [
    { name: "후기형", value: 45, posts: 67, engagement: 8200 },
    { name: "질문형", value: 35, posts: 52, engagement: 6100 },
    { name: "핫딜형", value: 20, posts: 29, engagement: 4600 },
  ];

  const COLORS = ['hsl(var(--accent))', 'hsl(var(--primary))', 'hsl(var(--chart-3))'];

  // 시간대별 참여율
  const hourlyEngagement = [
    { hour: "0-2", rate: 2.1 },
    { hour: "3-5", rate: 1.8 },
    { hour: "6-8", rate: 4.2 },
    { hour: "9-11", rate: 7.8 },
    { hour: "12-14", rate: 6.5 },
    { hour: "15-17", rate: 5.9 },
    { hour: "18-20", rate: 8.4 },
    { hour: "21-23", rate: 7.2 },
  ];

  // 최근 캠페인 목록
  const recentCampaigns = [
    {
      id: 1,
      name: "북유럽 원목 선반 캠페인",
      status: "active",
      channels: 3,
      posts: 15,
      views: 42300,
      engagement: 2480,
      comments: 1650,
      likes: 2280,
      startDate: "2025-10-20",
    },
    {
      id: 2,
      name: "육아 필수템 프로모션",
      status: "active",
      channels: 5,
      posts: 28,
      views: 78600,
      engagement: 4520,
      comments: 3120,
      likes: 4340,
      startDate: "2025-10-15",
    },
    {
      id: 3,
      name: "겨울 아동복 신상품",
      status: "completed",
      channels: 4,
      posts: 22,
      views: 61200,
      engagement: 3680,
      comments: 2450,
      likes: 3520,
      startDate: "2025-10-01",
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}만`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">성과 리포트</h1>
          <p className="text-muted-foreground">
            캠페인 성과와 채널별 분석을 확인하세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg border border-input bg-background"
          >
            <option value="7days">최근 7일</option>
            <option value="30days">최근 30일</option>
            <option value="90days">최근 90일</option>
            <option value="all">전체 기간</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* 전체 성과 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary" className="text-xs">
                {overallStats.activeCampaigns}개 진행중
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">총 캠페인</p>
              <p className="text-2xl font-bold">{overallStats.totalCampaigns}개</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Eye className="h-5 w-5 text-accent" />
              </div>
              <div className="flex items-center text-emerald-500 text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span className="font-semibold">12.5%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">총 조회수</p>
              <p className="text-2xl font-bold">{formatNumber(overallStats.totalViews)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-chart-3/10">
                <ThumbsUp className="h-5 w-5 text-chart-3" />
              </div>
              <div className="flex items-center text-emerald-500 text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span className="font-semibold">8.3%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">참여율</p>
              <p className="text-2xl font-bold">{overallStats.engagementRate}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-chart-3/10">
                <MessageCircle className="h-5 w-5 text-chart-3" />
              </div>
              <div className="flex items-center text-emerald-500 text-sm">
                <ArrowUpRight className="h-4 w-4" />
                <span className="font-semibold">18.2%</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">총 반응수</p>
              <p className="text-2xl font-bold">{formatNumber(overallStats.totalReactions)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 주간 트렌드 그래프 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            주간 성과 트렌드
          </CardTitle>
          <CardDescription>최근 7일간의 조회수, 참여, 반응 추이</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="views" className="space-y-4">
            <TabsList>
              <TabsTrigger value="views">조회수</TabsTrigger>
              <TabsTrigger value="engagement">참여</TabsTrigger>
              <TabsTrigger value="reactions">반응</TabsTrigger>
            </TabsList>

            <TabsContent value="views">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyTrend}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="engagement">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="engagement" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="reactions">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reactions" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 채널별 성과 & 콘텐츠 타입 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 채널별 성과 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              채널별 성과
            </CardTitle>
            <CardDescription>각 맘카페 채널의 상세 성과 분석</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channelPerformance.map((channel, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-lg">
                        {channel.rating}
                      </Badge>
                      <div>
                        <h4 className="font-semibold">{channel.name}</h4>
                        <p className="text-xs text-muted-foreground">{channel.posts}개 포스팅</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {channel.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                      {channel.trend === "down" && <TrendingDown className="h-4 w-4 text-rose-500" />}
                      <span className="text-sm font-semibold text-accent">ROI {channel.roi}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">조회수</p>
                      <p className="font-semibold">{formatNumber(channel.views)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">참여</p>
                      <p className="font-semibold">{formatNumber(channel.engagement)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        댓글
                      </p>
                      <p className="font-semibold text-accent">{formatNumber(channel.comments)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        좋아요
                      </p>
                      <p className="font-semibold text-primary">{formatNumber(channel.likes)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 콘텐츠 타입 분석 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2" />
              콘텐츠 타입 분석
            </CardTitle>
            <CardDescription>타입별 게시물 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3 mt-4">
              {contentTypeData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[idx] }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{item.posts}개</p>
                    <p className="text-xs text-muted-foreground">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 시간대별 참여율 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            시간대별 참여율
          </CardTitle>
          <CardDescription>24시간 기준 참여율 분포</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hourlyEngagement}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 최근 캠페인 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 캠페인</CardTitle>
          <CardDescription>진행 중 및 완료된 캠페인 목록</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold">{campaign.name}</h4>
                    <Badge 
                      variant={campaign.status === "active" ? "default" : "secondary"}
                      className={campaign.status === "active" ? "bg-emerald-500" : ""}
                    >
                      {campaign.status === "active" ? "진행중" : "완료"}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    자세히 보기
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">채널</p>
                    <p className="font-semibold">{campaign.channels}개</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">포스팅</p>
                    <p className="font-semibold">{campaign.posts}개</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">조회수</p>
                    <p className="font-semibold">{formatNumber(campaign.views)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">참여</p>
                    <p className="font-semibold">{formatNumber(campaign.engagement)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      댓글
                    </p>
                    <p className="font-semibold text-accent">{formatNumber(campaign.comments)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      좋아요
                    </p>
                    <p className="font-semibold text-primary">{formatNumber(campaign.likes)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
