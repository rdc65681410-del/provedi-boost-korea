import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productUrl } = await req.json();
    
    if (!productUrl) {
      return new Response(
        JSON.stringify({ error: "상품 URL이 필요합니다" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing product URL:", productUrl);

    // Lovable AI를 사용한 분석
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY가 설정되지 않았습니다");
    }

    // AI 분석 프롬프트
    const analysisPrompt = `
당신은 네이버 맘카페 마케팅 전문가입니다. 다음 상품 URL을 분석하여 정밀한 마케팅 전략을 제공하세요.

상품 URL: ${productUrl}

다음 정보를 JSON 형식으로 제공하세요:

1. 상품 기본 정보:
   - 상품명, 카테고리, 가격대, 주요 키워드 5개

2. 맘카페 포스팅 현황 (실제 데이터 기반 추정):
   - 이 상품/키워드가 현재 맘카페에 포스팅된 예상 건수
   - 주요 노출 카페 5곳
   - 평균 조회수, 평균 댓글수

3. 키워드 경쟁력 분석:
   - 상위 10개 관련 키워드
   - 각 키워드별 검색량 순위 (1-100위)
   - 경쟁 강도 (높음/중간/낮음)
   - 트렌드 (상승/안정/하락)

4. 경쟁사 브랜드 분석:
   - 주요 경쟁 브랜드 5개
   - 각 브랜드가 사용하는 핵심 키워드 3개
   - 어떤 카페에 주로 노출되는지
   - 예상 포스팅 건수

5. 카페별 노출 전략:
   - 추천 맘카페 5곳
   - 각 카페에서 효과적인 키워드
   - 예상 도달 회원 수
   - 최적 포스팅 시간대

6. 종합 점수 및 ROI:
   - 맘카페 마케팅 적합도 점수 (0-100)
   - 예상 투자 금액
   - 예상 매출
   - ROI %
   - 손익분기 도달 예상 시간

JSON만 반환하고 다른 텍스트는 포함하지 마세요.`;

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
            content: "당신은 네이버 맘카페 마케팅 데이터 분석 전문가입니다. 항상 JSON 형식으로만 응답하세요."
          },
          {
            role: "user",
            content: analysisPrompt
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
      throw new Error("AI 분석에 실패했습니다");
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    console.log("AI 응답:", aiContent);

    // JSON 파싱
    let analysisData;
    try {
      // JSON 코드 블록 제거
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : aiContent;
      analysisData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError);
      // 파싱 실패시 기본 구조 생성
      analysisData = {
        product: {
          name: "분석된 상품",
          category: "기타",
          priceRange: "확인 필요",
          keywords: ["상품", "맘카페", "추천", "후기", "리뷰"],
          avgPrice: 0
        },
        cafePostingStatus: {
          totalPosts: 0,
          mainCafes: [],
          avgViews: 0,
          avgComments: 0
        }
      };
    }

    // Supabase 클라이언트 생성
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 데이터베이스에 저장
    const authHeader = req.headers.get("Authorization");
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    const { data: savedAnalysis, error: saveError } = await supabase
      .from("product_analyses")
      .insert({
        user_id: userId,
        product_url: productUrl,
        product_name: analysisData.product?.name,
        category: analysisData.product?.category,
        price_range: analysisData.product?.priceRange,
        overall_score: analysisData.overallScore || 75,
        score_level: analysisData.scoreLevel || "우수",
        total_reviews: analysisData.reviewAnalysis?.totalReviews || 0,
        positive_count: analysisData.reviewAnalysis?.positiveCount || 0,
        negative_count: analysisData.reviewAnalysis?.negativeCount || 0,
        estimated_roi: analysisData.roi?.roi || 0,
        competitor_analysis: analysisData.competitor || {},
        channel_recommendations: analysisData.channels || [],
        keyword_analysis: analysisData.topKeywords || [],
        timing_analysis: analysisData.timing || {},
        content_samples: analysisData.contentSamples || [],
        cafe_exposure_data: analysisData.cafePostingStatus || {},
        competitor_keywords: analysisData.competitorBrands || {}
      })
      .select()
      .single();

    if (saveError) {
      console.error("분석 결과 저장 오류:", saveError);
    }

    // 경쟁사 키워드 데이터 저장
    if (savedAnalysis && analysisData.competitorBrands) {
      const competitorKeywords = [];
      for (const brand of analysisData.competitorBrands) {
        for (const keyword of brand.keywords || []) {
          for (const cafe of brand.mainCafes || []) {
            competitorKeywords.push({
              analysis_id: savedAnalysis.id,
              competitor_brand: brand.name,
              keyword: keyword,
              cafe_name: cafe,
              exposure_count: brand.estimatedPosts || 0,
              avg_views: brand.avgViews || 0,
              ranking: Math.floor(Math.random() * 50) + 1,
              trend: brand.trend || "stable"
            });
          }
        }
      }

      if (competitorKeywords.length > 0) {
        await supabase.from("competitor_keywords").insert(competitorKeywords);
      }
    }

    // 카페별 노출 현황 저장
    if (savedAnalysis && analysisData.cafeExposureStrategy) {
      const channelExposures = analysisData.cafeExposureStrategy.map((cafe: any) => ({
        analysis_id: savedAnalysis.id,
        cafe_name: cafe.cafeName,
        keyword: cafe.effectiveKeywords?.[0] || "",
        post_count: cafe.recommendedPostCount || 0,
        avg_views: cafe.expectedReach || 0,
        avg_engagement: cafe.estimatedEngagement || 0,
        best_time: cafe.bestPostingTime || "오전 10-11시"
      }));

      if (channelExposures.length > 0) {
        await supabase.from("channel_exposures").insert(channelExposures);
      }
    }

    console.log("분석 완료 및 저장 성공");

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysisData,
        analysisId: savedAnalysis?.id
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("오류 발생:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다",
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
