import Image from "next/image";

/**
 * 참신한하루 실제 제품 사진 렌더.
 * public/products/*.jpg를 next/image로 최적화해 보여준다.
 * 부모 요소는 반드시 position: relative + 크기(aspect 등)를 가져야 한다.
 */
export function ProductImage({
  src,
  alt,
  sizes = "(max-width: 768px) 50vw, 320px",
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
