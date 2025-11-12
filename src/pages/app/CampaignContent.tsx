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

      if (orderError) throw orderError;
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
