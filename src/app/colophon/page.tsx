import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Colophon",
  description: "How Southern Legends is made — the tools, the type, and the reasoning behind it.",
};

export default function ColophonPage() {
  return (
    <main id="main-content" className="bg-ll-light min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-24 md:py-32">

        <header className="mb-16">
          <p className="text-ll-primary text-sm font-semibold uppercase tracking-widest mb-4">Colophon</p>
          <h1 className="font-fraunces text-4xl md:text-5xl text-ll-dark leading-tight">
            How this site is made
          </h1>
        </header>

        <div className="prose prose-lg max-w-none text-ll-text space-y-12">

          <section>
            <h2 className="font-fraunces text-2xl text-ll-dark mb-4">What this is</h2>
            <p>
              Southern Legends is an independent editorial project based in Jacksonville, Alabama.
              It profiles small business owners, makers, and people doing quiet, durable work in
              Northeast Alabama — not because they are famous, but because they are here, and
              because that is worth something. The site started as a way to learn to pay attention
              again after losing a lot. That is still mostly what it is.
            </p>
          </section>

          <section>
            <h2 className="font-fraunces text-2xl text-ll-dark mb-4">Type</h2>
            <p>
              Body text is set in <strong>Source Sans 3</strong>, a workhorse designed by Paul
              Hunt and released through Adobe. It reads cleanly at length without calling
              attention to itself.
            </p>
            <p>
              Headlines and display text use <strong>Fraunces</strong>, a variable optical-size
              serif designed by Undercase Type. It has some warmth and age to it — appropriate
              for a site that spends time with people who have been at something for a long time.
            </p>
            <p>
              Pull quotes and accent elements use <strong>Rock Salt</strong>, a handwritten
              typeface by Font Diner. It marks a shift in register — a breath between the
              reported prose and whatever line a subject said that stopped the interview cold.
            </p>
          </section>

          <section>
            <h2 className="font-fraunces text-2xl text-ll-dark mb-4">Built with</h2>
            <p>
              The site is built with Next.js and deployed on Vercel. Profiles are written in MDX
              and live in a content directory. There is no CMS. There is no editorial team.
              There is one person writing, one laptop, and occasionally a decent cup of coffee.
            </p>
          </section>

          <section>
            <h2 className="font-fraunces text-2xl text-ll-dark mb-4">Editorial standards</h2>
            <p>
              Every profile on this site was reported in person — a real conversation, usually
              at the subject's business or home, often lasting longer than either of us planned.
              Notes are taken by hand. Photos are taken on-site.
            </p>
            <p>
              AI tools are used for research, outlining, and editing assistance. No profile is
              published with AI-generated prose. Any draft that starts from a machine goes through
              full rewriting before it goes anywhere near a publish button — not light editing,
              rewriting. If a piece doesn't sound like it came from a person who was in the room,
              it doesn't go up.
            </p>
            <p>
              The lens here is mine. I choose who to profile, what questions to ask, which
              details make it to the page. That means the site reflects what I notice — which is
              shaped by my own history, my failures, the specific geography of my attention. I
              try to be honest about that rather than pretend the work is neutral, because it isn't.
              No journalism is.
            </p>
          </section>

          <section>
            <h2 className="font-fraunces text-2xl text-ll-dark mb-4">Why these stories</h2>
            <p>
              There are a lot of people in this part of Alabama who have been building something
              for years — a business, a trade, a way of being in the world — and who have never
              had anyone sit down and ask them about it carefully. These stories exist because
              careful attention is the least expensive thing I can offer, and because I think
              it matters that someone wrote it down.
            </p>
          </section>

          <footer className="pt-8 border-t border-ll-border">
            <p className="text-ll-text-light text-sm">
              Southern Legends is written and produced by{" "}
              <a href="/about" className="text-ll-primary hover:underline">
                Matt Headley
              </a>{" "}
              in Jacksonville, Alabama.
            </p>
          </footer>

        </div>
      </div>
    </main>
  );
}
