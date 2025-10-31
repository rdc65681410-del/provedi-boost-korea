import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LinkIcon, 
  Loader2, 
  Copy, 
  Download,
  Sparkles,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ContentGenerate = () => {
  const [productUrl, setProductUrl] = useState("");
  const [selectedType, setSelectedType] = useState<"review" | "question" | "hotdeal">("review");
  const [cafeName, setCafeName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const contentTypes = [
    {
      id: "review" as const,
      name: "후기형",
      description: "실제 사용 경험을 바탕으로 한 진솔한 후기",
      icon: "✨",
      color: "bg-blue-500",
    },
    {
      id: "question" as const,
      name: "질문형",
      description: "궁금한 점을 자연스럽게 묻는 질문 포스팅",
      icon: "❓",
      color: "bg-purple-500",
    },
    {
      id: "hotdeal" as const,
      name: "핫딜형",
      description: "할인 정보를 간결하게 전달하는 포스팅",
      icon: "🔥",
      color: "bg-orange-500",
    },
  ];

  const handleGenerate = async () => {
    if (!productUrl) {
      toast.error("상품 URL을 입력해주세요");
      return;
    }

    setIsGenerating(true);
    setGeneratedContent("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: {
          productUrl,
          contentType: selectedType,
          cafeName: cafeName || "맘카페",
        },
      });

      if (error) throw error;

      if (data?.content) {
        setGeneratedContent(data.content);
        toast.success("콘텐츠가 생성되었습니다!");
      } else {
        throw new Error("콘텐츠가 생성되지 않았습니다.");
      }
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast.error(error.message || "콘텐츠 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("클립보드에 복사되었습니다!");
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contentTypes.find(t => t.id === selectedType)?.name}_콘텐츠.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("다운로드가 시작되었습니다!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">AI 콘텐츠 생성</h1>
        <p className="text-muted-foreground">
          상품 링크를 입력하면 맘카페에 최적화된 포스팅을 AI가 자동으로 작성합니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 입력 영역 */}
        <div className="space-y-6">
          {/* 상품 URL 입력 */}
          <Card>
            <CardHeader>
              <CardTitle>상품 정보</CardTitle>
              <CardDescription>포스팅할 상품의 URL을 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">상품 URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://smartstore.naver.com/..."
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cafe">카페명 (선택)</Label>
                <Input
                  id="cafe"
                  placeholder="예: 강남맘 육아정보"
                  value={cafeName}
                  onChange={(e) => setCafeName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 콘텐츠 타입 선택 */}
          <Card>
            <CardHeader>
              <CardTitle>콘텐츠 타입 선택</CardTitle>
              <CardDescription>어떤 스타일의 포스팅을 원하시나요?</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  {contentTypes.map((type) => (
                    <TabsTrigger key={type.id} value={type.id}>
                      <span className="mr-1">{type.icon}</span>
                      {type.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {contentTypes.map((type) => (
                  <TabsContent key={type.id} value={type.id} className="mt-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center text-white text-xl flex-shrink-0`}>
                          {type.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{type.name}</h4>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !productUrl}
                className="w-full mt-4"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    AI가 콘텐츠를 생성중입니다...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    AI 콘텐츠 생성하기
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 결과 영역 */}
        <Card className="lg:sticky lg:top-6 h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>생성된 콘텐츠</CardTitle>
                <CardDescription>AI가 작성한 포스팅을 확인하고 수정하세요</CardDescription>
              </div>
              {generatedContent && (
                <Badge variant="secondary" className="ml-2">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  완료
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedContent ? (
              <>
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="min-h-[400px] font-normal"
                  placeholder="생성된 콘텐츠가 여기에 표시됩니다..."
                />

                <div className="flex gap-2">
                  <Button onClick={handleCopy} variant="outline" className="flex-1">
                    <Copy className="mr-2 h-4 w-4" />
                    복사
                  </Button>
                  <Button onClick={handleDownload} variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    다운로드
                  </Button>
                  <Button onClick={handleGenerate} variant="outline" disabled={isGenerating}>
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">다음 단계</p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      📅 발행 예약하기
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      🎯 다른 카페에도 적용
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <Sparkles className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  AI 콘텐츠를 생성해보세요
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  상품 URL과 콘텐츠 타입을 선택한 후 생성 버튼을 클릭하세요.
                  AI가 맘카페에 최적화된 포스팅을 자동으로 작성합니다.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 사용 팁 */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <CardTitle>💡 콘텐츠 생성 팁</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">✨ 후기형</h4>
              <p className="text-muted-foreground">
                실제 사용 경험처럼 진솔하게 작성됩니다. 신뢰도가 높은 콘텐츠입니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">❓ 질문형</h4>
              <p className="text-muted-foreground">
                자연스러운 대화를 유도합니다. 댓글 참여율이 높습니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🔥 핫딜형</h4>
              <p className="text-muted-foreground">
                할인 정보를 간결하게 전달합니다. 빠른 전환율을 기대할 수 있습니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentGenerate;
