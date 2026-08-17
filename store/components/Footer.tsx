import Link from "next/link";
import { Leaf, MessageCircle, Store } from "lucide-react";

const KAKAO_URL = "https://open.kakao.com/o/sUHBXsGi";
const NAVER_STORE_URL = "https://smartstore.naver.com/chamshinhan2";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-sand/60">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-sage text-cream">
                <Leaf size={17} strokeWidth={2.2} />
              </span>
              <span className="font-display text-xl font-extrabold text-ink">참신한하루</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              정직한 원료로 채우는 건강한 하루. 원료의 종류와 함량을 투명하게 공개합니다.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE500] px-3.5 py-2 text-xs font-bold text-[#191600] hover:brightness-95"
              >
                <MessageCircle size={14} strokeWidth={0} className="fill-[#191600]" />
                카카오톡 문의
              </a>
              <a
                href={NAVER_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3.5 py-2 text-xs font-semibold text-ink hover:bg-sage-tint"
              >
                <Store size={14} /> 네이버 스토어
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">쇼핑</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/products" className="hover:text-sage">
                  전체 상품
                </Link>
              </li>
              <li>
                <Link href="/products?sort=subscription" className="hover:text-sage">
                  정기배송
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-sage">
                  주문 조회
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">고객 안내</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/policy/terms" className="hover:text-sage">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/policy/privacy" className="hover:text-sage">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/policy/refund" className="hover:text-sage">
                  교환·환불·청약철회
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 전자상거래법 필수 표기 (실제 사업자 정보로 교체) */}
        <div className="mt-12 border-t border-line pt-8 text-xs leading-relaxed text-muted">
          <p className="font-medium text-ink/80">참신한하루</p>
          <p className="mt-2 break-keep">
            대표 000 · 사업자등록번호 000-00-00000 · 통신판매업신고 2026-서울○○-0000
            <br />
            주소 서울특별시 ○○구 ○○로 00, 0층 · 고객센터 1600-0000 (평일 10:00–17:00) ·
            이메일 help@chamshinhan.example
          </p>
          <p className="mt-3 text-muted/80">
            본 사이트의 상품은 일반 건강식품이며, 특정 질병의 예방·치료 효과나 의약품의 대체
            효능을 표방하지 않습니다. 표시된 사업자 정보와 가격은 예시이며 실제 정보로 교체가
            필요합니다.
          </p>
          <p className="mt-4 text-muted/70">© 2026 참신한하루. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
