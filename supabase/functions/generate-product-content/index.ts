import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productInfo, contentType } = await req.json();
    
    if (!productInfo) {
      return new Response(
        JSON.stringify({ error: "상품 정보가 필요합니다" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("상품 콘텐츠 생성 요청:", { productInfo, contentType });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY가 설정되지 않았습니다");
    }

    let prompt = "";
    
    if (contentType === "naming") {
      // 상품명/옵션명 추천
      prompt = `
당신은 네이버 쇼핑 마케팅 전문가입니다. 다음 상품 정보를 분석하여 최적의 상품명과 옵션명을 추천하세요.

상품 정보: ${productInfo}

다음 형식의 JSON으로 반환하세요:
{
  "recommendedKeywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
  "originalProductName": "원본 상품명 요약",
  "suggestedNames": [
    "추천 상품명 1",
    "추천 상품명 2",
    "추천 상품명 3"
  ],
  "categories": ["카테고리1", "카테고리2"],
  "purchaseTags": ["태그1", "태그2", "태그3"]
}

JSON만 반환하고 다른 텍스트는 포함하지 마세요.`;
    } else {
      // 후기형, 질문형, 핫딜형 문구 생성
      const typeMap: Record<string, string> = {
        review: "후기형",
        question: "질문형", 
        hotdeal: "핫딜형"
      };
      
      const contentTypeName = typeMap[contentType] || "후기형";
      
      prompt = `
당신은 네이버 맘카페 마케팅 전문가입니다. 다음 상품에 대한 ${contentTypeName} 게시글을 작성하세요.

상품 정보: ${productInfo}

${contentType === "review" ? `
후기형 게시글 작성 가이드:
- 실제 사용 경험처럼 자연스럽게
- 장점 3-4가지 구체적으로
- 약간의 단점도 언급 (신뢰도 UP)
- 맘카페 톤앤매너 (이모티콘 적절히)
- 500자 내외
` : contentType === "question" ? `
질문형 게시글 작성 가이드:
- 자연스러운 고민 상황 제시
- 다른 맘들의 경험 물어보기
- 여러 제품 비교하는 척
- 자연스럽게 해당 제품 언급
- 300자 내외
` : `
핫딜형 게시글 작성 가이드:
- 할인 정보 강조
- 긴급성 부여 (오늘만, 한정수량 등)
- 가격 비교 정보
- 구매 링크 안내
- 간결하게 200자 내외
`}

다음 형식의 JSON으로 반환하세요:
{
  "title": "게시글 제목",
  "content": "게시글 본문",
  "tags": ["태그1", "태그2", "태그3"]
}

JSON만 반환하고 다른 텍스트는 포함하지 마세요.`;
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "당신은 네이버 쇼핑과 맘카페 마케팅 전문가입니다. 항상 JSON 형식으로만 응답하세요."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI 크레딧이 부족합니다. 워크스페이스에 크레딧을 추가해주세요." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI 게이트웨이 오류:", aiResponse.status, errorText);
      throw new Error("AI 생성에 실패했습니다");
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    console.log("AI 응답:", aiContent);

    // JSON 파싱
    let result;
    try {
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : aiContent;
      result = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError);
      throw new Error("AI 응답을 처리하는데 실패했습니다");
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("오류 발생:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
