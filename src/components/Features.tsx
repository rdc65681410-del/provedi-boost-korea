import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Target, FileText, Clock, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "스마트 링크 분석",
    description: "쿠팡, 네이버 스마트스토어, 자사몰 URL을 입력하면 AI가 자동으로 상품 정보와 카테고리를 분석합니다.",
  },
  {
    icon: Target,
    title: "최적 채널 추천",
    description: "1,000+ 맘카페 데이터베이스에서 상품에 가장 적합한 채널을 찾아 추천합니다.",
  },
  {
    icon: FileText,
    title: "AI 콘텐츠 생성",
    description: "핫딜, 질문형, 후기형 등 각 채널에 맞는 최적의 게시글을 자동으로 생성합니다.",
  },
  {
    icon: Clock,
    title: "시간 최적화",
    description: "채널별 활동 패턴을 분석하여 가장 효과적인 발행 시간을 추천합니다.",
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
