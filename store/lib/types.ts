export type Category =
  | "유산균"
  | "오메가3"
  | "비타민"
  | "발효홍삼"
  | "단백질"
  | "수면·이완";

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  summary: string;
  description: string[];
  price: number;
  salePrice?: number;
  category: Category;
  badges: string[];
  /** 화면 표시용 대표 색상(온-브랜드 아트에 사용) */
  accent: string;
  servings: string;
  ingredients: Ingredient[];
  intake: string;
  origin: string;
  caution: string;
  stock: number;
  rating: number;
  reviewCount: number;
  /** 정기배송 지원 여부 및 할인율(%) / 주기(일) */
  subscription: {
    enabled: boolean;
    discountPercent: number;
    intervalDays: number;
  };
  tags: string[];
  isBest?: boolean;
  isNew?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
}

export type OrderType = "single" | "subscription";

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number; // 실제 결제 단가(정기 할인 반영)
  listPrice: number; // 정가(단건가)
  qty: number;
  accent: string;
  category: Category;
  orderType: OrderType;
  intervalDays?: number;
}
