export type Category =
  | "다이어트"
  | "장건강"
  | "비타민·면역"
  | "뷰티"
  | "컨디션"
  | "키즈";

export interface Product {
  id: string;
  slug: string;
  name: string;
  engName: string;
  brand: string;
  summary: string;
  category: Category;
  price: number;
  salePrice?: number;
  /** 카테고리 톤 컬러(배지·태그에 사용) */
  accent: string;
  /** /products/xxx.jpg (public 기준 경로) */
  image: string;
  servings: string;
  ingredients: string[];
  features: string[];
  recommend: string[];
  intake: string;
  origin: string;
  caution: string;
  stock: number;
  rating: number;
  reviewCount: number;
  subscription: {
    enabled: boolean;
    discountPercent: number;
    intervalDays: number;
  };
  badges: string[];
  isBest?: boolean;
  isNew?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  product: string;
  rating: number;
  repurchase: boolean;
  content: string;
  createdAt: string;
}

export type OrderType = "single" | "subscription";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number; // 선택 묶음의 실제 결제가(정기 할인 반영)
  listPrice: number; // 낱개 기준가(통수 × 1통가) — 절약액 표시용
  qty: number; // 묶음 개수
  bottles: number; // 묶음 구성(1/2/3/5통)
  image: string;
  orderType: OrderType;
  intervalDays?: number;
}
