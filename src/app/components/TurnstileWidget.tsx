"use client";

import { useEffect, useRef } from "react";

// Cloudflare Turnstile, loaded once. Free tier, invisible for most visitors.
// onVerify("") is called when the token expires so the form asks for a fresh one.
type TurnstileApi = {
  render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback"?: () => void; "error-callback"?: () => void; theme?: string }) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export default function TurnstileWidget({ sitekey, onVerify }: { sitekey: string; onVerify: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const verifyRef = useRef(onVerify);
  verifyRef.current = onVerify;

  useEffect(() => {
    let widgetId: string | undefined;
    let cancelled = false;

    function mount() {
      if (cancelled || !ref.current || !window.turnstile) return;
      widgetId = window.turnstile.render(ref.current, {
        sitekey,
        theme: "auto",
        callback: (t) => verifyRef.current(t),
        "expired-callback": () => verifyRef.current(""),
        "error-callback": () => verifyRef.current(""),
      });
    }

    if (window.turnstile) {
      mount();
    } else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", mount);
    }

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [sitekey]);

  return <div ref={ref} />;
}
