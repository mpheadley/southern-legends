import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nominate a Story — Southern Legends",
  description: "Know someone in Northeast Alabama whose story deserves to be told? Nominate them for a Southern Legends profile.",
};

export default function NominatePage() {
  return (
    <main id="main-content">
      <section className="bg-ll-light">
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ll-primary hover:text-ll-primary-dark transition-colors mb-8"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>

          <h1
            className="text-3xl md:text-4xl font-bold text-ll-dark mb-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Know Someone Worth Writing About?
          </h1>

          <div className="prose-profile mb-12">
            <p className="text-ll-text leading-relaxed mb-6">
              I notice the people who are still building. The ones who couldn't stop, even when stopping looked easier. A craft they won't let go of. A business they started anyway. A place they keep alive because somebody has to.
            </p>
            <p className="text-ll-text leading-relaxed">
              If you know someone like that in Northeast Alabama, tell me about them.
            </p>
          </div>

          {/* Nomination Form */}
          <form
            action="https://formspree.io/f/xyknwdgp"
            method="POST"
            className="space-y-6"
          >
            {/* Subject Name */}
            <div>
              <label
                htmlFor="subject-name"
                className="block text-sm font-medium text-ll-dark mb-2"
              >
                Their name
              </label>
              <input
                type="text"
                id="subject-name"
                name="subject-name"
                required
                className="w-full px-4 py-2 border border-ll-border rounded bg-white text-ll-dark placeholder-ll-text-light focus:outline-none focus:ring-2 focus:ring-ll-primary focus:border-transparent"
                placeholder="Jane Smith"
              />
            </div>

            {/* Business/Place Name */}
            <div>
              <label
                htmlFor="business-name"
                className="block text-sm font-medium text-ll-dark mb-2"
              >
                What they do (business, craft, place, etc.)
              </label>
              <input
                type="text"
                id="business-name"
                name="business-name"
                required
                className="w-full px-4 py-2 border border-ll-border rounded bg-white text-ll-dark placeholder-ll-text-light focus:outline-none focus:ring-2 focus:ring-ll-primary focus:border-transparent"
                placeholder="Smith's Woodshop"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-ll-dark mb-2"
              >
                Location (city, county)
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="w-full px-4 py-2 border border-ll-border rounded bg-white text-ll-dark placeholder-ll-text-light focus:outline-none focus:ring-2 focus:ring-ll-primary focus:border-transparent"
                placeholder="Fort Payne, DeKalb County"
              />
            </div>

            {/* Why Nominate */}
            <div>
              <label
                htmlFor="why-nominate"
                className="block text-sm font-medium text-ll-dark mb-2"
              >
                Why nominate them? What's their story?
              </label>
              <textarea
                id="why-nominate"
                name="why-nominate"
                required
                rows={6}
                className="w-full px-4 py-2 border border-ll-border rounded bg-white text-ll-dark placeholder-ll-text-light focus:outline-none focus:ring-2 focus:ring-ll-primary focus:border-transparent resize-none"
                placeholder="Tell me about them. A few sentences is enough to start."
              />
            </div>

            {/* Your Name */}
            <div>
              <label
                htmlFor="nominator-name"
                className="block text-sm font-medium text-ll-dark mb-2"
              >
                Your name
              </label>
              <input
                type="text"
                id="nominator-name"
                name="name"
                required
                className="w-full px-4 py-2 border border-ll-border rounded bg-white text-ll-dark placeholder-ll-text-light focus:outline-none focus:ring-2 focus:ring-ll-primary focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            {/* Your Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-ll-dark mb-2"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-ll-border rounded bg-white text-ll-dark placeholder-ll-text-light focus:outline-none focus:ring-2 focus:ring-ll-primary focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            {/* Honeypot */}
            <input
              type="hidden"
              name="_gotcha"
              style={{ display: "none" }}
            />

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-ll-primary text-white font-semibold rounded hover:bg-ll-primary-dark transition-colors"
              >
                Send Nomination
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
