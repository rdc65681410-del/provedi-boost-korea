import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Users, MessageSquare } from "lucide-react";

const CafeMatching = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          정교한 데이터를 통해
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            브랜드에 최적화된 인플루언서를
          </span>
          <br />
          매칭해 보세요.
        </h2>

        <div className="relative">
          {/* Background decorative element */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <div className="text-[300px] font-bold text-primary">G</div>
          </div>

          {/* Main content card */}
          <Card className="relative z-10 p-8 md:p-12 bg-card/95 backdrop-blur-sm border-2">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Profile Section */}
              <div className="flex flex-col items-center md:items-start space-y-6">
                <div className="flex items-center space-x-4 p-6 bg-primary/5 border-2 border-primary rounded-3xl w-full max-w-md">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
                    맘
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold">me****</span>
                      <Badge variant="default" className="bg-primary">
                        <Star className="w-3 h-3 mr-1" />
                        프로페셔널
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      뷰티/패션 • 20대 중후반
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground text-center md:text-left">
                  AI가 분석한 최적의 카페 채널과 인플루언서를 매칭해드립니다
                </p>
              </div>

              {/* Stats Section */}
              <div className="space-y-4">
                <Card className="p-6 flex items-center justify-between hover:shadow-lg transition-shadow bg-background/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg font-medium">평균 도달</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">1,985</span>
                </Card>

                <Card className="p-6 flex items-center justify-between hover:shadow-lg transition-shadow bg-background/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg font-medium">평균 좋아요</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">1,816</span>
                </Card>

                <Card className="p-6 flex items-center justify-between hover:shadow-lg transition-shadow bg-background/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg font-medium">평균 댓글</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">572</span>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CafeMatching;
