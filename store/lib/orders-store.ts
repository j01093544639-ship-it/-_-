import type { CartLine, OrderType } from "./types";

/**
 * MVP용 클라이언트 주문 저장소(localStorage).
 * Supabase가 연결되면 서버 `orders` 테이블이 원본이 되지만,
 * 데모/비회원 흐름에서도 주문내역을 볼 수 있도록 브라우저에도 스냅샷을 남긴다.
 */
const KEY = "ondam-orders-v1";

export interface LocalOrder {
  orderNumber: string;
  createdAt: string;
  mode: OrderType;
  items: CartLine[];
  receiverName: string;
  phone: string;
  postcode: string;
  address: string;
  addressDetail: string;
  memo: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "pending" | "paid" | "failed";
  intervalDays?: number;
}

function readAll(): LocalOrder[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeAll(orders: LocalOrder[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function savePendingOrder(order: LocalOrder) {
  const all = readAll().filter((o) => o.orderNumber !== order.orderNumber);
  all.unshift(order);
  writeAll(all);
}

export function getOrder(orderNumber: string): LocalOrder | undefined {
  return readAll().find((o) => o.orderNumber === orderNumber);
}

export function setOrderStatus(orderNumber: string, status: LocalOrder["status"]) {
  const all = readAll();
  const idx = all.findIndex((o) => o.orderNumber === orderNumber);
  if (idx >= 0) {
    all[idx] = { ...all[idx], status };
    writeAll(all);
  }
}

export function listOrders(): LocalOrder[] {
  return readAll();
}
