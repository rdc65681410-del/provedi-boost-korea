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
  Loader2
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
}

const Analyze = () => {
  const [productUrl, setProductUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

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
                <Card key={idx} className="border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{channel.name}</h3>
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
                      <div className="col-span-2 md:col-span-1">
                        <Button variant="outline" size="sm" className="w-full">
                          콘텐츠 생성
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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

          {/* 다음 단계 */}
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle>다음 단계</CardTitle>
              <CardDescription>분석 결과를 활용하여 캠페인을 시작하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" size="lg" className="h-auto py-4 flex-col items-start">
                  <CheckCircle2 className="h-5 w-5 mb-2" />
                  <span className="font-semibold">콘텐츠 자동 생성</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    AI가 각 채널에 최적화된 게시글 작성
                  </span>
                </Button>
                <Button variant="outline" size="lg" className="h-auto py-4 flex-col items-start">
                  <Clock className="h-5 w-5 mb-2" />
                  <span className="font-semibold">발행 예약하기</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    최적 시간에 자동으로 게시
                  </span>
                </Button>
                <Button variant="hero" size="lg" className="h-auto py-4 flex-col items-start">
                  <TrendingUp className="h-5 w-5 mb-2" />
                  <span className="font-semibold">캠페인 시작</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    지금 바로 마케팅 시작
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analyze;
