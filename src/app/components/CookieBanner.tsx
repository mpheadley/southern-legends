"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Analytics, { loadGA4 } from "./Analytics";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID?.trim();

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    if (!GA4_ID) return;

    const consent = localStorage.getItem("cookie_consent");

    if (consent === "accepted") {
      loadGA4();
      setConsentGranted(true);
      return;
    }
    if (consent === "declined") return;

    const timer = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(timer);
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
    loadGA4();
    setConsentGranted(true);
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined");
    setShow(false);
  }

  return (
    <>
      <Analytics enabled={consentGranted} />

      {show && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-ll-dark/95 backdrop-blur-sm border-t border-white/10 px-6 py-4">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <p className="text-white/70 text-sm flex-grow">
              This site uses cookies to measure traffic and improve your experience.{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={accept}
                className="bg-ll-primary text-white text-sm font-semibold px-5 py-2 rounded hover:opacity-90 transition-opacity"
              >
                Accept
              </button>
              <button
                onClick={decline}
                className="border border-white/20 text-white/70 text-sm font-semibold px-5 py-2 rounded hover:bg-white/10 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
