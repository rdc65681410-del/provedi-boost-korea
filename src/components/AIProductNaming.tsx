import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface NamingResult {
  recommendedKeywords: string[];
  originalProductName: string;
  suggestedNames: string[];
  categories: string[];
  purchaseTags: string[];
}

interface ContentResult {
  title: string;
  content: string;
  tags: string[];
}

export const AIProductNaming = () => {
  const [productInfo, setProductInfo] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [namingResult, setNamingResult] = useState<NamingResult | null>(null);
  const [reviewContent, setReviewContent] = useState<ContentResult | null>(null);
  const [questionContent, setQuestionContent] = useState<ContentResult | null>(null);
  const [hotdealContent, setHotdealContent] = useState<ContentResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerateNaming = async () => {
    if (!productInfo.trim()) {
      toast.error("상품 정보를 입력해주세요");
      return;
    }

    setIsGenerating(true);
    toast.info("AI가 상품명을 분석하고 있습니다...");

    try {
      const { data, error } = await supabase.functions.invoke('generate-product-content', {
        body: { 
          productInfo: productInfo.trim(),
          contentType: 'naming'
        }
      });

      if (error) throw error;

      if (data.success) {
        setNamingResult(data.data);
        toast.success("AI 추천이 완료되었습니다!");
      } else {
        throw new Error(data.error || "생성에 실패했습니다");
      }
    } catch (error: any) {
      console.error("생성 오류:", error);
      toast.error(error.message || "생성에 실패했습니다");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateContent = async (type: 'review' | 'question' | 'hotdeal') => {
    if (!productInfo.trim()) {
      toast.error("상품 정보를 먼저 입력해주세요");
      return;
    }

    setIsGenerating(true);
    const typeMap = {
      review: '후기형',
      question: '질문형',
      hotdeal: '핫딜형'
    };
    toast.info(`AI가 ${typeMap[type]} 문구를 생성하고 있습니다...`);

    try {
      const { data, error } = await supabase.functions.invoke('generate-product-content', {
        body: { 
          productInfo: productInfo.trim(),
          contentType: type
        }
      });

      if (error) throw error;

      if (data.success) {
        if (type === 'review') setReviewContent(data.data);
        else if (type === 'question') setQuestionContent(data.data);
        else setHotdealContent(data.data);
        
        toast.success(`${typeMap[type]} 문구가 생성되었습니다!`);
      } else {
        throw new Error(data.error || "생성에 실패했습니다");
      }
    } catch (error: any) {
      console.error("생성 오류:", error);
      toast.error(error.message || "생성에 실패했습니다");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success("복사되었습니다");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error("복사에 실패했습니다");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-bold">AI 상품명, 옵션명 추천</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            클릭 한번으로 AI가 상품명과 옵션을 깔끔하게 다듬어줘요.
          </p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>수집 상품</span>
              <Button 
                onClick={handleGenerateNaming}
                disabled={isGenerating}
                className="ml-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    AI 분석 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI 상품명 추천
                  </>
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              상품 정보를 입력하고 AI 상품명 추천을 받아보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productInfo">상품 정보 입력</Label>
              <Textarea
                id="productInfo"
                placeholder="예: 겨울 4족 세끼 고양이 방한 강아지용 양털 조끼"
                value={productInfo}
                onChange={(e) => setProductInfo(e.target.value)}
                className="min-h-[100px]"
                disabled={isGenerating}
              />
            </div>

            {/* 상품명 추천 결과 */}
            {namingResult && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge variant="default">추천 키워드</Badge>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {namingResult.recommendedKeywords.map((keyword, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold mb-2 text-sm text-muted-foreground">원본 상품명</h3>
                  <p className="text-sm">{namingResult.originalProductName}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Badge variant="default">상품명</Badge>
                  </h3>
                  {namingResult.suggestedNames.map((name, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-lg bg-card border hover:shadow-md transition-shadow flex items-center justify-between group"
                    >
                      <p className="flex-1">{name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(name, idx)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedIndex === idx ? (
                          <Check className="h-4 w-4 text-accent" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-semibold mb-3 text-sm">구매 카테고리</h3>
                    <div className="flex flex-wrap gap-2">
                      {namingResult.categories.map((cat, idx) => (
                        <Badge key={idx} variant="outline">{cat}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-semibold mb-3 text-sm">구매 추천 태그</h3>
                    <div className="flex flex-wrap gap-2">
                      {namingResult.purchaseTags.map((tag, idx) => (
                        <Badge key={idx} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 마케팅 문구 생성 탭 */}
            <div className="pt-6 border-t">
              <h3 className="text-xl font-bold mb-4">맘카페 마케팅 문구 생성</h3>
              <Tabs defaultValue="review" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="review">후기형</TabsTrigger>
                  <TabsTrigger value="question">질문형</TabsTrigger>
                  <TabsTrigger value="hotdeal">핫딜형</TabsTrigger>
                </TabsList>

                <TabsContent value="review" className="space-y-4">
                  <Button 
                    onClick={() => handleGenerateContent('review')}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        후기형 문구 생성
                      </>
                    )}
                  </Button>
                  {reviewContent && (
                    <Card className="animate-fade-in">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{reviewContent.title}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(`${reviewContent.title}\n\n${reviewContent.content}`, 100)}
                          >
                            {copiedIndex === 100 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap mb-4">{reviewContent.content}</p>
                        <div className="flex flex-wrap gap-2">
                          {reviewContent.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary">#{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="question" className="space-y-4">
                  <Button 
                    onClick={() => handleGenerateContent('question')}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        질문형 문구 생성
                      </>
                    )}
                  </Button>
                  {questionContent && (
                    <Card className="animate-fade-in">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{questionContent.title}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(`${questionContent.title}\n\n${questionContent.content}`, 101)}
                          >
                            {copiedIndex === 101 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap mb-4">{questionContent.content}</p>
                        <div className="flex flex-wrap gap-2">
                          {questionContent.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary">#{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="hotdeal" className="space-y-4">
                  <Button 
                    onClick={() => handleGenerateContent('hotdeal')}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        핫딜형 문구 생성
                      </>
                    )}
                  </Button>
                  {hotdealContent && (
                    <Card className="animate-fade-in">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{hotdealContent.title}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(`${hotdealContent.title}\n\n${hotdealContent.content}`, 102)}
                          >
                            {copiedIndex === 102 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap mb-4">{hotdealContent.content}</p>
                        <div className="flex flex-wrap gap-2">
                          {hotdealContent.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary">#{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
