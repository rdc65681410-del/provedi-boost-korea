import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderData, cartItems } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Processing order:', orderData);

    // 1. 주문 생성
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        customer_company: orderData.customerCompany || null,
        product_url: orderData.productUrl,
        product_name: orderData.productName,
        total_amount: orderData.totalAmount,
        discount_amount: orderData.discountAmount,
        final_amount: orderData.finalAmount,
        status: 'processing'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error(`주문 생성 실패: ${orderError.message}`);
    }

    console.log('Order created:', order.id);

    // 2. 주문 아이템 생성
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      channel_name: item.channelName,
      content_type: item.contentType,
      post_count: item.postCount,
      price_per_post: item.pricePerPost,
      total_price: item.totalPrice
    }));

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      throw new Error(`주문 항목 생성 실패: ${itemsError.message}`);
    }

    console.log('Order items created:', items.length);

    // 3. AI를 사용해 각 아이템에 대한 콘텐츠 생성
    for (const item of items) {
      console.log(`Generating content for item ${item.id}:`, item.channel_name, item.content_type);
      
      // 콘텐츠 타입에 따른 프롬프트 생성
      const contentTypePrompt = {
        '후기형': '상품 사용 후기 형식으로 작성해주세요. 실제 사용 경험을 바탕으로 장점과 만족도를 자연스럽게 표현하세요.',
        '질문형': '상품에 대한 궁금증을 질문 형식으로 작성해주세요. 다른 사용자들의 의견을 구하는 자연스러운 톤으로 작성하세요.',
        '핫딜형': '상품의 특가나 프로모션 정보를 알리는 형식으로 작성해주세요. 혜택과 할인 정보를 강조하세요.'
      };

      const prompt = `
맘카페 "${item.channel_name}"에 올릴 ${item.content_type} 게시글을 ${item.post_count}개 생성해주세요.

상품 정보:
- 상품명: ${orderData.productName}
- 상품 URL: ${orderData.productUrl}

작성 가이드:
${contentTypePrompt[item.content_type as keyof typeof contentTypePrompt]}

각 게시글은 JSON 배열 형식으로 다음과 같이 작성해주세요:
[
  {
    "title": "게시글 제목",
    "content": "게시글 본문 (자연스럽고 진솔한 톤으로)",
    "tags": ["태그1", "태그2", "태그3"]
  }
]

중요: 
- 각 게시글은 서로 다른 내용으로 작성
- 맘카페 커뮤니티 톤에 맞게 자연스럽게
- 광고성 표현 최소화
- 실제 후기처럼 작성
`;

      try {
        // AI 콘텐츠 생성
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'user', content: prompt }
            ],
          }),
        });

        if (!aiResponse.ok) {
          console.error('AI response error:', aiResponse.status, await aiResponse.text());
          throw new Error('AI 콘텐츠 생성 실패');
        }

        const aiData = await aiResponse.json();
        const generatedText = aiData.choices[0].message.content;
        
        console.log('AI generated content:', generatedText.substring(0, 200));

        // JSON 파싱
        let posts = [];
        try {
          // JSON 추출 (마크다운 코드 블록 제거)
          const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            posts = JSON.parse(jsonMatch[0]);
          } else {
            posts = JSON.parse(generatedText);
          }
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          // 파싱 실패 시 기본 콘텐츠 생성
          posts = Array.from({ length: item.post_count }, (_, i) => ({
            title: `${orderData.productName} ${item.content_type} ${i + 1}`,
            content: `AI 생성 콘텐츠를 확인해주세요.\n\n원본 응답:\n${generatedText}`,
            tags: ['맘카페', '추천', '육아']
          }));
        }

        // 최적 시간 계산 (오전 10시, 오후 2시, 저녁 8시 등 분산)
        const optimalTimes = ['10:00', '11:00', '14:00', '15:00', '20:00', '21:00'];
        
        // 생성된 콘텐츠를 DB에 저장
        const contentsToInsert = posts.slice(0, item.post_count).map((post: any, index: number) => {
          const scheduledDate = new Date();
          scheduledDate.setDate(scheduledDate.getDate() + Math.floor(index / 2)); // 2개씩 같은 날
          
          return {
            order_item_id: item.id,
            channel_name: item.channel_name,
            content_type: item.content_type,
            title: post.title,
            content: post.content,
            tags: post.tags || [],
            scheduled_date: scheduledDate.toISOString().split('T')[0],
            scheduled_time: optimalTimes[index % optimalTimes.length],
            status: 'pending'
          };
        });

        const { error: contentsError } = await supabase
          .from('generated_contents')
          .insert(contentsToInsert);

        if (contentsError) {
          console.error('Contents insertion error:', contentsError);
          throw new Error(`콘텐츠 저장 실패: ${contentsError.message}`);
        }

        console.log(`Generated ${contentsToInsert.length} contents for item ${item.id}`);
      } catch (error) {
        console.error(`Error generating content for item ${item.id}:`, error);
        // 에러 발생 시에도 기본 콘텐츠 생성
        const fallbackContent = [{
          order_item_id: item.id,
          channel_name: item.channel_name,
          content_type: item.content_type,
          title: `${orderData.productName} - ${item.content_type}`,
          content: `[관리자 확인 필요] AI 콘텐츠 생성 중 오류가 발생했습니다.\n상품: ${orderData.productName}\n채널: ${item.channel_name}`,
          tags: ['맘카페', '육아'],
          scheduled_date: new Date().toISOString().split('T')[0],
          scheduled_time: '10:00',
          status: 'pending'
        }];

        await supabase.from('generated_contents').insert(fallbackContent);
      }
    }

    // 4. 주문 상태 업데이트
    await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', order.id);

    console.log('Order processing completed:', order.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: order.id,
        message: '주문이 완료되었습니다. 콘텐츠가 자동 생성되었습니다.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Error in process-order function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || '주문 처리 중 오류가 발생했습니다.' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});