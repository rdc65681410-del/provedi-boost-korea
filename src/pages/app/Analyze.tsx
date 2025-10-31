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
  Heart, 
  MessageCircle, 
  Share2,
  Eye,
  Hash,
  Clock,
  AlertCircle,
  Loader2,
  Target,
  BarChart3,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface PlatformRecommendation {
  name: string;
  score: number;
  followers: string;
  engagementRate: string;
  bestContentType: string;
  reason: string;
  icon: any;
  color: string;
}

const Analyze = () => {
  const [contentUrl, setContentUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!contentUrl) {
      toast.error("콘텐츠 URL을 입력해주세요");
      return;
    }

    // URL 유효성 검사
    try {
      new URL(contentUrl);
    } catch {
      toast.error("올바른 URL 형식이 아닙니다");
      return;
    }

    setIsAnalyzing(true);
    
    // 임시 데모 데이터 (나중에 AI 분석으로 대체)
    setTimeout(() => {
      const mockResult = {
        content: {
          title: "여름 신제품 출시 캠페인",
          type: "이미지 포스트",
          platform: "Instagram",
          category: "제품 홍보",
        },
        performance: {
          likes: 2847,
          comments: 182,
          shares: 94,
          views: 15234,
          engagementRate: 6.8,
          viralScore: 78,
        },
        audience: {
          primaryAge: "25-34세",
          gender: "여성 68%, 남성 32%",
          topLocations: ["서울", "부산", "인천"],
          interests: ["패션", "라이프스타일", "쇼핑"],
        },
        hashtags: [
          { tag: "#신상품", performance: 95, posts: "128K" },
          { tag: "#여름패션", performance: 89, posts: "245K" },
          { tag: "#데일리룩", performance: 84, posts: "1.2M" },
          { tag: "#OOTD", performance: 78, posts: "890K" },
          { tag: "#패션스타그램", performance: 72, posts: "456K" },
        ],
        platforms: [
          {
            name: "Instagram",
            score: 92,
            followers: "평균 5.2K",
            engagementRate: "6.8%",
            bestContentType: "이미지 & 릴스",
            reason: "높은 시각적 콘텐츠 선호도, 젊은 타겟층 활발",
            icon: Instagram,
            color: "#E4405F",
          },
          {
            name: "TikTok",
            score: 87,
            followers: "평균 8.1K",
            engagementRate: "8.4%",
            bestContentType: "숏폼 비디오",
            reason: "바이럴 확산 가능성 높음, Z세대 타겟",
            icon: Target,
            color: "#000000",
          },
          {
            name: "Facebook",
            score: 74,
            followers: "평균 3.5K",
            engagementRate: "4.2%",
            bestContentType: "이미지 & 텍스트",
            reason: "광범위한 연령층, 커뮤니티 형성 유리",
            icon: Facebook,
            color: "#1877F2",
          },
          {
            name: "YouTube",
            score: 68,
            followers: "평균 12.4K",
            engagementRate: "5.1%",
            bestContentType: "롱폼 비디오",
            reason: "상세한 제품 리뷰 & 튜토리얼 적합",
            icon: Youtube,
            color: "#FF0000",
          },
          {
            name: "Twitter",
            score: 62,
            followers: "평균 2.8K",
            engagementRate: "3.9%",
            bestContentType: "텍스트 & 이미지",
            reason: "실시간 반응 및 트렌드 참여 가능",
            icon: Twitter,
            color: "#1DA1F2",
          },
        ],
        contentAnalysis: {
          tone: "긍정적, 활기찬",
          visualStyle: "밝고 생동감 있는 색상",
          copyLength: "중간 (80-120자 권장)",
          callToAction: "명확함",
        },
        timing: {
          bestTimes: ["오전 10-12시", "오후 6-8시", "오후 9-11시"],
          bestDays: ["수요일", "목요일", "금요일", "일요일"],
        },
        insights: {
          viralPotential: "높음",
          contentQuality: "우수",
          targetRelevance: "매우 적합",
          expectedReach: "약 15K-25K",
          estimatedEngagement: "6.5-8.2%",
        },
        recommendations: [
          "해시태그 5-10개 사용으로 도달률 극대화",
          "릴스 형태로 재편집하여 추가 업로드 권장",
          "스토리에서 투표/질문 기능 활용",
          "인플루언서 협업으로 확산 가능성 증대",
        ],
      };
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
      toast.success("분석이 완료되었습니다!");
    }, 2000);
  };

  const performanceData = analysisResult ? [
    { name: '좋아요', value: analysisResult.performance.likes, color: '#E4405F' },
    { name: '댓글', value: analysisResult.performance.comments, color: '#1877F2' },
    { name: '공유', value: analysisResult.performance.shares, color: '#34D399' },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">콘텐츠 분석</h1>
        <p className="text-muted-foreground">
          소셜 미디어 콘텐츠 URL을 입력하면 AI가 성과를 분석하고 최적의 플랫폼과 전략을 추천합니다
        </p>
      </div>

      {/* URL 입력 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle>콘텐츠 URL 입력</CardTitle>
          <CardDescription>
            Instagram, Facebook, TikTok, YouTube 등 소셜 미디어 게시물 링크를 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">콘텐츠 URL</Label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="url"
                  type="url"
                  placeholder="https://instagram.com/p/..."
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
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
              경쟁사 콘텐츠, 트렌딩 포스트, 인플루언서 게시물 등 다양한 소셜 미디어 URL을 지원합니다
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 분석 결과 */}
      {analysisResult && (
        <div className="space-y-6 animate-fade-in">
          {/* 콘텐츠 정보 + 성과 지표 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 콘텐츠 정보 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>콘텐츠 분석 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">{analysisResult.content.platform}</Badge>
                    <Badge variant="outline">{analysisResult.content.type}</Badge>
                    <Badge variant="outline">{analysisResult.content.category}</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{analysisResult.content.title}</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">좋아요</p>
                      <p className="font-semibold">{analysisResult.performance.likes.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">댓글</p>
                      <p className="font-semibold">{analysisResult.performance.comments.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Share2 className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">공유</p>
                      <p className="font-semibold">{analysisResult.performance.shares.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">조회수</p>
                      <p className="font-semibold">{analysisResult.performance.views.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 참여율 & 바이럴 점수 */}
            <Card>
              <CardHeader>
                <CardTitle>성과 지표</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">참여율</span>
                      <span className="text-2xl font-bold text-accent">
                        {analysisResult.performance.engagementRate}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${analysisResult.performance.engagementRate * 10}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">바이럴 점수</span>
                      <span className="text-2xl font-bold text-primary">
                        {analysisResult.performance.viralScore}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${analysisResult.performance.viralScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 참여 분포 & 타겟 오디언스 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 참여 분포 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  참여 분포
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 타겟 오디언스 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  타겟 오디언스
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">주요 연령대</p>
                  <p className="font-semibold">{analysisResult.audience.primaryAge}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">성별 분포</p>
                  <p className="font-semibold">{analysisResult.audience.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">주요 지역</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {analysisResult.audience.topLocations.map((location: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{location}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">관심사</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {analysisResult.audience.interests.map((interest: string, idx: number) => (
                      <Badge key={idx} variant="outline">{interest}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 해시태그 분석 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="h-5 w-5 mr-2" />
                추천 해시태그
              </CardTitle>
              <CardDescription>
                이 콘텐츠에 효과적인 해시태그 Top 5
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.hashtags.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">
                        {idx + 1}
                      </Badge>
                      <span className="font-semibold text-lg">{item.tag}</span>
                      <Badge variant="outline" className="text-xs">{item.posts} 게시물</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-3">
                        <div className="text-xs text-muted-foreground">성과 점수</div>
                        <div className="font-bold text-accent">{item.performance}점</div>
                      </div>
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${item.performance}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 추천 플랫폼 */}
          <Card>
            <CardHeader>
              <CardTitle>추천 소셜 미디어 플랫폼 (Top 5)</CardTitle>
              <CardDescription>
                AI가 분석한 이 콘텐츠에 가장 효과적인 플랫폼 순위
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisResult.platforms.map((platform: PlatformRecommendation, idx: number) => (
                <Card 
                  key={idx} 
                  className="border-2 hover:border-accent/50 transition-all"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${platform.color}15` }}
                        >
                          <platform.icon 
                            className="h-6 w-6" 
                            style={{ color: platform.color }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold">{platform.name}</h3>
                            {idx === 0 && (
                              <Badge className="bg-accent">최고 추천</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{platform.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">{platform.score}점</div>
                        <div className="text-xs text-muted-foreground">매칭 점수</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">평균 팔로워</p>
                        <p className="font-semibold">{platform.followers}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">참여율</p>
                        <p className="font-semibold">{platform.engagementRate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">추천 콘텐츠</p>
                        <p className="font-semibold">{platform.bestContentType}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* 콘텐츠 분석 & 최적 발행 시간 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 콘텐츠 분석 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  콘텐츠 분석
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">톤 & 분위기</span>
                  <span className="font-semibold">{analysisResult.contentAnalysis.tone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">비주얼 스타일</span>
                  <span className="font-semibold">{analysisResult.contentAnalysis.visualStyle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">카피 길이</span>
                  <span className="font-semibold">{analysisResult.contentAnalysis.copyLength}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">CTA</span>
                  <Badge variant="secondary">{analysisResult.contentAnalysis.callToAction}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* 최적 발행 시간 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  최적 발행 시간
                </CardTitle>
                <CardDescription>플랫폼 활동 패턴 기반 추천</CardDescription>
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
          </div>

          {/* 예상 성과 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                예상 성과
              </CardTitle>
              <CardDescription>AI 분석 기반 예측</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">바이럴 가능성</p>
                  <p className="text-lg font-bold text-accent">{analysisResult.insights.viralPotential}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">콘텐츠 품질</p>
                  <p className="text-lg font-bold">{analysisResult.insights.contentQuality}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">예상 도달</p>
                  <p className="text-lg font-bold">{analysisResult.insights.expectedReach}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">예상 참여율</p>
                  <p className="text-lg font-bold text-accent">{analysisResult.insights.estimatedEngagement}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI 추천사항 */}
          <Card className="bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                AI 추천사항
              </CardTitle>
              <CardDescription>성과 향상을 위한 맞춤 제안</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysisResult.recommendations.map((rec: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-accent-foreground">{idx + 1}</span>
                    </div>
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analyze;
