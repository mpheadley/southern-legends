# Southern Legends — Discoverability Prompt

Paste this into a new Claude Code session when ready to work on it.

---

## Prompt

```
I need to improve discoverability for Southern Legends (southernlegends.blog), an editorial site about people and places in Northeast Alabama. It's a Next.js site deployed on Vercel.

Here's what's already done:
- JSON-LD schema (WebSite, Article, BreadcrumbList) on all pages
- Open Graph + Twitter Cards on all pages
- Dynamic sitemap.ts with priorities
- robots.ts allowing all crawlers
- GA4 (G-3PGNQKKWTN) with consent-based loading
- RSS feed at /profiles/feed.xml
- Canonical URLs on every page

Here's what I need done, in order:

1. **Google Search Console setup**
   - Add google-site-verification meta tag to root layout.tsx metadata
   - I'll give you the verification code once I register the property
   - After verification: submit sitemap URL, check index coverage

2. **Bing Webmaster Tools**
   - Same process — add verification meta tag, submit sitemap

3. **Schema audit**
   - Verify Article schema on profile pages includes all recommended fields (datePublished, dateModified, author, publisher with logo, image, speakable)
   - Add `SameAs` to the publisher/organization schema pointing to social profiles once they exist
   - Test with Google Rich Results Test on 2-3 profile pages

4. **RSS feed validation**
   - Validate feed.xml output against W3C Feed Validation
   - Submit to Google News Publisher Center if eligible (editorial content about local community)

5. **Social profile setup (just the checklist — don't build anything)**
   - What accounts does Southern Legends need? (Facebook page, Instagram, X/Twitter)
   - Draft bio/description consistent across all platforms
   - Note: these become `SameAs` URLs in the Organization schema

6. **Performance quick-check**
   - Run Lighthouse on the homepage and one profile page
   - Flag anything below 90 or images over 100KB

Don't change any copy, design, or content. This is infrastructure/SEO only.
```
