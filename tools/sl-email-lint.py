#!/usr/bin/env python3
"""sl-email-lint — fail if Southern Legends site email code breaks the sending rules.

Checks (exit 1 on any failure):
  1. Every Resend `emails.send` / `broadcasts.create` call in src/app/api uses a
     `from:` on a verified domain (matthewheadley.com, gatherstudio.app,
     theaisle.app) and never a `noreply@` address. A `from:` given as a constant
     (e.g. SL_FROM) is resolved from `export const NAME = "..."` in src/lib.
  2. Every call with `scheduledAt` has an unsubscribe link in its body
     (an href / URL containing "unsubscribe", or the unsubscribe helpers).
  3. The string `southernlegends.blog` appears nowhere in src/.

Usage: python3 tools/sl-email-lint.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
API = SRC / "app" / "api"

VERIFIED_DOMAINS = {"matthewheadley.com", "gatherstudio.app", "theaisle.app"}
CALL_RE = re.compile(r"\b(emails\.send|broadcasts\.create)\s*\(\s*\{")
CONST_RE = re.compile(r"export\s+const\s+([A-Z_][A-Z0-9_]*)\s*=\s*[\"'`]([^\"'`]+)[\"'`]")
FROM_RE = re.compile(r"\bfrom\s*:\s*(?:([\"'`])(.*?)\1|([A-Za-z_][A-Za-z0-9_]*))", re.S)
UNSUB_RE = re.compile(
    r"unsubscribe(?:Url|FooterHtml|FooterText)\s*\(|href=[\"'][^\"']*unsubscribe|RESEND_UNSUBSCRIBE_URL|/api/unsubscribe",
    re.I,
)
SOURCE_EXT = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".md", ".mdx", ".css", ".html"}


def load_constants() -> dict[str, str]:
    consts: dict[str, str] = {}
    for f in (SRC / "lib").rglob("*.ts"):
        for name, val in CONST_RE.findall(f.read_text(encoding="utf-8", errors="ignore")):
            consts[name] = val
    return consts


def call_body(text: str, start: int) -> str:
    """Return the text of the object literal starting at the `{` at/after start."""
    i = text.index("{", start)
    depth = 0
    in_str: str | None = None
    j = i
    while j < len(text):
        c = text[j]
        if in_str:
            if c == "\\":
                j += 2
                continue
            if c == in_str:
                in_str = None
        elif c in "\"'`":
            in_str = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return text[i : j + 1]
        j += 1
    return text[i:]


def extract_address(sender: str) -> str:
    m = re.search(r"<([^>]+)>", sender)
    return (m.group(1) if m else sender).strip().lower()


def main() -> int:
    errors: list[str] = []
    consts = load_constants()

    for f in sorted(API.rglob("*.ts")):
        text = f.read_text(encoding="utf-8", errors="ignore")
        rel = f.relative_to(ROOT)
        for m in CALL_RE.finditer(text):
            line = text.count("\n", 0, m.start()) + 1
            body = call_body(text, m.end() - 1)
            where = f"{rel}:{line} ({m.group(1)})"

            fm = FROM_RE.search(body)
            if not fm:
                errors.append(f"{where}: no `from:` found")
            else:
                if fm.group(3):
                    name = fm.group(3)
                    if name not in consts:
                        errors.append(f"{where}: `from: {name}` is not a string constant exported from src/lib")
                        sender = ""
                    else:
                        sender = consts[name]
                else:
                    sender = fm.group(2)
                if sender:
                    addr = extract_address(sender)
                    domain = addr.split("@")[-1]
                    if addr.startswith("noreply@") or addr.startswith("no-reply@"):
                        errors.append(f"{where}: from uses a no-reply address ({addr})")
                    elif "${" in addr:
                        errors.append(f"{where}: from address is templated ({addr}); use a constant")
                    elif domain not in VERIFIED_DOMAINS:
                        errors.append(f"{where}: from domain {domain!r} is not a verified Resend domain")

            if "scheduledAt" in body and not UNSUB_RE.search(body):
                errors.append(f"{where}: scheduled email has no unsubscribe link")
            # Matt's voice: emails open with "Hey" (Southern, how he talks), never "Hi"/"Hello"/"Dear".
            if re.search(r"(<p[^>]*>|[`\"'])\s*(Hi|Hello|Dear|Greetings)\b[ ,$]", body):
                errors.append(f'{where}: greeting opens with Hi/Hello/Dear; Matt says "Hey"')

    for f in SRC.rglob("*"):
        if f.is_file() and f.suffix in SOURCE_EXT:
            text = f.read_text(encoding="utf-8", errors="ignore")
            for i, ln in enumerate(text.splitlines(), 1):
                if "southernlegends.blog" in ln:
                    errors.append(f"{f.relative_to(ROOT)}:{i}: southernlegends.blog (use southernlegends.org)")

    if errors:
        print(f"sl-email-lint: {len(errors)} problem(s)")
        for e in errors:
            print("  " + e)
        return 1
    print("sl-email-lint: OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
