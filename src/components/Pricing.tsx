import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "49,000원",
    period: "/월",
    description: "개인 브랜드 및 소규모 셀러",
    features: [
      "월 10개 상품 분석",
      "기본 채널 추천 (5개)",
      "AI 콘텐츠 생성",
      "시간 최적화 추천",
      "이메일 지원",
    ],
  },
  {
    name: "Boost",
    price: "149,000원",
    period: "/월",
    description: "성장하는 중소 브랜드",
    features: [
      "월 50개 상품 분석",
      "고급 채널 추천 (15개)",
      "AI 콘텐츠 생성 (무제한)",
      "시간 최적화 + A/B 테스트",
      "캠페인 대행 서비스 (월 5회)",
      "우선 고객 지원",
      "성과 리포트",
    ],
    popular: true,
  },
  {
    name: "Pro",
    price: "499,000원",
    period: "/월",
    description: "대형 브랜드 및 에이전시",
    features: [
      "무제한 상품 분석",
      "프리미엄 채널 추천 (30개+)",
      "AI 콘텐츠 생성 (무제한)",
      "고급 시간 최적화 + 예측 분석",
      "캠페인 대행 서비스 (무제한)",
      "전담 계정 매니저",
      "맞춤형 리포트 + 컨설팅",
      "API 액세스",
    ],
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            성장에 맞는 요금제를 선택하세요
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            14일 무료 체험으로 시작하세요. 언제든지 업그레이드 또는 취소 가능합니다.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${
                plan.popular 
                  ? 'border-accent shadow-xl scale-105 z-10' 
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    인기
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-base mb-4">
                  {plan.description}
                </CardDescription>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </CardContent>
              
              <CardFooter>
                <Link to="/auth" className="w-full">
                  <Button 
                    variant={plan.popular ? "hero" : "outline"} 
                    size="lg" 
                    className="w-full"
                  >
                    시작하기
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-12">
          모든 요금제는 VAT 별도이며, 연간 결제 시 20% 할인이 적용됩니다.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
