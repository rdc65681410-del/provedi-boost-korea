import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Eye,
  MessageCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Target,
  FileText,
  BarChart3,
  CheckCircle2,
  Circle,
  AlertCircle,
  Play,
  Pause,
  Settings
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CampaignDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<any>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  useEffect(() => {
    loadCampaignData();
  }, [id]);

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      
      // orders 테이블에서 캠페인 정보 가져오기
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) {
        // 데이터가 없으면 목 데이터 사용
        console.log('Using mock data for demo');
        setCampaign({
          id: id,
          product_name: '북유럽 원목 선반 프리미엄',
          product_url: 'https://example.com/product1',
          customer_name: '김지민',
          customer_email: 'jimin@example.com',
          customer_phone: '010-1234-5678',
          customer_company: '홈앤리빙',
          total_amount: 450000,
          discount_amount: 45000,
          final_amount: 405000,
          status: 'processing',
          created_at: '2025-10-20',
        });
        
        setOrderItems([
          { id: '1', order_id: id, channel_name: '맘스홀릭베이비', content_type: 'review', post_count: 5, price_per_post: 30000, total_price: 150000 },
          { id: '2', order_id: id, channel_name: '베베하우스', content_type: 'question', post_count: 5, price_per_post: 25000, total_price: 125000 },
          { id: '3', order_id: id, channel_name: '우리아이맘', content_type: 'deal', post_count: 5, price_per_post: 26000, total_price: 130000 },
        ]);
        
        setContents([
          { id: '1', order_item_id: '1', title: '북유럽 원목 선반 사용 후기', content: '우리 아이 방에 딱 맞는 원목 선반이에요. 튼튼하고 디자인도 심플해서 너무 마음에 들어요!', content_type: 'review', channel_name: '맘스홀릭베이비', status: 'posted', scheduled_date: null, scheduled_time: null, posted_at: '2025-10-21', tags: ['육아용품', '수납', '인테리어'], created_at: '2025-10-20', updated_at: '2025-10-21' },
          { id: '2', order_item_id: '1', title: '아이방 정리에 딱! 원목 선반', content: '장난감이 너무 많아서 고민이었는데 이 선반으로 깔끔하게 정리했어요.', content_type: 'review', channel_name: '맘스홀릭베이비', status: 'posted', scheduled_date: null, scheduled_time: null, posted_at: '2025-10-22', tags: ['육아용품', '수납'], created_at: '2025-10-20', updated_at: '2025-10-22' },
          { id: '3', order_item_id: '1', title: '원목 선반 추천해주세요', content: '아이방 인테리어 중인데 원목 선반 추천 부탁드려요!', content_type: 'review', channel_name: '맘스홀릭베이비', status: 'posted', scheduled_date: null, scheduled_time: null, posted_at: '2025-10-23', tags: ['육아', '인테리어'], created_at: '2025-10-20', updated_at: '2025-10-23' },
          { id: '4', order_item_id: '2', title: '원목 선반 어떤가요?', content: '북유럽 스타일 원목 선반 구매하려는데 사용해보신 분 계신가요?', content_type: 'question', channel_name: '베베하우스', status: 'scheduled', scheduled_date: '2025-11-15', scheduled_time: '10:00:00', posted_at: null, tags: ['육아용품', '구매고민'], created_at: '2025-10-20', updated_at: '2025-10-20' },
          { id: '5', order_item_id: '2', title: '아이방 수납 고민이에요', content: '책이랑 장난감 정리할 선반 찾고 있어요. 추천해주세요!', content_type: 'question', channel_name: '베베하우스', status: 'scheduled', scheduled_date: '2025-11-16', scheduled_time: '14:30:00', posted_at: null, tags: ['육아', '수납'], created_at: '2025-10-20', updated_at: '2025-10-20' },
          { id: '6', order_item_id: '3', title: '원목 선반 특가 이벤트!', content: '지금 구매하시면 10% 할인! 무료배송까지!', content_type: 'deal', channel_name: '우리아이맘', status: 'pending', scheduled_date: null, scheduled_time: null, posted_at: null, tags: ['핫딜', '특가'], created_at: '2025-10-20', updated_at: '2025-10-20' },
          { id: '7', order_item_id: '3', title: '아이방 인테리어 필수템', content: '원목 선반으로 아이방을 더 예쁘게 꾸며보세요', content_type: 'deal', channel_name: '우리아이맘', status: 'pending', scheduled_date: null, scheduled_time: null, posted_at: null, tags: ['육아용품', '인테리어'], created_at: '2025-10-20', updated_at: '2025-10-20' },
        ]);
        
        setLoading(false);
        return;
      }
      
      setCampaign(orderData);

      // order_items 가져오기
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

      if (itemsError) throw itemsError;
      setOrderItems(itemsData || []);

      // generated_contents 가져오기
      const itemIds = itemsData?.map(item => item.id) || [];
      if (itemIds.length > 0) {
        const { data: contentsData, error: contentsError } = await supabase
          .from('generated_contents')
          .select('*')
          .in('order_item_id', itemIds);

        if (contentsError) throw contentsError;
        setContents(contentsData || []);
      }

    } catch (error: any) {
      console.error('Error loading campaign:', error);
      toast.error('캠페인 정보를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">캠페인을 찾을 수 없습니다</h2>
        <Link to="/app/campaigns">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            캠페인 목록으로
          </Button>
        </Link>
      </div>
    );
  }

  // 통계 계산
  const totalPosts = contents.length;
  const postedCount = contents.filter(c => c.status === 'posted').length;
  const scheduledCount = contents.filter(c => c.status === 'scheduled').length;
  const pendingCount = contents.filter(c => c.status === 'pending').length;
  
  // 예상 조회수 및 참여도 (실제 데이터가 없으므로 추정)
  const estimatedViewsPerPost = 2800;
  const estimatedEngagementPerPost = 165;
  const totalViews = postedCount * estimatedViewsPerPost;
  const totalEngagement = postedCount * estimatedEngagementPerPost;
  const engagementRate = totalViews > 0 ? (totalEngagement / totalViews * 100).toFixed(2) : '0';
  
  // 예상 매출 (ROI 기반 추정)
  const estimatedRevenue = Math.floor(campaign.final_amount * 4.2);
  const roi = campaign.final_amount > 0 ? Math.round((estimatedRevenue / campaign.final_amount) * 100) : 0;

  // 채널별 성과 데이터
  const channelPerformance = orderItems.map(item => {
    const channelContents = contents.filter(c => c.channel_name === item.channel_name && c.status === 'posted');
    return {
      name: item.channel_name,
      posts: channelContents.length,
      views: channelContents.length * estimatedViewsPerPost,
      engagement: channelContents.length * estimatedEngagementPerPost,
      rating: 4.2 + Math.random() * 0.6,
    };
  });

  // 일별 성과 트렌드 (최근 7일)
  const performanceTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayPosted = Math.floor(Math.random() * 3) + 1;
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      views: dayPosted * estimatedViewsPerPost,
      engagement: dayPosted * estimatedEngagementPerPost,
      posts: dayPosted,
    };
  });

  // 콘텐츠 타입별 분포
  const contentTypeDistribution = [
    { name: '후기형', value: contents.filter(c => c.content_type === 'review').length },
    { name: '질문형', value: contents.filter(c => c.content_type === 'question').length },
    { name: '핫딜형', value: contents.filter(c => c.content_type === 'deal').length },
  ].filter(item => item.value > 0);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <Link to="/app/campaigns">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              캠페인 목록
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">{campaign.product_name || '캠페인'}</h1>
          <p className="text-muted-foreground">{campaign.product_url}</p>
        </div>
        
        <div className="flex gap-2">
          <Link to={`/app/campaigns/${id}/content`}>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              콘텐츠 관리
            </Button>
          </Link>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            설정
          </Button>
        </div>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">총 조회수</p>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 mt-1">↑ 12.5% vs 이전</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">총 참여</p>
                <p className="text-2xl font-bold">{totalEngagement.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 mt-1">참여율 {engagementRate}%</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/10">
                <MessageCircle className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">예상 매출</p>
                <p className="text-2xl font-bold">{(estimatedRevenue / 10000).toFixed(0)}만원</p>
                <p className="text-xs text-emerald-600 mt-1">ROI {roi}%</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/10">
                <DollarSign className="h-6 w-6 text-emerald-500" />
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
                <Progress value={(postedCount / totalPosts) * 100} className="mt-2" />
              </div>
              <div className="p-3 rounded-full bg-amber-500/10">
                <Target className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 게시물 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>게시물 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-sm text-muted-foreground">게시 완료</p>
                <p className="text-2xl font-bold">{postedCount}개</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-500/10">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">예약됨</p>
                <p className="text-2xl font-bold">{scheduledCount}개</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/10">
              <Circle className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">대기중</p>
                <p className="text-2xl font-bold">{pendingCount}개</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">성과 분석</TabsTrigger>
          <TabsTrigger value="channels">채널별 성과</TabsTrigger>
          <TabsTrigger value="content">콘텐츠 분석</TabsTrigger>
          <TabsTrigger value="budget">예산 현황</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          {/* 일별 성과 트렌드 */}
          <Card>
            <CardHeader>
              <CardTitle>주간 성과 트렌드</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--chart-1))" name="조회수" strokeWidth={2} />
                  <Line type="monotone" dataKey="engagement" stroke="hsl(var(--chart-2))" name="참여" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 콘텐츠 타입 분포 */}
          {contentTypeDistribution.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>콘텐츠 타입 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contentTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="hsl(var(--chart-1))"
                      dataKey="value"
                    >
                      {contentTypeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>채널별 성과</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelPerformance.map((channel, idx) => (
                  <div key={idx} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{channel.name}</h4>
                      <Badge variant="outline">★ {channel.rating.toFixed(1)}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">게시물</p>
                        <p className="font-semibold">{channel.posts}개</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">조회수</p>
                        <p className="font-semibold">{channel.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">참여</p>
                        <p className="font-semibold">{channel.engagement.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>콘텐츠 성과</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                상세한 콘텐츠 분석은 콘텐츠 관리 페이지에서 확인하실 수 있습니다.
              </p>
              <Link to={`/app/campaigns/${id}/content`}>
                <Button className="mt-4">
                  <FileText className="h-4 w-4 mr-2" />
                  콘텐츠 관리로 이동
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>예산 사용 현황</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">총 예산</span>
                  <span className="font-semibold">{campaign.total_amount.toLocaleString()}원</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">할인 금액</span>
                  <span className="font-semibold text-emerald-600">-{campaign.discount_amount.toLocaleString()}원</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">최종 금액</span>
                  <span className="text-xl font-bold text-primary">{campaign.final_amount.toLocaleString()}원</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <h4 className="font-semibold mb-3">고객 정보</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">이름</span>
                    <span className="font-medium">{campaign.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">이메일</span>
                    <span className="font-medium">{campaign.customer_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">연락처</span>
                    <span className="font-medium">{campaign.customer_phone}</span>
                  </div>
                  {campaign.customer_company && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">회사</span>
                      <span className="font-medium">{campaign.customer_company}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignDetail;
