-- 참신한하루 스토어 · Supabase 스키마 (MVP)
-- Supabase SQL Editor에 그대로 붙여 실행하세요.
-- 원칙: 모든 테이블 RLS 활성화 후 필요한 정책만 추가(기본 deny).
-- ※ 상품은 앱의 lib/products.ts 시드로도 동작합니다. 이 스키마는 운영 전환용입니다.

-- ─────────────────────────────────────────────
-- 1. 상품
-- ─────────────────────────────────────────────
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  eng_name text,
  brand text not null,
  summary text,
  price integer not null,
  sale_price integer,
  category text not null,
  badges jsonb default '[]'::jsonb,
  accent text,
  image text,
  servings text,
  ingredients jsonb default '[]'::jsonb,
  features jsonb default '[]'::jsonb,
  recommend jsonb default '[]'::jsonb,
  intake text,
  origin text,
  caution text,
  stock integer not null default 0,
  rating numeric(2,1) default 0,
  review_count integer default 0,
  subscription_enabled boolean default false,
  subscription_discount integer default 0,
  subscription_interval_days integer default 30,
  is_best boolean default false,
  is_new boolean default false,
  created_at timestamptz default now()
);

alter table public.products enable row level security;

drop policy if exists "products public read" on public.products;
create policy "products public read"
  on public.products for select
  to anon, authenticated
  using (true);

-- ─────────────────────────────────────────────
-- 2. 상품 리뷰
-- ─────────────────────────────────────────────
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author text not null,
  rating smallint not null check (rating between 1 and 5),
  content text not null check (char_length(content) between 5 and 1000),
  created_at timestamptz default now()
);

alter table public.product_reviews enable row level security;

drop policy if exists "reviews public read" on public.product_reviews;
create policy "reviews public read"
  on public.product_reviews for select
  to anon, authenticated using (true);

drop policy if exists "reviews auth insert" on public.product_reviews;
create policy "reviews auth insert"
  on public.product_reviews for insert
  to authenticated with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 3. 주문 / 주문상품
-- ─────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,        -- Toss orderId와 일치
  user_id uuid references auth.users(id) on delete set null,
  order_type text not null default 'single' check (order_type in ('single','subscription')),
  status text not null default 'pending'    -- pending/paid/shipped/delivered/cancelled/failed
    check (status in ('pending','paid','shipped','delivered','cancelled','failed')),
  receiver_name text not null,
  phone text not null,
  postcode text,
  address text not null,
  address_detail text,
  memo text,
  subtotal integer not null default 0,
  shipping_fee integer not null default 0,
  total_amount integer not null,
  toss_payment_key text,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

-- 비회원 주문 허용(MVP): order_number를 아는 사람만 조회하도록 UX 설계
drop policy if exists "orders insert" on public.orders;
create policy "orders insert"
  on public.orders for insert
  to anon, authenticated with check (true);

drop policy if exists "orders read own or by number" on public.orders;
create policy "orders read own or by number"
  on public.orders for select
  to anon, authenticated
  using (user_id is null or auth.uid() = user_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  name text not null,
  qty integer not null check (qty > 0),
  unit_price integer not null
);

alter table public.order_items enable row level security;

drop policy if exists "order_items insert" on public.order_items;
create policy "order_items insert"
  on public.order_items for insert
  to anon, authenticated with check (true);

drop policy if exists "order_items read" on public.order_items;
create policy "order_items read"
  on public.order_items for select
  to anon, authenticated using (true);

-- ─────────────────────────────────────────────
-- 4. 정기배송(구독)
-- ─────────────────────────────────────────────
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  product_id text not null references public.products(id),
  qty integer not null default 1,
  interval_days integer not null default 30,
  unit_price integer not null,
  billing_key text,                          -- 토스 빌링키(자동결제). 서버에서만 다룸
  customer_key text,
  next_charge_at timestamptz,
  status text not null default 'active'       -- active/paused/cancelled
    check (status in ('active','paused','cancelled')),
  created_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions read own" on public.subscriptions;
create policy "subscriptions read own"
  on public.subscriptions for select
  to authenticated using (auth.uid() = user_id);

-- billing_key 등 민감정보는 클라이언트에서 직접 쓰지 않는다.
-- insert/update/정기결제는 service_role(서버) 경유로만 수행한다.

-- ─────────────────────────────────────────────
-- 5. 상품 시드 (데모용)
-- ─────────────────────────────────────────────
-- ※ 가격(price/sale_price)은 예시값입니다. 실제 판매가로 교체하세요.
insert into public.products
  (id, slug, name, brand, summary, price, sale_price, category, accent, image, servings,
   stock, rating, review_count, subscription_enabled, subscription_discount,
   subscription_interval_days, is_best, is_new)
values
  ('daily-dietary-fiber','daily-dietary-fiber','데일리 식이섬유 정','참신한하루','치커리 식이섬유 고함량',24900,21900,'장건강','#6f8f6a','/products/product-01.jpg','600mg × 120정',180,4.8,214,true,15,30,true,false),
  ('mugunghwa-fit-on','mugunghwa-fit-on','무궁화추출물 핏온 정','참신한하루','무궁화 추출 복합분말',29900,null,'다이어트','#cf7f43','/products/product-02.jpg','600mg × 60정',90,4.6,78,true,12,30,false,false),
  ('triella-collagen-biotin','triella-collagen-biotin','트리엘라 어린콜라겐 펩타이드 비오틴 플러스','참신한하루','초저분자 피쉬 콜라겐 + 비오틴',42000,36900,'뷰티','#b56a86','/products/product-03.jpg','450mg × 120정',140,4.9,326,true,10,30,true,false),
  ('paradise-grain-burning','paradise-grain-burning','파라다이스 그레인 버닝 원데이즈 정','참신한하루','파라다이스 그레인 추출분말',32900,null,'다이어트','#cf7f43','/products/product-04.jpg','600mg × 120정',76,4.6,64,true,12,30,false,false),
  ('fermented-oyster-kids','fermented-oyster-kids','발효굴 추출분말 & 유산균 정','참신한하루','발효굴 + 22종 유산균',27900,null,'키즈','#6d93b0','/products/product-05.jpg','600mg × 60정',88,4.8,152,true,12,30,false,false),
  ('alpha-cd-one-days','alpha-cd-one-days','알파CD 알파시클로덱스트린 원데이즈','참신한하루','알파시클로덱스트린 식이섬유',29900,null,'다이어트','#cf7f43','/products/product-06.jpg','450mg × 120정',110,4.7,71,true,12,30,false,true),
  ('plant-melatonin-tart-cherry','plant-melatonin-tart-cherry','식물성 멜라토닌 피스타치오 타트체리 정','참신한하루','식물성 멜라토닌 + 타트체리',28900,null,'컨디션','#8a7f53','/products/product-07.jpg','600mg × 60정',64,4.7,118,true,15,30,false,true),
  ('green-acerola-vitamin-c','green-acerola-vitamin-c','그린 아세로라 유래 비타민C 원데이즈','참신한하루','아세로라 유래 비타민C',21900,null,'비타민·면역','#d3a83c','/products/product-08.jpg','450mg × 120정',200,4.7,205,true,15,60,false,false),
  ('khorasan-grain-enzyme','khorasan-grain-enzyme','프리미엄 호라산밀 곡물효소 정','참신한하루','카무트 + 식이섬유 + 곡물효소',34900,null,'장건강','#6f8f6a','/products/product-09.jpg','1,000mg × 60정',82,4.7,96,true,12,30,false,true),
  ('papa-flora-ginger','papa-flora-ginger','파파 플로라 생강추출물 정','참신한하루','생강 추출분말 + 흑마늘',25900,null,'컨디션','#8a7f53','/products/product-10.jpg','600mg × 60정',95,4.8,133,true,12,30,false,false),
  ('lemon-vitamin-c','lemon-vitamin-c','레몬즙 비타민C 정','참신한하루','레몬 과즙분말 + 비타민C',18900,null,'비타민·면역','#d3a83c','/products/product-11.jpg','600mg × 60정',160,4.6,88,true,15,30,false,false),
  ('liposomal-glutathione','liposomal-glutathione','리포좀 글루타치온 정','참신한하루','리포좀 글루타치온 + 비타민C',39000,34900,'뷰티','#b56a86','/products/product-12.jpg','600mg × 60정',120,4.9,241,true,10,30,true,false),
  ('eggshell-gujeolcho','eggshell-gujeolcho','난각막 구아검 가수분해물 구절초 플러스','참신한하루','난각막 + 구절초 + 구아검',33900,null,'컨디션','#8a7f53','/products/product-13.jpg','450mg × 120정',70,4.7,84,true,12,30,false,false),
  ('acv-probiotics','acv-probiotics','애플사이다비니거 사과초모 유산균 정','참신한하루','유기농 사과초모 + 22종 유산균',26900,23900,'장건강','#6f8f6a','/products/product-14.jpg','600mg × 60정',130,4.8,176,true,12,30,true,false),
  ('saururus-liriope','saururus-liriope','삼백초 맥문동 정','참신한하루','삼백초 + 맥문동',24900,null,'컨디션','#8a7f53','/products/product-15.jpg','600mg × 60정',85,4.6,57,true,12,30,false,false),
  ('albumin-signature','albumin-signature','알부민 정','참신한하루','알부민 아미노산 복합물 (시그니처)',31900,null,'컨디션','#8a7f53','/products/product-16.jpg','600mg × 120정',108,4.8,149,true,12,30,true,false)
on conflict (id) do nothing;
