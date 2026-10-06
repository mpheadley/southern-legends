#!/usr/bin/env python3
"""
sl-invite-chooser.py: pick people to personally invite to Southern Legends, then stage the invites.

  1. Build + open the chooser (local HTML, never published; it holds contact data):
       python3 tools/sl-invite-chooser.py
     Pulls Turso CRM contacts (theaisle-mpheadley `contacts`) + Google Contacts (People API, read-only),
     merges by email, marks who's already subscribed and who's on the Aisle vendor list.
     Check people, click "Export selection" → saves invite-selection.json to ~/Downloads.

  2. Stage personal invites in the DEPLOYED Iris Inbox (Matt reviews + sends each one there):
       python3 tools/sl-invite-chooser.py --stage ~/Downloads/invite-selection.json --pin <INBOX_PIN> [--limit 25]
     Uses reports/sl-notify/outreach/invite-template.txt ({first} and {link} are filled in).
     Nothing is ever sent from here. Already-subscribed people are skipped at staging.

Everyone is eligible: family, clients, vendors, professional contacts (Matt, 2026-10-05).
Aisle-vendor addresses are only flagged: sa_mailer routes those through the Saturday Society
approval queue, so send those from the deployed Iris Inbox UI.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import subprocess
import sys
import urllib.request
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
ROOT = REPO.parent
OUT = ROOT / "reports" / "sl-notify" / "outreach"
PAGE = OUT / "invite-chooser.html"
TEMPLATE = OUT / "invite-template.txt"
TOKEN = ROOT / "tools" / "crm-gmail-sync" / "token.json"
CREDS = ROOT / "tools" / "crm-gmail-sync" / "credentials.json"
VENDORS = ROOT / "tools" / "data" / "aisle-vendor-recipients.txt"
INBOX = "https://iris-inbox.gatherstudio.app/api/stage"
LINK = "https://southernlegends.org/profiles/no-binoculars-required?utm_source=invite&utm_medium=email&utm_campaign=sl-invite"
ROLE = re.compile(r"^(info|contact|office|admin|hello|sales|support|noreply|no-reply|team|events|marketing|billing|accounts?)@", re.I)

DEFAULT_TEMPLATE = """Hey {first},

I made something, and I'd be so grateful if you took a moment to look at it.

It's called Southern Legends. I write about people in Northeast Alabama who are building something worth knowing about, and about twice a month I send one by email.

The first one is about Cher Dulaney and a birding festival nobody expected Calhoun County to have:
{link}

If you'd like the next one, it's free:
https://southernlegends.org/subscribe?source=invite

No hard feelings either way.

Matt"""


def turso_contacts() -> list[dict]:
    sys.path.insert(0, str(ROOT / "tools"))
    import crm_sqlite
    c = crm_sqlite.connect()
    rows = c.execute("""SELECT id, name, first_name, email, business_type, contact_type, city, last_contacted, source, notes
                        FROM contacts WHERE email LIKE '%@%'""").fetchall()
    subs = {r[0].lower() for r in c.execute(
        "SELECT email FROM newsletter_subscribers WHERE venture='sl' AND status='subscribed'").fetchall()}
    out = []
    for r in rows:
        for email in re.split(r"[,;\s]+", r[3] or ""):
            if "@" in email:
                out.append({"email": email.strip().lower(), "name": r[1] or "", "first": r[2] or "",
                            "org": r[4] or "", "type": (r[5] or "").strip().lower(), "city": r[6] or "",
                            "last": (r[7] or "")[:10], "note": (r[9] or "")[:90], "src": "CRM", "crm_id": r[0]})
    return out, subs


def google_contacts() -> list[dict]:
    from google.oauth2.credentials import Credentials
    from google.auth.transport.requests import Request
    tok = json.loads(TOKEN.read_text())
    cid = tok.get("client_id")
    csec = tok.get("client_secret")
    if not (cid and csec) and CREDS.exists():
        cj = json.loads(CREDS.read_text())
        cj = cj.get("installed") or cj.get("web") or {}
        cid, csec = cj.get("client_id"), cj.get("client_secret")
    creds = Credentials(token=tok.get("token"), refresh_token=tok.get("refresh_token"),
                        token_uri=tok.get("token_uri", "https://oauth2.googleapis.com/token"),
                        client_id=cid, client_secret=csec, scopes=tok.get("scopes"))
    creds.refresh(Request())
    out, page = [], None
    while True:
        url = ("https://people.googleapis.com/v1/people/me/connections?pageSize=1000"
               "&personFields=names,emailAddresses,organizations,addresses" + (f"&pageToken={page}" if page else ""))
        d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={"Authorization": f"Bearer {creds.token}"}), timeout=60))
        for p in d.get("connections", []):
            nm = (p.get("names") or [{}])[0]
            org = (p.get("organizations") or [{}])[0]
            city = ((p.get("addresses") or [{}])[0]).get("city", "")
            for e in p.get("emailAddresses", []):
                if "@" in e.get("value", ""):
                    out.append({"email": e["value"].strip().lower(), "name": nm.get("displayName", ""),
                                "first": nm.get("givenName", ""), "org": org.get("name", "") or org.get("title", ""),
                                "type": "", "city": city, "last": "", "note": "", "src": "Google"})
        page = d.get("nextPageToken")
        if not page:
            return out


def merge(lists: list[list[dict]], subs: set[str], vendors: set[str]) -> list[dict]:
    by = {}
    for lst in lists:
        for c in lst:
            e = c["email"]
            if e in by:
                m = by[e]
                for k in ("name", "first", "org", "type", "city", "last", "note"):
                    if not m.get(k) and c.get(k):
                        m[k] = c[k]
                if c["src"] not in m["src"]:
                    m["src"] += " + " + c["src"]
                if c.get("crm_id") and not m.get("crm_id"):
                    m["crm_id"] = c["crm_id"]
            else:
                by[e] = dict(c)
    for e, m in by.items():
        if not m["first"] and m["name"]:
            m["first"] = m["name"].split()[0]
        m["subscribed"] = e in subs
        m["vendor"] = e in vendors
        m["role"] = bool(ROLE.match(e))
    return sorted(by.values(), key=lambda m: (m["subscribed"], (m["name"] or m["email"]).lower()))


def build_page(people: list[dict]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    data = json.dumps(people).replace("</", "<\\/")
    types = sorted({p["type"] or "(none)" for p in people})
    PAGE.write_text(f"""<!doctype html><html><head><meta charset="utf-8"><title>SL Invite Chooser</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
:root{{--bg:#FAFAF7;--ink:#1C1917;--mut:#6B6560;--pri:#9A3412;--line:#E5E5E0;--warm:#F0EDE6}}
body{{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 Inter,Arial,sans-serif}}
header{{position:sticky;top:0;background:var(--ink);color:#fff;padding:14px 18px;z-index:2}}
header h1{{margin:0 0 8px;font:700 20px Georgia,serif}} .row{{display:flex;flex-wrap:wrap;gap:8px;align-items:center}}
input[type=search]{{flex:1;min-width:200px;padding:8px 10px;border-radius:6px;border:0;font-size:15px}}
button,select{{padding:8px 12px;border-radius:6px;border:0;font-weight:700;cursor:pointer}}
.pri{{background:var(--pri);color:#fff}} .ghost{{background:#3a3532;color:#fff}}
.chips{{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px}} .chip{{background:#3a3532;color:#ddd;border-radius:14px;padding:3px 10px;font-size:12px;cursor:pointer}}
.chip.on{{background:#CA8A04;color:#1C1917}}
table{{width:100%;border-collapse:collapse}} td,th{{padding:7px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}}
th{{font:700 11px 'Courier New',monospace;letter-spacing:1px;text-transform:uppercase;color:var(--mut);background:var(--warm);position:sticky;top:118px}}
tr.sel{{background:#fff7e6}} .mut{{color:var(--mut);font-size:13px}} .b{{display:inline-block;font-size:11px;border-radius:4px;padding:1px 6px;margin-right:4px}}
.sub{{background:#d1fae5;color:#065f46}} .ven{{background:#fde68a;color:#78350f}} .role{{background:#e5e7eb;color:#374151}}
#count{{font-weight:700}} @media(max-width:700px){{.hide-m{{display:none}} th{{top:170px}}}}
</style></head><body>
<header><h1>Southern Legends: who should I invite?</h1>
<div class="row"><input id="q" type="search" placeholder="Search name, email, company, city, notes…">
<label><input type="checkbox" id="hideSub" checked> hide subscribed</label>
<label><input type="checkbox" id="hideRole"> hide info@-type</label>
<button class="ghost" id="selVis">Select visible</button><button class="ghost" id="clr">Clear</button>
<span><span id="count">0</span> chosen</span><button class="pri" id="exp">Export selection</button></div>
<div class="chips" id="chips"></div></header>
<table><thead><tr><th></th><th>Name</th><th>Email</th><th class="hide-m">Org / type</th><th class="hide-m">City</th><th class="hide-m">Last</th><th class="hide-m">Source</th></tr></thead><tbody id="tb"></tbody></table>
<script>
const P={data};const TYPES={json.dumps(types)};
let sel=new Set();try{{sel=new Set(JSON.parse(localStorage.getItem('slInviteSel')||'[]'))}}catch(e){{}}
let onTypes=new Set();const $=id=>document.getElementById(id);
const save=()=>{{try{{localStorage.setItem('slInviteSel',JSON.stringify([...sel]))}}catch(e){{}};$('count').textContent=sel.size}};
TYPES.forEach(t=>{{const c=document.createElement('span');c.className='chip';c.textContent=t;c.onclick=()=>{{onTypes.has(t)?onTypes.delete(t):onTypes.add(t);c.classList.toggle('on');draw()}};$('chips').appendChild(c)}});
function vis(){{const q=$('q').value.toLowerCase();return P.filter(p=>(!$('hideSub').checked||!p.subscribed)&&(!$('hideRole').checked||!p.role)&&(!onTypes.size||onTypes.has(p.type||'(none)'))&&(!q||(p.name+' '+p.email+' '+p.org+' '+p.city+' '+p.note+' '+p.type).toLowerCase().includes(q)))}}
const esc=s=>(s||'').replace(/[&<>"]/g,c=>({{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}}[c]));
function draw(){{const rows=vis().slice(0,1500);$('tb').innerHTML=rows.map(p=>`<tr class="${{sel.has(p.email)?'sel':''}}" data-e="${{esc(p.email)}}"><td><input type="checkbox" ${{sel.has(p.email)?'checked':''}}></td><td><b>${{esc(p.name)||'<span class=mut>(no name)</span>'}}</b><br>${{p.subscribed?'<span class="b sub">subscribed</span>':''}}${{p.vendor?'<span class="b ven">Aisle vendor: send from Iris Inbox UI</span>':''}}${{p.role?'<span class="b role">role address</span>':''}}${{p.note?`<div class=mut>${{esc(p.note)}}</div>`:''}}</td><td>${{esc(p.email)}}</td><td class="hide-m">${{esc(p.org)}}<div class=mut>${{esc(p.type)}}</div></td><td class="hide-m">${{esc(p.city)}}</td><td class="hide-m mut">${{esc(p.last)}}</td><td class="hide-m mut">${{esc(p.src)}}</td></tr>`).join('');
document.querySelectorAll('#tb tr').forEach(tr=>tr.onclick=e=>{{const em=tr.dataset.e;sel.has(em)?sel.delete(em):sel.add(em);save();draw()}});save()}}
['q','hideSub','hideRole'].forEach(i=>$(i).oninput=draw);
$('selVis').onclick=()=>{{vis().forEach(p=>{{if(!p.subscribed)sel.add(p.email)}});save();draw()}};
$('clr').onclick=()=>{{sel.clear();save();draw()}};
$('exp').onclick=()=>{{const out=P.filter(p=>sel.has(p.email)).map(p=>({{email:p.email,name:p.name,first:p.first,crm_id:p.crm_id||null,vendor:p.vendor,subscribed:p.subscribed}}));
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(out,null,2)],{{type:'application/json'}}));a.download='invite-selection.json';a.click()}};
draw();
</script></body></html>""", encoding="utf-8")


def stage(sel_path: Path, pin: str, limit: int) -> None:
    people = json.loads(sel_path.read_text())
    tpl = TEMPLATE.read_text() if TEMPLATE.exists() else DEFAULT_TEMPLATE
    log = OUT / "staged.jsonl"
    done = {json.loads(l)["email"] for l in log.read_text().splitlines()} if log.exists() else set()
    staged = 0
    for p in people:
        if staged >= limit:
            break
        if p.get("subscribed") or p["email"] in done:
            continue
        first = (p.get("first") or "").strip() or "there"
        body = tpl.format(first=first, link=LINK)
        if re.match(r"\s*(Hi|Hello|Dear)\b", body):
            sys.exit('Template must open with "Hey" (Matt\'s greeting).')
        payload = {"pin": pin, "to_email": p["email"], "to_name": p.get("name", ""), "from_email": "matt@gatherstudio.app",
                   "subject": "I made something", "body": body,
                   "context": "Southern Legends personal invite drive (Matt picked this person in the invite chooser)."
                              + (" Aisle vendor: sa_mailer routes to Sat Co queue; send from the Iris Inbox UI." if p.get("vendor") else ""),
                   "priority": "normal", "gate": "matt-review", "tags": "southern-legends,sl-invite"}
        req = urllib.request.Request(INBOX, data=json.dumps(payload).encode(), method="POST",
                                     headers={"Content-Type": "application/json"})
        try:
            urllib.request.urlopen(req, timeout=30).read()
        except urllib.error.HTTPError as e:
            sys.exit(f"Iris Inbox refused ({e.code}): {e.read().decode()[:200]}")
        with log.open("a") as f:
            f.write(json.dumps({"email": p["email"], "at": datetime.now().isoformat(timespec="seconds")}) + "\n")
        staged += 1
    print(f"Staged {staged} invite(s) in Iris Inbox for review. Open https://iris-inbox.gatherstudio.app to send.")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--stage", type=Path)
    ap.add_argument("--pin")
    ap.add_argument("--limit", type=int, default=25)
    ap.add_argument("--no-google", action="store_true")
    a = ap.parse_args()
    if not TEMPLATE.exists():
        OUT.mkdir(parents=True, exist_ok=True)
        TEMPLATE.write_text(DEFAULT_TEMPLATE)
    if a.stage:
        if not a.pin:
            sys.exit("--pin required (current Iris Inbox INBOX_PIN)")
        stage(a.stage.expanduser(), a.pin, a.limit)
        return 0
    crm, subs = turso_contacts()
    lists = [crm]
    if not a.no_google:
        try:
            lists.append(google_contacts())
        except Exception as e:
            print(f"Google Contacts skipped: {e}")
    vendors = {l.strip().lower() for l in VENDORS.read_text().splitlines() if "@" in l} if VENDORS.exists() else set()
    people = merge(lists, subs, vendors)
    build_page(people)
    print(f"{len(people)} people ({sum(p['subscribed'] for p in people)} already subscribed). {PAGE}")
    subprocess.run(["open", str(PAGE)])
    return 0


if __name__ == "__main__":
    sys.exit(main())
