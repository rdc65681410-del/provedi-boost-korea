import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Eye,
  FileText,
  Search,
  Filter,
  Check,
  AlertCircle,
  Send,
  Trash2,
  Copy,
  MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'scheduled' | 'posted';
  channel_name: string;
  content_type: string;
  scheduled_date?: string;
  scheduled_time?: string;
  posted_at?: string;
  tags?: string[];
}

const CampaignContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [selectedContents, setSelectedContents] = useState<string[]>([]);

  useEffect(() => {
    loadCampaignContents();
  }, [id]);

  const loadCampaignContents = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Load order info
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) throw orderError;
      setOrderInfo(order);

      // Load order items to get their IDs
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('id')
        .eq('order_id', id);

      if (itemsError) throw itemsError;

      // Load generated contents
      const { data: contentsData, error: contentsError } = await supabase
        .from('generated_contents')
        .select('*')
        .in('order_item_id', items.map(i => i.id))
        .order('created_at', { ascending: false });

      if (contentsError) throw contentsError;
      setContents((contentsData || []) as ContentItem[]);
    } catch (error) {
      console.error('Error loading contents:', error);
      toast.error('콘텐츠를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleEditContent = async (content: ContentItem) => {
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
          tags: selectedContent.tags
        })
        .eq('id', selectedContent.id);

      if (error) throw error;

      toast.success('콘텐츠가 수정되었습니다');
      setIsEditDialogOpen(false);
      loadCampaignContents();
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('수정에 실패했습니다');
    }
  };

  const handleScheduleContent = async () => {
    if (!scheduleDate || selectedContents.length === 0) {
      toast.error('날짜와 콘텐츠를 선택해주세요');
      return;
    }

    try {
      const { error } = await supabase
        .from('generated_contents')
        .update({
          status: 'scheduled',
          scheduled_date: format(scheduleDate, 'yyyy-MM-dd'),
          scheduled_time: scheduleTime
        })
        .in('id', selectedContents);

      if (error) throw error;

      toast.success(`${selectedContents.length}개 콘텐츠가 예약되었습니다`);
      setIsScheduleDialogOpen(false);
      setSelectedContents([]);
      loadCampaignContents();
    } catch (error) {
      console.error('Error scheduling content:', error);
      toast.error('예약에 실패했습니다');
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('generated_contents')
        .delete()
        .eq('id', contentId);

      if (error) throw error;

      toast.success('콘텐츠가 삭제되었습니다');
      loadCampaignContents();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('삭제에 실패했습니다');
    }
  };

  const handleDuplicateContent = async (content: ContentItem) => {
    try {
      const { error } = await supabase
        .from('generated_contents')
        .insert({
          order_item_id: content.id,
          title: `${content.title} (복사본)`,
          content: content.content,
          content_type: content.content_type,
          channel_name: content.channel_name,
          status: 'pending',
          tags: content.tags
        });

      if (error) throw error;

      toast.success('콘텐츠가 복제되었습니다');
      loadCampaignContents();
    } catch (error) {
      console.error('Error duplicating content:', error);
      toast.error('복제에 실패했습니다');
    }
  };

  const toggleContentSelection = (contentId: string) => {
    setSelectedContents(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      pending: { label: "대기중", className: "bg-yellow-500", icon: AlertCircle },
      scheduled: { label: "예약됨", className: "bg-blue-500", icon: Clock },
      posted: { label: "게시됨", className: "bg-green-500", icon: Check },
    };
    const badge = config[status] || config.pending;
    const Icon = badge.icon;
    return (
      <Badge className={badge.className}>
        <Icon className="h-3 w-3 mr-1" />
        {badge.label}
      </Badge>
    );
  };

  const filteredContents = contents.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.channel_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingContents = filteredContents.filter(c => c.status === 'pending');
  const scheduledContents = filteredContents.filter(c => c.status === 'scheduled');
  const postedContents = filteredContents.filter(c => c.status === 'posted');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">콘텐츠를 불러오는 중...</p>
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
              <input
                type="checkbox"
                checked={selectedContents.includes(content.id)}
                onChange={() => toggleContentSelection(content.id)}
                className="rounded border-gray-300"
              />
              <h3 className="font-semibold text-lg">{content.title}</h3>
            </div>
            <div className="flex items-center gap-2 mb-3">
              {getStatusBadge(content.status)}
              <Badge variant="outline">{content.channel_name}</Badge>
              <Badge variant="outline">{content.content_type}</Badge>
            </div>
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
              <DropdownMenuItem onClick={() => handleDuplicateContent(content)}>
                <Copy className="h-4 w-4 mr-2" />
                복제
              </DropdownMenuItem>
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

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {content.content}
        </p>

        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {content.tags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {content.scheduled_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {new Date(content.scheduled_date).toLocaleDateString('ko-KR')}
              {content.scheduled_time && ` ${content.scheduled_time}`}
            </span>
          </div>
        )}

        {content.posted_at && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 mb-3">
            <Check className="h-4 w-4" />
            <span>
              게시됨: {new Date(content.posted_at).toLocaleDateString('ko-KR')}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => handleEditContent(content)}
          >
            <Eye className="h-4 w-4 mr-2" />
            미리보기
          </Button>
          {content.status === 'pending' && (
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => {
                setSelectedContents([content.id]);
                setIsScheduleDialogOpen(true);
              }}
            >
              <Clock className="h-4 w-4 mr-2" />
              예약하기
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/app/campaigns/${id}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">콘텐츠 관리</h1>
            <p className="text-muted-foreground">
              {orderInfo?.product_name || '캠페인'} - 총 {contents.length}개 콘텐츠
            </p>
          </div>
        </div>
        
        {selectedContents.length > 0 && (
          <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Clock className="h-4 w-4 mr-2" />
                선택 항목 예약 ({selectedContents.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>게시 일정 예약</DialogTitle>
                <DialogDescription>
                  선택한 {selectedContents.length}개 콘텐츠의 게시 일정을 설정하세요
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>게시 날짜</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {scheduleDate ? format(scheduleDate, 'PPP', { locale: ko }) : "날짜 선택"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={scheduleDate}
                        onSelect={setScheduleDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>게시 시간</Label>
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsScheduleDialogOpen(false)}
                >
                  취소
                </Button>
                <Button onClick={handleScheduleContent}>
                  예약하기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="콘텐츠 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              필터
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">대기중</p>
                <p className="text-2xl font-bold">{pendingContents.length}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500/10">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">예약됨</p>
                <p className="text-2xl font-bold">{scheduledContents.length}</p>
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
                <p className="text-sm text-muted-foreground mb-1">게시됨</p>
                <p className="text-2xl font-bold">{postedContents.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <Check className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">전체 ({filteredContents.length})</TabsTrigger>
          <TabsTrigger value="pending">대기중 ({pendingContents.length})</TabsTrigger>
          <TabsTrigger value="scheduled">예약됨 ({scheduledContents.length})</TabsTrigger>
          <TabsTrigger value="posted">게시됨 ({postedContents.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredContents.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingContents.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {scheduledContents.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="posted" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {postedContents.map(content => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>콘텐츠 수정</DialogTitle>
            <DialogDescription>
              콘텐츠 제목과 내용을 수정하세요
            </DialogDescription>
          </DialogHeader>
          
          {selectedContent && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>제목</Label>
                <Input
                  value={selectedContent.title}
                  onChange={(e) => setSelectedContent({
                    ...selectedContent,
                    title: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>내용</Label>
                <Textarea
                  value={selectedContent.content}
                  onChange={(e) => setSelectedContent({
                    ...selectedContent,
                    content: e.target.value
                  })}
                  rows={12}
                />
              </div>

              <div className="space-y-2">
                <Label>태그 (쉼표로 구분)</Label>
                <Input
                  value={selectedContent.tags?.join(', ') || ''}
                  onChange={(e) => setSelectedContent({
                    ...selectedContent,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="육아, 유아용품, 추천"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
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
