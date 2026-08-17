"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Send } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ReviewForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 5) {
      setNotice("후기를 5자 이상 입력해주세요.");
      return;
    }
    setStatus("sending");
    setNotice(null);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus("idle");
      setNotice("데모 환경입니다. Supabase 연결 후 후기가 저장됩니다.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      user_id: user.id,
      author: user.email?.split("@")[0] ?? "회원",
      rating,
      content: content.trim(),
    });

    if (error) {
      setStatus("idle");
      setNotice("후기 저장에 실패했어요. 잠시 후 다시 시도해주세요.");
      return;
    }
    setStatus("done");
    setContent("");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-cream p-5">
      <p className="text-sm font-semibold text-ink">후기 작성</p>
      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`별점 ${n}점`}
            className="p-0.5"
          >
            <Star
              size={22}
              strokeWidth={0}
              className={n <= rating ? "fill-clay text-clay" : "fill-line text-line"}
            />
          </button>
        ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="제품을 사용해보신 솔직한 후기를 남겨주세요."
        className="mt-3 w-full resize-none rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-sage"
      />
      {notice && <p className="mt-2 text-sm text-clay">{notice}</p>}
      {status === "done" && (
        <p className="mt-2 text-sm text-sage-dark">후기가 등록되었어요. 감사합니다!</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-3 inline-flex items-center gap-2 rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-cream hover:bg-sage-dark disabled:opacity-60"
      >
        <Send size={15} /> 후기 등록
      </button>
    </form>
  );
}
