import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Target, FileText, Clock, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI 콘텐츠 자동 생성",
    description: "주문 즉시 각 채널에 최적화된 후기형, 질문형, 핫딜형 게시글을 AI가 자동으로 작성합니다.",
  },
  {
    icon: Clock,
    title: "자동 스케줄링",
    description: "채널별 최적 시간대를 AI가 분석하여 자동으로 발행 일정을 배정합니다.",
  },
  {
    icon: Target,
    title: "관리자 페이지",
    description: "생성된 모든 콘텐츠를 한눈에 확인하고, 원클릭으로 승인 및 포스팅할 수 있습니다.",
  },
  {
    icon: Link2,
    title: "스마트 링크 분석",
    description: "쿠팡, 네이버 스마트스토어 등 모든 쇼핑몰 링크를 AI가 자동으로 분석합니다.",
  },
  {
    icon: TrendingUp,
    title: "실시간 성과 추적",
    description: "캠페인 성과를 실시간으로 모니터링하고 개선점을 제안합니다.",
  },
  {
    icon: Shield,
    title: "규정 준수 확인",
    description: "각 채널의 규정과 금칙어를 자동으로 확인하여 안전한 마케팅을 보장합니다.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            강력한 기능으로 마케팅을 자동화하세요
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI 기술과 빅데이터 분석으로 맘카페 마케팅의 모든 과정을 자동화합니다
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
