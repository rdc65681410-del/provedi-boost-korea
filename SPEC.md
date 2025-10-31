# 맘카페 마케팅 플랫폼 기능명세서

## 📋 프로젝트 개요

**프로젝트명**: 맘카페 마케팅 자동화 플랫폼  
**목적**: 맘카페를 통한 제품 마케팅 분석, 콘텐츠 생성, 캠페인 관리 자동화  
**대상 사용자**: 맘카페 마케터, 쇼핑몰 운영자, 육아 제품 판매자

---

## 🎯 핵심 기능 구조

### 1. **인증 및 사용자 관리** 
**현재 상태**: ✅ 기본 구현 완료
- Supabase Auth 연동
- 프로필 테이블 생성 (profiles)
- 로그인/회원가입 UI 구현

**추가 개발 필요**:
- [ ] 소셜 로그인 (카카오, 네이버)
- [ ] 비밀번호 재설정
- [ ] 이메일 인증 플로우
- [ ] 프로필 수정 기능
- [ ] 사용자 크레딧/포인트 관리

**RLS 정책**: 
- ✅ 사용자별 데이터 접근 제어 설정됨

---

### 2. **상품 분석 기능** (`/app/analyze`)
**현재 상태**: ⚠️ 프론트엔드 목업만 구현

**구현된 UI**:
- 상품 URL 입력
- 분석 결과 표시 (목업 데이터)
  - 제품 정보
  - 경쟁사 분석
  - ROI 예측
  - 키워드 트렌드
  - 리뷰 분석
  - 추천 채널 목록
  - 최적 발행 시간
  - 예상 성과

**개발 필요 사항**:

#### 2.1 크롤링 & 데이터 수집
- [ ] **상품 페이지 크롤링** (Edge Function)
  - 쿠팡, 11번가, 네이버 쇼핑 등 주요 쇼핑몰 파싱
  - 제품명, 가격, 이미지, 설명 추출
  - 리뷰 데이터 수집

- [ ] **맘카페 데이터 수집**
  - 네이버 카페 API 연동 또는 크롤링
  - 주요 맘카페 리스트 DB 구축
  - 카페별 회원수, 활동량 데이터

#### 2.2 AI 분석 엔진
- [ ] **Lovable AI 활용 분석**
  - 제품 카테고리 자동 분류
  - 타겟 고객 분석
  - 경쟁사 키워드 분석
  - 감성 분석 (긍정/부정 리뷰)
  - ROI 예측 모델

- [ ] **추천 알고리즘**
  - 채널 추천 점수 계산
  - 최적 발행 시간 분석
  - 콘텐츠 타입 추천

#### 2.3 데이터베이스 설계
```sql
-- 분석 이력 저장
CREATE TABLE product_analyses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  product_url TEXT,
  product_info JSONB,
  analysis_result JSONB,
  recommended_channels JSONB,
  created_at TIMESTAMP
);

-- 맘카페 채널 DB
CREATE TABLE mom_cafe_channels (
  id UUID PRIMARY KEY,
  name TEXT,
  platform TEXT, -- naver, daum
  members_count INTEGER,
  activity_level TEXT,
  category TEXT[],
  avg_cost INTEGER,
  success_rate DECIMAL
);

-- 채널 선택 및 결제
CREATE TABLE channel_selections (
  id UUID PRIMARY KEY,
  user_id UUID,
  analysis_id UUID,
  channel_id UUID,
  post_count INTEGER,
  total_price INTEGER,
  status TEXT, -- pending, paid, posting, completed
  created_at TIMESTAMP
);
```

---

### 3. **AI 콘텐츠 생성** (`/app/generate`)
**현재 상태**: ✅ 기본 구현 완료

**구현된 기능**:
- ✅ Lovable AI 연동 (Edge Function)
- ✅ 3가지 콘텐츠 타입 (후기, 질문, 핫딜)
- ✅ 콘텐츠 복사/다운로드

**개발 필요 사항**:
- [ ] **콘텐츠 저장 및 관리**
  ```sql
  CREATE TABLE generated_contents (
    id UUID PRIMARY KEY,
    user_id UUID,
    product_url TEXT,
    content_type TEXT,
    content TEXT,
    cafe_name TEXT,
    status TEXT, -- draft, published
    created_at TIMESTAMP
  );
  ```

- [ ] **콘텐츠 편집 기능**
  - 생성된 콘텐츠 수정
  - 템플릿 저장
  - 재생성 기능 개선

- [ ] **배치 생성**
  - 여러 채널용 콘텐츠 한번에 생성
  - 채널별 톤앤매너 자동 조정

- [ ] **이미지 생성 연동**
  - 상품 이미지 최적화
  - 썸네일 자동 생성

---

### 4. **캠페인 관리** (`/app/campaigns`)
**현재 상태**: ⚠️ 프론트엔드 목업만 구현

**구현된 UI**:
- 캠페인 목록 (진행중/완료)
- 캠페인 생성 폼
- 성과 지표 표시 (목업)
- 상태 관리 (시작/정지/삭제)

**개발 필요 사항**:

#### 4.1 캠페인 데이터베이스
```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY,
  user_id UUID,
  name TEXT,
  product_url TEXT,
  description TEXT,
  status TEXT, -- draft, active, paused, completed
  
  -- 목표 설정
  target_views INTEGER,
  target_engagement INTEGER,
  
  -- 예산
  budget INTEGER,
  spent INTEGER DEFAULT 0,
  
  -- 성과
  total_views INTEGER DEFAULT 0,
  total_engagement INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0,
  roi DECIMAL,
  
  -- 일정
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE campaign_posts (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns,
  channel_id UUID,
  content_id UUID,
  scheduled_at TIMESTAMP,
  published_at TIMESTAMP,
  status TEXT, -- scheduled, published, failed
  performance JSONB -- views, clicks, engagement
);
```

#### 4.2 캠페인 실행 엔진
- [ ] **자동 발행 시스템**
  - 예약 발행 기능 (Cron Jobs)
  - 맘카페 자동 포스팅 API 연동
  - 발행 실패 처리 및 재시도

- [ ] **성과 추적**
  - 조회수 수집
  - 댓글/좋아요 수집
  - 클릭률 추적 (UTM 파라미터)
  - 전환 추적 연동

- [ ] **알림 시스템**
  - 캠페인 시작/종료 알림
  - 성과 달성 알림
  - 예산 소진 알림

---

### 5. **채널 관리** (`/app/channels`)
**현재 상태**: ⚠️ 프론트엔드 목업만 구현

**구현된 UI**:
- 맘카페 채널 목록
- 채널별 성과 지표
- 즐겨찾기 기능

**개발 필요 사항**:
- [ ] **채널 DB 구축**
  - 주요 맘카페 500+ 개 데이터 수집
  - 카테고리별 분류
  - 활동량 업데이트 자동화

- [ ] **채널 분석**
  - 카페별 최적 발행 시간 분석
  - 인기 키워드 트렌드
  - 성과 통계

- [ ] **계정 연동**
  - 네이버 카페 계정 연동
  - 발행 권한 설정

---

### 6. **최적 타이밍 분석** (`/app/timing`)
**현재 상태**: ⚠️ 프론트엔드 목업만 구현

**구현된 UI**:
- 히트맵 (시간대별 활동량)
- 최적 시간 추천
- 주간 패턴 분석

**개발 필요 사항**:
- [ ] **데이터 수집 및 분석**
  - 맘카페별 시간대별 활동량 크롤링
  - 요일별 패턴 분석
  - 계절성 분석

- [ ] **AI 예측 모델**
  - 사용자별 최적 시간 예측
  - 제품 카테고리별 시간대 추천

```sql
CREATE TABLE timing_analytics (
  id UUID PRIMARY KEY,
  channel_id UUID,
  day_of_week INTEGER,
  hour INTEGER,
  activity_score DECIMAL,
  avg_engagement DECIMAL,
  updated_at TIMESTAMP
);
```

---

### 7. **리포트 및 분석** (`/app/reports`)
**현재 상태**: ⚠️ 프론트엔드 목업만 구현

**구현된 UI**:
- 전체 성과 대시보드
- 주간 트렌드 차트
- 채널별/콘텐츠별 분석
- 시간대별 인게이지먼트

**개발 필요 사항**:
- [ ] **실시간 데이터 연동**
  - 캠페인 성과 집계
  - 차트 데이터 API

- [ ] **리포트 생성**
  - PDF 리포트 자동 생성
  - 주간/월간 리포트 이메일 발송

- [ ] **비교 분석**
  - 이전 기간 대비 성과
  - 경쟁사 벤치마킹

---

### 8. **패키지 및 결제** (`/app/packages`)
**현재 상태**: ⚠️ UI만 구현, 결제 미연동

**구현된 UI**:
- 월간 구독 플랜 (스타터/프로/비즈니스)
- 일회성 크레딧 팩
- 가격 표시

**개발 필요 사항**:

#### 8.1 결제 시스템
- [ ] **PG사 연동** (우선순위 높음)
  - 토스페이먼츠 or 아임포트
  - 정기 결제 (구독)
  - 일회성 결제 (크레딧)

- [ ] **크레딧 시스템**
  ```sql
  CREATE TABLE user_credits (
    user_id UUID PRIMARY KEY,
    total_credits INTEGER DEFAULT 0,
    used_credits INTEGER DEFAULT 0,
    subscription_plan TEXT,
    subscription_status TEXT,
    subscription_start DATE,
    subscription_end DATE
  );
  
  CREATE TABLE credit_transactions (
    id UUID PRIMARY KEY,
    user_id UUID,
    type TEXT, -- purchase, usage, refund
    amount INTEGER,
    description TEXT,
    created_at TIMESTAMP
  );
  
  CREATE TABLE payment_history (
    id UUID PRIMARY KEY,
    user_id UUID,
    amount INTEGER,
    payment_method TEXT,
    status TEXT,
    pg_transaction_id TEXT,
    created_at TIMESTAMP
  );
  ```

- [ ] **구독 관리**
  - 플랜 업그레이드/다운그레이드
  - 자동 갱신
  - 해지 처리

---

### 9. **대시보드** (`/app/dashboard`)
**현재 상태**: ✅ 기본 UI 구현

**구현된 기능**:
- 통계 카드 (목업)
- 최근 활동 목록 (목업)
- 빠른 시작 버튼

**개발 필요 사항**:
- [ ] 실시간 데이터 연동
- [ ] 사용자별 맞춤 대시보드
- [ ] 알림 센터

---

## 🔧 기술 스택 및 인프라

### 현재 구성
- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Lovable Cloud)
- **AI**: Lovable AI (Gemini 2.5 Flash)
- **Auth**: Supabase Auth
- **Database**: PostgreSQL (Supabase)

### 추가 필요 기술
- **크롤링**: Cheerio, Puppeteer (Edge Functions)
- **결제**: 토스페이먼츠 SDK
- **스케줄링**: Supabase Cron Jobs
- **모니터링**: Sentry (오류 추적)
- **Analytics**: Google Analytics 4

---

## 📊 데이터베이스 전체 설계

### 핵심 테이블 목록
1. ✅ `profiles` - 사용자 프로필
2. ⬜ `user_credits` - 크레딧 관리
3. ⬜ `payment_history` - 결제 내역
4. ⬜ `product_analyses` - 상품 분석 결과
5. ⬜ `mom_cafe_channels` - 맘카페 채널 DB
6. ⬜ `channel_selections` - 채널 선택 내역
7. ⬜ `generated_contents` - 생성된 콘텐츠
8. ⬜ `campaigns` - 캠페인 관리
9. ⬜ `campaign_posts` - 캠페인 포스트
10. ⬜ `timing_analytics` - 타이밍 분석 데이터
11. ⬜ `credit_transactions` - 크레딧 거래 내역

### RLS 정책 설계
- 모든 테이블에 `user_id` 기반 RLS 적용
- 공개 데이터 (mom_cafe_channels, timing_analytics)는 읽기 전용

---

## 🔌 외부 API 연동 필요

### 1. 네이버 카페 API (우선순위: 높음)
- 카페 정보 조회
- 게시글 작성 (OAuth 필요)
- 활동 데이터 수집

### 2. 쇼핑몰 크롤링 (우선순위: 높음)
- 쿠팡 상품 정보
- 네이버 쇼핑
- 11번가

### 3. 결제 PG (우선순위: 높음)
- 토스페이먼츠 or 아임포트
- 정기결제 API
- 결제 콜백 처리

### 4. SMS/이메일 알림 (우선순위: 중간)
- SendGrid or AWS SES
- 알림톡 (카카오)

### 5. 단축 URL (우선순위: 낮음)
- bit.ly API
- UTM 파라미터 자동 생성

---

## 🚀 개발 우선순위 로드맵

### Phase 1: MVP (4-6주)
**목표**: 핵심 기능 동작하는 최소 제품

1. ✅ 사용자 인증 (완료)
2. ⬜ **결제 시스템 연동** (2주)
   - 토스페이먼츠 연동
   - 크레딧 시스템 DB
   - 구독/일회성 결제

3. ⬜ **상품 분석 기본 기능** (2주)
   - 상품 URL 크롤링 (주요 쇼핑몰 3개)
   - AI 분석 (Lovable AI 활용)
   - 분석 결과 저장

4. ⬜ **콘텐츠 생성 개선** (1주)
   - 생성 콘텐츠 DB 저장
   - 이력 관리

### Phase 2: 채널 연동 (4-6주)
**목표**: 실제 맘카페에 포스팅 가능

1. ⬜ **맘카페 DB 구축** (2주)
   - 주요 맘카페 500개 데이터 수집
   - 채널 정보 DB 구축

2. ⬜ **네이버 카페 API 연동** (2주)
   - OAuth 인증
   - 게시글 작성 API
   - 권한 관리

3. ⬜ **캠페인 관리 기본** (2주)
   - 캠페인 CRUD
   - 채널 선택 및 예약
   - 수동 발행 기능

### Phase 3: 자동화 (4주)
**목표**: 예약 발행 및 성과 추적

1. ⬜ **자동 발행 시스템** (2주)
   - Cron Jobs 설정
   - 예약 발행
   - 실패 처리

2. ⬜ **성과 추적** (2주)
   - 조회수/댓글 수집
   - 리포트 생성
   - 알림 시스템

### Phase 4: 고도화 (4주)
**목표**: AI 기반 최적화

1. ⬜ **타이밍 분석** (2주)
   - 시간대별 데이터 수집
   - AI 예측 모델

2. ⬜ **고급 분석 기능** (2주)
   - A/B 테스트
   - 경쟁사 벤치마킹
   - ROI 개선 제안

---

## 💰 비용 예상

### 인프라 비용 (월간)
- Supabase (Lovable Cloud): $25 (Pro Plan)
- Lovable AI 사용량: ~$50 (예상)
- 크롤링 프록시: ~$30
- **총 예상**: $105/월

### 개발 인력 (예상)
- 풀스택 개발자 1명: 3-4개월
- UI/UX 디자이너 (선택): 1개월
- QA 및 테스트: 2주

---

## ⚠️ 주요 리스크 및 고려사항

### 1. 법률적 이슈
- **네이버 카페 이용약관**: 자동 포스팅 제한 가능성
- **스팸 정책**: 대량 게시글 작성 시 제재 위험
- **해결 방안**: 
  - 사용자가 직접 계정 연동하도록 설계
  - 발행 속도 제한 (Rate Limiting)
  - 카페 운영자 승인 프로세스

### 2. 기술적 이슈
- **크롤링 안정성**: 쇼핑몰 구조 변경 시 파싱 오류
- **API 제한**: 네이버 API 호출 횟수 제한
- **해결 방안**:
  - 에러 핸들링 및 폴백 로직
  - 캐싱 전략
  - 재시도 메커니즘

### 3. 비즈니스 이슈
- **초기 채널 데이터**: 맘카페 정보 수집에 시간 소요
- **사용자 확보**: 초기 트래픽 유입 전략 필요
- **해결 방안**:
  - MVP부터 작은 규모로 시작
  - 베타 테스터 모집
  - 프리미엄 기능 점진적 오픈

---

## 📝 다음 단계

### 즉시 시작 가능한 작업
1. **결제 시스템 설계 및 연동** (최우선)
2. **상품 크롤링 엔진 개발**
3. **맘카페 데이터베이스 구축**
4. **핵심 테이블 마이그레이션**

### 논의 필요 사항
- [ ] 결제 PG사 선택 (토스 vs 아임포트)
- [ ] 네이버 카페 계정 연동 방식
- [ ] 크롤링 법률 검토
- [ ] 가격 정책 최종 확정
- [ ] MVP 출시 일정

---

## 📞 문의 및 협업

이 명세서를 바탕으로 개발팀과 협의하여 구체적인 개발 일정과 비용을 산정하시면 됩니다.

**작성일**: 2025-10-31  
**버전**: 1.0