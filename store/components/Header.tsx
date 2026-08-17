"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, Leaf } from "lucide-react";
import { useCart } from "./CartProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/products", label: "전체 상품" },
  { href: "/products?sort=subscription", label: "정기배송" },
  { href: "/#story", label: "브랜드 스토리" },
];

export function Header() {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const supabase = createSupabaseBrowserClient();
    if (supabase) await supabase.auth.signOut();
    setEmail(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2" aria-label="참신한하루 홈">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-sage text-cream">
            <Leaf size={17} strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
            참신한하루
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className="text-sm text-muted transition-colors hover:text-sage"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {email ? (
            <button
              type="button"
              onClick={logout}
              className="hidden rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-sage sm:block"
            >
              로그아웃
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-sage sm:block"
            >
              로그인
            </Link>
          )}
          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-sage-tint"
            aria-label="장바구니"
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            {ready && count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-[11px] font-bold text-cream">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-sage-tint md:hidden"
            aria-label="메뉴 열기"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-cream px-5 py-3 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-[15px] text-ink"
            >
              {n.label}
            </Link>
          ))}
          {email ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="block w-full py-2.5 text-left text-[15px] text-ink"
            >
              로그아웃
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block py-2.5 text-[15px] text-ink"
            >
              로그인
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
