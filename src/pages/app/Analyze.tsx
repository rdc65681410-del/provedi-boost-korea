import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

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
        },
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
          {/* 상품 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>상품 분석 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">상품명</p>
                  <p className="font-semibold">{analysisResult.product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">카테고리</p>
                  <Badge variant="secondary">{analysisResult.product.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">가격대</p>
                  <p className="font-semibold">{analysisResult.product.priceRange}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">주요 키워드</p>
                  <div className="flex flex-wrap gap-1">
                    {analysisResult.product.keywords.slice(0, 3).map((keyword: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 추천 채널 */}
          <Card>
            <CardHeader>
              <CardTitle>추천 맘카페 채널 (Top 3)</CardTitle>
              <CardDescription>
                AI가 분석한 가장 효과적인 맘카페 채널입니다
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
