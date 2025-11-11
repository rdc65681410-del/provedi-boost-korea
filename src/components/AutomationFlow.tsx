import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Link2, 
  Brain, 
  FileText, 
  Calendar, 
  LayoutDashboard,
  MousePointer,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";

const automationSteps = [
  {
    icon: Link2,
    title: "링크 입력",
    description: "상품 URL만 입력",
    time: "10초",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  },
  {
    icon: Brain,
    title: "AI 분석",
    description: "상품·채널 자동 분석",
    time: "1-2분",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  },
  {
    icon: FileText,
    title: "콘텐츠 자동 생성",
    description: "채널별 맞춤 게시글 작성",
    time: "자동",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    highlight: true
  },
  {
    icon: Calendar,
    title: "자동 스케줄링",
    description: "최적 시간대 자동 배정",
    time: "자동",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    highlight: true
  },
  {
    icon: LayoutDashboard,
    title: "관리자 페이지",
    description: "생성된 콘텐츠 확인",
    time: "실시간",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20"
  },
  {
    icon: MousePointer,
    title: "원클릭 포스팅",
    description: "승인 후 즉시 발행",
    time: "1클릭",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20"
  }
];

const AutomationFlow = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-primary to-accent text-white px-6 py-2">
            <Zap className="h-4 w-4 mr-2 inline" />
            완전 자동화 시스템
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            링크 하나로 끝나는<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              완전 자동화 마케팅
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            콘텐츠 생성부터 스케줄링까지 모두 자동. 당신은 승인만 하면 됩니다.
          </p>
        </div>

        {/* Desktop Flow */}
        <div className="hidden lg:block max-w-7xl mx-auto mb-16">
          <div className="relative">
            {/* Connection Lines */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-emerald-500 via-amber-500 via-pink-500 to-cyan-500 opacity-20" />
            
            <div className="grid grid-cols-6 gap-4">
              {automationSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    {/* Arrow */}
                    {index < automationSteps.length - 1 && (
                      <div className="absolute top-24 -right-2 z-20">
                        <ArrowRight className={`h-6 w-6 ${step.color}`} />
                      </div>
                    )}
                    
                    <Card className={`relative border-2 ${step.borderColor} ${step.bgColor} hover:shadow-2xl transition-all hover:-translate-y-2 group`}>
                      {step.highlight && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-accent text-accent-foreground animate-pulse">
                            <Sparkles className="h-3 w-3 mr-1" />
                            자동
                          </Badge>
                        </div>
                      )}
                      
                      <div className="p-6 text-center">
                        <div className={`w-16 h-16 rounded-2xl ${step.bgColor} border-2 ${step.borderColor} ${step.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        
                        <h3 className="font-bold text-foreground mb-2 text-sm">
                          {step.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          {step.description}
                        </p>
                        <Badge variant="outline" className={`${step.color} text-xs`}>
                          {step.time}
                        </Badge>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Flow */}
        <div className="lg:hidden space-y-4 max-w-md mx-auto mb-16">
          {automationSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className={`border-2 ${step.borderColor} ${step.bgColor}`}>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl ${step.bgColor} border-2 ${step.borderColor} ${step.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-foreground">
                            {step.title}
                          </h3>
                          {step.highlight && (
                            <Badge className="bg-accent text-accent-foreground text-xs">
                              자동
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {step.description}
                        </p>
                        <Badge variant="outline" className={`${step.color} text-xs`}>
                          {step.time}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {index < automationSteps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className={`h-6 w-6 ${step.color} rotate-90`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Benefits Grid */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            이 모든 것이 자동으로
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
              <div className="p-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h4 className="font-bold text-foreground mb-2">시간 절약</h4>
                <p className="text-3xl font-bold text-emerald-500 mb-2">95%</p>
                <p className="text-sm text-muted-foreground">
                  10시간 작업을 30분으로
                </p>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <div className="p-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="font-bold text-foreground mb-2">비용 절감</h4>
                <p className="text-3xl font-bold text-blue-500 mb-2">70%</p>
                <p className="text-sm text-muted-foreground">
                  대행사 비용의 1/3 수준
                </p>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <div className="p-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h4 className="font-bold text-foreground mb-2">성과 향상</h4>
                <p className="text-3xl font-bold text-purple-500 mb-2">3배</p>
                <p className="text-sm text-muted-foreground">
                  AI 최적화로 ROI 극대화
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutomationFlow;