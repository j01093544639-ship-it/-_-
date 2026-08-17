import type { Product, Review } from "./types";

/**
 * MVP 시드 데이터.
 * 실제 운영에서는 Supabase `products` 테이블로 교체한다(supabase/schema.sql 참고).
 * 문구는 일반 건강식품 기준 — 질병의 예방·치료를 단정하는 표현은 쓰지 않는다.
 */
export const PRODUCTS: Product[] = [
  {
    id: "p-lacto-01",
    slug: "daily-lacto-19",
    name: "데일리 락토 19종",
    brand: "온담",
    summary: "매일 아침을 가볍게 시작하고 싶은 분을 위한 19종 유산균",
    description: [
      "장까지 살아서 도달하도록 이중코팅한 19종 복합 유산균입니다.",
      "아침 공복 한 포로 하루를 규칙적으로 시작해 보세요.",
      "인공 향료·색소를 넣지 않았고, 개별 스틱 포장으로 휴대가 편합니다.",
    ],
    price: 39000,
    salePrice: 32900,
    category: "유산균",
    badges: ["이중코팅", "무향료"],
    accent: "#6f8f6a",
    servings: "30포 (1일 1포 · 30일분)",
    ingredients: [
      { name: "복합 유산균(19종)", amount: "100억 CFU 보장" },
      { name: "프리바이오틱스(치커리 식이섬유)", amount: "2,000mg" },
      { name: "아연", amount: "8.5mg" },
    ],
    intake: "1일 1회, 1포를 아침 공복에 물과 함께 섭취하세요.",
    origin: "대한민국 (원료 일부 수입)",
    caution:
      "특정 원료에 알레르기가 있는 분은 원재료를 확인하세요. 임신·수유 중이거나 질환이 있는 분은 전문가와 상담 후 드세요.",
    stock: 120,
    rating: 4.8,
    reviewCount: 214,
    subscription: { enabled: true, discountPercent: 15, intervalDays: 30 },
    tags: ["장건강", "아침루틴", "휴대간편"],
    isBest: true,
  },
  {
    id: "p-omega-01",
    slug: "clear-omega3-rtg",
    name: "클리어 오메가3 rTG",
    brand: "온담",
    summary: "비린내를 줄인 고순도 rTG 오메가3",
    description: [
      "흡수율을 고려한 rTG 형태의 고순도 오메가3입니다.",
      "레몬 향 코팅으로 비린 맛을 줄여 매일 부담 없이 섭취할 수 있습니다.",
      "산패를 억제하도록 소분 포장했습니다.",
    ],
    price: 34000,
    category: "오메가3",
    badges: ["rTG", "레몬코팅"],
    accent: "#c98a3a",
    servings: "60캡슐 (1일 2캡슐 · 30일분)",
    ingredients: [
      { name: "정제어유(EPA·DHA)", amount: "1,200mg" },
      { name: "비타민E(혼합 토코페롤)", amount: "11mg α-TE" },
    ],
    intake: "1일 2회, 1회 1캡슐을 식후에 물과 함께 섭취하세요.",
    origin: "노르웨이산 원료 · 국내 제조",
    caution:
      "항응고제를 복용 중이거나 수술 예정인 분은 전문가와 상담하세요. 어류 알레르기가 있는 분은 주의하세요.",
    stock: 86,
    rating: 4.7,
    reviewCount: 158,
    subscription: { enabled: true, discountPercent: 12, intervalDays: 30 },
    tags: ["혈행", "눈건조", "무비린"],
    isBest: true,
  },
  {
    id: "p-vitc-01",
    slug: "wholefood-vitamin-c",
    name: "홀푸드 비타민C 1000",
    brand: "온담",
    summary: "아세로라·구아바에서 얻은 자연유래 비타민C",
    description: [
      "합성 원료 대신 아세로라와 구아바 추출물을 담은 홀푸드 비타민C입니다.",
      "하루 한 알로 활기찬 컨디션 관리를 도와줍니다.",
      "새콤한 자연의 맛을 그대로 살렸습니다.",
    ],
    price: 24000,
    salePrice: 19900,
    category: "비타민",
    badges: ["자연유래", "1일1정"],
    accent: "#d0763f",
    servings: "90정 (1일 1정 · 90일분)",
    ingredients: [
      { name: "비타민C(아세로라·구아바 추출물)", amount: "1,000mg" },
      { name: "바이오플라보노이드", amount: "50mg" },
    ],
    intake: "1일 1회, 1정을 식후에 물과 함께 섭취하세요.",
    origin: "대한민국 (원료 일부 수입)",
    caution: "과다 섭취 시 위가 불편할 수 있습니다. 하루 권장량을 지켜 드세요.",
    stock: 200,
    rating: 4.6,
    reviewCount: 302,
    subscription: { enabled: true, discountPercent: 15, intervalDays: 60 },
    tags: ["컨디션", "활력", "새콤"],
    isNew: true,
  },
  {
    id: "p-redginseng-01",
    slug: "fermented-red-ginseng",
    name: "발효 홍삼 진",
    brand: "온담",
    summary: "6년근 홍삼을 발효해 부드럽게 담은 스틱",
    description: [
      "6년근 홍삼을 발효 공정으로 더 부드럽게 담았습니다.",
      "쌉싸름함을 줄여 홍삼이 처음인 분도 편하게 즐길 수 있습니다.",
      "바쁜 하루, 든든한 하루 한 포로 챙기세요.",
    ],
    price: 59000,
    salePrice: 49000,
    category: "발효홍삼",
    badges: ["6년근", "발효공법"],
    accent: "#b0503a",
    servings: "30포 (1일 1포 · 30일분)",
    ingredients: [
      { name: "발효홍삼농축액", amount: "70% 이상" },
      { name: "홍삼 사포닌(진세노사이드)", amount: "표기 함량 준수" },
    ],
    intake: "1일 1회, 1포를 그대로 또는 물에 타서 섭취하세요.",
    origin: "대한민국 (국내산 6년근 홍삼)",
    caution:
      "카페인에 민감하거나 혈압 관련 약을 드시는 분은 전문가와 상담 후 섭취하세요.",
    stock: 54,
    rating: 4.9,
    reviewCount: 121,
    subscription: { enabled: true, discountPercent: 10, intervalDays: 30 },
    tags: ["활력", "면역관리", "선물"],
    isBest: true,
  },
  {
    id: "p-protein-01",
    slug: "plant-protein-shake",
    name: "식물성 단백 셰이크",
    brand: "온담",
    summary: "완두·현미 단백에 곡물의 고소함을 더한 대체식",
    description: [
      "완두와 현미에서 얻은 식물성 단백을 한 끼 20g으로 담았습니다.",
      "물이나 우유에 타 마시기 좋은 고소한 곡물 맛입니다.",
      "바쁜 아침이나 운동 후 간편하게 단백질을 채우세요.",
    ],
    price: 42000,
    category: "단백질",
    badges: ["식물성", "20g 단백"],
    accent: "#8a7b4f",
    servings: "750g (약 25회분)",
    ingredients: [
      { name: "완두 단백", amount: "회당 14g" },
      { name: "현미 단백", amount: "회당 6g" },
      { name: "식이섬유", amount: "회당 4g" },
    ],
    intake: "1회 30g을 물 또는 우유 250ml에 타서 드세요.",
    origin: "대한민국 (원료 일부 수입)",
    caution: "대두·견과류를 다루는 시설에서 제조되었습니다.",
    stock: 73,
    rating: 4.5,
    reviewCount: 96,
    subscription: { enabled: true, discountPercent: 12, intervalDays: 30 },
    tags: ["단백질", "대체식", "운동후"],
    isNew: true,
  },
  {
    id: "p-sleep-01",
    slug: "calm-night-magnesium",
    name: "카밤 나이트 마그네슘",
    brand: "온담",
    summary: "하루의 끝, 편안한 밤 루틴을 위한 마그네슘 · 테아닌",
    description: [
      "이완을 돕는 마그네슘에 테아닌과 캐모마일을 더한 밤 전용 포뮬러입니다.",
      "잠들기 전 물 한 잔과 함께하는 나만의 루틴을 만들어 보세요.",
      "부드러운 베리 향으로 편안하게 마무리합니다.",
    ],
    price: 29000,
    category: "수면·이완",
    badges: ["마그네슘", "테아닌"],
    accent: "#6d6f96",
    servings: "60정 (1일 2정 · 30일분)",
    ingredients: [
      { name: "마그네슘(비스글리시네이트)", amount: "300mg" },
      { name: "L-테아닌", amount: "200mg" },
      { name: "캐모마일 추출물", amount: "100mg" },
    ],
    intake: "취침 30분 전 2정을 물과 함께 섭취하세요.",
    origin: "대한민국 (원료 일부 수입)",
    caution:
      "졸음을 유발할 수 있으니 운전 전에는 피하세요. 임신·수유 중에는 전문가와 상담하세요.",
    stock: 68,
    rating: 4.7,
    reviewCount: 143,
    subscription: { enabled: true, discountPercent: 15, intervalDays: 30 },
    tags: ["수면루틴", "이완", "밤"],
    isNew: true,
  },
];

const REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "p-lacto-01",
    author: "이◦은",
    rating: 5,
    content: "아침마다 한 포씩 챙겨 먹고 있어요. 속이 편안해서 계속 정기배송으로 받아요.",
    createdAt: "2026-07-28T09:12:00Z",
  },
  {
    id: "r2",
    productId: "p-lacto-01",
    author: "김◦수",
    rating: 4,
    content: "스틱 포장이라 출장 다닐 때 챙기기 좋네요. 맛도 거부감 없어요.",
    createdAt: "2026-08-03T21:40:00Z",
  },
  {
    id: "r3",
    productId: "p-omega-01",
    author: "박◦진",
    rating: 5,
    content: "비린내 정말 안 나요. 예전에 먹던 오메가3는 트림이 올라왔는데 이건 괜찮아요.",
    createdAt: "2026-08-08T13:05:00Z",
  },
  {
    id: "r4",
    productId: "p-redginseng-01",
    author: "정◦라",
    rating: 5,
    content: "부모님 선물로 드렸는데 부드럽고 맛있다고 하세요. 재구매합니다.",
    createdAt: "2026-08-10T08:20:00Z",
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getBestSellers(): Product[] {
  return PRODUCTS.filter((p) => p.isBest);
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter((p) => p.isNew);
}

export function getCategories(): string[] {
  return Array.from(new Set(PRODUCTS.map((p) => p.category)));
}

export function getReviewsByProduct(productId: string): Review[] {
  return REVIEWS.filter((r) => r.productId === productId).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}
