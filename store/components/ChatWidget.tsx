"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Leaf } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "안녕하세요! 참신한하루 상담 챗봇 하루예요 🌿\n제품·성분·주문·정기배송 무엇이든 물어봐 주세요.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const history = [...messages, { role: "user", content: text } as Msg];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 인사 메시지는 제외하고 실제 대화만 전송
        body: JSON.stringify({ messages: history.filter((m) => m !== GREETING) }),
      });
      if (!res.ok || !res.body) throw new Error("no stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
      if (!acc.trim()) throw new Error("empty");
    } catch {
      setMessages((m) => {
        const copy = m.slice();
        copy[copy.length - 1] = {
          role: "assistant",
          content: "죄송해요, 잠시 문제가 생겼어요. 잠시 후 다시 시도해주세요.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="상담 챗봇 열기"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-sage text-cream shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} strokeWidth={2} />}
      </button>

      {/* 채팅 패널 */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[30rem] max-h-[75vh] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-line bg-cream shadow-2xl">
          <header className="flex items-center gap-2 border-b border-line bg-sage px-4 py-3 text-cream">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-cream/20">
              <Leaf size={16} strokeWidth={2.2} />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold">참신한하루 상담</p>
              <p className="text-[11px] text-cream/80">제품·주문·정기배송 도우미</p>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3.5 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-sage px-3.5 py-2 text-[13.5px] leading-relaxed text-cream"
                      : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-sand/70 px-3.5 py-2 text-[13.5px] leading-relaxed text-ink"
                  }
                >
                  {m.content || (loading && i === messages.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-line bg-cream p-2.5">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="궁금한 점을 입력하세요…"
                className="max-h-24 flex-1 resize-none rounded-xl border border-line bg-white px-3 py-2 text-[13.5px] text-ink outline-none placeholder:text-muted/70 focus:border-sage"
              />
              <button
                type="button"
                onClick={send}
                disabled={loading || !input.trim()}
                aria-label="전송"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sage text-cream transition-opacity disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="mt-1.5 px-1 text-[10.5px] leading-tight text-muted/70">
              참신한하루 관련 상담만 도와드려요. 일반 건강식품이며 의약품이 아닙니다.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
