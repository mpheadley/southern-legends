import { NextResponse } from "next/server";

// The $7/mo newsletter tier is retired (2026-10-05). One monthly offer now:
// the $5 reader tier on /support via /api/patron/checkout.
export async function POST() {
  return NextResponse.json(
    { error: "This tier is no longer offered. See https://southernlegends.org/support" },
    { status: 410 },
  );
}

export async function GET() {
  return POST();
}
