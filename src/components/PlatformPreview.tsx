import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Target, 
  FileText, 
  Calendar,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Store
} from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const PlatformPreview = () => {
  return (
    <section className="py-24 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            한눈에 보는 플랫폼 기능
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            맘카페 마케팅의 모든 과정을 하나의 대시보드에서 관리하세요
          </p>
        </div>

        <Tabs defaultValue="analyze" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="analyze" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              링크 분석
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              맞춤 카페추천
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              콘텐츠 생성
            </TabsTrigger>
            <TabsTrigger value="campaign" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              캠페인 관리
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              성과 리포트
            </TabsTrigger>
          </TabsList>

          {/* 링크 분석 탭 */}
          <TabsContent value="analyze" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-card border-2 border-accent">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Badge className="bg-accent text-accent-foreground">
                    AI 자동 분석
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">
                    상품 URL만 입력하면 끝
                  </h3>
                  <p className="text-muted-foreground">
                    쿠팡, 네이버 스마트스토어 등 어떤 쇼핑몰 링크든 AI가 자동으로 분석하여 
                    최적의 맘카페 채널을 추천합니다.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Target className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">채널 매칭도 분석</p>
                        <p className="text-sm text-muted-foreground">
                          상품과 가장 잘 맞는 맘카페 Top 10 추천
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">예상 ROI 계산</p>
                        <p className="text-sm text-muted-foreground">
                          투자 대비 예상 수익률 자동 계산
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-chart-3/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BarChart3 className="h-4 w-4 text-chart-3" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">경쟁사 분석</p>
                        <p className="text-sm text-muted-foreground">
                          시장 점유율 및 가격 경쟁력 분석
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center p-8">
                      <Target className="h-16 w-16 text-accent mx-auto mb-4" />
                      <p className="text-muted-foreground">링크 분석 화면 미리보기</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* 맞춤 카페추천 탭 */}
          <TabsContent value="recommendations" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-card border-2 border-primary">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Badge className="bg-primary text-primary-foreground">
                    AI 매칭 시스템
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">
                    데이터 기반 최적 카페 추천
                  </h3>
                  <p className="text-muted-foreground">
                    상품 특성과 타겟층을 분석하여 가장 효과적인 맘카페를 
                    AI가 자동으로 매칭해드립니다.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Store className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">카페 매칭도 점수</p>
                        <p className="text-sm text-muted-foreground">
                          98점 이상의 최고 매칭 카페 추천
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">타겟층 분석</p>
                        <p className="text-sm text-muted-foreground">
                          연령대, 관심사, 구매력 기반 타겟팅
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-chart-3/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TrendingUp className="h-4 w-4 text-chart-3" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">활성도 분석</p>
                        <p className="text-sm text-muted-foreground">
                          실시간 카페 활동 데이터 기반 추천
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
                  <div className="aspect-video flex flex-col items-center justify-center p-6">
                    <Store className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground text-center mb-4">맞춤 카페 추천 결과</p>
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-background/80">
                        <span className="text-sm font-semibold">강남맘 육아정보</span>
                        <Badge className="bg-primary">98점</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-background/80">
                        <span className="text-sm font-semibold">서초 워킹맘 모임</span>
                        <Badge variant="secondary">94점</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-background/80">
                        <span className="text-sm font-semibold">분당 맘카페</span>
                        <Badge variant="secondary">91점</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* 콘텐츠 생성 탭 */}
          <TabsContent value="content" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-card border-2 border-primary">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center p-8">
                      <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">AI 콘텐츠 생성 화면</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <Badge className="bg-primary text-primary-foreground">
                    AI 자동 작성
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">
                    맘카페별 맞춤 콘텐츠 자동 생성
                  </h3>
                  <p className="text-muted-foreground">
                    각 채널의 특성과 규정에 맞춰 후기형, 질문형, 핫딜형 게시글을 
                    AI가 자동으로 작성합니다.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">후기형</Badge>
                        <span className="text-sm font-semibold">자연스러운 사용 후기</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "아이가 너무 좋아해요! 원목이라 안전하고..."
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">질문형</Badge>
                        <span className="text-sm font-semibold">자연스러운 질문</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "이 제품 써보신 분 계신가요? 궁금해요~"
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">핫딜형</Badge>
                        <span className="text-sm font-semibold">할인 정보 공유</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        "🔥 타임특가 발견! 30% 할인 중이에요"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* 캠페인 관리 탭 */}
          <TabsContent value="campaign" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-card border-2 border-chart-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Badge className="bg-chart-3 text-white">
                    올인원 관리
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">
                    모든 캠페인을 한곳에서
                  </h3>
                  <p className="text-muted-foreground">
                    여러 맘카페에 진행 중인 모든 캠페인을 통합 관리하고 
                    실시간으로 성과를 모니터링하세요.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10">
                      <span className="text-sm font-semibold">진행중인 캠페인</span>
                      <span className="text-2xl font-bold text-accent">5개</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                      <span className="text-sm font-semibold">예약된 포스팅</span>
                      <span className="text-2xl font-bold text-primary">24개</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-chart-3/10">
                      <span className="text-sm font-semibold">이번 달 조회수</span>
                      <span className="text-2xl font-bold text-chart-3">32만</span>
                    </div>
                  </div>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-border bg-muted">
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center p-8">
                      <Calendar className="h-16 w-16 text-chart-3 mx-auto mb-4" />
                      <p className="text-muted-foreground">캠페인 관리 대시보드</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* 성과 리포트 탭 */}
          <TabsContent value="reports" className="space-y-6 animate-fade-in">
            <Card className="p-6 bg-card border-2 border-accent">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img 
                    src={dashboardPreview} 
                    alt="대시보드 미리보기" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <Badge className="bg-accent text-accent-foreground">
                    실시간 분석
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground">
                    상세한 성과 리포트
                  </h3>
                  <p className="text-muted-foreground">
                    캠페인 성과를 한눈에 파악하고 데이터 기반으로 
                    마케팅 전략을 최적화하세요.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">조회수</span>
                      </div>
                      <p className="text-2xl font-bold">32.4만</p>
                      <p className="text-xs text-accent font-semibold">+12.5%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">참여율</span>
                      </div>
                      <p className="text-2xl font-bold">5.8%</p>
                      <p className="text-xs text-accent font-semibold">+8.3%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">도달 수</span>
                      </div>
                      <p className="text-2xl font-bold">8.2만</p>
                      <p className="text-xs text-accent font-semibold">+15.7%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">ROI</span>
                      </div>
                      <p className="text-2xl font-bold">342%</p>
                      <p className="text-xs text-accent font-semibold">+24.7%</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PlatformPreview;
