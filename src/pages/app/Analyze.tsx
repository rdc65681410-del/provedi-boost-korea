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
  Minus,
  ShoppingCart,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar } from "recharts";
import { CompetitorKeywordMap } from "@/components/CompetitorKeywordMap";
import { CafeExposureHeatmap } from "@/components/CafeExposureHeatmap";
import { CafePostingStatus } from "@/components/CafePostingStatus";
import { CafeActivityGrade } from "@/components/CafeActivityGrade";
import { TimePerformancePredictor } from "@/components/TimePerformancePredictor";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface CartItem {
  channelIndex: number;
  channelName: string;
  contentType: "후기형" | "질문형" | "핫딜형";
  postCount: number;
  pricePerPost: number;
  totalPrice: number;
}

const Analyze = () => {
  const [productUrl, setProductUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedChannels, setSelectedChannels] = useState<Map<number, number>>(new Map());
  const [selectedContentTypes, setSelectedContentTypes] = useState<Map<number, "후기형" | "질문형" | "핫딜형">>(new Map());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });

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

      // 채널 데이터가 없을 경우 백엔드 DB에서 베이스 추천 생성
      let channelsFromAI: any[] = Array.isArray(aiAnalysis.channels) ? aiAnalysis.channels : [];
      if (!channelsFromAI || channelsFromAI.length === 0) {
        const { data: cafes, error: cafesError } = await supabase
          .from('mom_cafe_channels')
          .select('name,members,activity_level,success_rate,pricing,avg_engagement_rate,avg_views,best_content_types,keywords')
          .limit(8);

        if (!cafesError && cafes) {
          const productKeywords: string[] = Array.isArray(aiAnalysis.product?.keywords)
            ? aiAnalysis.product.keywords
            : [];

          const scoreFrom = (n?: number | null) => {
            const s = Number(n ?? 0);
            if (s > 0 && s <= 100) return Math.round(s);
            if (s > 1 && s <= 5) return Math.round(s * 20);
            if (s > 0 && s < 1) return Math.round(s * 100);
            return 80;
          };
          const gradeFrom = (s: number) => (s >= 90 ? 'A+' : s >= 85 ? 'A' : s >= 75 ? 'B+' : 'B');

          channelsFromAI = cafes
            .sort((a: any, b: any) => Number(b.success_rate ?? b.avg_engagement_rate ?? 0) - Number(a.success_rate ?? a.avg_engagement_rate ?? 0))
            .slice(0, 5)
            .map((row: any) => {
              const pricing = (row.pricing || {}) as any;
              const review = Number(pricing.review ?? 120000);
              const question = Number(pricing.question ?? review);
              const hotdeal = Number(pricing.hotdeal ?? Math.round(review * 1.1));
              const score = scoreFrom(row.success_rate ?? (Number(row.avg_engagement_rate ?? 0) * 100));
              const matchCount = productKeywords.filter((k: string) => Array.isArray(row.keywords) && row.keywords.includes(k)).length;
              const reason = matchCount > 0
                ? `타깃 키워드 ${matchCount}개 일치 · 활성도 ${row.activity_level}`
                : `활성도 ${row.activity_level} · 평균 조회수 ${(row.avg_views ?? 0).toLocaleString()}회`;

              return {
                name: row.name,
                score,
                members: `${(row.members ?? 0).toLocaleString()}명`,
                activityLevel: row.activity_level ?? '중간',
                cost: `${review.toLocaleString()}원~`,
                contentType: (row.best_content_types?.[0] as '후기형' | '질문형' | '핫딜형') ?? '후기형',
                reason,
                rating: gradeFrom(score),
                logo: '☕️',
                pricing: { review, question, hotdeal },
                successRate: Math.round(Number(row.success_rate ?? (Number(row.avg_engagement_rate ?? 0) * 100))),
                recommendedPosts: 10,
              } as ChannelRecommendation;
            });
        }
      }
      
      // 기존 mock 데이터 형식으로 변환 (UI 호환성 유지)
      const formattedResult = {
        product: aiAnalysis.product || {
          name: '분석된 상품',
          category: '기타',
          priceRange: '확인 필요',
          keywords: aiAnalysis.product?.keywords || ['상품', '추천'],
          avgPrice: aiAnalysis.product?.avgPrice || 0,
        },
        overallScore: aiAnalysis.overallScore || 75,
        scoreLevel: aiAnalysis.scoreLevel || '우수',
        reviewAnalysis: aiAnalysis.reviewAnalysis || {
          totalReviews: 0,
          positiveCount: 0,
          negativeCount: 0,
          positiveReviews: ['긍정적인 리뷰가 많습니다.'],
          negativeReviews: ['일부 개선이 필요한 점이 있습니다.'],
        },
        competitor: aiAnalysis.competitor || {
          marketShare: 20,
          avgPrice: 40000,
          topBrands: ['브랜드A', '브랜드B'],
          competitionLevel: '중간',
          pricePosition: '경쟁력 있음',
        },
        roi: aiAnalysis.roi || {
          estimatedInvestment: 300000,
          expectedRevenue: 1000000,
          roi: 233,
          breakEven: '약 2-3주',
          profitMargin: 700000,
        },
        successCase: aiAnalysis.successCase || {
          productName: '유사 상품',
          category: '동일 카테고리',
          revenue: '월 2,000만원',
          period: '3개월',
          channels: 5,
          engagement: '7.5%',
        },
        topKeywords: aiAnalysis.topKeywords || [],
        channels: channelsFromAI,
        contentSamples: aiAnalysis.contentSamples || [],
        timing: aiAnalysis.timing || {
          bestTimes: ['오전 10-11시', '오후 2-3시'],
          bestDays: ['월요일', '수요일'],
        },
        insights: aiAnalysis.insights || {
          competitionLevel: '중간',
          seasonality: '사계절',
          expectedReach: '5,000-8,000명',
          estimatedEngagement: '4.5-6.0%',
        },
        // 새로 추가된 데이터
        cafePostingStatus: aiAnalysis.cafePostingStatus || {},
        competitorBrands: aiAnalysis.competitorBrands || [],
        cafeExposureStrategy: aiAnalysis.cafeExposureStrategy || [],
      };
      
      setAnalysisResult(formattedResult);
      toast.success('AI 분석이 완료되었습니다!');
    } catch (error: any) {
      console.error("분석 실패:", error);
      toast.error(error.message || "분석에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleChannelSelection = (index: number) => {
    const newSelection = new Map(selectedChannels);
    const newContentTypes = new Map(selectedContentTypes);
    
    if (newSelection.has(index)) {
      newSelection.delete(index);
      newContentTypes.delete(index);
    } else {
      const recommendedCount = analysisResult?.channels[index]?.recommendedPosts || 10;
      newSelection.set(index, recommendedCount);
      
      // 기본 콘텐츠 타입 설정 (AI 추천)
      const defaultType = analysisResult?.channels[index]?.contentType || "후기형";
      newContentTypes.set(index, defaultType as "후기형" | "질문형" | "핫딜형");
    }
    
    setSelectedChannels(newSelection);
    setSelectedContentTypes(newContentTypes);
  };

  const updateChannelCount = (index: number, delta: number) => {
    const newSelection = new Map(selectedChannels);
    const currentCount = newSelection.get(index) || 0;
    const newCount = Math.max(1, Math.min(50, currentCount + delta));
    newSelection.set(index, newCount);
    setSelectedChannels(newSelection);
  };

  const updateContentType = (index: number, type: "후기형" | "질문형" | "핫딜형") => {
    const newContentTypes = new Map(selectedContentTypes);
    newContentTypes.set(index, type);
    setSelectedContentTypes(newContentTypes);
  };

  const calculateTotal = () => {
    if (!analysisResult) return 0;
    let total = 0;
    selectedChannels.forEach((count, index) => {
      const channel = analysisResult.channels[index];
      const contentType = selectedContentTypes.get(index) || channel.contentType;
      const typeKey = contentType === "후기형" ? "review" : 
                     contentType === "질문형" ? "question" : "hotdeal";
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

  const addToCart = () => {
    if (selectedChannels.size === 0) {
      toast.error("최소 1개 이상의 채널을 선택해주세요");
      return;
    }

    const newCartItems: CartItem[] = [];
    selectedChannels.forEach((count, index) => {
      const channel = analysisResult.channels[index];
      const contentType = selectedContentTypes.get(index) || channel.contentType;
      const typeKey = contentType === "후기형" ? "review" : 
                     contentType === "질문형" ? "question" : "hotdeal";
      const pricePerPost = channel.pricing[typeKey];
      
      newCartItems.push({
        channelIndex: index,
        channelName: channel.name,
        contentType: contentType as "후기형" | "질문형" | "핫딜형",
        postCount: count,
        pricePerPost,
        totalPrice: pricePerPost * count
      });
    });

    setCart([...cart, ...newCartItems]);
    setSelectedChannels(new Map());
    setSelectedContentTypes(new Map());
    toast.success(`${newCartItems.length}개 채널이 장바구니에 담겼습니다`);
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    toast.info("장바구니에서 제거되었습니다");
  };

  const calculateCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      toast.error("장바구니가 비어있습니다");
      return;
    }

    setShowCheckout(true);
    
    // 결제 섹션으로 스크롤
    setTimeout(() => {
      document.getElementById('checkout-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleCompleteOrder = async () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error("모든 필수 정보를 입력해주세요");
      return;
    }

    const totalAmount = calculateCartTotal();
    const discount = cart.length > 1 ? 0.9 : 1;
    const finalAmount = Math.floor(totalAmount * discount);
    const discountAmount = totalAmount - finalAmount;

    try {
      toast.info("주문을 처리하고 있습니다...");

      // Edge Function 호출하여 주문 생성 및 콘텐츠 자동 생성
      const { data, error } = await supabase.functions.invoke('process-order', {
        body: {
          orderData: {
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            customerCompany: customerInfo.company,
            productUrl: productUrl,
            productName: analysisResult?.product?.name || "분석된 상품",
            totalAmount,
            discountAmount,
            finalAmount
          },
          cartItems: cart
        }
      });

      if (error) {
        console.error('Order processing error:', error);
        throw new Error(error.message || '주문 처리에 실패했습니다');
      }

      if (!data.success) {
        throw new Error(data.error || '주문 처리에 실패했습니다');
      }

      toast.success(`주문이 완료되었습니다! AI가 콘텐츠를 자동 생성했습니다.`);
      toast.info("관리자 페이지에서 생성된 콘텐츠를 확인하실 수 있습니다.");
      
      // 주문 완료 후 초기화
      setCart([]);
      setShowCheckout(false);
      setCustomerInfo({ name: "", email: "", phone: "", company: "" });
      setSelectedChannels(new Map());
      setSelectedContentTypes(new Map());
    } catch (error: any) {
      console.error('Order completion error:', error);
      toast.error(error.message || "주문 처리 중 오류가 발생했습니다.");
    }
  };

  const successRateData = analysisResult?.channels.map((ch: ChannelRecommendation) => ({
    name: ch.name.slice(0, 8),
    rate: ch.successRate,
  })) || [];

  return (
    <div className="space-y-6">
      {/* 메인 콘텐츠 영역 */}
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
          {/* 상품 정보 + 종합 평가 + 맘카페 마케팅 잠재력 */}
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

            {/* 맘카페 마케팅 잠재력 */}
            <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-accent" />
                  맘카페 마케팅 잠재력
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">예상 도달 범위</div>
                  <div className="text-xl font-bold text-accent">
                    {analysisResult.insights?.expectedReach || "5,000-8,000명"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">예상 참여율</div>
                  <div className="text-xl font-bold">
                    {analysisResult.insights?.estimatedEngagement || "4.5-6.0%"}
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">경쟁 수준</span>
                    <Badge variant="secondary">{analysisResult.insights?.competitionLevel || "중간"}</Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-muted-foreground">시즌성</span>
                    <span className="text-sm font-semibold">{analysisResult.insights?.seasonality || "사계절"}</span>
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
                <div className="pt-3 border-t space-y-2">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">총 조회수</div>
                    <div className="text-2xl font-bold text-primary">
                      {analysisResult.successCase.totalViews || "15,000회"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">평균 반응률</div>
                    <Badge className="w-full justify-center bg-primary text-lg py-2">
                      {analysisResult.successCase.engagement}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 키워드 트렌드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-amber-500" />
                나에게 맞춤 키워드 트렌드
              </CardTitle>
              <CardDescription>
                해당 상품 카테고리의 인기 키워드 Top 5
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(analysisResult.topKeywords.length > 0 ? analysisResult.topKeywords : [
                  { rank: 1, keyword: "유아용품 추천", count: "1,250회", trend: "up" },
                  { rank: 2, keyword: "육아템", count: "980회", trend: "up" },
                  { rank: 3, keyword: "아기용품 필수", count: "850회", trend: "up" },
                  { rank: 4, keyword: "출산선물", count: "720회", trend: "down" },
                  { rank: 5, keyword: "신생아용품", count: "650회", trend: "up" }
                ]).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">
                        {item.rank}
                      </Badge>
                      <div>
                        <span className="font-semibold text-base">{item.keyword}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{item.count}</Badge>
                          {item.trend === "up" && (
                            <div className="flex items-center gap-1 text-emerald-500">
                              <TrendingUp className="h-3 w-3" />
                              <span className="text-xs font-medium">상승</span>
                            </div>
                          )}
                          {item.trend === "down" && (
                            <div className="flex items-center gap-1 text-rose-500">
                              <TrendingDown className="h-3 w-3" />
                              <span className="text-xs font-medium">하락</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 맘카페 포스팅 현황 - 삭제됨 */}
          
          {/* 경쟁사 브랜드 키워드 노출 지도 - 삭제됨 */}
          
          {/* 카페별 노출 전략 - 삭제됨 */}

          {/* 브랜드 맞춤 추천 맘카페 */}
          <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                브랜드 맞춤 추천 맘카페 (Top 5)
              </CardTitle>
              <CardDescription>
                AI가 분석한 가장 효과적인 맘카페 채널 - 활성도 등급과 성과 예측 포함
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult.channels && analysisResult.channels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysisResult.channels.slice(0, 5).map((channel: ChannelRecommendation, idx: number) => (
                    <Card key={idx} className="hover:shadow-lg transition-all border-2 hover:border-accent">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="text-4xl">{channel.logo}</div>
                          <Badge variant="secondary" className="text-lg font-bold">
                            {channel.rating}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mb-2">{channel.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <CafeActivityGrade 
                            activityLevel={channel.activityLevel}
                            activityScore={channel.score}
                            size="sm"
                          />
                          {idx === 0 && (
                            <Badge className="bg-primary text-xs">최고 추천</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">{channel.reason}</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>{channel.members}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-accent" />
                            <span>{channel.successRate}% 성공률</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t">
                          <p className="text-xs font-semibold mb-2">추천 상품 타입</p>
                          <div className="grid grid-cols-3 gap-1">
                            {["후기형", "질문형", "핫딜형"].map((type) => (
                              <div 
                                key={type}
                                className={`text-center p-2 rounded text-xs ${
                                  channel.contentType === type 
                                    ? 'bg-accent text-accent-foreground font-bold' 
                                    : 'bg-muted'
                                }`}
                              >
                                {type}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <div className="text-xs text-muted-foreground mb-1">추천 포스팅 수</div>
                          <Badge variant="outline" className="w-full justify-center">
                            {channel.recommendedPosts}개
                          </Badge>
                        </div>

                        <Button
                          className="w-full"
                          size="sm"
                          onClick={() => {
                            toggleChannelSelection(idx);
                            toast.success(`${channel.name} 선택됨`);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          선택하기
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    상품 URL을 입력하고 분석을 실행하면 맞춤 추천 카페가 표시됩니다
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 채널별 성공률 차트 - 삭제됨 */}

          {/* 시간대별 성과 예측 - 삭제됨 */}

          {/* 추천 채널 상세 선택 */}
          <Card>
            <CardHeader>
              <CardTitle>선택한 채널 상세 설정</CardTitle>
              <CardDescription>
                콘텐츠 타입과 포스팅 수를 조정하고 장바구니에 담으세요
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

                      {/* 콘텐츠 타입 선택 */}
                       <div className="pt-4 border-t border-border space-y-4">
                         <div>
                           <p className="text-sm font-semibold mb-3">콘텐츠 타입 선택</p>
                           <Tabs 
                             value={isSelected ? selectedContentTypes.get(idx) || channel.contentType : channel.contentType}
                             onValueChange={(value) => {
                               if (isSelected) {
                                 updateContentType(idx, value as "후기형" | "질문형" | "핫딜형");
                               }
                             }}
                           >
                             <TabsList className="grid w-full grid-cols-3">
                               <TabsTrigger value="후기형" disabled={!isSelected}>
                                 <div className="text-center">
                                   <div className="text-xs">후기형</div>
                                   <div className="font-bold text-xs">{channel.pricing.review.toLocaleString()}원</div>
                                 </div>
                               </TabsTrigger>
                               <TabsTrigger value="질문형" disabled={!isSelected}>
                                 <div className="text-center">
                                   <div className="text-xs">질문형</div>
                                   <div className="font-bold text-xs">{channel.pricing.question.toLocaleString()}원</div>
                                 </div>
                               </TabsTrigger>
                               <TabsTrigger value="핫딜형" disabled={!isSelected}>
                                 <div className="text-center">
                                   <div className="text-xs">핫딜형</div>
                                   <div className="font-bold text-xs">{channel.pricing.hotdeal.toLocaleString()}원</div>
                                 </div>
                               </TabsTrigger>
                             </TabsList>
                           </Tabs>
                           {!isSelected && (
                             <p className="text-xs text-muted-foreground mt-2 text-center">
                               AI 추천: <span className="font-semibold text-accent">{channel.contentType}</span>
                             </p>
                           )}
                         </div>

                         {/* 선택 및 개수 조절 */}
                         {isSelected ? (
                           <div className="space-y-3">
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

              {/* 선택 요약 & 장바구니 담기 */}
              {selectedChannels.size > 0 && (
                <Card className="border-2 border-accent bg-gradient-to-r from-accent/5 to-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">현재 선택 내역</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>선택된 채널: <span className="font-bold text-accent">{selectedChannels.size}개</span></span>
                          <span>•</span>
                          <span>총 포스팅: <span className="font-bold text-accent">{getTotalPosts()}개</span></span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">총 금액</div>
                          <div className="text-3xl font-bold text-accent">
                            {calculateTotal().toLocaleString()}원
                          </div>
                        </div>
                        
                        <Button 
                          size="lg" 
                          className="h-16 px-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart();
                          }}
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          장바구니 담기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 결제 섹션 */}
              {showCheckout && cart.length > 0 && (
                <Card id="checkout-section" className="border-2 border-primary bg-gradient-to-r from-primary/5 to-accent/5 scroll-mt-6">
                  <CardHeader>
                    <CardTitle>결제 정보</CardTitle>
                    <CardDescription>
                      주문 정보를 입력해주세요
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 주문 내역 요약 */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-bold mb-3">주문 내역</h3>
                      <div className="space-y-2">
                        {cart.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.channelName} ({item.contentType} {item.postCount}개)
                            </span>
                            <span className="font-semibold">{item.totalPrice.toLocaleString()}원</span>
                          </div>
                        ))}
                        {cart.length > 1 && (
                          <div className="flex justify-between text-sm pt-2 border-t">
                            <span className="text-accent font-semibold">패키지 할인 10%</span>
                            <span className="text-accent font-bold">
                              -{Math.floor(calculateCartTotal() * 0.1).toLocaleString()}원
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-3 border-t">
                          <span className="font-bold text-lg">최종 결제 금액</span>
                          <span className="font-bold text-2xl text-accent">
                            {cart.length > 1 
                              ? Math.floor(calculateCartTotal() * 0.9).toLocaleString()
                              : calculateCartTotal().toLocaleString()
                            }원
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 고객 정보 입력 */}
                    <div className="space-y-4">
                      <h3 className="font-bold">고객 정보</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer-name">이름 *</Label>
                          <Input
                            id="customer-name"
                            placeholder="홍길동"
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customer-company">회사명</Label>
                          <Input
                            id="customer-company"
                            placeholder="(주)회사명 (선택)"
                            value={customerInfo.company}
                            onChange={(e) => setCustomerInfo({...customerInfo, company: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customer-email">이메일 *</Label>
                          <Input
                            id="customer-email"
                            type="email"
                            placeholder="example@email.com"
                            value={customerInfo.email}
                            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customer-phone">연락처 *</Label>
                          <Input
                            id="customer-phone"
                            type="tel"
                            placeholder="010-1234-5678"
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 결제 버튼 */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        size="lg"
                        className="flex-1"
                        onClick={handleCompleteOrder}
                      >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        주문 완료
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground text-center pt-4 border-t">
                      <p>결제 완료 후 담당자가 24시간 내에 연락드립니다.</p>
                      <p>캠페인 진행은 최대 3영업일 소요됩니다.</p>
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

      {/* 장바구니 영역 */}
      {analysisResult && (
        <div className="w-full">
          <div className="space-y-4">
            <Card className="border-2 border-primary bg-gradient-to-r from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  장바구니
                  {cart.length > 0 && (
                    <Badge className="ml-2 bg-accent">{cart.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">선택한 채널이 없습니다</p>
                    <p className="text-xs mt-1">채널을 선택하고 장바구니에 담아보세요</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {cart.map((item, index) => (
                        <Card key={index} className="border">
                          <CardContent className="pt-3 pb-3">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-sm mb-1 truncate">{item.channelName}</h4>
                                  <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                                    <Badge variant="outline" className="text-xs">{item.contentType}</Badge>
                                    <span>•</span>
                                    <span>{item.postCount}개</span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 flex-shrink-0"
                                  onClick={() => removeFromCart(index)}
                                >
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-accent">
                                  {item.totalPrice.toLocaleString()}원
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Card className="border-2 border-accent bg-accent/5">
                      <CardContent className="pt-4 pb-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">총 항목</span>
                            <span className="font-bold">{cart.length}개</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">합계</span>
                            <span className="text-muted-foreground line-through">
                              {calculateCartTotal().toLocaleString()}원
                            </span>
                          </div>
                          
                          {cart.length > 1 && (
                            <div className="p-2 bg-accent/10 rounded-lg">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-accent font-semibold">패키지 할인 10% 🎉</span>
                                <span className="text-accent font-bold">
                                  -{Math.floor(calculateCartTotal() * 0.1).toLocaleString()}원
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t">
                            <span className="font-bold">최종 금액</span>
                            <div className="text-2xl font-bold text-accent">
                              {cart.length > 1 
                                ? Math.floor(calculateCartTotal() * 0.9).toLocaleString()
                                : calculateCartTotal().toLocaleString()
                              }원
                            </div>
                          </div>

                          <Button
                            size="lg"
                            className="w-full"
                            onClick={handleProceedToPayment}
                          >
                            결제하기
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze;
