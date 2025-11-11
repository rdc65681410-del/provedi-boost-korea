-- 상품 분석 결과 테이블
CREATE TABLE IF NOT EXISTS public.product_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  product_url TEXT NOT NULL,
  product_name TEXT,
  category TEXT,
  price_range TEXT,
  overall_score INTEGER,
  score_level TEXT,
  total_reviews INTEGER,
  positive_count INTEGER,
  negative_count INTEGER,
  estimated_roi NUMERIC,
  competitor_analysis JSONB,
  channel_recommendations JSONB,
  keyword_analysis JSONB,
  timing_analysis JSONB,
  content_samples JSONB,
  cafe_exposure_data JSONB,
  competitor_keywords JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 맘카페 채널 데이터베이스
CREATE TABLE IF NOT EXISTS public.mom_cafe_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  members INTEGER,
  activity_level TEXT,
  category TEXT,
  avg_views INTEGER,
  avg_engagement_rate NUMERIC,
  success_rate NUMERIC,
  pricing JSONB,
  best_content_types TEXT[],
  keywords TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 경쟁사 키워드 노출 현황
CREATE TABLE IF NOT EXISTS public.competitor_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES public.product_analyses(id),
  competitor_brand TEXT,
  keyword TEXT,
  cafe_name TEXT,
  exposure_count INTEGER,
  avg_views INTEGER,
  ranking INTEGER,
  trend TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 카페별 노출 현황
CREATE TABLE IF NOT EXISTS public.channel_exposures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES public.product_analyses(id),
  cafe_name TEXT,
  keyword TEXT,
  post_count INTEGER,
  avg_views INTEGER,
  avg_engagement NUMERIC,
  best_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE public.product_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mom_cafe_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitor_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_exposures ENABLE ROW LEVEL SECURITY;

-- product_analyses 정책
CREATE POLICY "Users can view their own analyses"
  ON public.product_analyses FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own analyses"
  ON public.product_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own analyses"
  ON public.product_analyses FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- mom_cafe_channels 정책 (모든 사용자가 조회 가능)
CREATE POLICY "Anyone can view channels"
  ON public.mom_cafe_channels FOR SELECT
  USING (true);

-- competitor_keywords 정책
CREATE POLICY "Users can view competitor keywords"
  ON public.competitor_keywords FOR SELECT
  USING (true);

CREATE POLICY "System can insert competitor keywords"
  ON public.competitor_keywords FOR INSERT
  WITH CHECK (true);

-- channel_exposures 정책
CREATE POLICY "Users can view channel exposures"
  ON public.channel_exposures FOR SELECT
  USING (true);

CREATE POLICY "System can insert channel exposures"
  ON public.channel_exposures FOR INSERT
  WITH CHECK (true);

-- 업데이트 트리거
CREATE TRIGGER update_product_analyses_updated_at
  BEFORE UPDATE ON public.product_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mom_cafe_channels_updated_at
  BEFORE UPDATE ON public.mom_cafe_channels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 초기 맘카페 데이터 삽입
INSERT INTO public.mom_cafe_channels (name, members, activity_level, category, avg_views, avg_engagement_rate, success_rate, pricing, best_content_types, keywords) VALUES
('맘스홀릭베이비', 48520, '매우 높음', '육아/인테리어', 3200, 5.8, 87, '{"review": 150000, "question": 120000, "hotdeal": 100000}'::jsonb, ARRAY['후기형', '질문형'], ARRAY['육아', '인테리어', '북유럽', '수납', '아이방']),
('베베하우스', 32100, '높음', '육아/가구', 2800, 5.2, 82, '{"review": 140000, "question": 110000, "hotdeal": 95000}'::jsonb, ARRAY['질문형', '후기형'], ARRAY['가구', '실용', '가성비', '추천']),
('우리아이맘', 28400, '높음', '육아/쇼핑', 2500, 4.9, 79, '{"review": 130000, "question": 100000, "hotdeal": 85000}'::jsonb, ARRAY['핫딜형', '후기형'], ARRAY['할인', '특가', '가성비', '육아템']),
('송파맘카페', 25100, '높음', '지역/육아', 2200, 4.5, 75, '{"review": 120000, "question": 95000, "hotdeal": 80000}'::jsonb, ARRAY['후기형', '질문형'], ARRAY['송파', '지역맘', '실사용', '후기']),
('대치동맘모임', 22800, '보통', '교육/육아', 2000, 4.2, 72, '{"review": 115000, "question": 90000, "hotdeal": 75000}'::jsonb, ARRAY['질문형', '정보형'], ARRAY['교육', '학습', '아이방', '공부방']);