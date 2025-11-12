import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Check,
  Clock,
  Users,
  FileText,
  Eye,
  MessageCircle,
  DollarSign,
  TrendingUp,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Calendar as CalendarIcon
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Campaign {
  id: number;
  name: string;
  status: "active" | "paused" | "completed" | "scheduled";
  productUrl: string;
  channels: string[];
  totalPosts: number;
  postedCount: number;
  views: number;
  engagement: number;
  revenue: number;
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
}

const Campaigns = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    productUrl: "",
    description: "",
  });

  // 목 데이터
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: "북유럽 원목 선반 캠페인",
      status: "active",
      productUrl: "https://example.com/product1",
      channels: ["맘스홀릭베이비", "베베하우스", "우리아이맘"],
      totalPosts: 15,
      postedCount: 8,
      views: 42300,
      engagement: 2480,
      revenue: 1850000,
      startDate: "2025-10-20",
      budget: 450000,
      spent: 240000,
    },
    {
      id: 2,
      name: "육아 필수템 프로모션",
      status: "active",
      productUrl: "https://example.com/product2",
      channels: ["맘스홀릭베이비", "베베하우스", "우리아이맘", "송파맘카페", "대치동맘모임"],
      totalPosts: 28,
      postedCount: 18,
      views: 78600,
      engagement: 4520,
      revenue: 3240000,
      startDate: "2025-10-15",
      budget: 780000,
      spent: 520000,
    },
    {
      id: 3,
      name: "겨울 아동복 신상품",
      status: "completed",
      productUrl: "https://example.com/product3",
      channels: ["베베하우스", "우리아이맘", "송파맘카페", "대치동맘모임"],
      totalPosts: 22,
      postedCount: 22,
      views: 61200,
      engagement: 3680,
      revenue: 2580000,
      startDate: "2025-10-01",
      endDate: "2025-10-25",
      budget: 620000,
      spent: 620000,
    },
    {
      id: 4,
      name: "유아 학습교구 특가",
      status: "scheduled",
      productUrl: "https://example.com/product4",
      channels: ["대치동맘모임", "송파맘카페"],
      totalPosts: 10,
      postedCount: 0,
      views: 0,
      engagement: 0,
      revenue: 0,
      startDate: "2025-11-05",
      budget: 280000,
      spent: 0,
    },
    {
      id: 5,
      name: "아이방 인테리어 소품",
      status: "paused",
      productUrl: "https://example.com/product5",
      channels: ["맘스홀릭베이비", "베베하우스"],
      totalPosts: 12,
      postedCount: 5,
      views: 18900,
      engagement: 1120,
      revenue: 680000,
      startDate: "2025-10-18",
      budget: 360000,
      spent: 150000,
    },
  ]);

  const getStatusBadge = (status: Campaign["status"]) => {
    const statusConfig = {
      active: { label: "진행중", className: "bg-emerald-500" },
      paused: { label: "일시정지", className: "bg-amber-500" },
      completed: { label: "완료", className: "bg-gray-500" },
      scheduled: { label: "예약됨", className: "bg-blue-500" },
    };
    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4" />;
      case "paused":
        return <Pause className="h-4 w-4" />;
      case "completed":
        return <Check className="h-4 w-4" />;
      case "scheduled":
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}만`;
    }
    return num.toLocaleString();
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.productUrl) {
      toast.error("캠페인 이름과 상품 URL을 입력해주세요");
      return;
    }
    
    toast.success("캠페인이 생성되었습니다!");
    setIsCreateDialogOpen(false);
    setNewCampaign({ name: "", productUrl: "", description: "" });
  };

  const handlePauseCampaign = (id: number) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, status: "paused" as const } : c
    ));
    toast.success("캠페인이 일시정지되었습니다");
  };

  const handleResumeCampaign = (id: number) => {
    setCampaigns(campaigns.map(c => 
      c.id === id ? { ...c, status: "active" as const } : c
    ));
    toast.success("캠페인이 재개되었습니다");
  };

  const handleDeleteCampaign = (id: number) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast.success("캠페인이 삭제되었습니다");
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCampaigns = filteredCampaigns.filter(c => c.status === "active");
  const scheduledCampaigns = filteredCampaigns.filter(c => c.status === "scheduled");
  const pausedCampaigns = filteredCampaigns.filter(c => c.status === "paused");
  const completedCampaigns = filteredCampaigns.filter(c => c.status === "completed");

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold">{campaign.name}</h3>
              {getStatusBadge(campaign.status)}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {campaign.productUrl}
            </p>
            <div className="flex flex-wrap gap-2">
              {campaign.channels.map((channel, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {channel}
                </Badge>
              ))}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                복제
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {campaign.status === "active" && (
                <DropdownMenuItem onClick={() => handlePauseCampaign(campaign.id)}>
                  <Pause className="h-4 w-4 mr-2" />
                  일시정지
                </DropdownMenuItem>
              )}
              {campaign.status === "paused" && (
                <DropdownMenuItem onClick={() => handleResumeCampaign(campaign.id)}>
                  <Play className="h-4 w-4 mr-2" />
                  재개
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleDeleteCampaign(campaign.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 진행률 */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">게시 진행률</span>
            <span className="font-semibold">
              {campaign.postedCount}/{campaign.totalPosts}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${(campaign.postedCount / campaign.totalPosts) * 100}%` }}
            />
          </div>
        </div>

        {/* 성과 지표 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">조회수</p>
              <p className="font-semibold">{formatNumber(campaign.views)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">참여</p>
              <p className="font-semibold">{formatNumber(campaign.engagement)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            <div>
              <p className="text-xs text-muted-foreground">매출</p>
              <p className="font-semibold text-emerald-600">{formatNumber(campaign.revenue)}원</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">ROI</p>
              <p className="font-semibold text-primary">
                {campaign.revenue > 0 ? Math.round((campaign.revenue / campaign.spent) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* 예산 */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">예산 사용</span>
            <span className="font-semibold">
              {formatNumber(campaign.spent)} / {formatNumber(campaign.budget)}원
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
            />
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 mt-4">
          <Link to={`/app/campaigns/${campaign.id}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              상세보기
            </Button>
          </Link>
          {campaign.status === "active" && (
            <Link to={`/app/campaigns/${campaign.id}/content`} className="flex-1">
              <Button className="w-full" size="sm">
                콘텐츠 관리
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">캠페인</h1>
          <p className="text-muted-foreground">
            맘카페 마케팅 캠페인을 관리하세요
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-5 w-5 mr-2" />
              새 캠페인 만들기
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 캠페인 만들기</DialogTitle>
              <DialogDescription>
                상품 URL을 분석하여 최적의 맘카페 채널을 추천받으세요
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">캠페인 이름 *</Label>
                <Input
                  id="campaign-name"
                  placeholder="예: 북유럽 원목 선반 캠페인"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-url">상품 URL *</Label>
                <Input
                  id="product-url"
                  type="url"
                  placeholder="https://..."
                  value={newCampaign.productUrl}
                  onChange={(e) => setNewCampaign({ ...newCampaign, productUrl: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  쿠팡, 네이버 스마트스토어 등 상품 링크를 입력하세요
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">캠페인 설명 (선택)</Label>
                <Textarea
                  id="description"
                  placeholder="캠페인에 대한 간단한 설명을 입력하세요"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleCreateCampaign}>
                다음: 채널 분석
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 검색 & 필터 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="캠페인 이름으로 검색..."
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

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">진행중</p>
                <p className="text-2xl font-bold">{activeCampaigns.length}</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/10">
                <Play className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">예약됨</p>
                <p className="text-2xl font-bold">{scheduledCampaigns.length}</p>
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
                <p className="text-sm text-muted-foreground mb-1">일시정지</p>
                <p className="text-2xl font-bold">{pausedCampaigns.length}</p>
              </div>
              <div className="p-3 rounded-full bg-amber-500/10">
                <Pause className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">완료</p>
                <p className="text-2xl font-bold">{completedCampaigns.length}</p>
              </div>
              <div className="p-3 rounded-full bg-gray-500/10">
                <Check className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 캠페인 목록 */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            전체 ({filteredCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            진행중 ({activeCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            예약됨 ({scheduledCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="paused">
            일시정지 ({pausedCampaigns.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            완료 ({completedCampaigns.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {scheduledCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paused" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pausedCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completedCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Campaigns;
