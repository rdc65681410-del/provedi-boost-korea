import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface CafeExposureData {
  cafeName: string;
  effectiveKeywords: string[];
  recommendedPostCount: number;
  expectedReach: number;
  estimatedEngagement: number;
  bestPostingTime: string;
}

interface CafeExposureHeatmapProps {
  cafeExposureStrategy?: CafeExposureData[];
}

export const CafeExposureHeatmap = ({ cafeExposureStrategy = [] }: CafeExposureHeatmapProps) => {
  if (!cafeExposureStrategy || cafeExposureStrategy.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>카페별 노출 전략</CardTitle>
          <CardDescription>각 맘카페에서 효과적인 키워드와 최적 시간대</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">카페별 노출 전략을 분석 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>카페별 노출 전략</CardTitle>
        <CardDescription>각 맘카페에서 효과적인 키워드와 최적 시간대</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cafeExposureStrategy.map((cafe, idx) => (
            <div 
              key={idx} 
              className="p-4 rounded-lg border bg-gradient-to-r from-card to-muted/20 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{cafe.cafeName}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-3 w-3" />
                    <span>최적 시간: {cafe.bestPostingTime}</span>
                  </div>
                </div>
                <Badge className="bg-accent">
                  {cafe.recommendedPostCount}개 포스팅 권장
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">예상 도달</p>
                  <p className="text-sm font-bold">{cafe.expectedReach.toLocaleString()}명</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">예상 참여율</p>
                  <p className="text-sm font-bold text-accent">{cafe.estimatedEngagement.toFixed(1)}%</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">효율성 점수</p>
                  <p className="text-sm font-bold text-primary">
                    {Math.round((cafe.estimatedEngagement / cafe.recommendedPostCount) * 10)}/10
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-2 text-muted-foreground">효과적인 키워드</p>
                <div className="flex flex-wrap gap-2">
                  {cafe.effectiveKeywords.map((keyword, kidx) => (
                    <Badge 
                      key={kidx} 
                      variant="outline" 
                      className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-default"
                    >
                      #{keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {cafeExposureStrategy.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>카페별 노출 전략 데이터가 없습니다</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
