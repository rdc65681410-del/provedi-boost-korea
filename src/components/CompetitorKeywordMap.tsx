import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CompetitorData {
  name: string;
  keywords: string[];
  mainCafes: string[];
  estimatedPosts: number;
  avgViews: number;
  trend: string;
}

interface CompetitorKeywordMapProps {
  competitorBrands?: CompetitorData[];
}

export const CompetitorKeywordMap = ({ competitorBrands = [] }: CompetitorKeywordMapProps) => {
  if (!competitorBrands || competitorBrands.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>경쟁사 브랜드 키워드 노출 지도</CardTitle>
          <CardDescription>주요 경쟁 브랜드가 사용하는 키워드와 노출 카페</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">경쟁사 데이터를 분석 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>경쟁사 브랜드 키워드 노출 지도</CardTitle>
        <CardDescription>주요 경쟁 브랜드가 사용하는 키워드와 노출 카페</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {competitorBrands.map((brand, idx) => (
            <div key={idx} className="p-4 rounded-lg border bg-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-1">{brand.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>예상 포스팅: {brand.estimatedPosts}건</span>
                    <span>•</span>
                    <span>평균 조회수: {brand.avgViews.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {brand.trend === "up" && (
                    <>
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-emerald-500 font-semibold">상승</span>
                    </>
                  )}
                  {brand.trend === "down" && (
                    <>
                      <TrendingDown className="h-4 w-4 text-rose-500" />
                      <span className="text-sm text-rose-500 font-semibold">하락</span>
                    </>
                  )}
                  {brand.trend === "stable" && (
                    <>
                      <Minus className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-semibold">안정</span>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold mb-2 text-muted-foreground">핵심 키워드</p>
                  <div className="flex flex-wrap gap-2">
                    {brand.keywords.map((keyword, kidx) => (
                      <Badge key={kidx} variant="secondary" className="text-sm">
                        #{keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2 text-muted-foreground">주요 노출 카페</p>
                  <div className="flex flex-wrap gap-2">
                    {brand.mainCafes.map((cafe, cidx) => (
                      <Badge key={cidx} variant="outline" className="text-sm">
                        {cafe}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {competitorBrands.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>경쟁사 데이터가 없습니다</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
