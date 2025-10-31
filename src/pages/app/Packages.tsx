import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";
import { toast } from "sonner";

const subscriptionPlans = [
  {
    name: "스타터",
    posts: 50,
    price: "29,000",
    description: "개인 크리에이터에게 적합",
    features: [
      "월 50개 포스트 생성",
      "모든 채널 지원",
      "시간 최적화 분석",
      "기본 분석 리포트",
    ],
  },
  {
    name: "프로",
    posts: 100,
    price: "49,000",
    description: "성장하는 비즈니스에 최적",
    features: [
      "월 100개 포스트 생성",
      "모든 채널 지원",
      "시간 최적화 분석",
      "고급 분석 리포트",
      "우선 지원",
    ],
    popular: true,
  },
  {
    name: "비즈니스",
    posts: 200,
    price: "89,000",
    description: "대규모 캠페인 운영",
    features: [
      "월 200개 포스트 생성",
      "모든 채널 지원",
      "시간 최적화 분석",
      "프리미엄 분석 리포트",
      "전담 고객 지원",
      "API 액세스",
    ],
  },
];

const creditPacks = [
  {
    name: "미니",
    posts: 10,
    price: "8,000",
    description: "테스트용으로 적합",
  },
  {
    name: "스탠다드",
    posts: 30,
    price: "20,000",
    description: "단기 캠페인에 최적",
    popular: true,
  },
  {
    name: "프리미엄",
    posts: 50,
    price: "30,000",
    description: "대규모 프로젝트",
  },
];

const Packages = () => {
  const handleSubscribe = (planName: string) => {
    toast.success(`${planName} 플랜이 선택되었습니다`, {
      description: "실제 결제 기능은 곧 추가될 예정입니다.",
    });
  };

  const handleBuyCredits = (packName: string) => {
    toast.success(`${packName} 크레딧 팩이 선택되었습니다`, {
      description: "실제 결제 기능은 곧 추가될 예정입니다.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">패키지 & 크레딧</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          귀하의 비즈니스에 맞는 플랜을 선택하세요
        </p>
      </div>

      {/* Monthly Subscriptions */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">월간 구독</h2>
          <p className="text-muted-foreground">
            매월 자동으로 크레딧이 충전되는 정기 구독 플랜
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${
                plan.popular 
                  ? "border-primary shadow-lg shadow-primary/20" 
                  : ""
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
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      ₩{plan.price}
                    </span>
                    <span className="text-muted-foreground">/월</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    월 {plan.posts}개 포스트
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
      </div>

      {/* One-time Credit Packs */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">일회성 크레딧</h2>
          <p className="text-muted-foreground">
            필요할 때 바로 사용할 수 있는 크레딧 팩
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creditPacks.map((pack) => (
            <Card 
              key={pack.name}
              className={`relative ${
                pack.popular 
                  ? "border-accent shadow-lg shadow-accent/20" 
                  : ""
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
                  <CardTitle className="text-xl">{pack.name} 팩</CardTitle>
                </div>
                <CardDescription>{pack.description}</CardDescription>
                <div className="pt-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-foreground">
                      ₩{pack.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {pack.posts}개 포스트 크레딧
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <Button 
                  className="w-full" 
                  variant={pack.popular ? "default" : "outline"}
                  onClick={() => handleBuyCredits(pack.name)}
                >
                  구매하기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p>모든 가격은 VAT 포함 가격입니다.</p>
        <p>연간 구독 시 20% 할인 혜택이 제공됩니다.</p>
      </div>
    </div>
  );
};

export default Packages;
