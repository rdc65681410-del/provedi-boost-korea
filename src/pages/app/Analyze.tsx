import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Calendar,
  CreditCard,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
}

const Analyze = () => {
  const [productUrl, setProductUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedChannels, setSelectedChannels] = useState<Set<number>>(new Set());

  const handleAnalyze = async () => {
    if (!productUrl) {
      toast.error("상품 URL을 입력해주세요");
      return;
    }

    // URL 유효성 검사
    try {
      new URL(productUrl);
    } catch {
      toast.error("올바른 URL 형식이 아닙니다");
      return;
    }

    setIsAnalyzing(true);
    
    // 임시 데모 데이터 (나중에 AI 분석으로 대체)
    setTimeout(() => {
      const mockResult = {
        product: {
          name: "북유럽 스타일 원목 선반",
          category: "가구/인테리어",
          priceRange: "30,000-50,000원",
          keywords: ["북유럽", "원목", "선반", "수납", "인테리어"],
          image: productUrl, // 실제로는 AI가 추출
        },
        // 종합 분석 평가
        overallScore: 61,
        scoreLevel: "보통",
        reviewAnalysis: {
          totalReviews: 298,
          positiveCount: 234,
          negativeCount: 64,
          positiveReviews: [
            "대부분의 고객들이 이 제품을 선불로 구매하였으며, 수신자들이 만족했다는 리뷰가 많습니다. 그리고 제품의 귀여움, 이동이 편리한 무게...",
          ],
          negativeReviews: [
            "주로 제품의 충전 문제와 배송 문제를 지적하고 있습니다. 충전 시간이 짧다는 불만과 충전이 아예 되지 않는 문제가 있었습니다. 또한..."
          ],
          warning: "관계 허락에 영향을 미칠 수 있는 문제 발견"
        },
        // 상위 노출 키워드
        topKeywords: [
          { rank: 1, keyword: "무드등", count: "1위" },
          { rank: 2, keyword: "인테리어조명", count: "6위" },
          { rank: 3, keyword: "수면등", count: "12위" },
          { rank: 4, keyword: "수유등", count: "57위" },
          { rank: 5, keyword: "미니조명", count: "78위" },
        ],
        channels: [
          {
            name: "맘스홀릭베이비",
            score: 94,
            members: "48,520명",
            activityLevel: "매우 높음",
            cost: "무료",
            contentType: "후기형",
            reason: "육아 인테리어 콘텐츠 활발, 수납 관심도 높음",
            rating: "A+",
            logo: "👶",
            pricing: {
              review: 150000,
              question: 120000,
              hotdeal: 100000
            }
          },
          {
            name: "베베하우스",
            score: 89,
            members: "32,100명",
            activityLevel: "높음",
            cost: "무료",
            contentType: "질문형",
            reason: "실용적 가구 Q&A 활발, 구매력 높은 회원층",
            rating: "A",
            logo: "🏠",
            pricing: {
              review: 140000,
              question: 110000,
              hotdeal: 95000
            }
          },
          {
            name: "우리아이맘",
            score: 85,
            members: "28,400명",
            activityLevel: "높음",
            cost: "5,000원",
            contentType: "핫딜형",
            reason: "가성비 제품 선호, 할인 정보 공유 활발",
            rating: "A",
            logo: "💝",
            pricing: {
              review: 130000,
              question: 100000,
              hotdeal: 85000
            }
          },
          {
            name: "송파맘카페",
            score: 82,
            members: "25,100명",
            activityLevel: "높음",
            cost: "무료",
            contentType: "후기형",
            reason: "지역 밀착형, 실제 사용 후기 선호",
            rating: "B+",
            logo: "🌸",
            pricing: {
              review: 120000,
              question: 95000,
              hotdeal: 80000
            }
          },
          {
            name: "대치동맘모임",
            score: 79,
            members: "22,800명",
            activityLevel: "보통",
            cost: "무료",
            contentType: "질문형",
            reason: "교육 관심도 높은 학부모 타겟",
            rating: "B+",
            logo: "📚",
            pricing: {
              review: 115000,
              question: 90000,
              hotdeal: 75000
            }
          },
          {
            name: "일산맘스토리",
            score: 76,
            members: "20,500명",
            activityLevel: "보통",
            cost: "5,000원",
            contentType: "핫딜형",
            reason: "신도시 젊은층, 트렌디한 제품 선호",
            rating: "B",
            logo: "🏙️",
            pricing: {
              review: 110000,
              question: 85000,
              hotdeal: 70000
            }
          },
          {
            name: "부산맘키즈",
            score: 73,
            members: "19,200명",
            activityLevel: "보통",
            cost: "무료",
            contentType: "후기형",
            reason: "부산 지역 맘들의 활발한 정보 공유",
            rating: "B",
            logo: "🌊",
            pricing: {
              review: 105000,
              question: 82000,
              hotdeal: 68000
            }
          },
          {
            name: "성남맘플러스",
            score: 70,
            members: "17,900명",
            activityLevel: "보통",
            cost: "무료",
            contentType: "질문형",
            reason: "실용적 정보 교환 활발",
            rating: "B",
            logo: "🏘️",
            pricing: {
              review: 100000,
              question: 78000,
              hotdeal: 65000
            }
          },
          {
            name: "인천맘네트워크",
            score: 67,
            members: "16,400명",
            activityLevel: "보통",
            cost: "5,000원",
            contentType: "핫딜형",
            reason: "가성비 중시, 할인 정보 빠른 확산",
            rating: "B-",
            logo: "✈️",
            pricing: {
              review: 95000,
              question: 75000,
              hotdeal: 62000
            }
          },
          {
            name: "광주맘커뮤니티",
            score: 64,
            members: "15,100명",
            activityLevel: "보통",
            cost: "무료",
            contentType: "후기형",
            reason: "지역 특화 제품 반응 좋음",
            rating: "B-",
            logo: "🌳",
            pricing: {
              review: 90000,
              question: 72000,
              hotdeal: 60000
            }
          },
          {
            name: "대구맘앤키즈",
            score: 61,
            members: "14,200명",
            activityLevel: "낮음",
            cost: "무료",
            contentType: "질문형",
            reason: "착실한 회원층, 장기 캠페인 유리",
            rating: "C+",
            logo: "🍎",
            pricing: {
              review: 85000,
              question: 70000,
              hotdeal: 58000
            }
          },
        ],
        timing: {
          bestTimes: ["오전 9-11시", "오후 2-3시", "오후 8-10시"],
          bestDays: ["월요일", "수요일", "금요일"],
        },
        insights: {
          competitionLevel: "중간",
          seasonality: "사계절",
          expectedReach: "약 3,500-5,000명",
          estimatedEngagement: "3.5-4.2%",
        },
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      toast.success("분석이 완료되었습니다!");
    }, 2000);
  };

  const toggleChannelSelection = (index: number) => {
    const newSelection = new Set(selectedChannels);
    if (newSelection.has(index)) {
      newSelection.delete(index);
    } else {
      newSelection.add(index);
    }
    setSelectedChannels(newSelection);
  };

  const calculateTotal = () => {
    if (!analysisResult) return 0;
    let total = 0;
    selectedChannels.forEach(index => {
      const channel = analysisResult.channels[index];
      const typeKey = channel.contentType === "후기형" ? "review" : 
                     channel.contentType === "질문형" ? "question" : "hotdeal";
      total += channel.pricing[typeKey];
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

    toast.success(`${selectedChannels.size}개 채널 결제 진행 - ${finalAmount.toLocaleString()}원`);
    // 실제 결제 페이지로 이동
    // navigate("/app/payment", { state: { selectedChannels, total: finalAmount } });
  };

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
                variant="hero"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  "분석 시작"
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
          {/* 상품 정보 + 종합 분석 평가 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 상품 정보 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>상품 분석 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 mb-6">
                  {/* 상품 이미지 */}
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-muted-foreground text-xs">상품 이미지</span>
                  </div>
                  
                  {/* 상품 정보 */}
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline">가구/인테리어</Badge>
                      <Badge variant="outline">인테리어 소품</Badge>
                      <Badge variant="outline">조명</Badge>
                      <Badge variant="outline">인테리어 조명</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{analysisResult.product.name}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">가격</p>
                    <p className="font-semibold">{analysisResult.product.priceRange}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">판매 건수(7일)</p>
                    <p className="font-semibold">{analysisResult.reviewAnalysis.totalReviews}건</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">예상 매출액(7일)</p>
                    <p className="font-semibold">396만원</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">평균 배송일</p>
                    <p className="font-semibold">1.6일</p>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-4">
                  2024년 01월 01일 13:34 업데이트
                </div>
              </CardContent>
            </Card>

            {/* 종합 분석 평가 */}
            <Card>
              <CardHeader>
                <CardTitle>종합 분석 평가</CardTitle>
              </CardHeader>
              <CardContent>
                {/* 게이지 차트 */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-48 h-48">
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
                          innerRadius={60}
                          outerRadius={80}
                          dataKey="value"
                        >
                          <Cell fill="#F59E0B" />
                          <Cell fill="#E5E7EB" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold">{analysisResult.scoreLevel}</div>
                      <div className="text-sm text-muted-foreground">
                        {analysisResult.overallScore}점<span className="text-xs">/100점</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 경고 메시지 */}
                {analysisResult.reviewAnalysis.warning && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-destructive">
                      {analysisResult.reviewAnalysis.warning}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 상위 노출 키워드 + 리뷰 분석 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 상위 노출 키워드 */}
            <Card>
              <CardHeader>
                <CardTitle>상위 노출 키워드</CardTitle>
                <CardDescription>
                  상위 1페이지에 노출되고 있는 키워드를 찾았어요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResult.topKeywords.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">
                          {item.rank}위
                        </Badge>
                        <span className="font-semibold">{item.keyword}</span>
                        <Badge variant="outline" className="text-xs">{item.count}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  상위 키워드로 순위 추적하기
                </Button>
              </CardContent>
            </Card>

            {/* 리뷰 분석 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>리뷰 분석</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    총 평점 4.3 · 리뷰 수 {analysisResult.reviewAnalysis.totalReviews}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 긍정 리뷰 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-accent">긍정 리뷰 요약</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analysisResult.reviewAnalysis.positiveReviews[0]}
                  </p>
                </div>

                {/* 부정 리뷰 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsDown className="h-4 w-4 text-destructive" />
                    <span className="font-semibold text-destructive">부정 리뷰 요약</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analysisResult.reviewAnalysis.negativeReviews[0]}
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  자세히 보기
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 추천 채널 */}
          <Card>
            <CardHeader>
              <CardTitle>브랜드 맞춤 추천 맘카페 (Top 10)</CardTitle>
              <CardDescription>
                AI가 분석한 가장 효과적인 맘카페 채널 순위입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisResult.channels.map((channel: ChannelRecommendation, idx: number) => (
                <Card 
                  key={idx} 
                  className={`border-2 transition-all cursor-pointer ${
                    selectedChannels.has(idx)
                      ? 'border-accent bg-accent/5 shadow-lg'
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => toggleChannelSelection(idx)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-4xl">
                          {channel.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold">{channel.name}</h3>
                            {selectedChannels.has(idx) && (
                              <Badge className="bg-accent">선택됨 ✓</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{channel.reason}</p>
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
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
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
                          <p className="text-xs text-muted-foreground">추천 타입</p>
                          <Badge variant="outline" className="mt-1">{channel.contentType}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* 가격 견적 테이블 */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm font-semibold mb-3">콘텐츠 타입별 견적</p>
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
                  </CardContent>
                </Card>
              ))}

              {/* 결제 요약 */}
              {selectedChannels.size > 0 && (
                <Card className="border-2 border-accent bg-gradient-card">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">선택한 채널 요약</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>선택된 채널: <span className="font-bold text-accent">{selectedChannels.size}개</span></span>
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
                          className="h-16 px-8 bg-accent hover:bg-accent/90"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProceedToPayment();
                          }}
                        >
                          <CreditCard className="mr-2 h-5 w-5" />
                          결제하기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* 발행 시간 최적화 */}
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

          {/* 결제 후 프로세스 안내 */}
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
