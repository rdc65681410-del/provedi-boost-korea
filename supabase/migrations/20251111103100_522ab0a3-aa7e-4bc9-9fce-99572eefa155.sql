-- mom_cafe_channels 테이블에 Realtime 활성화
ALTER TABLE public.mom_cafe_channels REPLICA IDENTITY FULL;

-- Realtime publication에 테이블 추가 (이미 추가되어 있을 수 있음)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'mom_cafe_channels'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.mom_cafe_channels;
  END IF;
END $$;