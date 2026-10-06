import { NextResponse } from "next/server";

export async function GET() {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Matt Headley",
    "N:Headley;Matt;;;",
    "ORG:Southern Legends",
    "TITLE:Writer",
    "TEL;TYPE=CELL:+12566447334",
    "EMAIL;TYPE=WORK:matt@gatherstudio.app",
    "URL:https://southernlegends.org",
    "NOTE:Longform stories from Northeast Alabama.",
    "END:VCARD",
  ].join("\r\n");

  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="Matt Headley - Southern Legends.vcf"',
    },
  });
}
