import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Link2, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (!url) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      navigate("/app/analyze");
    }, 1500);
  };

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
          <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 border border-accent/20 hover:bg-accent/20 transition-all">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">AI 기반 맘카페 마케팅 자동화</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            맘카페 마케팅,<br />
            <span className="text-accent">10시간을 30분으로</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed">
            링크만 입력하면 <span className="font-bold text-accent">AI가 콘텐츠를 자동 생성</span>하고<br />
            <span className="font-bold text-accent">최적 시간에 자동 스케줄링</span>까지. 당신은 승인만 하면 됩니다.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <span className="text-white font-semibold text-sm">✨ 콘텐츠 자동 생성</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <span className="text-white font-semibold text-sm">⚡ 자동 스케줄링</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <span className="text-white font-semibold text-sm">📊 관리자 페이지</span>
            </div>
          </div>

          {/* Interactive Demo Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-2 mb-4">
                <Link2 className="h-5 w-5 text-white/70" />
                <span className="text-white/90 font-medium">상품 링크를 입력해보세요</span>
              </div>
              <div className="flex gap-3">
                <Input
                  type="url"
                  placeholder="https://smartstore.naver.com/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 h-14 bg-white/90 border-white/30 text-foreground placeholder:text-muted-foreground text-base"
                />
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={handleAnalyze}
                  disabled={!url || isAnalyzing}
                  className="h-14 px-8 whitespace-nowrap"
                >
                  {isAnalyzing ? (
                    <>분석 중...</>
                  ) : (
                    <>
                      분석 시작
                      <TrendingUp className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
              <p className="text-white/60 text-sm mt-3">
                쿠팡, 네이버 스마트스토어, 자사몰 등 모든 쇼핑몰 링크 지원
              </p>
            </div>
          </div>
          
          {/* Call to Action Text */}
          <div className="mb-6">
            <p className="text-2xl md:text-3xl font-bold text-white mb-2">
              첫 페이지 내 브랜드 장악
            </p>
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent via-accent-foreground to-accent bg-clip-text text-transparent animate-pulse">
              당신 차례입니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link to="/auth">
              <Button variant="outline" size="lg" className="min-w-[200px] bg-white text-primary border-white hover:bg-white/90 font-semibold">
                무료로 시작하기
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span>3분 만에 시작</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span>신용카드 불필요</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
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
