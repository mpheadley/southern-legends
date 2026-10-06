"use client";

import { useState } from "react";

interface Props {
  url: string;
  title: string;
  description?: string;
}

export default function ShareRow({ url, title, description = "" }: Props) {
  const [copied, setCopied] = useState(false);

  const full = url.startsWith("http") ? url : `https://southernlegends.org${url}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(full)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(full)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description ? `${description}\n\n${full}` : full)}`;

  async function copy() {
    await navigator.clipboard.writeText(full).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-3 mt-2">
      <span className="text-xs uppercase tracking-widest text-stone-400">Share</span>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
      <a
        href={fbUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      </a>
      <a
        href={emailUrl}
        aria-label="Share via email"
        className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
      </a>
      <button
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy link"}
        className="w-8 h-8 flex items-center justify-center rounded border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition"
      >
        {copied ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
          </svg>
        )}
      </button>
    </div>
  );
}
