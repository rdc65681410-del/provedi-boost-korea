import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { performanceData, channelData, keywordData } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // AI에게 데이터 분석을 요청
    const prompt = `다음 맘카페 마케팅 성과 데이터를 분석하고 인사이트를 제공해주세요:

전체 성과:
- 총 캠페인: ${performanceData.totalCampaigns}개
- 총 조회수: ${performanceData.totalViews}
- 평균 참여율: ${performanceData.engagementRate}%
- 총 반응수: ${performanceData.totalReactions}

채널별 성과 (상위 3개):
${channelData.map((ch: any, i: number) => `${i + 1}. ${ch.name}: 조회수 ${ch.views}, 참여 ${ch.engagement}, 댓글 ${ch.comments}`).join('\n')}

주요 키워드 성과:
${keywordData.map((kw: any) => `- ${kw.keyword}: 노출 ${kw.exposures}회, 평균 참여 ${kw.avgEngagement}%`).join('\n')}

다음 형식으로 JSON을 반환해주세요:
{
  "summary": "전체 성과 요약 (2-3문장)",
  "topInsights": ["인사이트 1", "인사이트 2", "인사이트 3"],
  "improvements": ["개선 제안 1", "개선 제안 2"],
  "nextActions": ["다음 액션 1", "다음 액션 2", "다음 액션 3"]
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: '당신은 맘카페 마케팅 전문가입니다. 데이터를 분석하고 실용적인 인사이트를 제공합니다. 반드시 JSON 형식으로만 응답하세요.' 
          },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const insights = JSON.parse(aiData.choices[0].message.content);

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate insights';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
