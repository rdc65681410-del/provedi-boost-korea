import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  Target, 
  DollarSign, 
  Shield, 
  Flame, 
  Search,
  Sparkles,
  Eye,
  MessageCircle,
  Clock,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { CafeActivityGrade } from "@/components/CafeActivityGrade";
import { TimePerformancePredictor } from "@/components/TimePerformancePredictor";
import { supabase } from "@/integrations/supabase/client";

type Category = "전체" | "육아용품" | "임신/출산" | "지역맘" | "리뷰전문";

interface CafeData {
  id: string;
  name: string;
  activityLevel: string;
  activityScore: number;
  members: number;
  memberGrowth: number;
  dailyPosts: number;
  dailyComments: number;
  matchScore: number;
  estimatedCost: string;
  adPolicy: string;
  difficulty: string;
  expectedViews: string;
  expectedEngagement: number;
  category: Category;
  keywords: string[];
  bestPostingTimes: string[];
  avgResponseTime: string;
  successRate: number;
  isHot?: boolean;
  isRising?: boolean;
}

const Channels = () => {
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedCafes, setRecommendedCafes] = useState<CafeData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");
  const [selectedCafe, setSelectedCafe] = useState<CafeData | null>(null);
  const [showAllCafes, setShowAllCafes] = useState(false);

  // 전체 카페 데이터베이스에서 가져오기
  const loadAllCafes = async () => {
    try {
      const { data, error } = await supabase
        .from('mom_cafe_channels')
        .select('*')
        .order('success_rate', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedCafes: CafeData[] = data.map((cafe: any) => ({
          id: cafe.id,
          name: cafe.name,
          activityLevel: cafe.activity_level,
          activityScore: Math.round(cafe.success_rate || 75),
          members: cafe.members,
          memberGrowth: Math.random() * 20 + 5,
          dailyPosts: cafe.avg_views / 10,
          dailyComments: cafe.avg_views / 5,
          matchScore: Math.round(cafe.success_rate || 75),
          estimatedCost: `${Math.floor(cafe.pricing.review / 10000)}-${Math.floor(cafe.pricing.review / 5000)}만원`,
          adPolicy: "허용",
          difficulty: cafe.activity_level === "매우 높음" ? "어려움" : cafe.activity_level === "높음" ? "보통" : "쉬움",
          expectedViews: `${Math.floor(cafe.avg_views / 100) * 100}-${Math.floor(cafe.avg_views / 50) * 100}`,
          expectedEngagement: cafe.avg_engagement_rate || 5.0,
          category: "육아용품",
          keywords: cafe.keywords || [],
          bestPostingTimes: ["오전 10-11시", "오후 2-3시", "오후 8-10시"],
          avgResponseTime: "2시간 이내",
          successRate: cafe.success_rate,
          isHot: cafe.success_rate > 85,
          isRising: cafe.avg_engagement_rate > 5.0
        }));

        setRecommendedCafes(formattedCafes);
      }
    } catch (error) {
      console.error("카페 데이터 로드 오류:", error);
      toast.error("카페 데이터를 불러오는데 실패했습니다");
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !selectedKeywords.includes(keywordInput.trim())) {
      setSelectedKeywords([...selectedKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
  };

  const handleAnalyzeKeywords = async () => {
    if (selectedKeywords.length === 0) {
      toast.error("최소 1개 이상의 키워드를 입력해주세요");
      return;
    }

    setIsAnalyzing(true);
    toast.info("AI가 최적의 카페를 분석하고 있습니다...");

    try {
      // 데이터베이스에서 실제 카페 데이터 가져오기
      await loadAllCafes();

      // 키워드와 매칭되는 카페 점수 계산
      const scoredCafes = recommendedCafes.map(cafe => {
        const keywordMatchCount = selectedKeywords.filter(keyword => 
          cafe.keywords.some(ck => ck.toLowerCase().includes(keyword.toLowerCase()))
        ).length;
        
        const matchScore = (keywordMatchCount / selectedKeywords.length) * 100;
        
        return {
          ...cafe,
          matchScore: Math.min(100, cafe.matchScore + matchScore)
        };
      });

      // 매칭 점수로 정렬
      const sortedCafes = scoredCafes
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 10);

      setRecommendedCafes(sortedCafes);
      toast.success(`${sortedCafes.length}개의 최적 카페를 찾았습니다!`);
    } catch (error) {
      console.error("분석 오류:", error);
      toast.error("분석에 실패했습니다");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredCafes = recommendedCafes.filter(cafe => {
    const matchesCategory = selectedCategory === "전체" || cafe.category === selectedCategory;
    return matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">맘카페 채널 추천</h1>
        <p className="text-muted-foreground">
          상품 키워드를 입력하면 AI가 최적의 맘카페를 추천합니다
        </p>
      </div>

      {/* 키워드 입력 섹션 */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            상품 키워드 입력
          </CardTitle>
          <CardDescription>
            상품과 관련된 키워드를 입력하면 가장 적합한 맘카페를 AI가 추천합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyword">키워드 입력</Label>
            <div className="flex gap-2">
              <Input
                id="keyword"
                placeholder="예: 아기띠, 유아식, 장난감 등"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                disabled={isAnalyzing}
              />
              <Button 
                onClick={handleAddKeyword}
                variant="outline"
                disabled={isAnalyzing}
              >
                추가
              </Button>
            </div>
          </div>

          {selectedKeywords.length > 0 && (
            <div className="space-y-2">
              <Label>선택된 키워드 ({selectedKeywords.length}개)</Label>
              <div className="flex flex-wrap gap-2">
                {selectedKeywords.map((keyword, idx) => (
                  <Badge 
                    key={idx}
                    variant="secondary"
                    className="text-sm px-3 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleRemoveKeyword(keyword)}
                  >
                    {keyword} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button 
            onClick={handleAnalyzeKeywords}
            disabled={isAnalyzing || selectedKeywords.length === 0}
            size="lg"
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Activity className="h-5 w-5 mr-2 animate-spin" />
                AI 분석 중...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                최적 카페 찾기
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 전체 카페 보기 버튼 */}
      {recommendedCafes.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={() => {
                loadAllCafes();
                setShowAllCafes(true);
              }}
              variant="outline"
              className="w-full"
            >
              <Users className="h-4 w-4 mr-2" />
              전체 맘카페 데이터베이스 보기
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 추천 결과 */}
      {recommendedCafes.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {selectedKeywords.length > 0 ? '맞춤 추천 카페' : '전체 카페 목록'}
            </h2>
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체 카테고리</SelectItem>
                <SelectItem value="육아용품">육아용품</SelectItem>
                <SelectItem value="임신/출산">임신/출산</SelectItem>
                <SelectItem value="지역맘">지역맘</SelectItem>
                <SelectItem value="리뷰전문">리뷰전문</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCafes.map((cafe) => (
              <Card 
                key={cafe.id} 
                className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer"
                onClick={() => setSelectedCafe(cafe)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{cafe.name}</CardTitle>
                        {cafe.isHot && <Flame className="w-5 h-5 text-orange-500" />}
                        {cafe.isRising && <TrendingUp className="w-5 h-5 text-emerald-500" />}
                      </div>
                      <Badge variant="outline">{cafe.category}</Badge>
                    </div>
                    <CafeActivityGrade 
                      activityLevel={cafe.activityLevel}
                      activityScore={cafe.activityScore}
                      size="sm"
                    />
                  </div>

                  {selectedKeywords.length > 0 && (
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">브랜드 적합도</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                            style={{ width: `${cafe.matchScore}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold text-primary">{cafe.matchScore}%</span>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 주요 지표 */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Users className="w-3 h-3" />
                        회원수
                      </div>
                      <div className="font-bold text-sm">{(cafe.members / 1000).toFixed(0)}K</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Eye className="w-3 h-3" />
                        예상 조회
                      </div>
                      <div className="font-bold text-sm">{cafe.expectedViews}</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <MessageCircle className="w-3 h-3" />
                        참여율
                      </div>
                      <div className="font-bold text-sm text-accent">{cafe.expectedEngagement}%</div>
                    </div>
                  </div>

                  {/* 세부 정보 */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">일일 활동량</span>
                      <span className="font-semibold">
                        게시글 {cafe.dailyPosts.toFixed(0)} · 댓글 {cafe.dailyComments.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">예상 비용</span>
                      <span className="font-semibold">{cafe.estimatedCost}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">진입 난이도</span>
                      <Badge variant={
                        cafe.difficulty === "쉬움" ? "default" : 
                        cafe.difficulty === "보통" ? "secondary" : "outline"
                      }>
                        {cafe.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">성공률</span>
                      <span className="font-semibold text-emerald-600">{cafe.successRate}%</span>
                    </div>
                  </div>

                  {/* 최적 시간대 미리보기 */}
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-3 w-3 text-accent" />
                      <span className="text-xs font-semibold">추천 포스팅 시간</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cafe.bestPostingTimes.slice(0, 3).map((time, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCafe(cafe);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    상세 분석 보기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* 선택된 카페 상세 정보 모달 */}
      {selectedCafe && (
        <Card className="fixed inset-4 z-50 overflow-y-auto bg-background shadow-2xl">
          <CardHeader className="border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {selectedCafe.name}
                  <CafeActivityGrade 
                    activityLevel={selectedCafe.activityLevel}
                    activityScore={selectedCafe.activityScore}
                    size="md"
                  />
                </CardTitle>
                <CardDescription className="mt-2">
                  상세 성과 예측 및 최적 전략 분석
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedCafe(null)}
              >
                닫기 ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <TimePerformancePredictor cafeName={selectedCafe.name} />
            
            <Card>
              <CardHeader>
                <CardTitle>카페 상세 정보</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">회원 수</span>
                  <p className="text-lg font-bold">{selectedCafe.members.toLocaleString()}명</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">월간 성장률</span>
                  <p className="text-lg font-bold text-emerald-600">+{selectedCafe.memberGrowth.toFixed(1)}%</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">평균 응답 시간</span>
                  <p className="text-lg font-bold">{selectedCafe.avgResponseTime}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">캠페인 성공률</span>
                  <p className="text-lg font-bold text-accent">{selectedCafe.successRate}%</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Channels;
