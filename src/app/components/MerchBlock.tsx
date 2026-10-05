import Image from "next/image";
import Link from "next/link";

interface MerchBlockProps {
  slug?: string;
  href?: string;
  frontImage: string;
  backImage: string;
  title: string;
  description: string;
  price?: string;
}

export default function MerchBlock({
  slug,
  href = "#order",
  frontImage,
  backImage,
  title,
  description,
  price,
}: MerchBlockProps) {
  const linkHref = slug ? `/merch/${slug}` : href;
  const isInternal = !!slug;

  const inner = (
    <div className="group block rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--primary)] transition-colors no-underline">
      <div className="flex">
        <div className="relative w-1/2 aspect-[3/4]" style={{ background: "#fff" }}>
          <Image
            src={frontImage}
            alt={`${title} — front`}
            fill
            className="object-contain p-2 group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
        <div className="relative w-1/2 aspect-[3/4]">
          <Image
            src={backImage}
            alt={`${title} — in the wild`}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      </div>
      <div className="px-4 py-3 border-t border-[var(--border)]">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[var(--dark)]">{title}</p>
          {price && <p className="text-sm font-bold text-[var(--primary)]">{price}</p>}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>
        <p className="text-xs text-[var(--text-muted)] mt-1 opacity-50">Color may vary slightly due to print vendor.</p>
        <p className="text-xs text-[var(--primary)] mt-2 font-medium">View details →</p>
      </div>
    </div>
  );

  if (isInternal) {
    return <Link href={linkHref} className="block no-underline">{inner}</Link>;
  }
  return (
    <a href={linkHref} target="_blank" rel="noopener noreferrer" className="block no-underline">
      {inner}
    </a>
  );
}
