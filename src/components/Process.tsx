import { Link2, Brain, FileText, Calendar, Settings, Rocket } from "lucide-react";
import linkImage from "@/assets/process-step-1-link.jpg";
import aiAnalysisImage from "@/assets/process-step-2-ai-analysis.jpg";
import contentImage from "@/assets/process-step-3-content.jpg";
import schedulingImage from "@/assets/process-step-4-scheduling.jpg";
import adminImage from "@/assets/process-step-5-admin.jpg";
import postingImage from "@/assets/process-step-6-posting.jpg";

const steps = [
  {
    icon: Link2,
    number: "01",
    title: "링크 입력",
    description: "상품 URL만 입력",
    detail: "10초",
    image: linkImage
  },
  {
    icon: Brain,
    number: "02",
    title: "AI 분석",
    description: "상품·채널 자동 분석",
    detail: "1~2분",
    image: aiAnalysisImage
  },
  {
    icon: FileText,
    number: "03",
    title: "콘텐츠 자동 생성",
    description: "채널별 맞춤 게시글 작성",
    detail: "자동",
    image: contentImage
  },
  {
    icon: Calendar,
    number: "04",
    title: "자동 스케줄링",
    description: "최적 시간대 자동 배정",
    detail: "자동",
    image: schedulingImage
  },
  {
    icon: Settings,
    number: "05",
    title: "관리자 페이지",
    description: "생성된 콘텐츠 확인",
    detail: "실시간",
    image: adminImage
  },
  {
    icon: Rocket,
    number: "06",
    title: "원클릭 포스팅",
    description: "승인 후 즉시 발행",
    detail: "1클릭",
    image: postingImage
  }
];

const Process = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            간단한 6단계로 시작하세요
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            복잡한 설정 없이 링크 하나로 전문가 수준의 맘카페 마케팅을 시작할 수 있습니다
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2">
                    {/* Step Number Badge */}
                    <div className="absolute top-4 left-4 z-10 w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.number}
                    </div>

                    {/* Dashboard Preview Image */}
                    <div className="relative h-48 overflow-hidden bg-muted">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        <Icon className="h-7 w-7" />
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-3 text-sm">
                        {step.description}
                      </p>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                        {step.detail}
                      </div>
                    </div>
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
