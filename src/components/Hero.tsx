import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-95" />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 border border-accent/20">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI 기반 맘카페 마케팅 자동화</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            맘카페 마케팅,<br />
            이제 <span className="text-accent">자동으로</span> 실행하세요
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            상품 링크만 입력하면 AI가 최적의 채널을 찾고, 콘텐츠를 생성하고,<br />
            최고의 시간에 발행까지. 맘카페 마케팅의 모든 것을 자동화합니다.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/auth">
              <Button variant="hero" size="lg" className="min-w-[200px]">
                무료로 시작하기
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="min-w-[200px] bg-white/10 text-white border-white/30 hover:bg-white/20">
              데모 보기
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-8 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>3분 만에 시작</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>신용카드 불필요</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>무료 체험 가능</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
