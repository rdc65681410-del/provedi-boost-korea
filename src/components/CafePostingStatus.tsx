import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, MessageCircle, TrendingUp } from "lucide-react";

interface CafePostingStatusProps {
  cafePostingStatus?: {
    totalPosts?: number;
    mainCafes?: Array<{ name: string; posts: number }>;
    avgViews?: number;
    avgComments?: number;
    trendAnalysis?: string;
  };
}

export const CafePostingStatus = ({ cafePostingStatus }: CafePostingStatusProps) => {
  if (!cafePostingStatus || !cafePostingStatus.totalPosts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>맘카페 포스팅 현황</CardTitle>
          <CardDescription>이 상품/키워드의 맘카페 노출 현황</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">포스팅 현황 데이터를 분석 중입니다...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          맘카페 포스팅 현황
        </CardTitle>
        <CardDescription>이 상품/키워드의 현재 맘카페 노출 현황</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-card border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">총 포스팅</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {cafePostingStatus.totalPosts?.toLocaleString()}건
            </p>
          </div>

          <div className="p-4 rounded-lg bg-card border">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">평균 조회수</span>
            </div>
            <p className="text-2xl font-bold text-accent">
              {cafePostingStatus.avgViews?.toLocaleString()}회
            </p>
          </div>

          <div className="p-4 rounded-lg bg-card border">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">평균 댓글</span>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {cafePostingStatus.avgComments?.toLocaleString()}개
            </p>
          </div>
        </div>

        {cafePostingStatus.mainCafes && cafePostingStatus.mainCafes.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-3 text-muted-foreground">주요 노출 카페</p>
            <div className="space-y-2">
              {cafePostingStatus.mainCafes.map((cafe, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 rounded-lg bg-card border hover:shadow-sm transition-shadow"
                >
                  <span className="font-medium">{cafe.name}</span>
                  <Badge variant="secondary">{cafe.posts}건</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {cafePostingStatus.trendAnalysis && (
          <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold mb-1">트렌드 분석</p>
                <p className="text-sm text-muted-foreground">{cafePostingStatus.trendAnalysis}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
