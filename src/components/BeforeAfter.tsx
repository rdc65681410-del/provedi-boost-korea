import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Check, Clock, DollarSign, TrendingUp, AlertCircle, Sparkles } from "lucide-react";

const manualWork = [
  {
    icon: Clock,
    title: "10시간 이상 소요",
    items: [
      "맘카페 직접 검색 (2시간)",
      "회원가입·규정 확인 (1시간)",
      "게시글 수동 작성 (4시간)",
      "발행 시간 고민·예약 (1시간)",
      "각 카페별 반복 작업 (2시간+)"
    ]
  },
  {
    icon: DollarSign,
    title: "높은 비용",
    items: [
      "대행사 수수료 월 200만원+",
      "콘텐츠 제작비 별도",
      "성과 분석 리포트 별도",
      "담당자 인건비 추가"
    ]
  },
  {
    icon: AlertCircle,
    title: "낮은 정확도",
    items: [
      "감으로 채널 선택",
      "최적 시간대 모름",
      "규정 위반 위험",
      "일관성 없는 품질"
    ]
  }
];

const automatedWork = [
  {
    icon: Clock,
    title: "30분 만에 완료",
    items: [
      "링크 입력 (10초)",
      "AI 분석 완료 (1-2분)",
      "콘텐츠 자동 생성 (자동)",
      "최적 시간 자동 배정 (자동)",
      "관리자 페이지에서 승인 (5분)"
    ]
  },
  {
    icon: DollarSign,
    title: "저렴한 비용",
    items: [
      "선택한 만큼만 결제",
      "콘텐츠 생성 무료 포함",
      "성과 분석 리포트 포함",
      "별도 인건비 불필요"
    ]
  },
  {
    icon: TrendingUp,
    title: "높은 정확도",
    items: [
      "AI 데이터 기반 채널 추천",
      "통계 기반 최적 시간 예측",
      "규정 자동 체크",
      "일관된 고품질 콘텐츠"
    ]
  }
];

const BeforeAfter = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-destructive to-accent text-white px-6 py-2 text-base">
            비교해보세요
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            기존 방식 vs 우리 플랫폼
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            차원이 다른 효율성을 경험하세요
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Before - Manual */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <Badge variant="destructive" className="mb-3 text-base px-4 py-2">
                  <X className="h-4 w-4 mr-2" />
                  기존 수동 방식
                </Badge>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  비효율적이고 비쌉니다
                </h3>
                <p className="text-muted-foreground">
                  시간과 돈을 낭비하는 전통적인 방법
                </p>
              </div>

              {manualWork.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Card 
                    key={index} 
                    className="border-2 border-destructive/20 bg-destructive/5 hover:shadow-lg transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h4 className="font-bold text-foreground">{section.title}</h4>
                      </div>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-sm">
                            <X className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                );
              })}

              <div className="text-center p-6 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-lg font-bold text-destructive mb-1">
                  총 소요 시간: 10시간+
                </p>
                <p className="text-sm text-muted-foreground">
                  월 비용: 200만원+ (대행사 기준)
                </p>
              </div>
            </div>

            {/* After - Automated */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <Badge className="mb-3 bg-gradient-to-r from-accent to-accent-foreground text-white text-base px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  우리 플랫폼
                </Badge>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  빠르고 정확하고 저렴합니다
                </h3>
                <p className="text-muted-foreground">
                  AI 자동화로 모든 것을 해결
                </p>
              </div>

              {automatedWork.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Card 
                    key={index} 
                    className="border-2 border-accent/20 bg-accent/5 hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h4 className="font-bold text-foreground">{section.title}</h4>
                      </div>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-foreground font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                );
              })}

              <div className="text-center p-6 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border-2 border-accent/20">
                <p className="text-lg font-bold text-accent mb-1">
                  총 소요 시간: 30분
                </p>
                <p className="text-sm text-muted-foreground">
                  월 비용: 50만원~ (셀프 마케팅)
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  시간과 비용을 95% 절감하세요
                </h3>
                <p className="text-muted-foreground mb-6">
                  기존 방식 대비 20배 빠르고, 3배 저렴하며, 훨씬 정확합니다
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-background/80 px-4 py-2 rounded-full">
                    <Check className="h-4 w-4 text-accent" />
                    <span className="font-semibold">10시간 → 30분</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/80 px-4 py-2 rounded-full">
                    <Check className="h-4 w-4 text-accent" />
                    <span className="font-semibold">200만원 → 50만원</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/80 px-4 py-2 rounded-full">
                    <Check className="h-4 w-4 text-accent" />
                    <span className="font-semibold">ROI 3배 향상</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;