import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { 
  LinkIcon, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star, 
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Target,
  TrendingDown,
  Sparkles,
  Award,
  BarChart3,
  Calendar,
  Zap,
  Plus,
  Minus
} from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar } from "recharts";
import { CompetitorKeywordMap } from "@/components/CompetitorKeywordMap";
import { CafeExposureHeatmap } from "@/components/CafeExposureHeatmap";
import { CafePostingStatus } from "@/components/CafePostingStatus";
import { CafeActivityGrade } from "@/components/CafeActivityGrade";
import { TimePerformancePredictor } from "@/components/TimePerformancePredictor";

interface ChannelRecommendation {
  name: string;
  score: number;
  members: string;
  activityLevel: string;
  cost: string;
  contentType: string;
  reason: string;
  rating: string;
  logo: string;
  pricing: {
    review: number;
    question: number;
    hotdeal: number;
  };
  successRate: number;
  recommendedPosts: number;
}

const Analyze = () => {
  const [productUrl, setProductUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedChannels, setSelectedChannels] = useState<Map<number, number>>(new Map());

  const handleAnalyze = async () => {
    if (!productUrl) {
      toast.error("상품 URL을 입력해주세요");
      return;
    }

    try {
      new URL(productUrl);
    } catch {
      toast.error("올바른 URL 형식이 아닙니다");
      return;
    }

    setIsAnalyzing(true);
    toast.info("AI가 상품을 분석하고 있습니다... 1-2분 소요될 수 있습니다.");
    
    try {
      // Edge Function 호출
      const { data, error } = await supabase.functions.invoke('analyze-product', {
        body: { productUrl }
      });

      if (error) {
        console.error("분석 오류:", error);
        throw new Error(error.message || "분석에 실패했습니다");
      }

      if (!data.success) {
        throw new Error(data.error || "분석 데이터를 가져올 수 없습니다");
      }

      // AI 응답 데이터 처리
      const aiAnalysis = data.analysis;
      
      // 기존 mock 데이터 형식으로 변환 (UI 호환성 유지)
      const formattedResult = {
        product: aiAnalysis.product || {
          name: "분석된 상품",
          category: "기타",
          priceRange: "확인 필요",
          keywords: aiAnalysis.product?.keywords || ["상품", "추천"],
          avgPrice: aiAnalysis.product?.avgPrice || 0
        },
        overallScore: aiAnalysis.overallScore || 75,
        scoreLevel: aiAnalysis.scoreLevel || "우수",
        reviewAnalysis: aiAnalysis.reviewAnalysis || {
          totalReviews: 0,
          positiveCount: 0,
          negativeCount: 0,
          positiveReviews: ["긍정적인 리뷰가 많습니다."],
          negativeReviews: ["일부 개선이 필요한 점이 있습니다."]
        },
        competitor: aiAnalysis.competitor || {
          marketShare: 20,
          avgPrice: 40000,
          topBrands: ["브랜드A", "브랜드B"],
          competitionLevel: "중간",
          pricePosition: "경쟁력 있음"
        },
        roi: aiAnalysis.roi || {
          estimatedInvestment: 300000,
          expectedRevenue: 1000000,
          roi: 233,
          breakEven: "약 2-3주",
          profitMargin: 700000
        },
        successCase: aiAnalysis.successCase || {
          productName: "유사 상품",
          category: "동일 카테고리",
          revenue: "월 2,000만원",
          period: "3개월",
          channels: 5,
          engagement: "7.5%"
        },
        topKeywords: aiAnalysis.topKeywords || [],
        channels: aiAnalysis.channels || [],
        contentSamples: aiAnalysis.contentSamples || [],
        timing: aiAnalysis.timing || {
          bestTimes: ["오전 10-11시", "오후 2-3시"],
          bestDays: ["월요일", "수요일"]
        },
        insights: aiAnalysis.insights || {
          competitionLevel: "중간",
          seasonality: "사계절",
          expectedReach: "5,000-8,000명",
          estimatedEngagement: "4.5-6.0%"
        },
        // 새로 추가된 데이터
        cafePostingStatus: aiAnalysis.cafePostingStatus || {},
        competitorBrands: aiAnalysis.competitorBrands || [],
        cafeExposureStrategy: aiAnalysis.cafeExposureStrategy || []
      };
      
      setAnalysisResult(formattedResult);
      toast.success("AI 분석이 완료되었습니다!");
    } catch (error: any) {
      console.error("분석 실패:", error);
      toast.error(error.message || "분석에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleChannelSelection = (index: number) => {
    const newSelection = new Map(selectedChannels);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      const recommendedCount = analysisResult?.channels[index]?.recommendedPosts || 10;
      newSelection.set(index, recommendedCount);
    }
    setSelectedChannels(newSelection);
  };

  const updateChannelCount = (index: number, delta: number) => {
    const newSelection = new Map(selectedChannels);
    const currentCount = newSelection.get(index) || 0;
    const newCount = Math.max(1, Math.min(50, currentCount + delta));
    newSelection.set(index, newCount);
    setSelectedChannels(newSelection);
  };

  const calculateTotal = () => {
    if (!analysisResult) return 0;
    let total = 0;
    selectedChannels.forEach((count, index) => {
      const channel = analysisResult.channels[index];
      const typeKey = channel.contentType === "후기형" ? "review" : 
                     channel.contentType === "질문형" ? "question" : "hotdeal";
      total += channel.pricing[typeKey] * count;
    });
    return total;
  };

  const getTotalPosts = () => {
    let total = 0;
    selectedChannels.forEach((count) => {
      total += count;
    });
    return total;
  };

  const handleProceedToPayment = () => {
    if (selectedChannels.size === 0) {
      toast.error("최소 1개 이상의 채널을 선택해주세요");
      return;
    }

    const finalAmount = selectedChannels.size > 1 
      ? Math.floor(calculateTotal() * 0.9) 
      : calculateTotal();

    toast.success(`${selectedChannels.size}개 채널 선택 완료 - ${finalAmount.toLocaleString()}원`);
  };

  const successRateData = analysisResult?.channels.map((ch: ChannelRecommendation) => ({
    name: ch.name.slice(0, 8),
    rate: ch.successRate,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">링크 분석</h1>
        <p className="text-muted-foreground">
          상품 URL을 입력하면 AI가 최적의 맘카페 채널과 마케팅 전략을 추천합니다
        </p>
      </div>

      {/* URL 입력 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>상품 URL 입력</CardTitle>
          <CardDescription>
            쿠팡, 네이버 스마트스토어, 자사몰 등 상품 링크를 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">상품 URL</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://..."
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="pl-10"
                  disabled={isAnalyzing}
                />
              </div>
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    AI 분석 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    분석 시작
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-start space-x-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              쿠팡, 네이버 스마트스토어, 11번가, 자사몰 등 다양한 쇼핑몰 URL을 지원합니다
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 분석 결과 */}
      {analysisResult && (
        <div className="space-y-6 animate-fade-in">
          {/* 상품 정보 + 종합 평가 + ROI */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 상품 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>상품 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{analysisResult.product.category}</Badge>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{analysisResult.product.name}</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">가격대</span>
                      <span className="font-semibold">{analysisResult.product.priceRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">리뷰 수</span>
                      <span className="font-semibold">{analysisResult.reviewAnalysis.totalReviews}건</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 종합 평가 */}
            <Card>
              <CardHeader>
                <CardTitle>종합 평가</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: analysisResult.overallScore },
                            { value: 100 - analysisResult.overallScore }
                          ]}
                          cx="50%"
                          cy="50%"
                          startAngle={180}
                          endAngle={0}
                          innerRadius={45}
                          outerRadius={60}
                          dataKey="value"
                        >
                          <Cell fill="hsl(var(--accent))" />
                          <Cell fill="hsl(var(--muted))" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-accent">{analysisResult.scoreLevel}</div>
                      <div className="text-xs text-muted-foreground">
                        {analysisResult.overallScore}점
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    맘카페 마케팅 적합도
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* 예상 ROI */}
            <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-accent" />
                  예상 ROI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">투자 금액</div>
                  <div className="text-xl font-bold">
                    {analysisResult.roi.estimatedInvestment.toLocaleString()}원
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">예상 매출</div>
                  <div className="text-xl font-bold text-accent">
                    {analysisResult.roi.expectedRevenue.toLocaleString()}원
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-accent">{analysisResult.roi.roi}%</span>
                    <span className="text-sm text-muted-foreground">ROI</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    손익분기 {analysisResult.roi.breakEven}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 경쟁사 분석 + 성공 사례 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 경쟁사 분석 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  경쟁사 분석
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-sm text-muted-foreground mb-1">시장 점유율</div>
                    <div className="text-2xl font-bold">{analysisResult.competitor.marketShare}%</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-sm text-muted-foreground mb-1">경쟁 수준</div>
                    <Badge variant="secondary">{analysisResult.competitor.competitionLevel}</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">가격 경쟁력</div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-accent">{analysisResult.competitor.pricePosition}</Badge>
                    <span className="text-sm">
                      경쟁사 평균: {analysisResult.competitor.avgPrice.toLocaleString()}원
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-2">주요 경쟁 브랜드</div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.competitor.topBrands.map((brand: string, idx: number) => (
                      <Badge key={idx} variant="outline">{brand}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 성공 사례 */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  유사 상품 성공 사례
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">상품명</div>
                  <div className="font-semibold">{analysisResult.successCase.productName}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">기간</div>
                    <div className="font-bold">{analysisResult.successCase.period}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">채널 수</div>
                    <div className="font-bold">{analysisResult.successCase.channels}개</div>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-sm text-muted-foreground mb-1">총 매출</div>
                  <div className="text-2xl font-bold text-primary">
                    {analysisResult.successCase.revenue}
                  </div>
                </div>
                <Badge className="w-full justify-center bg-primary">
                  참여율 {analysisResult.successCase.engagement}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* 키워드 트렌드 + 리뷰 분석 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 실시간 키워드 트렌드 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-amber-500" />
                  실시간 키워드 트렌드
                </CardTitle>
                <CardDescription>
                  상위 노출되고 있는 키워드 Top 5
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.topKeywords.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">
                          {item.rank}
                        </Badge>
                        <div>
                          <span className="font-semibold">{item.keyword}</span>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">{item.count}</Badge>
                            {item.trend === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                            {item.trend === "down" && <TrendingDown className="h-3 w-3 text-rose-500" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          {/* 리뷰 분석 */}
            <Card>
              <CardHeader>
                <CardTitle>리뷰 분석</CardTitle>
                <CardDescription>
                  총 {analysisResult.reviewAnalysis.totalReviews}개 리뷰 분석 결과
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold text-emerald-600">긍정 리뷰</span>
                    <Badge variant="secondary">{analysisResult.reviewAnalysis.positiveCount}건</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analysisResult.reviewAnalysis.positiveReviews[0]}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsDown className="h-4 w-4 text-rose-500" />
                    <span className="font-semibold text-rose-600">부정 리뷰</span>
                    <Badge variant="secondary">{analysisResult.reviewAnalysis.negativeCount}건</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analysisResult.reviewAnalysis.negativeReviews[0]}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 맘카페 포스팅 현황 */}
          <CafePostingStatus cafePostingStatus={analysisResult.cafePostingStatus} />

          {/* 경쟁사 브랜드 키워드 노출 지도 */}
          <CompetitorKeywordMap competitorBrands={analysisResult.competitorBrands} />

          {/* 카페별 노출 전략 */}
          <CafeExposureHeatmap cafeExposureStrategy={analysisResult.cafeExposureStrategy} />

          {/* AI 생성 콘텐츠 샘플 */}
          <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                AI 생성 콘텐츠 샘플
              </CardTitle>
              <CardDescription>
                각 채널 유형에 맞춰 AI가 자동 생성한 게시글 예시
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysisResult.contentSamples.map((sample: any, idx: number) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit mb-2">{sample.type}</Badge>
                      <CardTitle className="text-sm">{sample.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{sample.preview}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 채널별 성공률 차트 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                채널별 성공률
              </CardTitle>
              <CardDescription>최근 3개월 캠페인 성공률</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={successRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="rate" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 시간대별 성과 예측 */}
          <TimePerformancePredictor />

          {/* 추천 채널 */}
          <Card>
            <CardHeader>
              <CardTitle>브랜드 맞춤 추천 맘카페 (Top 5)</CardTitle>
              <CardDescription>
                AI가 분석한 가장 효과적인 맘카페 채널 - 활성도 등급과 성과 예측 포함
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisResult.channels.map((channel: ChannelRecommendation, idx: number) => {
                const isSelected = selectedChannels.has(idx);
                const postCount = selectedChannels.get(idx) || 0;
                
                return (
                  <Card 
                    key={idx} 
                    className={`border-2 transition-all ${
                      isSelected
                        ? 'border-accent bg-accent/5 shadow-lg'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="text-4xl">
                            {channel.logo}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="text-lg font-bold">{channel.name}</h3>
                              {isSelected && (
                                <Badge className="bg-accent">선택됨 ✓</Badge>
                              )}
                              {idx === 0 && (
                                <Badge className="bg-primary">최고 추천</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{channel.reason}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                추천: {channel.recommendedPosts}개 포스팅
                              </Badge>
                              <CafeActivityGrade 
                                activityLevel={channel.activityLevel}
                                activityScore={channel.score}
                                size="sm"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant="secondary" className="text-lg font-bold">
                            {channel.rating}
                          </Badge>
                          <div className="flex items-center text-accent">
                            <Star className="h-4 w-4 mr-1 fill-current" />
                            <span className="text-sm font-semibold">{channel.score}점</span>
                          </div>
                        </div>
                      </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">회원수</p>
                          <p className="font-semibold">{channel.members}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">활성도</p>
                          <p className="font-semibold">{channel.activityLevel}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">게시 비용</p>
                          <p className="font-semibold">{channel.cost}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        <div>
                          <p className="text-xs text-muted-foreground">성공률</p>
                          <p className="font-semibold text-accent">{channel.successRate}%</p>
                        </div>
                      </div>
                    </div>

                      {/* 가격 견적 & 선택/개수 조절 */}
                      <div className="pt-4 border-t border-border space-y-4">
                        <div>
                          <p className="text-sm font-semibold mb-3">콘텐츠 타입별 견적 (개당)</p>
                          <div className="grid grid-cols-3 gap-3">
                            <div className={`p-3 rounded-lg text-center transition-all ${
                              channel.contentType === "후기형" 
                                ? 'bg-accent text-accent-foreground' 
                                : 'bg-muted'
                            }`}>
                              <div className="text-xs mb-1">후기형</div>
                              <div className="font-bold">{channel.pricing.review.toLocaleString()}원</div>
                            </div>
                            <div className={`p-3 rounded-lg text-center transition-all ${
                              channel.contentType === "질문형" 
                                ? 'bg-accent text-accent-foreground' 
                                : 'bg-muted'
                            }`}>
                              <div className="text-xs mb-1">질문형</div>
                              <div className="font-bold">{channel.pricing.question.toLocaleString()}원</div>
                            </div>
                            <div className={`p-3 rounded-lg text-center transition-all ${
                              channel.contentType === "핫딜형" 
                                ? 'bg-accent text-accent-foreground' 
                                : 'bg-muted'
                            }`}>
                              <div className="text-xs mb-1">핫딜형</div>
                              <div className="font-bold">{channel.pricing.hotdeal.toLocaleString()}원</div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            현재 추천: <span className="font-semibold text-accent">{channel.contentType}</span>
                          </p>
                        </div>

                        {/* 선택 및 개수 조절 */}
                        {isSelected ? (
                          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent">
                            <div className="flex items-center gap-3">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateChannelCount(idx, -1);
                                }}
                                disabled={postCount <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <div className="text-center min-w-[80px]">
                                <div className="text-2xl font-bold text-accent">{postCount}</div>
                                <div className="text-xs text-muted-foreground">포스팅</div>
                              </div>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateChannelCount(idx, 1);
                                }}
                                disabled={postCount >= 50}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleChannelSelection(idx);
                              }}
                            >
                              선택 취소
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleChannelSelection(idx);
                            }}
                          >
                            이 채널 선택하기
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* 결제 요약 */}
              {selectedChannels.size > 0 && (
                <Card className="border-2 border-accent bg-gradient-to-r from-accent/5 to-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">선택한 채널 요약</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>선택된 채널: <span className="font-bold text-accent">{selectedChannels.size}개</span></span>
                          <span>•</span>
                          <span>총 포스팅: <span className="font-bold text-accent">{getTotalPosts()}개</span></span>
                          {selectedChannels.size > 1 && (
                            <>
                              <span>•</span>
                              <span className="text-accent font-semibold">
                                패키지 할인 10% 적용 🎉
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">총 견적</div>
                          {selectedChannels.size > 1 && (
                            <div className="text-sm text-muted-foreground line-through">
                              {calculateTotal().toLocaleString()}원
                            </div>
                          )}
                          <div className="text-3xl font-bold text-accent">
                            {selectedChannels.size > 1 
                              ? Math.floor(calculateTotal() * 0.9).toLocaleString()
                              : calculateTotal().toLocaleString()
                            }원
                          </div>
                        </div>
                        
                        <Button 
                          size="lg" 
                          className="h-16 px-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProceedToPayment();
                          }}
                        >
                          다음 단계로
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* 최적 발행 시간 + 예상 성과 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  최적 발행 시간
                </CardTitle>
                <CardDescription>채널별 활동 패턴 기반 추천</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">추천 시간대</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.timing.bestTimes.map((time: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">추천 요일</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.timing.bestDays.map((day: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  예상 성과
                </CardTitle>
                <CardDescription>AI 분석 기반 예측</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">경쟁 수준</span>
                    <Badge variant="secondary">{analysisResult.insights.competitionLevel}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">시즌성</span>
                    <span className="font-semibold">{analysisResult.insights.seasonality}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">예상 도달 범위</span>
                    <span className="font-semibold">{analysisResult.insights.expectedReach}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">예상 참여율</span>
                    <span className="font-semibold text-accent">
                      {analysisResult.insights.estimatedEngagement}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 결제 후 프로세스 */}
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>결제 후 진행 과정</CardTitle>
              <CardDescription>자동화된 워크플로우로 빠르게 캠페인을 시작하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <FileText className="h-10 w-10 text-accent mb-3" />
                  <span className="font-semibold mb-1">1. 콘텐츠 자동 생성</span>
                  <span className="text-xs text-muted-foreground">
                    AI가 각 채널에 최적화된 맞춤 게시글 작성
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <Calendar className="h-10 w-10 text-accent mb-3" />
                  <span className="font-semibold mb-1">2. 자동 스케줄링</span>
                  <span className="text-xs text-muted-foreground">
                    최적 시간대에 자동으로 게시 예약
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <TrendingUp className="h-10 w-10 text-accent mb-3" />
                  <span className="font-semibold mb-1">3. 실시간 성과 분석</span>
                  <span className="text-xs text-muted-foreground">
                    대시보드에서 캠페인 성과 모니터링
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analyze;
