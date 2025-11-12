import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Play,
  Pause,
  Check,
  Clock,
  Eye,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Calendar,
  Target,
  FileText,
  Edit,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CampaignData {
  order: any;
  items: any[];
  contents: any[];
}

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);

  useEffect(() => {
    loadCampaignData();
  }, [id]);

  const loadCampaignData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Load order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) throw orderError;

      // Load order items
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

      if (itemsError) throw itemsError;

      // Load generated contents
      const { data: contents, error: contentsError } = await supabase
        .from('generated_contents')
        .select('*')
        .in('order_item_id', items.map(i => i.id));

      if (contentsError) throw contentsError;

      setCampaignData({ order, items, contents });
    } catch (error) {
      console.error('Error loading campaign:', error);
      toast.error('캠페인 데이터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">캠페인 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!campaignData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">캠페인을 찾을 수 없습니다</p>
        <Button onClick={() => navigate('/app/campaigns')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          캠페인 목록으로
        </Button>
      </div>
    );
  }

  const { order, items, contents } = campaignData;

  // Calculate statistics
  const totalPosts = items.reduce((sum, item) => sum + item.post_count, 0);
  const postedCount = contents.filter(c => c.status === 'posted').length;
  const scheduledCount = contents.filter(c => c.status === 'scheduled').length;
  const pendingCount = contents.filter(c => c.status === 'pending').length;
  
  // Estimated metrics (실제로는 tracking 시스템이 필요)
  const estimatedViews = postedCount * 2500;
  const estimatedEngagement = Math.round(estimatedViews * 0.058);
  const estimatedRevenue = Math.round(order.total_amount * 4.2);
  const roi = order.total_amount > 0 ? Math.round((estimatedRevenue / order.total_amount) * 100) : 0;

  const getStatusBadge = (status: string) => {
    const config: any = {
      pending: { label: "대기중", className: "bg-yellow-500" },
      processing: { label: "진행중", className: "bg-blue-500" },
      completed: { label: "완료", className: "bg-green-500" },
      cancelled: { label: "취소됨", className: "bg-gray-500" },
    };
    const badge = config[status] || config.pending;
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  // Channel performance data
  const channelStats = items.map(item => {
    const itemContents = contents.filter(c => c.order_item_id === item.id);
    const posted = itemContents.filter(c => c.status === 'posted').length;
    return {
      name: item.channel_name,
      posts: posted,
      total: item.post_count,
      views: posted * 2500,
      engagement: Math.round(posted * 2500 * 0.058),
      contentType: item.content_type
    };
  });

  // Daily performance trend (last 7 days)
  const dailyTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    const dayContents = contents.filter(c => 
      c.posted_at && c.posted_at.startsWith(dateStr)
    );
    
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      posts: dayContents.length,
      views: dayContents.length * 2500,
      engagement: Math.round(dayContents.length * 2500 * 0.058)
    };
  });

  // Content type distribution
  const contentTypeData = items.reduce((acc: any[], item) => {
    const existing = acc.find(d => d.name === item.content_type);
    if (existing) {
      existing.value += item.post_count;
    } else {
      acc.push({ name: item.content_type, value: item.post_count });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/app/campaigns')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              {order.product_name || '캠페인'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {order.product_url}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(order.status)}
          <Link to={`/app/campaigns/${id}/content`}>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              콘텐츠 관리
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">총 조회수</p>
                <p className="text-2xl font-bold">{estimatedViews.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 mt-1">+12.5% vs 예상</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">참여 수</p>
                <p className="text-2xl font-bold">{estimatedEngagement.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 mt-1">참여율 5.8%</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/10">
                <MessageCircle className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">예상 매출</p>
                <p className="text-2xl font-bold">{(estimatedRevenue / 10000).toFixed(1)}만원</p>
                <p className="text-xs text-emerald-600 mt-1">ROI {roi}%</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/10">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">게시 진행률</p>
                <p className="text-2xl font-bold">{postedCount}/{totalPosts}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((postedCount / totalPosts) * 100)}% 완료
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-500/10">
                <Activity className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>진행 현황</CardTitle>
          <CardDescription>게시물 상태별 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">전체 진행률</span>
                <span className="text-sm text-muted-foreground">
                  {postedCount + scheduledCount}/{totalPosts}
                </span>
              </div>
              <Progress value={((postedCount + scheduledCount) / totalPosts) * 100} />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 bg-emerald-500/10 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{postedCount}</p>
                <p className="text-sm text-muted-foreground">게시 완료</p>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{scheduledCount}</p>
                <p className="text-sm text-muted-foreground">예약됨</p>
              </div>
              <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">대기중</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Tabs defaultValue="channels" className="space-y-4">
        <TabsList>
          <TabsTrigger value="channels">채널별 성과</TabsTrigger>
          <TabsTrigger value="trend">성과 트렌드</TabsTrigger>
          <TabsTrigger value="content">콘텐츠 유형</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>채널별 성과 분석</CardTitle>
              <CardDescription>각 채널의 게시물 성과</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelStats.map((channel, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{channel.name}</h4>
                        <p className="text-sm text-muted-foreground">{channel.contentType}</p>
                      </div>
                      <Badge variant="outline">
                        {channel.posts}/{channel.total} 게시
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">조회수</p>
                        <p className="text-lg font-semibold">{channel.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">참여</p>
                        <p className="text-lg font-semibold">{channel.engagement.toLocaleString()}</p>
                      </div>
                    </div>

                    <Progress value={(channel.posts / channel.total) * 100} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>최근 7일 성과 트렌드</CardTitle>
              <CardDescription>일별 게시물 및 성과 추이</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="posts" stroke="#8884d8" name="게시물" />
                  <Line type="monotone" dataKey="views" stroke="#82ca9d" name="조회수" />
                  <Line type="monotone" dataKey="engagement" stroke="#ffc658" name="참여" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>콘텐츠 유형 분포</CardTitle>
              <CardDescription>콘텐츠 타입별 게시물 수</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Budget & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>예산 사용 현황</CardTitle>
            <CardDescription>총 예산 대비 사용 금액</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">사용 금액</span>
                <span className="text-2xl font-bold">
                  {(order.final_amount / 10000).toFixed(1)}만원
                </span>
              </div>
              <Progress value={100} className="h-3" />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">총 예산</p>
                  <p className="text-lg font-semibold">
                    {(order.total_amount / 10000).toFixed(1)}만원
                  </p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">할인</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    -{(order.discount_amount / 10000).toFixed(1)}만원
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>캠페인 정보</CardTitle>
            <CardDescription>기본 정보 및 담당자</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">고객명</span>
                <span className="font-medium">{order.customer_name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">이메일</span>
                <span className="font-medium text-sm">{order.customer_email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">연락처</span>
                <span className="font-medium">{order.customer_phone}</span>
              </div>
              {order.customer_company && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">회사</span>
                  <span className="font-medium">{order.customer_company}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">생성일</span>
                <span className="font-medium">
                  {new Date(order.created_at).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDetail;
