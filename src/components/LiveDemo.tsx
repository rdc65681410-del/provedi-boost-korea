import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";

const demoChannels = [
  {
    name: "강남맘 육아정보",
    score: 98,
    members: "45,000명",
    activity: "매우 높음",
    cost: "150,000원",
    type: "후기형",
    reason: "타겟층 일치도 95%"
  },
  {
    name: "서초 워킹맘 모임",
    score: 94,
    members: "32,000명", 
    activity: "높음",
    cost: "120,000원",
    type: "질문형",
    reason: "활성 시간대 최적"
  },
  {
    name: "분당 맘카페",
    score: 91,
    members: "28,000명",
    activity: "높음", 
    cost: "100,000원",
    type: "핫딜형",
    reason: "가격 민감도 높음"
  }
];

const LiveDemo = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            실시간 분석 결과 미리보기
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI가 분석한 실제 채널 추천 결과를 확인해보세요
          </p>
        </div>

        {/* Demo Product Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                상품 이미지
              </div>
              <div className="flex-1">
                <Badge className="mb-3">유아 장난감</Badge>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  프리미엄 원목 블록 세트
                </h3>
                <p className="text-muted-foreground mb-4">
                  가격대: 50,000-80,000원 | 타겟: 25-40세 부모
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">원목장난감</Badge>
                  <Badge variant="outline">교육완구</Badge>
                  <Badge variant="outline">유아발달</Badge>
                  <Badge variant="outline">친환경</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recommended Channels */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            추천 맘카페 채널 TOP 3
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoChannels.map((channel, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-border bg-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {index === 0 && (
                  <Badge className="mb-3 bg-accent text-accent-foreground">
                    최고 추천
                  </Badge>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-foreground">
                    {channel.name}
                  </h4>
                  <div className="text-3xl font-bold text-accent">
                    {channel.score}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      가입자
                    </span>
                    <span className="font-semibold text-foreground">{channel.members}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      활성도
                    </span>
                    <span className="font-semibold text-foreground">{channel.activity}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      예상 비용
                    </span>
                    <span className="font-semibold text-foreground">{channel.cost}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      추천 유형
                    </span>
                    <Badge variant="secondary">{channel.type}</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">추천 이유:</span> {channel.reason}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            이런 상세한 분석 결과를 3분 안에 받아보세요
          </p>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
