# Journal Writing Workflow
*For personal essays — distinct from the profile workflow.*
*Started April 15 2026. Finish documenting after the-same-domain.mdx is complete.*

---

## The Process (draft)

1. **Talk first.** Voice memo or AI chat — not writing. Get the emotional core out loud before touching the keyboard. Don't try to construct, just talk.

2. **Transcribe.** Use `~/Developer/webdev/tools/transcribe.py` with Replicate (thomasmol/whisper-diarization). Two memos under 5MB each take under a minute.

3. **Label speakers.** If transcript includes an AI chat, mark Matt's words vs. AI's words explicitly before using anything. Only Matt's words are raw material.

4. **Gap audit.** Before organizing, identify implied scenes and check each for: time/place anchor, first sensory hit, specific visual detail. Ask one question per gap. Wait for the answer.

5. **Organize words.** Pull Matt's exact words into a doc by section. No paraphrasing, no connective tissue. Just his words in the right order.

6. **Merge into MDX.** Drop organized words as plain prose into the MDX shell. No comment blocks, no markers. Matt writes the connective tissue, opening, and ending directly into the file.

7. **Draft → gap audit → edit.** Matt writes. Editor (Claude) runs gap audit on the draft, asks one question at a time, flags rhythm and kill list violations. Matt makes all changes.

8. **Voice guide audit.** Run the self-audit checklist from `content/AUTHENTIC-VOICE-GUIDE.md` against the draft. Re-read the guide — don't rely on memory.

9. **Rest.** Leave the draft at least one day before second read. Read it cold — it will tell you what it needs that a hot read won't.

10. **Second-draft decisions.** Links, title, excerpt — resolve the editorial decisions comment at the top of the file before publish.

---

## What's different from the profile workflow

- No interview subject — all material comes from Matt's own voice
- Voice memos replace the interview recording
- The gap audit checks Matt's own scenes, not a subject's
- Opening and ending are always Matt's — no scaffold substitutes

---

## Design & Editorial Decisions (from the-same-domain session, April 15 2026)

### Drop caps
- **Profiles only, not journals.** Profiles start with a character — the drop cap signals "this is a story about someone." Journals start with Matt's own voice — a drop cap feels too formal, too literary. The essay doesn't need that signal.
- Implementation: `.prose-journal` class in `globals.css` is identical to `.prose-profile` but without the `::first-letter` drop cap rule.

### Pull quotes
- **Generally not for journals.** In a short personal essay, a pull quote repeats something the reader just saw — it's redundant. Pull quotes earn their place in profiles by lifting the subject's voice to the surface, creating a second read-layer. In Matt's essays, the voice is already his throughout — there's no second voice to surface.
- Exception: a very long essay (4000+ words) where a key line would otherwise get lost in the middle. Use rarely.

### Featured post on /journal listing
- Add `featured: true` to a post's frontmatter to pin it as the hero card at the top of `/journal`.
- Falls back to the most recent post if nothing is flagged.
- To change the featured post: remove `featured: true` from the old one, add it to the new one.

### FeaturedImage placement
- **After the opening section, not at the top.** Reader earns it by reading in. Full-width photos work well for journals of emotional weight. Place after the first horizontal rule or scene break.

### MDX comment syntax
- **Use `{/* */}` not `<!-- -->`.** HTML comments cause a parse error in MDX: "Unexpected character `!`". MDX only accepts JSX comment syntax.

### Image conversion workflow (HEIC → WebP)
1. `sips -s format png input.heic --out output.png` — HEIC to PNG (preserves color; ffmpeg loses it)
2. `cwebp -q 80 output.png -o output.webp` — PNG to WebP
3. `sips -r 90 output.webp --out output.webp` — fix rotation if needed (sips doesn't honor EXIF orientation automatically)

### Cache busting for Next.js images
- **Rename the file when replacing an existing image.** Next.js caches images by URL. Replacing the file at the same path won't clear the cache — even after deleting `.next/cache/images` and restarting the server. A new filename forces a fresh fetch.

### Draft file naming
- Draft as `.md`, rename to `.mdx` at publish time. The MDX parser ignores `.md` files — safe to leave in `content/journal-drafts/` without accidentally publishing.

### Merged vs. separate docs
- **Merged MDX is better.** Maintaining a separate words doc + an MDX shell creates two sources of truth. Once Matt starts writing connective tissue, move everything into the MDX file and delete the words doc. Scaffolding docs (`resume-*.md`, `*-words.md`) become stale fast — close them out when the MDX draft is underway.

---

## Notes (from the-same-domain session)

- Talk → transcribe → label → organize → merge into MDX → draft → edit → voice audit → rest → second read → publish is the right sequence. Don't compress.
- Two voice memos + one Claude.ai chat produced enough material. One session is enough to get the emotional core if you talk freely.
- The gap audit (one question at a time, wait for answer) is the best way to catch implied scenes that don't have enough grounding yet.
- Enneagram note (type 4 identity, "being vs. doing" tension) was cut — good instinct. It's real material but a different essay. Track it as a seed.
