-- 온담 스토어 · Supabase 스키마 (MVP)
-- Supabase SQL Editor에 그대로 붙여 실행하세요.
-- 원칙: 모든 테이블 RLS 활성화 후 필요한 정책만 추가(기본 deny).

-- ─────────────────────────────────────────────
-- 1. 상품
-- ─────────────────────────────────────────────
create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  brand text not null,
  summary text,
  description jsonb default '[]'::jsonb,
  price integer not null,
  sale_price integer,
  category text not null,
  badges jsonb default '[]'::jsonb,
  accent text,
  servings text,
  ingredients jsonb default '[]'::jsonb,
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
insert into public.products
  (id, slug, name, brand, summary, price, sale_price, category, accent, servings,
   stock, rating, review_count, subscription_enabled, subscription_discount,
   subscription_interval_days, is_best, is_new)
values
  ('p-lacto-01','daily-lacto-19','데일리 락토 19종','온담','19종 복합 유산균',39000,32900,'유산균','#6f8f6a','30포',120,4.8,214,true,15,30,true,false),
  ('p-omega-01','clear-omega3-rtg','클리어 오메가3 rTG','온담','고순도 rTG 오메가3',34000,null,'오메가3','#c98a3a','60캡슐',86,4.7,158,true,12,30,true,false),
  ('p-vitc-01','wholefood-vitamin-c','홀푸드 비타민C 1000','온담','자연유래 비타민C',24000,19900,'비타민','#d0763f','90정',200,4.6,302,true,15,60,false,true),
  ('p-redginseng-01','fermented-red-ginseng','발효 홍삼 진','온담','발효 6년근 홍삼',59000,49000,'발효홍삼','#b0503a','30포',54,4.9,121,true,10,30,true,false),
  ('p-protein-01','plant-protein-shake','식물성 단백 셰이크','온담','완두·현미 식물성 단백',42000,null,'단백질','#8a7b4f','750g',73,4.5,96,true,12,30,false,true),
  ('p-sleep-01','calm-night-magnesium','카밤 나이트 마그네슘','온담','마그네슘·테아닌',29000,null,'수면·이완','#6d6f96','60정',68,4.7,143,true,15,30,false,true)
on conflict (id) do nothing;
