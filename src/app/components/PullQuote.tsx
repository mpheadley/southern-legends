/**
 * PullQuote — styled blockquote with Rock Salt font and oversized quote marks.
 * Used as an MDX component: <PullQuote>quote text</PullQuote>
 * or via markdown blockquote with a special class.
 */
export default function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <figure className="pull-quote my-12 mx-0 md:-mx-8 px-8 py-6 relative">
      {/* Oversized opening quote mark */}
      <span
        className="pull-quote-mark absolute -top-2 left-2 text-8xl leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <blockquote className="relative z-10 text-xl md:text-2xl leading-relaxed">
        {children}
      </blockquote>
    </figure>
  );
}
