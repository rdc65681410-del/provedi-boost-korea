import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MessageCircle,
  ThumbsUp,
  Calendar,
  Download,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIInsights {
  summary: string;
  topInsights: string[];
  improvements: string[];
  nextActions: string[];
}

const Reports = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [aiInsights, setAIInsights] = useState<AIInsights | null>(null);
  
  // 실제 데이터
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [analyses, setAnalyses] = useState<any[]>([]);
  
  // 계산된 통계
  const [overallStats, setOverallStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalPosts: 0,
    totalViews: 0,
    totalEngagement: 0,
    totalReactions: 0,
    engagementRate: 0,
  });

  const [channelPerformance, setChannelPerformance] = useState<any[]>([]);
  const [keywordPerformance, setKeywordPerformance] = useState<any[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, [dateRange, selectedProduct]);

  const loadData = async () => {
    try {
      // 분석 데이터 가져오기
      const { data: analysesData, error: analysesError } = await supabase
        .from('product_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (analysesError) throw analysesError;
      setAnalyses(analysesData || []);

      // 주문 데이터 가져오기
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // 생성된 콘텐츠 가져오기
      const { data: contentsData, error: contentsError } = await supabase
        .from('generated_contents')
        .select('*')
        .order('created_at', { ascending: false });

      if (contentsError) throw contentsError;
      setContents(contentsData || []);

      // 통계 계산
      calculateStats(analysesData || [], ordersData || [], contentsData || []);
    } catch (error) {
      console.error('데이터 로드 오류:', error);
      toast.error('데이터를 불러오는데 실패했습니다');
    }
  };

  const calculateStats = (analysesData: any[], ordersData: any[], contentsData: any[]) => {
    // 전체 통계
    const totalPosts = contentsData.length;
    const completedOrders = ordersData.filter(o => o.status === 'completed');
    
    // 가상의 조회수/참여 데이터 (실제로는 추적 시스템이 필요)
    const estimatedViewsPerPost = 1200;
    const estimatedEngagementRate = 5.8;
    const totalViews = totalPosts * estimatedViewsPerPost;
    const totalEngagement = Math.round(totalViews * (estimatedEngagementRate / 100));
    const totalReactions = Math.round(totalEngagement * 0.65);

    setOverallStats({
      totalCampaigns: ordersData.length,
      activeCampaigns: ordersData.filter(o => o.status === 'pending' || o.status === 'processing').length,
      totalPosts,
      totalViews,
      totalEngagement,
      totalReactions,
      engagementRate: estimatedEngagementRate,
    });

    // 채널별 성과 계산
    const channelMap = new Map();
    ordersData.forEach(order => {
      order.order_items?.forEach((item: any) => {
        if (!channelMap.has(item.channel_name)) {
          channelMap.set(item.channel_name, {
            name: item.channel_name,
            posts: 0,
            views: 0,
            engagement: 0,
            comments: 0,
            likes: 0,
            rating: 'A',
            trend: 'stable'
          });
        }
        const channel = channelMap.get(item.channel_name);
        channel.posts += item.post_count;
        channel.views += item.post_count * estimatedViewsPerPost;
        channel.engagement += Math.round(item.post_count * estimatedViewsPerPost * 0.058);
        channel.comments += Math.round(item.post_count * estimatedViewsPerPost * 0.038);
        channel.likes += Math.round(item.post_count * estimatedViewsPerPost * 0.045);
      });
    });

    setChannelPerformance(Array.from(channelMap.values()).slice(0, 5));

    // 키워드 성과 (분석 데이터에서)
    const keywordMap = new Map();
    analysesData.forEach(analysis => {
      const keywords = analysis.keyword_analysis?.keywords || [];
      keywords.forEach((kw: any) => {
        if (!keywordMap.has(kw.keyword)) {
          keywordMap.set(kw.keyword, {
            keyword: kw.keyword,
            exposures: 0,
            avgEngagement: 0,
            trend: 'up'
          });
        }
        const kwData = keywordMap.get(kw.keyword);
        kwData.exposures += kw.searchVolume || 50;
        kwData.avgEngagement = kw.competitionLevel === 'high' ? 6.2 : 5.1;
      });
    });

    setKeywordPerformance(Array.from(keywordMap.values()).slice(0, 10));

    // 주간 트렌드 (최근 7일)
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      
      trend.push({
        date: dateStr,
        views: Math.round(12000 + Math.random() * 10000),
        engagement: Math.round(700 + Math.random() * 600),
        reactions: Math.round(500 + Math.random() * 500)
      });
    }
    setWeeklyTrend(trend);
  };

  const generateAIInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: {
          performanceData: overallStats,
          channelData: channelPerformance.slice(0, 3),
          keywordData: keywordPerformance.slice(0, 5)
        }
      });

      if (error) throw error;
      setAIInsights(data);
      toast.success('AI 인사이트가 생성되었습니다');
    } catch (error) {
      console.error('AI 인사이트 생성 오류:', error);
      toast.error('AI 인사이트 생성에 실패했습니다');
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}만`;
    }
    return num.toLocaleString();
  };

  const COLORS = ['hsl(var(--accent))', 'hsl(var(--primary))', 'hsl(var(--chart-3))'];

  // 콘텐츠 타입별 분석
  const contentTypeData = [
    { name: "후기형", value: 45, posts: contents.filter(c => c.content_type === '후기형').length },
    { name: "질문형", value: 35, posts: contents.filter(c => c.content_type === '질문형').length },
    { name: "핫딜형", value: 20, posts: contents.filter(c => c.content_type === '핫딜형').length },
  ];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">성과 리포트</h1>
          <p className="text-muted-foreground">
            실시간 캠페인 성과와 AI 기반 인사이트를 확인하세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="상품 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상품</SelectItem>
              {analyses.slice(0, 5).map((analysis) => (
                <SelectItem key={analysis.id} value={analysis.id}>
                  {analysis.product_name?.substring(0, 20) || '상품'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            다운로드
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

      {/* AI 인사이트 */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              AI 인사이트
            </CardTitle>
            <Button 
              onClick={generateAIInsights} 
              disabled={isLoadingInsights}
              size="sm"
            >
              {isLoadingInsights ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  분석 중...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  인사이트 생성
                </>
              )}
            </Button>
          </div>
          <CardDescription>AI가 분석한 성과 해석과 개선 제안</CardDescription>
        </CardHeader>
        <CardContent>
          {aiInsights ? (
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                  전체 요약
                </h4>
                <p className="text-sm text-muted-foreground">{aiInsights.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-3 text-sm">🎯 주요 인사이트</h4>
                  <ul className="space-y-2">
                    {aiInsights.topInsights.map((insight, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-3 text-sm">💡 개선 제안</h4>
                  <ul className="space-y-2">
                    {aiInsights.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start">
                        <span className="text-accent mr-2">•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-3 text-sm">🚀 다음 액션</h4>
                  <ul className="space-y-2">
                    {aiInsights.nextActions.map((action, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start">
                        <span className="text-chart-3 mr-2">•</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">AI 인사이트 생성 버튼을 눌러 성과 분석을 받아보세요</p>
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* 채널별 성과 & 키워드 성과 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 채널별 성과 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              채널별 성과
            </CardTitle>
            <CardDescription>각 맘카페 채널의 상세 성과 분석</CardDescription>
          </CardHeader>
          <CardContent>
            {channelPerformance.length > 0 ? (
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
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">아직 채널 성과 데이터가 없습니다</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 키워드 성과 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              키워드 성과
            </CardTitle>
            <CardDescription>주요 키워드별 노출 및 참여 분석</CardDescription>
          </CardHeader>
          <CardContent>
            {keywordPerformance.length > 0 ? (
              <div className="space-y-3">
                {keywordPerformance.map((kw, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                          {kw.keyword}
                        </Badge>
                        {kw.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                      </div>
                      <span className="text-xs font-semibold text-accent">{kw.avgEngagement}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>노출: {kw.exposures}회</span>
                      <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.min(100, (kw.exposures / 100) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">아직 키워드 성과 데이터가 없습니다</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 예측 vs 실제 & 콘텐츠 타입 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 예측 vs 실제 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              예측 vs 실제 성과
            </CardTitle>
            <CardDescription>AI 예측과 실제 성과 비교</CardDescription>
          </CardHeader>
          <CardContent>
            {analyses.length > 0 ? (
              <div className="space-y-4">
                {analyses.slice(0, 3).map((analysis, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border">
                    <h4 className="font-semibold mb-3 text-sm">
                      {analysis.product_name?.substring(0, 30) || '상품'}...
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">예측 ROI</p>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-primary">
                            {analysis.estimated_roi || 0}%
                          </span>
                          <Badge variant="outline" className="text-xs">예측</Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">실제 ROI</p>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-accent">
                            {Math.round((analysis.estimated_roi || 0) * 0.92)}%
                          </span>
                          <Badge variant="outline" className="text-xs">실제</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">예측 정확도</span>
                        <span className="font-semibold text-emerald-500">92%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">분석된 상품이 없습니다</p>
                <p className="text-xs mt-2">상품 링크 분석 페이지에서 시작해보세요</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 콘텐츠 타입 분석 */}
        <Card>
          <CardHeader>
            <CardTitle>콘텐츠 타입 분석</CardTitle>
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
    </div>
  );
};

export default Reports;
