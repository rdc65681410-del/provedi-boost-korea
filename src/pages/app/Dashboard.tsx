import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, FileText, Clock, ArrowUpRight } from "lucide-react";
import dashboardImage from "@/assets/dashboard-preview.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";

const statsCards = [
  { title: "활성 캠페인", value: "12", change: "+3", icon: TrendingUp },
  { title: "추천 채널", value: "48", change: "+8", icon: Target },
  { title: "생성된 콘텐츠", value: "156", change: "+24", icon: FileText },
  { title: "예약 발행", value: "32", change: "+12", icon: Clock },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", session.user.id)
        .single();
      
      if (profile) {
        setUserName(profile.name);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {userName ? `${userName}님, 환영합니다!` : "대시보드"}
        </h1>
        <p className="text-muted-foreground">맘카페 마케팅 성과를 한눈에 확인하세요</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-accent flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.change} 이번 주
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Campaign Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 캠페인 성과</CardTitle>
            <CardDescription>지난 30일간의 성과 요약</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img 
                src={dashboardImage} 
                alt="Campaign Performance" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">총 노출</span>
                <span className="font-semibold">124,580</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">클릭률</span>
                <span className="font-semibold">3.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">전환율</span>
                <span className="font-semibold">1.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>빠른 시작</CardTitle>
            <CardDescription>새로운 캠페인을 시작해보세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/app/analyze">
              <Button className="w-full justify-start" variant="outline" size="lg">
                <FileText className="h-5 w-5 mr-3" />
                상품 링크 분석하기
              </Button>
            </Link>
            <Button className="w-full justify-start" variant="outline" size="lg">
              <Target className="h-5 w-5 mr-3" />
              채널 추천 받기
            </Button>
            <Button className="w-full justify-start" variant="outline" size="lg">
              <FileText className="h-5 w-5 mr-3" />
              AI 콘텐츠 생성
            </Button>
            <Button className="w-full justify-start" variant="hero" size="lg">
              <TrendingUp className="h-5 w-5 mr-3" />
              새 캠페인 시작
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>최근 활동</CardTitle>
          <CardDescription>최근 7일간의 활동 내역</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "새 콘텐츠 생성", channel: "맘스홀릭베이비", time: "2시간 전" },
              { action: "채널 추천 완료", channel: "베베하우스", time: "5시간 전" },
              { action: "캠페인 발행", channel: "우리아이맘", time: "1일 전" },
              { action: "성과 리포트 생성", channel: "전체 캠페인", time: "2일 전" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.channel}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
