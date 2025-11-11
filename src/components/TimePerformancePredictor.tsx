import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Eye, MessageCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface TimeSlot {
  time: string;
  hour: number;
  expectedViews: number;
  expectedEngagement: number;
  performance: "최고" | "우수" | "양호" | "보통";
}

interface TimePerformancePredictorProps {
  cafeName?: string;
}

const generateTimeData = (): TimeSlot[] => {
  const timeSlots: TimeSlot[] = [];
  const peakHours = [10, 11, 14, 15, 20, 21, 22]; // 피크 시간대
  
  for (let hour = 0; hour < 24; hour++) {
    const isPeak = peakHours.includes(hour);
    const baseViews = isPeak ? 800 : 300;
    const variance = Math.random() * 200;
    const expectedViews = Math.floor(baseViews + variance);
    const expectedEngagement = isPeak ? 5.5 + Math.random() * 2 : 2.5 + Math.random() * 1.5;
    
    let performance: "최고" | "우수" | "양호" | "보통";
    if (expectedEngagement > 6.5) performance = "최고";
    else if (expectedEngagement > 5) performance = "우수";
    else if (expectedEngagement > 3.5) performance = "양호";
    else performance = "보통";
    
    timeSlots.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      hour,
      expectedViews,
      expectedEngagement: parseFloat(expectedEngagement.toFixed(1)),
      performance
    });
  }
  
  return timeSlots;
};

export const TimePerformancePredictor = ({ cafeName }: TimePerformancePredictorProps) => {
  const timeData = generateTimeData();
  const topSlots = [...timeData]
    .sort((a, b) => b.expectedEngagement - a.expectedEngagement)
    .slice(0, 5);

  const performanceColor = {
    "최고": "bg-amber-500",
    "우수": "bg-emerald-500",
    "양호": "bg-blue-500",
    "보통": "bg-slate-400"
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          시간대별 성과 예측
        </CardTitle>
        <CardDescription>
          {cafeName ? `${cafeName}의 ` : ''}24시간 활동 패턴 기반 예측
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 시간대별 참여율 차트 */}
        <div>
          <h4 className="text-sm font-semibold mb-3">시간대별 예상 참여율</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                interval={2}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="expectedEngagement" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={false}
                name="참여율 (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 시간대별 예상 조회수 차트 */}
        <div>
          <h4 className="text-sm font-semibold mb-3">시간대별 예상 조회수</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                interval={2}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar 
                dataKey="expectedViews" 
                fill="hsl(var(--primary))"
                name="조회수"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TOP 5 최적 시간대 */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1 text-accent" />
            추천 포스팅 시간대 TOP 5
          </h4>
          <div className="space-y-2">
            {topSlots.map((slot, idx) => (
              <div 
                key={slot.hour}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <Badge className="w-8 h-8 flex items-center justify-center bg-primary">
                    {idx + 1}
                  </Badge>
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="font-bold">{slot.time}</span>
                      <Badge className={performanceColor[slot.performance]}>
                        {slot.performance}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {slot.expectedViews}회
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {slot.expectedEngagement}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 시간대별 추천 사항 */}
        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
          <h4 className="text-sm font-semibold mb-2">💡 포스팅 전략 제안</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• <strong>오전 10-11시</strong>: 주부들의 아침 일과 후 활동 시간</li>
            <li>• <strong>오후 2-3시</strong>: 점심 후 휴식 시간대, 높은 참여율</li>
            <li>• <strong>저녁 8-10시</strong>: 가족 저녁 식사 후 최고 피크 타임</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
