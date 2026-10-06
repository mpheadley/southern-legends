#!/usr/bin/env python3
"""
email-masthead.py — builds public/images/email/sl-masthead-editorial.jpg for SL subscriber emails.

Source: a frame of the SL watercolor end card (sl-watercolor-bumper-v3-trimmed.mp4 at 12s),
cropped clear of the recording's UI chrome and the cat, then the SL badge is redrawn with
just "SL" (Matt, 2026-10-05: no "Southern Legends" words inside the badge, the title below
already says it).

  python3 tools/email-masthead.py
"""
from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

REPO = Path(__file__).resolve().parent.parent
BUMPER = Path("/Volumes/Samsung_T5/DownloadsT5/bumpers/sl-watercolor-bumper-v3-trimmed.mp4")
FONT = Path("/Volumes/Samsung_T5/webdev/gather/assets/fonts/Fraunces-Black.ttf")
OUT = REPO / "public/images/email/sl-masthead-editorial.jpg"

BADGE_BOX = (534, 33, 722, 220)   # badge position in the 1200x628 banner
BADGE_FILL = (120, 47, 20)
CREAM = (245, 239, 227)


def main() -> None:
    with tempfile.TemporaryDirectory() as td:
        frame = Path(td) / "endcard.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "12", "-i", str(BUMPER), "-frames:v", "1",
                        "-vf", "crop=1708:960:106:60,scale=1920:1080:flags=lanczos,"
                               "crop=1280:670:290:195,scale=1200:-2:flags=lanczos", str(frame)], check=True)
        im = Image.open(frame).convert("RGB")

    x0, y0, x1, y1 = BADGE_BOX
    pad = 4
    shadow = Image.new("L", im.size, 0)
    ImageDraw.Draw(shadow).rounded_rectangle((x0 - pad + 3, y0 - pad + 5, x1 + pad + 3, y1 + pad + 5), 16, fill=110)
    im.paste((0, 0, 0), mask=shadow.filter(ImageFilter.GaussianBlur(6)))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((x0 - pad, y0 - pad, x1 + pad, y1 + pad), 16, fill=BADGE_FILL)

    font = ImageFont.truetype(str(FONT), 112)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    d.text((cx, cy + 4), "SL", font=font, fill=CREAM, anchor="mm")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    im.save(OUT, quality=88)
    print(OUT, im.size)


if __name__ == "__main__":
    main()
