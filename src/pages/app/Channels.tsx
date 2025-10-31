import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Users, Activity, Target, DollarSign, Shield, AlertCircle, Flame, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type CafeGrade = "S" | "A" | "B" | "C" | "D";
type AdPolicy = "허용" | "제한적" | "불가";
type Difficulty = "쉬움" | "보통" | "어려움";
type Category = "전체" | "육아용품" | "임신/출산" | "지역맘" | "리뷰전문";

interface CafeData {
  id: string;
  name: string;
  grade: CafeGrade;
  members: number;
  memberGrowth: number;
  dailyPosts: number;
  dailyComments: number;
  targetMatch: number;
  estimatedCost: string;
  adPolicy: AdPolicy;
  difficulty: Difficulty;
  expectedViews: string;
  expectedEngagement: number;
  category: Category;
  isHot?: boolean;
  isRising?: boolean;
}

const trendingKeywords = [
  { keyword: "아기띠", count: 1250, trend: "up" },
  { keyword: "육아용품", count: 980, trend: "up" },
  { keyword: "기저귀", count: 850, trend: "down" },
  { keyword: "유아식", count: 720, trend: "up" },
  { keyword: "장난감", count: 650, trend: "up" },
];

const mockCafes: CafeData[] = [
  {
    id: "1",
    name: "맘스홀릭 베이비",
    grade: "S",
    members: 850000,
    memberGrowth: 15.2,
    dailyPosts: 2500,
    dailyComments: 8500,
    targetMatch: 95,
    estimatedCost: "50-100만원",
    adPolicy: "제한적",
    difficulty: "어려움",
    expectedViews: "50,000-80,000",
    expectedEngagement: 12.5,
    category: "육아용품",
    isHot: true,
  },
  {
    id: "2",
    name: "육아의 모든것",
    grade: "S",
    members: 720000,
    memberGrowth: 22.8,
    dailyPosts: 2200,
    dailyComments: 7800,
    targetMatch: 92,
    estimatedCost: "40-80만원",
    adPolicy: "허용",
    difficulty: "보통",
    expectedViews: "40,000-70,000",
    expectedEngagement: 11.8,
    category: "육아용품",
    isHot: true,
    isRising: true,
  },
  {
    id: "3",
    name: "베이비트리",
    grade: "A",
    members: 580000,
    memberGrowth: 8.5,
    dailyPosts: 1800,
    dailyComments: 6200,
    targetMatch: 88,
    estimatedCost: "30-60만원",
    adPolicy: "허용",
    difficulty: "쉬움",
    expectedViews: "30,000-55,000",
    expectedEngagement: 10.2,
    category: "임신/출산",
  },
  {
    id: "4",
    name: "강남맘 커뮤니티",
    grade: "A",
    members: 450000,
    memberGrowth: 18.3,
    dailyPosts: 1500,
    dailyComments: 5500,
    targetMatch: 85,
    estimatedCost: "35-70만원",
    adPolicy: "제한적",
    difficulty: "어려움",
    expectedViews: "25,000-50,000",
    expectedEngagement: 9.8,
    category: "지역맘",
    isRising: true,
  },
  {
    id: "5",
    name: "육아리뷰왕",
    grade: "A",
    members: 380000,
    memberGrowth: 25.6,
    dailyPosts: 1200,
    dailyComments: 4800,
    targetMatch: 90,
    estimatedCost: "25-50만원",
    adPolicy: "허용",
    difficulty: "보통",
    expectedViews: "20,000-45,000",
    expectedEngagement: 11.2,
    category: "리뷰전문",
    isHot: true,
    isRising: true,
  },
  {
    id: "6",
    name: "워킹맘 스토리",
    grade: "B",
    members: 320000,
    memberGrowth: 12.4,
    dailyPosts: 900,
    dailyComments: 3500,
    targetMatch: 78,
    estimatedCost: "20-40만원",
    adPolicy: "허용",
    difficulty: "쉬움",
    expectedViews: "15,000-35,000",
    expectedEngagement: 8.5,
    category: "육아용품",
  },
  {
    id: "7",
    name: "서울맘 모임",
    grade: "B",
    members: 280000,
    memberGrowth: 9.2,
    dailyPosts: 850,
    dailyComments: 3200,
    targetMatch: 75,
    estimatedCost: "18-35만원",
    adPolicy: "제한적",
    difficulty: "보통",
    expectedViews: "12,000-30,000",
    expectedEngagement: 7.8,
    category: "지역맘",
  },
  {
    id: "8",
    name: "초보맘 가이드",
    grade: "B",
    members: 250000,
    memberGrowth: 20.1,
    dailyPosts: 750,
    dailyComments: 2800,
    targetMatch: 82,
    estimatedCost: "15-30만원",
    adPolicy: "허용",
    difficulty: "쉬움",
    expectedViews: "10,000-25,000",
    expectedEngagement: 8.9,
    category: "임신/출산",
    isRising: true,
  },
  {
    id: "9",
    name: "부산맘 네트워크",
    grade: "C",
    members: 180000,
    memberGrowth: 6.5,
    dailyPosts: 550,
    dailyComments: 2000,
    targetMatch: 68,
    estimatedCost: "10-20만원",
    adPolicy: "허용",
    difficulty: "쉬움",
    expectedViews: "8,000-18,000",
    expectedEngagement: 6.5,
    category: "지역맘",
  },
  {
    id: "10",
    name: "육아꿀팁 공유",
    grade: "C",
    members: 150000,
    memberGrowth: 15.7,
    dailyPosts: 480,
    dailyComments: 1800,
    targetMatch: 72,
    estimatedCost: "8-15만원",
    adPolicy: "허용",
    difficulty: "보통",
    expectedViews: "6,000-15,000",
    expectedEngagement: 7.2,
    category: "육아용품",
  },
];

const Channels = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");
  const [selectedGrade, setSelectedGrade] = useState<string>("전체");
  const [sortBy, setSortBy] = useState<string>("members");
  const [searchQuery, setSearchQuery] = useState("");

  const getGradeColor = (grade: CafeGrade) => {
    switch (grade) {
      case "S": return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
      case "A": return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "B": return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      case "C": return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
      case "D": return "bg-gradient-to-r from-gray-300 to-gray-400 text-white";
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "쉬움": return "text-green-600";
      case "보통": return "text-yellow-600";
      case "어려움": return "text-red-600";
    }
  };

  const getAdPolicyColor = (policy: AdPolicy) => {
    switch (policy) {
      case "허용": return "text-green-600";
      case "제한적": return "text-yellow-600";
      case "불가": return "text-red-600";
    }
  };

  const filteredCafes = mockCafes
    .filter(cafe => {
      const matchesCategory = selectedCategory === "전체" || cafe.category === selectedCategory;
      const matchesGrade = selectedGrade === "전체" || cafe.grade === selectedGrade;
      const matchesSearch = cafe.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesGrade && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "members": return b.members - a.members;
        case "growth": return b.memberGrowth - a.memberGrowth;
        case "match": return b.targetMatch - a.targetMatch;
        case "activity": return (b.dailyPosts + b.dailyComments) - (a.dailyPosts + a.dailyComments);
        default: return 0;
      }
    });

  const hotCafes = mockCafes.filter(cafe => cafe.isHot).slice(0, 5);
  const risingCafes = mockCafes.filter(cafe => cafe.isRising).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            맘카페 채널 추천
          </h1>
          <p className="text-muted-foreground">
            실시간 데이터 기반 최적의 맘카페를 찾아보세요
          </p>
        </div>

        {/* Trending Keywords */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              실시간 트렌딩 키워드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {trendingKeywords.map((item, idx) => (
                <Badge key={idx} variant="secondary" className="text-base py-2 px-4">
                  <span className="font-semibold">{item.keyword}</span>
                  <span className="mx-2 text-muted-foreground">|</span>
                  <span className="text-muted-foreground">{item.count.toLocaleString()}</span>
                  {item.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 ml-2 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 ml-2 text-red-500" />
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hot & Rising Cafes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hot Cafes */}
          <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                🔥 실시간 인기 카페 TOP 5
              </CardTitle>
              <CardDescription>지금 가장 활발한 커뮤니티</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {hotCafes.map((cafe, idx) => (
                <div key={cafe.id} className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    idx === 0 ? 'bg-yellow-500 text-white' : 
                    idx === 1 ? 'bg-gray-400 text-white' :
                    idx === 2 ? 'bg-orange-600 text-white' : 'bg-muted'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{cafe.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {cafe.members.toLocaleString()}명 • 활동도 {cafe.dailyPosts + cafe.dailyComments}
                    </div>
                  </div>
                  <Badge className={getGradeColor(cafe.grade)}>{cafe.grade}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Rising Cafes */}
          <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                📈 급상승 카페 TOP 5
              </CardTitle>
              <CardDescription>최근 30일 성장률 기준</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {risingCafes.map((cafe, idx) => (
                <div key={cafe.id} className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{cafe.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {cafe.members.toLocaleString()}명 • +{cafe.memberGrowth}% 성장
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    +{cafe.memberGrowth}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>필터 & 정렬</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">검색</label>
                <Input
                  placeholder="카페 이름 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">카테고리</label>
                <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전체">전체</SelectItem>
                    <SelectItem value="육아용품">육아용품</SelectItem>
                    <SelectItem value="임신/출산">임신/출산</SelectItem>
                    <SelectItem value="지역맘">지역맘</SelectItem>
                    <SelectItem value="리뷰전문">리뷰전문</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">등급</label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전체">전체</SelectItem>
                    <SelectItem value="S">S등급</SelectItem>
                    <SelectItem value="A">A등급</SelectItem>
                    <SelectItem value="B">B등급</SelectItem>
                    <SelectItem value="C">C등급</SelectItem>
                    <SelectItem value="D">D등급</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">정렬</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="members">회원 수</SelectItem>
                    <SelectItem value="growth">성장률</SelectItem>
                    <SelectItem value="match">적합도</SelectItem>
                    <SelectItem value="activity">활동량</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cafe List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCafes.map((cafe) => (
            <Card key={cafe.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{cafe.name}</CardTitle>
                      {cafe.isHot && <Flame className="w-5 h-5 text-orange-500" />}
                      {cafe.isRising && <TrendingUp className="w-5 h-5 text-green-500" />}
                    </div>
                    <Badge variant="outline">{cafe.category}</Badge>
                  </div>
                  <Badge className={`${getGradeColor(cafe.grade)} text-lg px-3 py-1`}>
                    {cafe.grade}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Users className="w-4 h-4" />
                      회원 수
                    </div>
                    <div className="font-semibold">{cafe.members.toLocaleString()}명</div>
                    <div className="text-sm text-green-600">+{cafe.memberGrowth}%</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Activity className="w-4 h-4" />
                      일일 활동
                    </div>
                    <div className="font-semibold">게시글 {cafe.dailyPosts}</div>
                    <div className="text-sm text-muted-foreground">댓글 {cafe.dailyComments}</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Target className="w-4 h-4" />
                      타겟 적합도
                    </div>
                    <div className="font-semibold text-primary">{cafe.targetMatch}%</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="w-4 h-4" />
                      예상 비용
                    </div>
                    <div className="font-semibold">{cafe.estimatedCost}</div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      광고 정책
                    </span>
                    <span className={`font-medium ${getAdPolicyColor(cafe.adPolicy)}`}>
                      {cafe.adPolicy}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      진입 난이도
                    </span>
                    <span className={`font-medium ${getDifficultyColor(cafe.difficulty)}`}>
                      {cafe.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">예상 조회수</span>
                    <span className="font-medium">{cafe.expectedViews}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">예상 참여율</span>
                    <span className="font-medium text-primary">{cafe.expectedEngagement}%</span>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  이 카페로 콘텐츠 생성하기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCafes.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              검색 조건에 맞는 카페가 없습니다.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Channels;