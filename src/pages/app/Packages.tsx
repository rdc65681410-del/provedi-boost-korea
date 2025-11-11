import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";

const agencyPlans = [
  {
    name: "기본",
    posts: 23,
    price: "500,000",
    vat: "(부가세 별도)",
    description: "키워드, 고급시간 최적화",
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
    posts: 50,
    price: "1,100,000",
    vat: "(부가세 별도)",
    description: "성장하는 브랜드",
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
    posts: 999,
    price: "2,500,000",
    vat: "(부가세 별도)",
    description: "대형 브랜드 및 에이전시",
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

const selfMarketingCredits = [
  {
    name: "스타터",
    credits: 100000,
    bonus: 0,
    price: "100,000",
    description: "테스트로 시작하기",
    perPost: "5,000원",
  },
  {
    name: "베이직",
    credits: 300000,
    bonus: 30000,
    price: "300,000",
    description: "소규모 캠페인",
    perPost: "4,500원",
    popular: true,
  },
  {
    name: "스탠다드",
    credits: 500000,
    bonus: 75000,
    price: "500,000",
    description: "중규모 마케팅",
    perPost: "4,000원",
  },
  {
    name: "프리미엄",
    credits: 1000000,
    bonus: 200000,
    price: "1,000,000",
    description: "대규모 캠페인",
    perPost: "3,500원",
  },
];

const Packages = () => {
  const handleSubscribe = (planName: string) => {
    toast.success(`${planName} 플랜이 선택되었습니다`, {
      description: "실제 결제 기능은 곧 추가될 예정입니다.",
    });
  };

  const handleBuyCredits = (packName: string) => {
    toast.success(`${packName} 크레딧이 선택되었습니다`, {
      description: "실제 결제 기능은 곧 추가될 예정입니다.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">패키지 & 결제</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          귀하의 비즈니스에 맞는 플랜을 선택하세요
        </p>
      </div>

      <Tabs defaultValue="agency" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="agency">대행 에이전시</TabsTrigger>
          <TabsTrigger value="self">셀프 마케팅</TabsTrigger>
        </TabsList>

        {/* 대행 에이전시 구독 */}
        <TabsContent value="agency" className="space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">대행 에이전시 월간 구독</h2>
            <p className="text-muted-foreground">
              전문가가 케어하는 맘카페 마케팅 대행 서비스
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agencyPlans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${
                  plan.popular 
                    ? "border-primary shadow-xl scale-105 z-10" 
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      인기
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">
                          ₩{plan.price}
                        </span>
                        <span className="text-muted-foreground">/월</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">{plan.vat}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      {plan.posts === 999 ? "무제한 포스팅" : `월 ${plan.posts}개 포스팅`}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.name)}
                  >
                    구독하기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 셀프 마케팅 충전 */}
        <TabsContent value="self" className="space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">셀프 마케팅 충전형</h2>
            <p className="text-muted-foreground">
              원하는 만큼 충전하고 자유롭게 사용하세요
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <p className="font-semibold text-foreground">충전 금액이 높을수록 보너스 증가!</p>
            </div>
            <p className="text-sm text-muted-foreground">
              충전된 크레딧으로 원하는 카페와 포스팅 개수를 자유롭게 선택하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selfMarketingCredits.map((pack) => (
              <Card 
                key={pack.name}
                className={`relative ${
                  pack.popular 
                    ? "border-accent shadow-lg shadow-accent/20" 
                    : "border-border"
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      추천
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    <CardTitle className="text-xl">{pack.name}</CardTitle>
                  </div>
                  <CardDescription>{pack.description}</CardDescription>
                  <div className="pt-4 space-y-2">
                    <div className="flex items-baseline gap-1 justify-center">
                      <span className="text-3xl font-bold text-foreground">
                        ₩{pack.price}
                      </span>
                    </div>
                    <div className="bg-muted rounded-lg p-3 space-y-1">
                      <p className="text-sm font-semibold text-foreground text-center">
                        {(pack.credits).toLocaleString()}원 충전
                      </p>
                      {pack.bonus > 0 && (
                        <p className="text-xs text-accent font-semibold text-center">
                          + {pack.bonus.toLocaleString()}원 보너스 🎁
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground text-center">
                        포스팅당 약 {pack.perPost}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Button 
                    className="w-full" 
                    variant={pack.popular ? "default" : "outline"}
                    onClick={() => handleBuyCredits(pack.name)}
                  >
                    충전하기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  셀프 마케팅 이용 방법
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto">
                      1
                    </div>
                    <p className="text-sm font-semibold">크레딧 충전</p>
                    <p className="text-xs text-muted-foreground">원하는 금액만큼 충전</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto">
                      2
                    </div>
                    <p className="text-sm font-semibold">카페 선택</p>
                    <p className="text-xs text-muted-foreground">분석 결과에서 맞춤 카페 선택</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mx-auto">
                      3
                    </div>
                    <p className="text-sm font-semibold">개수 설정</p>
                    <p className="text-xs text-muted-foreground">포스팅 개수 자유롭게 선택</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold mx-auto">
                      4
                    </div>
                    <p className="text-sm font-semibold">자동 차감</p>
                    <p className="text-xs text-muted-foreground">크레딧에서 자동 결제</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Note */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>대행 에이전시 요금제는 VAT 별도 가격입니다.</p>
        <p>셀프 마케팅 충전 크레딧은 VAT 포함 가격입니다.</p>
      </div>
    </div>
  );
};

export default Packages;
