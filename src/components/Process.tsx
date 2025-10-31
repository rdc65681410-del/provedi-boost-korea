import { Link2, Brain, Sparkles, Rocket } from "lucide-react";

const steps = [
  {
    icon: Link2,
    number: "01",
    title: "링크 입력",
    description: "쿠팡, 네이버 스마트스토어, 자사몰 등 판매 링크를 입력하세요"
  },
  {
    icon: Brain,
    number: "02",
    title: "AI 분석",
    description: "AI가 상품 정보, 타겟층, 트렌드를 자동으로 분석합니다"
  },
  {
    icon: Sparkles,
    number: "03",
    title: "채널 추천",
    description: "최적의 맘카페 채널과 발행 시간, 콘텐츠 유형을 추천받습니다"
  },
  {
    icon: Rocket,
    number: "04",
    title: "자동 실행",
    description: "콘텐츠 생성부터 발행까지 한 번의 클릭으로 완료됩니다"
  }
];

const Process = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            간단한 4단계로 시작하세요
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            복잡한 설정 없이 링크 하나로 전문가 수준의 맘카페 마케팅을 시작할 수 있습니다
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative group animate-fade-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-accent/50 to-transparent -translate-x-8" />
                  )}

                  <div className="relative bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Icon className="h-8 w-8" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
