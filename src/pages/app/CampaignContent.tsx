import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  MoreVertical,
  Eye,
  MessageCircle,
  ThumbsUp,
  Send,
  CalendarCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  content_type: string;
  channel_name: string;
  status: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  posted_at: string | null;
  tags: string[] | null;
}

const CampaignContent = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<any>(null);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadCampaignContent();
  }, [id]);

  const loadCampaignContent = async () => {
    try {
      setLoading(true);
      
      // 캠페인 정보 가져오기
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
        });
        
        setContents([
          { 
            id: '1', 
            title: '북유럽 원목 선반 사용 후기 - 아이방 정리 끝!', 
            content: '안녕하세요! 두 아이 엄마예요. 항상 장난감 정리가 고민이었는데, 이번에 북유럽 원목 선반을 들였더니 정말 대박이에요! 😍\n\n우선 디자인이 너무 심플하고 예뻐서 아이방 인테리어와 완벽하게 어울려요. 무엇보다 튼튼해서 아이들이 마구 사용해도 끄떡없어요.\n\n높이도 딱 아이들 눈높이라서 스스로 정리하는 습관을 기를 수 있어서 좋아요. 엄마표 정리교육에도 도움이 되는 것 같아요 👍\n\n가격대비 품질도 훌륭하고, 조립도 쉬워서 여자 혼자서도 30분이면 뚝딱 완성할 수 있었어요. 강력 추천합니다!', 
            content_type: 'review', 
            channel_name: '맘스홀릭베이비', 
            status: 'posted', 
            scheduled_date: null, 
            scheduled_time: null, 
            posted_at: '2025-10-21T09:30:00', 
            tags: ['육아용품', '수납', '인테리어', '북유럽스타일'] 
          },
          { 
            id: '2', 
            title: '아이방 정리에 딱! 원목 선반 후기', 
            content: '장난감이 너무 많아서 늘 고민이었는데 이 선반으로 깔끔하게 정리했어요.\n\n3단으로 되어 있어서 공간 활용도가 좋고, 원목이라 안전해서 맘 놓고 쓸 수 있어요. 모서리도 둥글게 처리되어 있어서 안심이에요.\n\n색상도 내츄럴해서 어떤 인테리어에도 잘 어울려요. 책이랑 장난감 정리하니까 방이 훨씬 넓어 보이네요!', 
            content_type: 'review', 
            channel_name: '맘스홀릭베이비', 
            status: 'posted', 
            scheduled_date: null, 
            scheduled_time: null, 
            posted_at: '2025-10-22T14:20:00', 
            tags: ['육아용품', '수납', '정리'] 
          },
          { 
            id: '3', 
            title: '마침내 찾았어요! 완벽한 아이방 수납장', 
            content: '여러 수납장을 알아보다가 이 원목 선반을 선택했는데 대만족이에요! 💯\n\n크기도 적당하고 무게도 가벼워서 청소할 때 옮기기도 편해요. 그림책, 장난감, 인형까지 다 들어가서 방이 정말 깔끔해졌어요.\n\n아이가 좋아하는 장난감을 직접 골라서 정리하는 재미도 생겼대요 ㅎㅎ 정리정돈 습관 기르기에도 좋은 것 같아요!', 
            content_type: 'review', 
            channel_name: '맘스홀릭베이비', 
            status: 'posted', 
            scheduled_date: null, 
            scheduled_time: null, 
            posted_at: '2025-10-23T11:15:00', 
            tags: ['육아', '인테리어', '수납장'] 
          },
          { 
            id: '4', 
            title: '원목 선반 어떤가요? 구매 고민 중이에요', 
            content: '안녕하세요! 북유럽 스타일 원목 선반 구매하려는데 사용해보신 분 계신가요?\n\n아이방 정리용으로 생각 중인데, 튼튼한지, 조립은 쉬운지 궁금해요.\n\n혹시 비슷한 제품 사용하시는 분들 후기 부탁드려요! 🙏', 
            content_type: 'question', 
            channel_name: '베베하우스', 
            status: 'scheduled', 
            scheduled_date: '2025-11-15', 
            scheduled_time: '10:00:00', 
            posted_at: null, 
            tags: ['육아용품', '구매고민', '후기요청'] 
          },
          { 
            id: '5', 
            title: '아이방 수납 고민이에요 ㅠㅠ 도와주세요', 
            content: '4살 아이 키우는 맘인데요, 책이랑 장난감이 너무 많아서 정리가 안 돼요.\n\n원목 수납장 알아보고 있는데 추천해주실 만한 제품 있나요? 안전하고 튼튼한 걸로요!\n\n댓글로 추천 부탁드립니다! 감사해요 😊', 
            content_type: 'question', 
            channel_name: '베베하우스', 
            status: 'scheduled', 
            scheduled_date: '2025-11-16', 
            scheduled_time: '14:30:00', 
            posted_at: null, 
            tags: ['육아', '수납', '추천요청'] 
          },
          { 
            id: '6', 
            title: '🎉 원목 선반 특가 이벤트! 지금이 기회!', 
            content: '⭐️ 북유럽 스타일 원목 선반 특가 ⭐️\n\n지금 구매하시면 10% 할인!\n게다가 무료배송까지! 🚚\n\n아이방 정리의 필수템을 특가로 만나보세요.\n튼튼하고 안전한 원목 소재로 안심하고 사용하실 수 있어요.\n\n[링크] 👈 클릭하고 할인받으세요!', 
            content_type: 'deal', 
            channel_name: '우리아이맘', 
            status: 'pending', 
            scheduled_date: null, 
            scheduled_time: null, 
            posted_at: null, 
            tags: ['핫딜', '특가', '할인이벤트'] 
          },
          { 
            id: '7', 
            title: '아이방 인테리어 필수템 💕 원목 선반', 
            content: '우리 아이 방을 더 예쁘고 깔끔하게!\n\n북유럽 감성 원목 선반으로 아이방 인테리어 완성하세요 ✨\n\n✅ 심플한 디자인\n✅ 튼튼한 원목 소재\n✅ 아이 눈높이에 딱 맞는 높이\n✅ 쉬운 조립\n\n지금 바로 우리 아이방을 변신시켜보세요!', 
            content_type: 'deal', 
            channel_name: '우리아이맘', 
            status: 'pending', 
            scheduled_date: null, 
            scheduled_time: null, 
            posted_at: null, 
            tags: ['육아용품', '인테리어', '북유럽'] 
          },
          { 
            id: '8', 
            title: '정리정돈 습관을 길러주는 마법의 선반', 
            content: '아이가 스스로 정리하는 습관! 이 선반 하나면 가능해요 🌟\n\n우리 아이도 이제 스스로 장난감을 정리해요. 눈높이에 맞춰져 있어서 아이가 쉽게 접근할 수 있고, 정리하는 재미까지 느낀대요.\n\n엄마표 정리교육의 시작, 원목 선반과 함께하세요!', 
            content_type: 'review', 
            channel_name: '베베하우스', 
            status: 'pending', 
            scheduled_date: null, 
            scheduled_time: null, 
            posted_at: null, 
            tags: ['육아', '정리습관', '교육'] 
          },
          { 
            id: '9', 
            title: '원목 가구 고민하시는 분들께 추천!', 
            content: '저도 원목 가구 처음 써보는데 이거 진짜 좋아요!\n\n화학 약품 냄새도 전혀 없고, 원목 특유의 은은한 향이 좋더라구요. 아이가 자주 만지는 가구라 소재가 중요한데 안심하고 쓸 수 있어요.\n\n가격도 합리적이고 품질도 좋아서 강추합니다! 👍', 
            content_type: 'review', 
            channel_name: '우리아이맘', 
            status: 'scheduled', 
            scheduled_date: '2025-11-17', 
            scheduled_time: '16:00:00', 
            posted_at: null, 
            tags: ['원목가구', '육아용품', '안전'] 
          },
          { 
            id: '10', 
            title: '아이방 꾸미기 중인데 선반 추천해주세요!', 
            content: '안녕하세요~ 곧 돌 되는 아기 엄마예요.\n\n아이방 꾸미는 중인데 수납 선반 추천 부탁드려요. 안전하고 예쁜 걸로요!\n\n사용하시는 분들 후기 궁금합니다 💚', 
            content_type: 'question', 
            channel_name: '맘스홀릭베이비', 
            status: 'scheduled', 
            scheduled_date: '2025-11-18', 
            scheduled_time: '10:30:00', 
            posted_at: null, 
            tags: ['아이방', '인테리어', '추천'] 
          },
        ] as ContentItem[]);
        
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

      // generated_contents 가져오기
      const itemIds = itemsData?.map(item => item.id) || [];
      if (itemIds.length > 0) {
        const { data: contentsData, error: contentsError } = await supabase
          .from('generated_contents')
          .select('*')
          .in('order_item_id', itemIds)
          .order('created_at', { ascending: false });

        if (contentsError) throw contentsError;
        setContents(contentsData as ContentItem[] || []);
      }

    } catch (error: any) {
      console.error('Error loading campaign content:', error);
      toast.error('콘텐츠를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleEditContent = (content: ContentItem) => {
    setSelectedContent(content);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedContent) return;

    try {
      const { error } = await supabase
        .from('generated_contents')
        .update({
          title: selectedContent.title,
          content: selectedContent.content,
          tags: selectedContent.tags,
        })
        .eq('id', selectedContent.id);

      if (error) throw error;

      toast.success('콘텐츠가 수정되었습니다');
      setIsEditDialogOpen(false);
      loadCampaignContent();
    } catch (error: any) {
      console.error('Error updating content:', error);
      toast.error('콘텐츠 수정에 실패했습니다');
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('이 콘텐츠를 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('generated_contents')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      toast.success('콘텐츠가 삭제되었습니다');
      loadCampaignContent();
    } catch (error: any) {
      console.error('Error deleting content:', error);
      toast.error('콘텐츠 삭제에 실패했습니다');
    }
  };

  const handleScheduleContent = async (contentId: string, date: string, time: string) => {
    try {
      const { error } = await supabase
        .from('generated_contents')
        .update({
          status: 'scheduled',
          scheduled_date: date,
          scheduled_time: time,
        })
        .eq('id', contentId);

      if (error) throw error;

      toast.success('게시 일정이 설정되었습니다');
      loadCampaignContent();
    } catch (error: any) {
      console.error('Error scheduling content:', error);
      toast.error('일정 설정에 실패했습니다');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      posted: { label: "게시완료", className: "bg-emerald-500", icon: CheckCircle2 },
      scheduled: { label: "예약됨", className: "bg-blue-500", icon: Clock },
      pending: { label: "대기중", className: "bg-amber-500", icon: Circle },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getContentTypeBadge = (type: string) => {
    const typeConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      review: { label: "후기형", variant: "default" },
      question: { label: "질문형", variant: "secondary" },
      deal: { label: "핫딜형", variant: "outline" },
    };
    const config = typeConfig[type] || { label: type, variant: "outline" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || content.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const postedContents = filteredContents.filter(c => c.status === 'posted');
  const scheduledContents = filteredContents.filter(c => c.status === 'scheduled');
  const pendingContents = filteredContents.filter(c => c.status === 'pending');

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

  const ContentCard = ({ content }: { content: ContentItem }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge(content.status)}
              {getContentTypeBadge(content.content_type)}
            </div>
            <h4 className="font-semibold mb-1 line-clamp-1">{content.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {content.content}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {content.channel_name}
              </span>
              {content.scheduled_date && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {content.scheduled_date} {content.scheduled_time}
                </span>
              )}
            </div>
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {content.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditContent(content)}>
                <Edit className="h-4 w-4 mr-2" />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                navigator.clipboard.writeText(content.content);
                toast.success('콘텐츠가 클립보드에 복사되었습니다');
              }}>
                <Copy className="h-4 w-4 mr-2" />
                복사
              </DropdownMenuItem>
              {content.status === 'pending' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    일정 설정
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleDeleteContent(content.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {content.status === 'posted' && (
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border text-xs">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">2.8K</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">45</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">120</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <Link to={`/app/campaigns/${id}`}>
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              캠페인 상세로
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">콘텐츠 관리</h1>
          <p className="text-muted-foreground">{campaign?.product_name || '캠페인 콘텐츠'}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <CalendarCheck className="h-4 w-4 mr-2" />
            일괄 예약
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            일괄 게시
          </Button>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">전체</p>
                <p className="text-2xl font-bold">{contents.length}개</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">게시완료</p>
                <p className="text-2xl font-bold">{postedContents.length}개</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">예약됨</p>
                <p className="text-2xl font-bold">{scheduledContents.length}개</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">대기중</p>
                <p className="text-2xl font-bold">{pendingContents.length}개</p>
              </div>
              <div className="p-3 rounded-full bg-amber-500/10">
                <Circle className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 & 필터 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="콘텐츠 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="posted">게시완료</SelectItem>
                <SelectItem value="scheduled">예약됨</SelectItem>
                <SelectItem value="pending">대기중</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 콘텐츠 목록 */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">전체 ({filteredContents.length})</TabsTrigger>
          <TabsTrigger value="posted">게시완료 ({postedContents.length})</TabsTrigger>
          <TabsTrigger value="scheduled">예약됨 ({scheduledContents.length})</TabsTrigger>
          <TabsTrigger value="pending">대기중 ({pendingContents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContents.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="posted">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {postedContents.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledContents.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingContents.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>콘텐츠 수정</DialogTitle>
            <DialogDescription>
              콘텐츠의 제목, 내용, 태그를 수정할 수 있습니다
            </DialogDescription>
          </DialogHeader>
          
          {selectedContent && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>제목</Label>
                <Input
                  value={selectedContent.title}
                  onChange={(e) => setSelectedContent({ ...selectedContent, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>내용</Label>
                <Textarea
                  value={selectedContent.content}
                  onChange={(e) => setSelectedContent({ ...selectedContent, content: e.target.value })}
                  rows={12}
                />
              </div>

              <div className="space-y-2">
                <Label>태그 (쉼표로 구분)</Label>
                <Input
                  value={selectedContent.tags?.join(', ') || ''}
                  onChange={(e) => setSelectedContent({ 
                    ...selectedContent, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  placeholder="육아, 아기용품, 맘카페"
                />
              </div>

              <div className="flex items-center gap-2">
                {getContentTypeBadge(selectedContent.content_type)}
                <Badge variant="outline">{selectedContent.channel_name}</Badge>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveEdit}>
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignContent;
