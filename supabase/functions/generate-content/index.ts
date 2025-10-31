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
    const { productUrl, contentType, cafeName } = await req.json();
    
    if (!productUrl || !contentType) {
      return new Response(
        JSON.stringify({ error: "상품 URL과 콘텐츠 타입이 필요합니다." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // 콘텐츠 타입별 프롬프트
    const prompts = {
      review: `당신은 맘카페의 실제 사용자입니다. 다음 상품에 대한 진솔하고 상세한 후기형 포스팅을 작성해주세요.

상품 URL: ${productUrl}
카페명: ${cafeName || "맘카페"}

작성 가이드:
- 실제 구매 후 사용한 경험처럼 자연스럽게 작성
- 장점과 단점을 균형있게 서술
- 구체적인 사용 상황과 느낌 포함
- 아이 반응이나 가족 반응 포함
- 2-3문단으로 자연스러운 대화체
- 과도한 홍보 느낌 없이 진정성 있게
- 이모티콘 적절히 사용

포스팅을 작성해주세요:`,

      question: `당신은 맘카페에서 상품에 대해 궁금한 점을 질문하는 회원입니다. 다음 상품에 대한 자연스러운 질문형 포스팅을 작성해주세요.

상품 URL: ${productUrl}
카페명: ${cafeName || "맘카페"}

작성 가이드:
- 실제로 구매를 고민하는 사람의 진솔한 질문
- 구체적인 상황 설명 포함 (예: 아이 나이, 용도 등)
- 2-3가지 궁금한 점 언급
- 사용해보신 분들의 의견을 구하는 톤
- 자연스럽고 친근한 대화체
- 이모티콘 적절히 사용

질문 포스팅을 작성해주세요:`,

      hotdeal: `당신은 맘카페에서 좋은 할인 정보를 공유하는 회원입니다. 다음 상품에 대한 핫딜형 포스팅을 작성해주세요.

상품 URL: ${productUrl}
카페명: ${cafeName || "맘카페"}

작성 가이드:
- 할인 정보를 간단명료하게 전달
- 가격 정보, 할인율 강조
- 빠르게 품절될 수 있다는 긴박감
- 실용적인 정보 위주
- 짧고 임팩트 있게
- 이모티콘으로 시선 집중
- 링크 클릭 유도

핫딜 포스팅을 작성해주세요:`,
    };

    const systemPrompt = prompts[contentType as keyof typeof prompts] || prompts.review;

    console.log("Calling Lovable AI for content generation...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: systemPrompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "사용량 한도 초과. 잠시 후 다시 시도해주세요." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "크레딧이 부족합니다. 워크스페이스에 크레딧을 추가해주세요." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI 콘텐츠 생성 중 오류가 발생했습니다.");
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content;

    if (!generatedContent) {
      throw new Error("콘텐츠가 생성되지 않았습니다.");
    }

    console.log("Content generated successfully");

    return new Response(
      JSON.stringify({ content: generatedContent }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-content function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
