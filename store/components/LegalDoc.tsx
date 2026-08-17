export function LegalDoc({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-3xl font-extrabold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-muted">시행일 {updated}</p>
      <div className="mt-8 space-y-8 leading-relaxed text-ink/85">{children}</div>
      <p className="mt-12 rounded-xl bg-sand/60 px-4 py-3 text-xs leading-relaxed text-muted">
        본 문서는 표준 양식을 바탕으로 한 예시입니다. 실제 운영 전 사업자 정보와 정책을
        검토·보완하고 법률 전문가의 확인을 받으시길 권장합니다.
      </p>
    </div>
  );
}

export function Section({
  no,
  title,
  children,
}: {
  no: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-bold text-ink">
        제{no}조 ({title})
      </h2>
      <div className="mt-2 space-y-2 text-[15px] text-muted">{children}</div>
    </section>
  );
}
