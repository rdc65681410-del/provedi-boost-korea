import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const selfMarketingPlan = {
  name: "셀프 마케팅",
  description: "내가 직접 선택하는 맞춤 마케팅",
  features: [
    "분석 결과에서 맞춤 카페 직접 선택",
    "원하는 포스팅 개수 선택",
    "선택한 만큼만 결제",
    "AI 콘텐츠 생성 지원",
    "시간 최적화 추천",
    "기본 성과 리포트",
  ],
};

const agencyPlans = [
  {
    name: "기본",
    price: "500,000원",
    period: "/월",
    description: "키워드, 고급시간 최적화",
    vat: "(부가세 별도)",
    features: [
      "월 23개 포스팅",
      "핫딜형 + 후기형 + 질문형",
      "AI 콘텐츠 생성",
      "시간 최적화",
      "맞춤 카페 추천",
      "기본 성과 리포트",
    ],
  },
  {
    name: "부스트",
    price: "1,100,000원",
    period: "/월",
    description: "성장하는 브랜드",
    vat: "(부가세 별도)",
    features: [
      "월 50개+ 포스팅",
      "핫딜형 + 후기형 + 질문형",
      "AI 콘텐츠 생성 (무제한)",
      "고급 시간 최적화 + 예측분석",
      "캠페인 대행 서비스",
      "A/B 테스트",
      "우선 고객 지원",
      "상세 성과 리포트",
    ],
    popular: true,
  },
  {
    name: "프로",
    price: "2,500,000원",
    period: "/월",
    description: "대형 브랜드 및 에이전시",
    vat: "(부가세 별도)",
    features: [
      "무제한 포스팅",
      "모든 콘텐츠 유형",
      "AI 콘텐츠 생성 (무제한)",
      "고급 시간 최적화 + 예측분석",
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

        <Tabs defaultValue="self" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="self">셀프 마케팅</TabsTrigger>
            <TabsTrigger value="agency">대행 에이전시</TabsTrigger>
          </TabsList>

          {/* 셀프마케팅 요금제 */}
          <TabsContent value="self" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <Card className="border-accent shadow-xl">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl mb-2">{selfMarketingPlan.name}</CardTitle>
                  <CardDescription className="text-lg mb-6">
                    {selfMarketingPlan.description}
                  </CardDescription>
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-2">유연한 결제 방식</p>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      선택한 만큼만 결제
                    </p>
                    <p className="text-sm text-muted-foreground">
                      카페와 포스팅 개수를 자유롭게 선택하세요
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h4 className="font-semibold text-foreground mb-4 text-center">이용 방법</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                          1
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">상품 분석</p>
                          <p className="text-sm text-muted-foreground">
                            상품 링크를 입력하고 AI 분석 결과 확인
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                          2
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">맞춤 카페 선택</p>
                          <p className="text-sm text-muted-foreground">
                            추천된 카페 중 원하는 카페를 직접 선택
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                          3
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">포스팅 개수 선택</p>
                          <p className="text-sm text-muted-foreground">
                            각 카페별 포스팅 개수를 자유롭게 설정
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-bold">
                          4
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">결제 및 시작</p>
                          <p className="text-sm text-muted-foreground">
                            선택한 내용에 따라 자동 계산된 금액으로 결제
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground text-center mb-4">포함된 기능</h4>
                    {selfMarketingPlan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Link to="/auth" className="w-full">
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                    >
                      지금 시작하기
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* 대행 에이전시 요금제 */}
          <TabsContent value="agency" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {agencyPlans.map((plan, index) => (
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
                    <div className="flex flex-col items-center">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-muted-foreground ml-1">{plan.period}</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">{plan.vat}</span>
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
          </TabsContent>
        </Tabs>
        
        <p className="text-center text-sm text-muted-foreground mt-12">
          모든 요금제는 VAT 별도이며, 연간 결제 시 20% 할인이 적용됩니다.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
