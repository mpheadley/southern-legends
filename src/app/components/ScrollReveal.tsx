"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("scroll-reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );

    document
      .querySelectorAll(".animate-on-scroll:not(.visible), .animate-on-scroll-slow:not(.visible)")
      .forEach((el) => {
        observer.observe(el);
      });

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
