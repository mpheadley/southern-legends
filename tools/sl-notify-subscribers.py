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


def build_email(fm: dict, slug: str, route: str) -> tuple[str, str, str]:
    e = htmlmod.escape
    title = fm.get("title", slug)
    name = fm.get("name", "")
    blurb = fm.get("subtitle") or fm.get("excerpt", "")
    hero = email_safe(fm.get("heroImage") or fm.get("image") or "")
    hero_url = SITE + hero if hero.startswith("/") else hero
    credit = fm.get("photoCredit") or fm.get("heroCredit") or ""
    url = f"{SITE}/{route}/{slug}"
    kicker = {"profiles": "New profile", "essays": "New essay", "listicles": "New list"}[route]
    if name and route == "profiles":
        kicker += f" · {name}"

    hero_html = ""
    if hero_url:
        hero_html = (
            f'<a href="{url}"><img src="{e(hero_url)}" alt="{e(fm.get("heroAlt", title))}" '
            f'style="width:100%;max-width:600px;border-radius:6px;margin:0 0 6px;display:block;"></a>'
        )
        if credit:
            c = credit if credit.lower().startswith("photo") else f"Photo: {credit}"
            hero_html += f'<p style="font-size:11px;color:#8a8378;margin:0 0 22px;">{e(c)}</p>'

    body = f"""\
<div style="max-width:600px;margin:0 auto;font-family:Georgia,serif;color:#1C1917;padding:8px;">
  <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#8B2A1F;margin:0 0 8px;">Southern Legends · {e(kicker)}</p>
  <h1 style="font-size:30px;line-height:1.2;margin:0 0 16px;">{e(title)}</h1>
  {hero_html}
  <p style="font-size:17px;line-height:1.6;color:#3a352f;margin:0 0 24px;">{e(blurb)}</p>
  <p style="margin:0 0 32px;">
    <a href="{url}" style="display:inline-block;background:#8B2A1F;color:#fff;text-decoration:none;font-weight:600;padding:12px 24px;border-radius:4px;font-family:Arial,sans-serif;">Read the full story &rarr;</a>
  </p>
  <hr style="border:none;border-top:1px solid #e5e0d8;margin:0 0 16px;">
  <p style="font-size:13px;color:#8a8378;line-height:1.6;margin:0;">
    You're getting this because you subscribed to Southern Legends, stories from Northeast Alabama.
    Free to read, always. <a href="{SITE}/support" style="color:#8B2A1F;">Support the work</a> if you'd like to help keep it going.<br>
    Matt Headley · <a href="{SITE}" style="color:#8a8378;">southernlegends.org</a> ·
    <a href="{{{{{{RESEND_UNSUBSCRIBE_URL}}}}}}" style="color:#8a8378;">Unsubscribe</a>
  </p>
</div>"""
    return title, body, url


LETTERS = OUT / "letters"


def load_letter(slug: str) -> tuple[str, str, str] | None:
    """A hand-written letter (welcome, roundup) lives in reports/sl-notify/letters/<slug>.json:
    {"subject": ..., "check_url": <page that must be live>, "body_file": <html fragment>}."""
    p = LETTERS / f"{slug}.json"
    if not p.exists():
        return None
    meta = json.loads(p.read_text())
    body = (LETTERS / meta["body_file"]).read_text(encoding="utf-8")
    return meta["subject"], body, meta["check_url"]


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
    subject, body, url = build_email(fm, slug, route)
    return _write_preview(slug, subject, body, url, open_it)


def _write_preview(slug: str, subject: str, body: str, url: str, open_it: bool) -> dict:
    live = is_live(url)
    h = hashlib.sha256((subject + body).encode()).hexdigest()
    OUT.mkdir(parents=True, exist_ok=True)
    page = OUT / f"{slug}.html"
    banner = (
        f'<div style="font-family:Arial;background:#fff7d6;border:1px solid #e3b23c;padding:10px 14px;margin:0 0 20px;">'
        f"<b>PREVIEW, not sent.</b> Subject: {htmlmod.escape(subject)} · To: SL subscribers · "
        f'Page live: {"yes" if live else "NO, deploy first"} · <a href="{url}">{url}</a></div>'
    )
    page.write_text(banner + body.replace("{{{RESEND_UNSUBSCRIBE_URL}}}", "#"), encoding="utf-8")
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
    broken = [u for u in image_urls(cur["body"]) if not is_live(u)]
    if broken:
        raise SystemExit(f"{slug}: these images don't load yet (deploy first?): {broken}")
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
