import { useEffect, useState } from "react";
import { TrendingUp, Users, Zap, Target } from "lucide-react";

const stats = [
  {
    icon: Zap,
    value: 95,
    suffix: "%",
    label: "시간 절약",
    description: "10시간 → 30분"
  },
  {
    icon: Users,
    value: 850,
    suffix: "+",
    label: "활성 셀러",
    description: "현재 이용 중"
  },
  {
    icon: TrendingUp,
    value: 3,
    suffix: "배",
    label: "ROI 향상",
    description: "AI 최적화"
  },
  {
    icon: Target,
    value: 98,
    suffix: "%",
    label: "매칭 정확도",
    description: "AI 분석 기반"
  }
];

const Counter = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

const Stats = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-4 hover:bg-accent/20 transition-colors">
                  <Icon className="h-8 w-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-base md:text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
