#!/usr/bin/env python3
"""
sl-notify-subscribers.py — email a newly live Southern Legends page to the subscriber list.

Matt reviews every email before it goes out. Python enforces that, not a prompt:
  1. preview  : builds the email, checks the page is live, saves the preview + a content hash,
                and opens it in the browser. Sends nothing.
  2. --send   : refuses unless (a) a preview exists for the exact same content, (b) the page is
                live on southernlegends.org, (c) this slug hasn't been sent before, and
                (d) inside a Claude session, SL_NOTIFY_APPROVED=<slug> is set (Matt's go for
                THAT send, every time).

Handles profiles, essays, and listicles.

Usage:
  python3 tools/sl-notify-subscribers.py <slug>             # preview only, opens in browser
  python3 tools/sl-notify-subscribers.py <slug> --send      # broadcast (after review)
  python3 tools/sl-notify-subscribers.py --pending          # preview every live page not yet sent
  python3 tools/sl-notify-subscribers.py --skip <slug>      # mark a page as "don't email"

Sends through Resend broadcasts to the SL audience (RESEND_FULL_ACCESS_KEY).
From: Southern Legends <stories@matthewheadley.com>. southernlegends.org is not a verified
Resend domain yet; switch FROM once it is.
"""
from __future__ import annotations

import hashlib
import html as htmlmod
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
ROOT = REPO.parent
SITE = "https://southernlegends.org"
FROM = "Southern Legends <stories@matthewheadley.com>"
REPLY_TO = "matt@gatherstudio.app"
AUDIENCE_ID = "bc84e16a-40ed-4e6b-bc6e-1396bcb83a92"
OUT = ROOT / "reports" / "sl-notify"
SENT_LOG = OUT / "sent.jsonl"
SKIP_LOG = OUT / "skip.jsonl"
# Pages dated before this were live before the pipeline existed; --pending ignores them.
PENDING_SINCE = "2026-10-01"

KINDS = {
    "profile": (REPO / "content" / "profiles", "profiles"),
    "essay": (REPO / "content" / "journal", "essays"),
    "listicle": (REPO / "content" / "listicles", "listicles"),
}


def load_env(key: str) -> str:
    v = os.environ.get(key)
    if v:
        return v.strip()
    for p in (REPO / ".env.local", ROOT / ".env.local", Path.home() / "Developer/webdev/.env.local"):
        if p.exists():
            for line in p.read_text().splitlines():
                if line.startswith(f"{key}="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    return ""


def find(slug: str) -> tuple[str, Path, str] | None:
    for kind, (d, route) in KINDS.items():
        p = d / f"{slug}.mdx"
        if p.exists():
            return kind, p, route
    return None


def frontmatter(path: Path) -> dict:
    m = re.match(r"^---\n(.*?)\n---", path.read_text(encoding="utf-8"), re.S)
    fm = {}
    if m:
        for line in m.group(1).splitlines():
            if ":" in line and not line.startswith((" ", "-")):
                k, v = line.split(":", 1)
                fm[k.strip()] = v.strip().strip('"').strip("'")
    return fm


def is_live(url: str) -> bool:
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method="HEAD"), timeout=30) as r:
            return r.status == 200
    except Exception:
        return False


def read_log(p: Path) -> set[str]:
    if not p.exists():
        return set()
    return {json.loads(l)["slug"] for l in p.read_text().splitlines() if l.strip()}


def append_log(p: Path, row: dict) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with p.open("a") as f:
        f.write(json.dumps(row) + "\n")


def email_safe(img: str) -> str:
    """Older Outlook can't show WebP. For a /public WebP, make a JPG sibling (<name>-email.jpg,
    1200px wide) and use that. It ships with the next deploy; send() refuses until it's live."""
    if not img.startswith("/") or not img.lower().endswith(".webp"):
        return img
    src = REPO / "public" / img.lstrip("/")
    jpg_rel = img[:-5] + "-email.jpg"
    jpg = REPO / "public" / jpg_rel.lstrip("/")
    if src.exists() and not jpg.exists():
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vf", "scale='min(1200,iw)':-2",
                        "-q:v", "3", str(jpg)], check=True)
    return jpg_rel if jpg.exists() else img


def image_urls(body: str) -> list[str]:
    return re.findall(r'<img[^>]+src="([^"]+)"', body)


# ---------------------------------------------------------------------------
# Email design components. Every SL email is built from these, so the look
# stays consistent. Table layout + inline styles for email clients.
# Tokens mirror southern-legends/src/app/globals.css (--color-ll-*).
# ---------------------------------------------------------------------------
C = {
    "primary": "#9A3412", "primary_dark": "#7C2D12", "accent": "#CA8A04",
    "dark": "#1C1917", "light": "#FAFAF7", "warm": "#F0EDE6", "text": "#3F3B36",
    "muted": "#6B6560", "border": "#E5E5E0",
}
SERIF = "'Fraunces', Georgia, 'Times New Roman', serif"
BODY = "Georgia, 'Times New Roman', serif"
MONO = "'Courier Prime', 'Courier New', Courier, monospace"
SANS = "'Inter', Arial, Helvetica, sans-serif"
WORDMARK = f"{SITE}/ad-assets/sl-wordmark-crimson.png"
MASTHEAD = f"{SITE}/images/email/sl-masthead-editorial.jpg"
SIGNATURE = f"{SITE}/images/email/matt-signature.png"
HEADSHOT = f"{SITE}/images/email/matt-headshot-240.jpg"
_e = htmlmod.escape


def _abs(src: str) -> str:
    return SITE + src if src.startswith("/") else src


def c_kicker(text: str) -> str:
    return (f'<tr><td class="px" style="padding:28px 40px 6px;font-family:{MONO};font-size:13px;letter-spacing:2px;'
            f'text-transform:uppercase;color:{C["primary"]};">{_e(text)}</td></tr>')


def c_masthead(dateline: str) -> str:
    """Editorial masthead: full-width banner from the SL watercolor end card, dateline strip below."""
    return (f'<tr><td style="padding:0;background:{C["dark"]};"><a href="{SITE}">'
            f'<img src="{MASTHEAD}" width="600" alt="Southern Legends. Northeast Alabama, by Matt Headley." '
            f'style="display:block;width:100%;max-width:600px;height:auto;border:0;"></a></td></tr>'
            f'<tr><td class="px" align="center" style="padding:14px 40px;background:{C["dark"]};font-family:{MONO};'
            f'font-size:12px;letter-spacing:3px;text-transform:uppercase;color:{C["accent"]};">{_e(dateline)}</td></tr>')


def c_photo(src: str, alt: str, caption: str = "", href: str = "") -> str:
    img = (f'<img src="{_e(_abs(src))}" width="520" alt="{_e(alt)}" '
           f'style="display:block;width:100%;max-width:520px;height:auto;border:0;border-radius:6px;">')
    if href:
        img = f'<a href="{_e(href)}">{img}</a>'
    cap = (f'<div style="font-family:{SANS};font-size:12px;line-height:1.5;color:{C["muted"]};padding-top:8px;">'
           f'{_e(caption)}</div>') if caption else ""
    return f'<tr><td class="px" style="padding:24px 40px 4px;">{img}{cap}</td></tr>'


def c_prose(paragraphs: list[str]) -> str:
    ps = "".join(f'<p style="margin:0 0 16px;">{p}</p>' for p in paragraphs)  # trusted letter HTML
    return (f'<tr><td class="px" style="padding:20px 40px 4px;font-family:{BODY};font-size:18px;line-height:1.65;'
            f'color:{C["text"]};">{ps}</td></tr>')


def c_button(href: str, label: str) -> str:
    return (f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>'
            f'<td style="background:{C["primary"]};border-radius:4px;">'
            f'<a href="{_e(href)}" style="display:inline-block;padding:14px 26px;font-family:{SANS};font-size:16px;'
            f'font-weight:700;color:#ffffff;text-decoration:none;">{_e(label)} &rarr;</a></td></tr></table>')


def c_story(kicker: str, title: str, dek: str, image: str, alt: str, credit: str, href: str,
            hero: bool = False) -> str:
    """Story card. hero=True: the image is a rendered email hero (tools/sl-share-card.py --email-hero)
    that already carries kicker, title, and credit, so the card shows only the dek and button."""
    if hero:
        return (f'<tr><td class="px" style="padding:28px 40px 8px;">'
                f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
                f'style="border-radius:8px;background:{C["dark"]};">'
                f'<tr><td style="padding:0;"><a href="{_e(href)}"><img src="{_e(_abs(image))}" width="520" alt="{_e(alt or title)}" '
                f'style="display:block;width:100%;height:auto;border:0;border-radius:8px 8px 0 0;"></a></td></tr>'
                f'<tr><td style="padding:0 24px 26px;">'
                f'<div style="font-family:{BODY};font-size:17px;line-height:1.6;color:#E7E2D9;padding:0 0 18px;">{_e(dek)}</div>'
                f'{c_button(href, "Read the full story")}</td></tr></table></td></tr>')
    cred = (f'<div style="font-family:{SANS};font-size:11px;color:{C["muted"]};padding:6px 0 0;">{_e(credit)}</div>'
            if credit else "")
    return (f'<tr><td class="px" style="padding:28px 40px 8px;">'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
            f'style="border:1px solid {C["border"]};border-radius:8px;background:#ffffff;">'
            f'<tr><td style="padding:0;"><a href="{_e(href)}"><img src="{_e(_abs(image))}" width="518" alt="{_e(alt)}" '
            f'style="display:block;width:100%;height:auto;border:0;border-radius:8px 8px 0 0;"></a></td></tr>'
            f'<tr><td style="padding:16px 24px 24px;">{cred}'
            f'<div style="font-family:{MONO};font-size:12px;letter-spacing:2px;text-transform:uppercase;'
            f'color:{C["accent"]};padding:12px 0 6px;">{_e(kicker)}</div>'
            f'<div style="font-family:{SERIF};font-size:28px;line-height:1.15;font-weight:700;color:{C["dark"]};'
            f'padding:0 0 10px;"><a href="{_e(href)}" style="color:{C["dark"]};text-decoration:none;">{_e(title)}</a></div>'
            f'<div style="font-family:{BODY};font-size:17px;line-height:1.6;color:{C["text"]};padding:0 0 18px;">{_e(dek)}</div>'
            f'{c_button(href, "Read the full story")}</td></tr></table></td></tr>')


def c_video(thumb: str, page_url: str, label: str, length: str) -> str:
    """Video card. ALWAYS links to the video's section on the SL page (<page>#video), never to
    YouTube directly (Matt, 2026-10-05). send() checks the live page has id="video"."""
    href = page_url.split("#")[0] + "#video"
    return (f'<tr><td class="px" style="padding:20px 40px 8px;">'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
            f'style="background:{C["dark"]};border-radius:8px;">'
            f'<tr><td style="padding:0;"><a href="{href}"><img src="{_e(_abs(thumb))}" width="520" alt="{_e(label)}" '
            f'style="display:block;width:100%;height:auto;border:0;border-radius:8px 8px 0 0;"></a></td></tr>'
            f'<tr><td style="padding:14px 20px;"><a href="{href}" style="font-family:{SANS};font-size:15px;font-weight:700;'
            f'color:#ffffff;text-decoration:none;"><span style="color:{C["accent"]};">&#9654;</span>&nbsp; {_e(label)}'
            + (f'<span style="font-weight:400;color:#b8b2aa;"> &middot; {_e(length)}</span>' if length else '') + f'</a></td></tr>'
            f'</table></td></tr>')


def c_events(title: str, rows: list[dict], link: dict | None = None) -> str:
    trs = "".join(
        f'<tr><td valign="top" style="padding:10px 14px 10px 0;width:76px;">'
        f'<div style="background:{C["primary"]};color:#fff;border-radius:4px;text-align:center;padding:6px 0;'
        f'font-family:{MONO};font-size:12px;letter-spacing:1px;line-height:1.3;">{_e(r["day"])}<br>'
        f'<span style="font-family:{SERIF};font-size:22px;font-weight:700;letter-spacing:0;">{_e(r["date"])}</span></div></td>'
        f'<td valign="top" style="padding:10px 0;font-family:{BODY};font-size:16px;line-height:1.55;color:{C["text"]};">'
        f'<b style="color:{C["dark"]};">{_e(r["what"])}</b><br>{_e(r["detail"])}</td></tr>'
        for r in rows)
    lk = (f'<div style="padding-top:8px;"><a href="{_e(link["href"])}" style="font-family:{SANS};font-size:15px;'
          f'font-weight:700;color:{C["primary"]};">{_e(link["label"])} &rarr;</a></div>') if link else ""
    return (f'<tr><td class="px" style="padding:24px 40px 8px;">'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
            f'style="background:{C["warm"]};border-left:4px solid {C["accent"]};border-radius:0 8px 8px 0;">'
            f'<tr><td style="padding:18px 22px;"><div style="font-family:{MONO};font-size:12px;letter-spacing:2px;'
            f'text-transform:uppercase;color:{C["muted"]};padding-bottom:4px;">{_e(title)}</div>'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{trs}</table>{lk}'
            f'</td></tr></table></td></tr>')


def c_note(html_text: str) -> str:
    return (f'<tr><td class="px" style="padding:20px 40px 4px;font-family:{BODY};font-size:16px;line-height:1.6;'
            f'color:{C["muted"]};font-style:italic;">{html_text}</td></tr>')


def c_signoff(closing: str = "Thanks for reading,") -> str:
    return (f'<tr><td class="px" style="padding:24px 40px 8px;">'
            f'<div style="font-family:{BODY};font-size:18px;color:{C["text"]};padding-bottom:4px;">{_e(closing)}</div>'
            f'<img src="{SIGNATURE}" width="150" alt="Matt" style="display:block;width:150px;height:auto;border:0;margin:0 0 14px;">'
            f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>'
            f'<td valign="middle" style="padding-right:14px;"><img src="{HEADSHOT}" width="64" height="64" alt="Matt Headley" '
            f'style="display:block;width:64px;height:64px;border-radius:32px;border:2px solid {C["border"]};"></td>'
            f'<td valign="middle" style="font-family:{SANS};font-size:14px;line-height:1.5;color:{C["muted"]};">'
            f'<b style="font-family:{SERIF};font-size:17px;color:{C["dark"]};">Matt Headley</b><br>'
            f'Writer, Southern Legends<br><a href="{SITE}" style="color:{C["primary"]};text-decoration:none;">southernlegends.org</a>'
            f'</td></tr></table></td></tr>')


def c_footer() -> str:
    return (f'<tr><td class="px" style="padding:28px 40px 32px;border-top:1px solid {C["border"]};font-family:{SANS};font-size:12px;'
            f'line-height:1.7;color:{C["muted"]};" align="center">'
            f"You're getting this because you subscribed to Southern Legends, stories from Northeast Alabama.<br>"
            f'Free to read, always. <a href="{SITE}/support" style="color:{C["primary"]};">Support the work</a> &middot; '
            f'<a href="{SITE}" style="color:{C["muted"]};">southernlegends.org</a> &middot; '
            f'<a href="{{{{{{RESEND_UNSUBSCRIBE_URL}}}}}}" style="color:{C["muted"]};">Unsubscribe</a></td></tr>')


def c_info(title: str, html_text: str, link: dict | None = None) -> str:
    lk = (f'<div style="padding-top:10px;"><a href="{_e(link["href"])}" style="font-family:{SANS};font-size:15px;'
          f'font-weight:700;color:{C["primary"]};">{_e(link["label"])} &rarr;</a></div>') if link else ""
    return (f'<tr><td class="px" style="padding:24px 40px 8px;">'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
            f'style="background:{C["warm"]};border-left:4px solid {C["accent"]};border-radius:0 8px 8px 0;">'
            f'<tr><td style="padding:18px 22px;"><div style="font-family:{MONO};font-size:12px;letter-spacing:2px;'
            f'text-transform:uppercase;color:{C["muted"]};padding-bottom:6px;">{_e(title)}</div>'
            f'<div style="font-family:{BODY};font-size:16px;line-height:1.6;color:{C["text"]};">{html_text}</div>{lk}'
            f'</td></tr></table></td></tr>')


def c_crisis() -> str:
    """Safe messaging. Any email that mentions suicide must carry this (send() refuses otherwise)."""
    return (f'<tr><td class="px" style="padding:20px 40px 4px;">'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" '
            f'style="background:#faf6ee;border-left:4px solid {C["accent"]};border-radius:0 8px 8px 0;">'
            f'<tr><td style="padding:14px 18px;font-family:{SANS};font-size:15px;line-height:1.55;color:{C["text"]};">'
            f'This story talks about suicide. If you or someone you know is struggling, call or text '
            f'<a href="tel:988" style="color:{C["primary"]};font-weight:700;">988</a>, the Suicide &amp; Crisis Lifeline, '
            f'any time. It\'s free and confidential.</td></tr></table></td></tr>')


def c_ad(image: str, href: str, alt: str, label: str, html_text: str = "") -> str:
    """A labeled promo (e.g. The Aisle, Matt's own event). Always carries a visible label."""
    txt = (f'<div style="font-family:{BODY};font-size:16px;line-height:1.6;color:{C["text"]};padding:0 0 14px;">'
           f'{html_text}</div>') if html_text else ""
    return (f'<tr><td class="px" align="center" style="padding:28px 40px 8px;">'
            f'<div style="font-family:{MONO};font-size:11px;letter-spacing:2px;text-transform:uppercase;'
            f'color:{C["muted"]};padding:0 0 10px;">{_e(label)}</div>{txt}'
            f'<a href="{_e(href)}"><img src="{_e(_abs(image))}" width="300" alt="{_e(alt)}" '
            f'style="display:block;width:300px;max-width:100%;height:auto;border:0;border-radius:6px;'
            f'box-shadow:0 2px 10px rgba(0,0,0,0.12);"></a></td></tr>')


def wrap(rows: str, preheader: str = "") -> str:
    pre = (f'<div style="display:none;max-height:0;overflow:hidden;opacity:0;">{_e(preheader)}</div>'
           if preheader else "")
    return (f'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">'
            f'<style>@media (max-width:480px){{.px{{padding-left:18px!important;padding-right:18px!important}}}}</style>'
            f'<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=Courier+Prime&family=Inter:wght@400;700&display=swap" rel="stylesheet">'
            f'</head><body style="margin:0;padding:0;background:{C["warm"]};">{pre}'
            f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:{C["warm"]};">'
            f'<tr><td align="center" style="padding:24px 12px;">'
            f'<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" '
            f'style="width:100%;max-width:600px;background:{C["light"]};border-radius:10px;overflow:hidden;">'
            f'{rows}</table></td></tr></table></body></html>')


BLOCKS = {
    "kicker": lambda b: c_kicker(b["text"]),
    "photo": lambda b: c_photo(b["src"], b.get("alt", ""), b.get("caption", ""), b.get("href", "")),
    "prose": lambda b: c_prose(b["paragraphs"]),
    "story": lambda b: c_story(b.get("kicker", ""), b["title"], b["dek"], b["image"], b.get("alt", ""),
                               b.get("credit", ""), b["href"], b.get("hero", False)),
    "video": lambda b: c_video(b["thumb"], b["page"], b["label"], b.get("length", "")),
    "events": lambda b: c_events(b["title"], b["rows"], b.get("link")),
    "note": lambda b: c_note(b["html"]),
    "signoff": lambda b: c_signoff(b.get("closing", "Thanks for reading,")),
    "crisis": lambda b: c_crisis(),
    "info": lambda b: c_info(b["title"], b["html"], b.get("link")),
    "ad": lambda b: c_ad(b["image"], b["href"], b.get("alt", ""), b.get("label", "Advertisement"), b.get("html", "")),
}


def render_blocks(spec: dict) -> str:
    rows = c_masthead(spec.get("dateline", "Stories from Northeast Alabama"))
    rows += "".join(BLOCKS[b["type"]](b) for b in spec["blocks"])
    return wrap(rows + c_footer(), spec.get("preheader", ""))


def youtube_thumb(url: str) -> str:
    m = re.search(r"(?:v=|youtu\.be/|shorts/|embed/)([A-Za-z0-9_-]{11})", url or "")
    return f"https://i.ytimg.com/vi/{m.group(1)}/maxresdefault.jpg" if m else ""


def build_email(fm: dict, slug: str, route: str, text: str = "") -> tuple[str, str, str]:
    """Auto email for a newly live page, built from the same components as letters."""
    title = fm.get("title", slug)
    name = fm.get("name", "")
    dek = fm.get("subtitle") or fm.get("excerpt", "")
    url = f"{SITE}/{route}/{slug}"
    kicker = {"profiles": "New profile", "essays": "New essay", "listicles": "New list"}[route]
    if name and route == "profiles":
        kicker += f" · {name}"
    credit = fm.get("photoCredit") or fm.get("heroCredit") or ""
    if credit and not credit.lower().startswith("photo"):
        credit = f"Photo: {credit}"
    blocks = [{"type": "crisis"}] if re.search(r"suicid", text, re.I) else []
    blocks += [{"type": "story", "kicker": kicker, "title": title, "dek": dek,
               "image": email_safe(fm.get("heroImage") or fm.get("image") or ""),
               "alt": fm.get("heroAlt", title), "credit": credit, "href": url}]
    thumb = youtube_thumb(fm.get("youtubeUrl", ""))
    if thumb:
        blocks.append({"type": "video", "thumb": thumb, "page": url, "label": "Watch the interview"})
    blocks.append({"type": "signoff"})
    return title, render_blocks({"preheader": dek, "blocks": blocks}), url


LETTERS = OUT / "letters"


def load_letter(slug: str) -> tuple[str, str, str] | None:
    """A letter (welcome, roundup) is DATA in reports/sl-notify/letters/<slug>.json:
    {"subject", "check_url", "preheader", "dateline", "covers": [...], "blocks": [...]}.
    Block types: see BLOCKS. Rendered by the same components as every SL email."""
    p = LETTERS / f"{slug}.json"
    if not p.exists():
        return None
    meta = json.loads(p.read_text())
    return meta["subject"], render_blocks(meta), meta["check_url"]


def preview(slug: str, open_it: bool = True) -> dict | None:
    letter = load_letter(slug) if slug.startswith("letter-") else None
    if letter:
        subject, body, url = letter
        return _write_preview(slug, subject, body, url, open_it)
    hit = find(slug)
    if not hit:
        print(f"{slug}: not found")
        return None
    kind, path, route = hit
    fm = frontmatter(path)
    if fm.get("published", "true").lower() == "false" or fm.get("aiWritten", "false").lower() == "true":
        print(f"{slug}: not published (or aiWritten). Not emailing.")
        return None
    subject, body, url = build_email(fm, slug, route, path.read_text(encoding="utf-8"))
    return _write_preview(slug, subject, body, url, open_it)


def _write_preview(slug: str, subject: str, body: str, url: str, open_it: bool) -> dict:
    live = is_live(url)
    h = hashlib.sha256((subject + body).encode()).hexdigest()
    OUT.mkdir(parents=True, exist_ok=True)
    page = OUT / f"{slug}.html"
    # Images not on the live site yet (waiting on a deploy) show from the local file in the
    # preview only, so Matt sees the real email. The sent email always uses the live URL.
    shown, pending_imgs = body, []
    for u in image_urls(body):
        if u.startswith(SITE) and not is_live(u):
            local = REPO / "public" / u[len(SITE):].lstrip("/")
            pending_imgs.append(u[len(SITE):])
            if local.exists():
                shown = shown.replace(u, local.as_uri())
    note = (f" · <b style='color:#8B2A1F'>{len(pending_imgs)} image(s) not live yet, deploy before sending</b>"
            if pending_imgs else "")
    banner = (
        f'<div style="font-family:Arial;background:#fff7d6;border:1px solid #e3b23c;padding:10px 14px;margin:0 0 20px;">'
        f"<b>PREVIEW, not sent.</b> Subject: {htmlmod.escape(subject)} · To: SL subscribers · "
        f'Page live: {"yes" if live else "NO, deploy first"} · <a href="{url}">{url}</a>{note}</div>'
    )
    page.write_text(banner + shown.replace("{{{RESEND_UNSUBSCRIBE_URL}}}", "#"), encoding="utf-8")
    (OUT / f"{slug}.json").write_text(json.dumps({"slug": slug, "hash": h, "url": url, "subject": subject,
                                                  "built": datetime.now(timezone.utc).isoformat()}))
    print(f"{slug}: preview {page}  live={live}")
    if open_it:
        subprocess.run(["open", str(page)])
    return {"slug": slug, "subject": subject, "body": body, "url": url, "hash": h, "live": live}


def resend(path: str, payload: dict | None, key: str, method: str = "POST") -> dict:
    req = urllib.request.Request(
        f"https://api.resend.com{path}", method=method,
        data=json.dumps(payload).encode() if payload is not None else None,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json",
                 "User-Agent": "sl-notify/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        raise SystemExit(f"Resend {path} failed [{e.code}]: {e.read().decode()[:400]}")


def send(slug: str) -> None:
    if slug in read_log(SENT_LOG):
        raise SystemExit(f"{slug}: already sent to subscribers. Refusing to send twice.")
    manifest = OUT / f"{slug}.json"
    if not manifest.exists():
        raise SystemExit(f"{slug}: no preview on file. Run without --send first and review it.")
    if os.environ.get("CLAUDECODE") and os.environ.get("SL_NOTIFY_APPROVED", "") != slug:
        raise SystemExit(f"{slug}: blocked inside a Claude session. Needs Matt's go for this send "
                         f"(SL_NOTIFY_APPROVED={slug}).")
    cur = preview(slug, open_it=False)
    if not cur:
        raise SystemExit(1)
    if cur["hash"] != json.loads(manifest.read_text())["hash"]:
        raise SystemExit(f"{slug}: content changed since the preview Matt saw. Re-preview first.")
    if not cur["live"]:
        raise SystemExit(f"{slug}: page isn't live at {cur['url']}. Deploy first.")
    if re.search(r"suicid", cur["body"], re.I) and "988" not in cur["body"]:
        raise SystemExit(f"{slug}: mentions suicide but has no 988 crisis line. Add a crisis block.")
    broken = [u for u in image_urls(cur["body"]) if not is_live(u)]
    if broken:
        raise SystemExit(f"{slug}: these images don't load yet (deploy first?): {broken}")
    for page in sorted(set(re.findall(r'href="([^"#]+)#video"', cur["body"]))):
        try:
            html = urllib.request.urlopen(page, timeout=30).read().decode("utf-8", "ignore")
        except Exception:
            html = ""
        if 'id="video"' not in html:
            raise SystemExit(f"{slug}: {page} has no #video anchor live yet, so the video link would land "
                             f"at the top of the page. Deploy first.")
    key = load_env("RESEND_FULL_ACCESS_KEY")
    if not key:
        raise SystemExit("RESEND_FULL_ACCESS_KEY not found.")
    b = resend("/broadcasts", {"audience_id": AUDIENCE_ID, "from": FROM, "reply_to": REPLY_TO,
                               "subject": cur["subject"], "html": cur["body"],
                               "name": f"SL - {cur['subject']} - {datetime.now():%Y-%m-%d}"}, key)
    bid = b.get("id")
    if not bid:
        raise SystemExit(f"Broadcast not created: {b}")
    resend(f"/broadcasts/{bid}/send", {}, key)
    append_log(SENT_LOG, {"slug": slug, "broadcast_id": bid, "url": cur["url"],
                          "sent_at": datetime.now(timezone.utc).isoformat()})
    # A letter that features a page counts as that page's email, so --pending won't re-send it.
    meta = LETTERS / f"{slug}.json"
    if slug.startswith("letter-") and meta.exists():
        for covered in json.loads(meta.read_text()).get("covers", []):
            append_log(SENT_LOG, {"slug": covered, "broadcast_id": bid, "via": slug,
                                  "sent_at": datetime.now(timezone.utc).isoformat()})
    print(f"{slug}: sent. Broadcast {bid}")


def pending() -> list[str]:
    done = read_log(SENT_LOG) | read_log(SKIP_LOG)
    out = []
    for kind, (d, route) in KINDS.items():
        for p in sorted(d.glob("*.mdx")):
            fm = frontmatter(p)
            if fm.get("published", "true").lower() == "false" or fm.get("aiWritten", "false").lower() == "true":
                continue
            if fm.get("date", "")[:10] < PENDING_SINCE or p.stem in done:
                continue
            out.append(p.stem)
    return out


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if "--pending" in sys.argv:
        slugs = pending()
        if not slugs:
            print("Nothing pending.")
            return 0
        for s in slugs:
            preview(s)
        print("\nReview each preview. To send one: tools/sl-notify-subscribers.py <slug> --send")
        return 0
    if not args:
        print(__doc__)
        return 1
    slug = args[0].replace(".mdx", "")
    if "--skip" in sys.argv:
        append_log(SKIP_LOG, {"slug": slug, "at": datetime.now(timezone.utc).isoformat()})
        print(f"{slug}: marked don't-email.")
        return 0
    if "--send" in sys.argv:
        send(slug)
    else:
        preview(slug)
    return 0


if __name__ == "__main__":
    sys.exit(main())
