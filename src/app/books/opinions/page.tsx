"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";


const SPREADS = [
  {
    id: 0,
    image: "/images/books/opinions/spread-01.webp",
    imageAlt: "An exhausted couple buried under wedding planning binders and sticky notes",
    text: [
      "The Weddingplex loomed on the edge of the town,",
      "with its taffeta towers and tulle tumbling down.",
      "And somewhere inside in a room full of things,",
      "two people were planning their planning of rings.",
      "",
      "They'd chosen their flowers. They'd chosen their hall.",
      "They'd chosen the napkins (the hardest of all).",
      "They thought they were done. They thought they were through.",
      "",
      "They were not.",
      "Oh, they were not.",
      "Not even close to through.",
    ],
  },
  {
    id: 1,
    image: "/images/books/opinions/spread-02.webp",
    imageAlt: "A beaming mother holds up her phone showing Pinterest wedding ideas",
    text: [
      "Then came the Mumkins — her mother, his mother,",
      "her aunt and his aunt and his grandmother's brother.",
      "",
      "They came with their binders!",
      "They came with their boards!",
      "They came with their Pinterest and swatches and cords!",
      "",
      '"The centerpiece HEIGHT!" cried the first Mumkin. "Wrong!"',
      '"The centerpiece WIDTH!" cried the second. "Too long!"',
      '"The centerpiece FLOWERS!" cried the third. "Too strong!"',
    ],
  },
  {
    id: 2,
    image: null,
    imageAlt: "",
    text: [
      "The Flowersmith called. (The Flowersmith calls a lot.)",
      "",
      '"I just need to know — dusty rose or dusty not?',
      "Or rose-adjacent blush? Or a blush-ier blush?",
      'Or a rose that is dusty but more of a flush?"',
      "",
      "She had forty-two swatches.",
      "She'd need to bring more.",
      "She'd be there in an hour.",
      "She'd been there before.",
    ],
  },
  {
    id: 3,
    image: null,
    imageAlt: "",
    text: [
      "The Cateroon came with his silvery trays.",
      "He'd been calling since Tuesday. It had been seventeen days.",
      "",
      '"About the fish!" said the Cateroon.',
      '"About the bread!',
      'About the chicken! About — " he said,',
      '"— are any guests dead?"',
      "",
      "(He meant dietary restrictions. He worded it wrong.",
      "He's a very good caterer. This has gone on too long.)",
    ],
  },
  {
    id: 4,
    image: null,
    imageAlt: "",
    text: [
      "It was midnight.",
      "The seating chart covered the bed.",
      "",
      "They'd moved the Hendersons.",
      "Moved them. Re-moved them.",
      "Moved them again —",
      "",
      "because of the thing",
      "that we're not going to say",
      "but that everyone knows",
      "and has always known.",
      "",
      "You know.",
      "Just move the Hendersons.",
    ],
  },
  {
    id: 5,
    image: null,
    imageAlt: "",
    text: [
      "EVERYONE",
      "has opinions",
      "about your wedding.",
      "",
      "Everyone.",
      "",
      "So very, deeply, truly many opinions.",
      "",
      "Would you all please just STOP.",
      "",
      "— The end. —",
      "",
      "(They will not stop.",
      "The napkins are beige.",
      "You wanted ivory.",
      "Those are different.",
      "Congratulations.)",
    ],
  },
];

export default function OpinionsBook() {
  const [page, setPage] = useState(0);
  const spread = SPREADS[page];

  return (
    <main className="min-h-screen" style={{ background: "var(--color-ll-warm)" }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: "var(--color-ll-accent)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/books" className="text-sm" style={{ color: "var(--color-ll-primary)" }}>
            ← Books
          </Link>
          <span className="text-xs" style={{ color: "var(--color-ll-accent-dark)", fontFamily: "monospace" }}>
            {page + 1} / {SPREADS.length}
          </span>
        </div>
      </div>

      {/* Title — first page only */}
      {page === 0 && (
        <div className="text-center pt-10 pb-4 px-6">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--color-ll-accent-dark)" }}>
            A Children&rsquo;s Book for Grown-Ups
          </p>
          <h1
            className="text-4xl md:text-5xl font-black leading-tight mb-2"
            style={{ color: "var(--color-ll-dark)", fontFamily: "var(--font-heading)" }}
          >
            Everyone Has Opinions
            <br />
            About Your Wedding
          </h1>
          <p className="text-sm mt-3" style={{ color: "var(--color-ll-primary)" }}>
            by Matt Headley
          </p>
        </div>
      )}

      {/* Book Spread */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div
          className="rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          style={{ background: "#fffef9", minHeight: 480, border: "1px solid #e5e0d8" }}
        >
          {/* Image side */}
          <div
            className="md:w-1/2 flex items-center justify-center p-8"
            style={{ background: "#f5f0e8" }}
          >
            {spread.image ? (
              <Image
                src={spread.image}
                alt={spread.imageAlt}
                width={420}
                height={420}
                className="rounded-xl object-cover w-full"
                style={{ maxHeight: 420 }}
              />
            ) : (
              <div
                className="w-full rounded-xl flex items-center justify-center"
                style={{
                  height: 360,
                  background: "#e8e2d8",
                  color: "#a09080",
                  fontSize: 14,
                  fontFamily: "var(--font-heading)",
                  fontStyle: "italic",
                  textAlign: "center",
                  padding: 24,
                }}
              >
                Illustration coming soon
                <br />
                <span style={{ fontSize: 12, marginTop: 8, display: "block" }}>
                  (Jason Wright, we&rsquo;re looking at you)
                </span>
              </div>
            )}
          </div>

          {/* Text side */}
          <div className="md:w-1/2 flex flex-col justify-center p-8 md:p-12">
            {spread.text.map((line, i) =>
              line === "" ? (
                <div key={i} className="h-4" />
              ) : (
                <p
                  key={i}
                  className="leading-relaxed"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: line === line.toUpperCase() && line.length > 3 ? 22 : 17,
                    color: "var(--color-ll-dark)",
                    fontWeight: line === line.toUpperCase() && line.length > 3 ? 800 : 400,
                    fontStyle: line.startsWith("(") ? "italic" : "normal",
                  }}
                >
                  {line}
                </p>
              )
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-6 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: page === 0 ? "#e5e0d8" : "var(--color-ll-primary)",
              color: page === 0 ? "#a09080" : "#fff",
              cursor: page === 0 ? "not-allowed" : "pointer",
            }}
          >
            ← Previous
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {SPREADS.map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: i === page ? "var(--color-ll-primary)" : "#c8c0b0",
                  transform: i === page ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>

          {page < SPREADS.length - 1 ? (
            <button
              onClick={() => setPage((p) => Math.min(SPREADS.length - 1, p + 1))}
              className="px-6 py-2 rounded-full text-sm font-medium text-white transition-all"
              style={{ background: "var(--color-ll-primary)" }}
            >
              Next →
            </button>
          ) : (
            <Link
              href="/subscribe"
              className="px-6 py-2 rounded-full text-sm font-medium text-white"
              style={{ background: "var(--color-ll-accent-dark)" }}
            >
              Get notified when it ships →
            </Link>
          )}
        </div>

        {/* CTA */}
        {page === SPREADS.length - 1 && (
          <div
            className="mt-8 rounded-xl p-6 text-center"
            style={{ background: "var(--color-ll-primary)", color: "#fff" }}
          >
            <p className="font-bold text-lg mb-1">The full book is coming.</p>
            <p className="text-sm mb-4 opacity-90">
              Illustrated. Printed. Subscribers hear first when it ships.
            </p>
            <Link
              href="/subscribe"
              className="inline-block px-6 py-2 rounded-full text-sm font-bold"
              style={{ background: "#fff", color: "var(--color-ll-primary)" }}
            >
              Notify me when it&rsquo;s ready
            </Link>
          </div>
        )}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs pb-10" style={{ color: "#a09080" }}>
        A satirical picture book for adults. No children were consulted.
      </p>
    </main>
  );
}
