"use client";
import { useState, useEffect, type CSSProperties } from "react";

const PIN_KEY = "sl_admin_pin";
const ls = { getItem: (k: string) => typeof window !== "undefined" ? localStorage.getItem(k) : null, setItem: (k: string, v: string) => typeof window !== "undefined" && localStorage.setItem(k, v) };
const BROWN = "#292524";
const AMBER = "#D97706";
const AMBER_BG = "#FEF3C7";
const CREAM = "#FAFAF7";
const inp: CSSProperties = { width: "100%", background: "#fafaf7", border: "1px solid #e5e0d8", borderRadius: 6, color: BROWN, padding: "8px 10px", fontSize: 13, marginTop: 4, boxSizing: "border-box" };

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [tab, setTab] = useState<"scripts"|"calendar"|"queue"|"edit"|"post"|"email"|"ghostwrite">("scripts");

  // Queue state
  type Profile = { slug: string; title: string; date: string; published: boolean };
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [queueFilter, setQueueFilter] = useState<"all"|"published"|"drafts">("all");
  const [queueLoading, setQueueLoading] = useState(false);

  // Edit state — in-place MDX profile editor
  type Frontmatter = Record<string, unknown> & { title?: string; excerpt?: string; subtitle?: string; heroImage?: string; heroAlt?: string; tags?: string[]; published?: boolean; date?: string };
  const [editSlug, setEditSlug] = useState<string|null>(null);
  const [editFm, setEditFm] = useState<Frontmatter>({});
  const [editBody, setEditBody] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editSaved, setEditSaved] = useState(false);
  const [editStats, setEditStats] = useState<{ words: number; readTime: string }|null>(null);
  const [editErr, setEditErr] = useState<string|null>(null);
  const editWords = editBody.trim() ? editBody.trim().split(/\s+/).length : 0;
  const editReadMin = Math.max(1, Math.round(editWords / 200));

  // Post state
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [posting, setPosting] = useState(false);
  const [postResult, setPostResult] = useState<string|null>(null);

  // Email state
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string|null>(null);

  // Calendar state
  type CalItem = { id: string; date: string; platform: string; type: string; status: "live"|"ready"|"draft"|"planned"; copy: string; link?: string };
  const SEED: CalItem[] = [
    { id:"1", date:"2026-06-08", platform:"FB - SL Page", type:"Reel", status:"live", copy:"Intro reel (19s). From the Appalachian foothills..." },
    { id:"2", date:"2026-06-08", platform:"FB - SL Page", type:"Reel", status:"live", copy:"Workout clip (49s). What if every angry comment was a workout?" },
    { id:"3", date:"2026-06-08", platform:"FB - SL Page", type:"Feed post", status:"live", copy:"Ep1 announcement with OG card.", link:"https://southernlegends.blog/essays/the-digital-gym-somatic-practice" },
    { id:"4", date:"2026-06-08", platform:"YouTube", type:"Video", status:"live", copy:"Full ep1 (3:43).", link:"https://www.youtube.com/watch?v=upVG97BpaFw" },
    { id:"5", date:"2026-06-08", platform:"Spotify", type:"Clip", status:"live", copy:"What if every angry comment was a workout? From Ep. 1 of Southern Legends." },
    { id:"6", date:"2026-06-09", platform:"FB — Personal", type:"Share / Reel", status:"ready", copy:"Share SL intro Reel + workout clip to timeline." },
    { id:"7", date:"2026-06-09", platform:"YouTube / TikTok", type:"Intro Reel v3", status:"ready", copy:"New intro reel (diff music) via CapCut. Asset: pending export." },
    { id:"8", date:"TBD", platform:"FB — SL Page", type:"Reel", status:"planned", copy:"Swap intro Reel to v3 once exported." },
    { id:"9", date:"TBD", platform:"All", type:"Ep2 launch", status:"planned", copy:"Freedom Riders episode out now.", link:"https://southernlegends.blog/podcast" },
    { id:"10", date:"TBD", platform:"All", type:"Ep3 launch", status:"planned", copy:"Chief Ladiga Trail episode out now.", link:"https://southernlegends.blog/podcast" },
  ];
  const [calItems, setCalItems] = useState<CalItem[]>(() => {
    if (typeof window === "undefined") return SEED;
    try { const s = localStorage.getItem("sl_calendar"); return s ? JSON.parse(s) : SEED; } catch { return SEED; }
  });
  const [newItem, setNewItem] = useState<Partial<CalItem>>({ date:"", platform:"FB — SL Page", type:"Feed post", status:"planned", copy:"", link:"" });
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [editCopy, setEditCopy] = useState("");

  function saveCalendar(items: CalItem[]) {
    setCalItems(items);
    if (typeof window !== "undefined") localStorage.setItem("sl_calendar", JSON.stringify(items));
  }
  function cycleStatus(id: string) {
    const order: CalItem["status"][] = ["planned","draft","ready","live"];
    saveCalendar(calItems.map(i => i.id === id ? { ...i, status: order[(order.indexOf(i.status)+1)%4] } : i));
  }
  function deleteItem(id: string) { saveCalendar(calItems.filter(i => i.id !== id)); }
  function addItem() {
    if (!newItem.copy?.trim()) return;
    const item: CalItem = { id: Date.now().toString(), date: newItem.date||"TBD", platform: newItem.platform||"", type: newItem.type||"", status: newItem.status||"planned", copy: newItem.copy||"" };
    saveCalendar([...calItems, item]);
    setNewItem({ date:"", platform:"FB — SL Page", type:"Feed post", status:"planned", copy:"" });
    setAdding(false);
  }
  function startEdit(item: CalItem) { setEditId(item.id); setEditCopy(item.copy); }
  function saveEdit(id: string) { saveCalendar(calItems.map(i => i.id===id ? {...i, copy: editCopy} : i)); setEditId(null); }

  const [genningPost, setGenningPost] = useState(false);

  // Ghostwriter state
  const [angle, setAngle] = useState("");
  const [writing, setWriting] = useState(false);
  const [ghostPost, setGhostPost] = useState("");

  useEffect(() => {
    const migrated = sessionStorage.getItem(PIN_KEY);
    if (migrated) { ls.setItem(PIN_KEY, migrated); sessionStorage.removeItem(PIN_KEY); }
    const p = new URLSearchParams(window.location.search).get("p");
    if (p) { ls.setItem(PIN_KEY, p); setPin(p); setAuthed(true); return; }
    const saved = ls.getItem(PIN_KEY);
    if (saved) { setPin(saved); setAuthed(true); }
  }, []);

  function submitPin() { ls.setItem(PIN_KEY, pinInput); setPin(pinInput); setAuthed(true); }
  function headers() { return { "Content-Type": "application/json", "x-admin-pin": pin }; }

  async function loadQueue() {
    setQueueLoading(true);
    const r = await fetch("/api/admin/queue", { headers: { "x-admin-pin": pin } });
    const d = await r.json();
    setQueueLoading(false);
    if (d.ok) setProfiles(d.profiles);
  }

  async function openEditor(slug: string) {
    setTab("edit"); setEditSlug(slug); setEditLoading(true); setEditErr(null); setEditSaved(false);
    setEditFm({}); setEditBody(""); setEditStats(null);
    const r = await fetch(`/api/admin/profile/${slug}`, { headers: { "x-admin-pin": pin } });
    const d = await r.json();
    setEditLoading(false);
    if (d.ok) { setEditFm(d.frontmatter || {}); setEditBody(d.content || ""); setEditStats({ words: d.words, readTime: d.readTime }); }
    else setEditErr(d.error || "Failed to load");
  }
  function setFm(key: string, value: unknown) { setEditFm(f => ({ ...f, [key]: value })); }
  async function saveProfile() {
    if (!editSlug) return;
    setEditSaving(true); setEditErr(null); setEditSaved(false);
    const r = await fetch(`/api/admin/profile/${editSlug}`, { method: "POST", headers: headers(), body: JSON.stringify({ frontmatter: editFm, content: editBody }) });
    const d = await r.json();
    setEditSaving(false);
    if (d.ok) { setEditSaved(true); setEditStats({ words: d.words, readTime: d.readTime }); setTimeout(() => setEditSaved(false), 2500); loadQueue(); }
    else setEditErr(d.error || "Save failed");
  }

  async function postNow() {
    if (!message.trim()) return;
    setPosting(true); setPostResult(null);
    const r = await fetch("/api/admin/fb-post", { method: "POST", headers: headers(), body: JSON.stringify({ message, link: link || undefined }) });
    const d = await r.json();
    setPosting(false);
    if (d.ok) { setPostResult(d.post_url); setMessage(""); setLink(""); }
    else setPostResult("Error: " + d.error);
  }

  async function sendEmail() {
    if (!subject.trim() || !body.trim()) return;
    setSending(true); setSendResult(null);
    const r = await fetch("/api/newsletter/send", { method: "POST", headers: headers(), body: JSON.stringify({ subject, body, secret: pin }) });
    const d = await r.json();
    setSending(false);
    setSendResult(d.ok ? "✓ Broadcast sent." : "Error: " + (d.error ?? "Unknown"));
  }

  async function genPost() {
    if (!message.trim() && !link.trim()) return;
    setGenningPost(true);
    const r = await fetch("/api/admin/genpost", { method: "POST", headers: headers(), body: JSON.stringify({ message, link: link || undefined }) });
    const d = await r.json();
    setGenningPost(false);
    if (d.ok) setMessage(d.post);
  }

  async function ghostwrite() {
    if (!angle.trim()) return;
    setWriting(true); setGhostPost("");
    const r = await fetch("/api/admin/ghostwrite", { method: "POST", headers: headers(), body: JSON.stringify({ angle }) });
    const d = await r.json();
    setWriting(false);
    if (d.ok) setGhostPost(d.post);
  }

  if (!authed) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: CREAM }}>
      <div style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 12, padding: 32, width: 320, textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🌿</div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#78716c", marginBottom: 20 }}>Southern Legends · Admin</div>
        <input type="password" placeholder="PIN" value={pinInput}
          onChange={e => setPinInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submitPin()}
          style={{ width: "100%", background: "#fafaf7", border: "1px solid #d4c9b8", borderRadius: 8, color: BROWN, padding: "10px 14px", fontSize: 18, letterSpacing: 4, textAlign: "center", marginBottom: 12, boxSizing: "border-box" }}
        />
        <button onClick={submitPin} style={{ width: "100%", background: AMBER, color: "#fff", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          Enter
        </button>
      </div>
    </div>
  );

  const ESSAYS = [
    { label: "The Hospital", slug: "the-hospital" },
    { label: "The Digital Gym", slug: "the-digital-gym-somatic-practice" },
    { label: "A Seed Must Die", slug: "a-seed-must-die" },
    { label: "Five Fifteen", slug: "five-fifteen" },
    { label: "The Same Domain", slug: "the-same-domain" },
    { label: "No Shade", slug: "no-shade" },
    { label: "I'm Not Going to Disappear", slug: "im-not-going-to-disappear" },
    { label: "Chief Ladiga, 1832", slug: "chief-ladiga-trail" },
    { label: "Hope in the Wilderness", slug: "hope-in-the-wilderness" },
    { label: "Attempt 73", slug: "attempt-73" },
    { label: "A Letter Never Sent", slug: "a-letter-never-sent" },
    { label: "My Writing Has a New Home", slug: "my-writing-has-a-new-home" },
  ];

  const SCRIPTS = [
    { label: "Interfaith Ministries", url: "https://f46wkkj98gisw4ta.public.blob.vercel-storage.com/scripts/interfaith-teleprompter.txt", note: "Walk-and-talk ready" },
    { label: "Chief Ladiga Trail", url: "https://f46wkkj98gisw4ta.public.blob.vercel-storage.com/scripts/chief-ladiga-teleprompter.txt", note: "On trail" },
    { label: "Freedom Riders", url: "https://f46wkkj98gisw4ta.public.blob.vercel-storage.com/scripts/freedom-riders-teleprompter.txt", note: "Needs monument location" },
    { label: "Jay Jenkins", url: "https://f46wkkj98gisw4ta.public.blob.vercel-storage.com/scripts/jay-jenkins-teleprompter.txt", note: "Interview" },
    { label: "Shannon Jenkins", url: "https://f46wkkj98gisw4ta.public.blob.vercel-storage.com/scripts/shannon-jenkins-teleprompter.txt", note: "Interview" },
  ];

  const tabs = [
    { key: "scripts" as const, label: "📜 Scripts" },
    { key: "calendar" as const, label: "📅 Calendar" },
    { key: "queue" as const, label: "📋 Queue" },
    { key: "edit" as const, label: "📝 Edit" },
    { key: "post" as const, label: "📘 Post" },
    { key: "email" as const, label: "✉ Email" },
    { key: "ghostwrite" as const, label: "✍ Write" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: CREAM, color: BROWN, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #e5e0d8", display: "flex", alignItems: "center", gap: 10, background: "#fff" }}>
        <span>🌿</span>
        <span style={{ fontWeight: 700, fontSize: 16, fontFamily: "Georgia, serif" }}>Southern Legends</span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "#a8a29e" }}>southernlegends.blog</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, borderBottom: "1px solid #e5e0d8", padding: "12px 16px", background: CREAM }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "10px 16px", borderRadius: 9,
            background: tab===t.key ? AMBER : "#fff",
            border: `1.5px solid ${tab===t.key ? AMBER : "#d8cfc2"}`,
            color: tab===t.key ? "#fff" : BROWN,
            cursor: "pointer", fontWeight: 700, fontSize: 14,
            boxShadow: tab===t.key ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
            transition: "all .12s",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: 20 }}>

        {/* Scripts */}
        {tab === "scripts" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#a8a29e", marginBottom:4 }}>Episode Scripts</div>
            {SCRIPTS.map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{ background:"#fff", border:"1px solid #e5e0d8", borderRadius:8, padding:"12px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", textDecoration:"none", gap:12 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:BROWN }}>{s.label}</div>
                  <div style={{ fontSize:11, color:"#a8a29e", marginTop:2 }}>{s.note}</div>
                </div>
                <span style={{ background:AMBER_BG, color:AMBER, border:`1px solid ${AMBER}`, borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700, flexShrink:0 }}>Open →</span>
              </a>
            ))}
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#a8a29e", marginTop:8, marginBottom:4 }}>Published Essays</div>
            {ESSAYS.map(e => (
              <a key={e.slug} href={`https://southernlegends.blog/essays/${e.slug}`} target="_blank" rel="noopener noreferrer"
                style={{ background:"#fff", border:"1px solid #e5e0d8", borderRadius:8, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", textDecoration:"none", gap:12 }}>
                <div style={{ fontSize:13, fontWeight:600, color:BROWN }}>{e.label}</div>
                <span style={{ background:"#f5f3ff", color:"#7c3aed", border:"1px solid #c4b5fd", borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:700, flexShrink:0 }}>Read →</span>
              </a>
            ))}
          </div>
        )}

        {/* Calendar */}
        {tab === "calendar" && (() => {
          const statusColor: Record<CalItem["status"], string> = { live:"#16a34a", ready:"#2563eb", draft:"#d97706", planned:"#7c3aed" };
          const statusBg: Record<CalItem["status"], string> = { live:"#f0fdf4", ready:"#eff6ff", draft:"#fffbeb", planned:"#f5f3ff" };
          return (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, color:"#a8a29e" }}>Social Calendar</div>
                <button onClick={() => setAdding(a => !a)} style={{ background:adding?"#e5e0d8":AMBER, color:adding?"#78716c":"#fff", border:"none", borderRadius:6, padding:"4px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  {adding ? "Cancel" : "+ Add"}
                </button>
              </div>
              {adding && (
                <div style={{ background:"#fff", border:`1px solid ${AMBER}`, borderRadius:10, padding:14, display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <input value={newItem.date||""} onChange={e => setNewItem(p=>({...p,date:e.target.value}))} placeholder="Date (e.g. 2026-06-10)"
                      style={{ background:"#fafaf7", border:"1px solid #e5e0d8", borderRadius:6, color:BROWN, padding:"7px 10px", fontSize:12, width:"100%", boxSizing:"border-box" as const }} />
                    <input value={newItem.platform||""} onChange={e => setNewItem(p=>({...p,platform:e.target.value}))} placeholder="Platform"
                      style={{ background:"#fafaf7", border:"1px solid #e5e0d8", borderRadius:6, color:BROWN, padding:"7px 10px", fontSize:12, width:"100%", boxSizing:"border-box" as const }} />
                    <input value={newItem.type||""} onChange={e => setNewItem(p=>({...p,type:e.target.value}))} placeholder="Type (Reel, Post…)"
                      style={{ background:"#fafaf7", border:"1px solid #e5e0d8", borderRadius:6, color:BROWN, padding:"7px 10px", fontSize:12, width:"100%", boxSizing:"border-box" as const }} />
                    <select value={newItem.status||"planned"} onChange={e => setNewItem(p=>({...p,status:e.target.value as CalItem["status"]}))}
                      style={{ background:"#fafaf7", border:"1px solid #e5e0d8", borderRadius:6, color:BROWN, padding:"7px 10px", fontSize:12, width:"100%", boxSizing:"border-box" as const }}>
                      {(["planned","draft","ready","live"] as const).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <textarea value={newItem.copy||""} onChange={e => setNewItem(p=>({...p,copy:e.target.value}))} placeholder="Copy / notes"
                    style={{ background:"#fafaf7", border:"1px solid #e5e0d8", borderRadius:6, color:BROWN, padding:"7px 10px", fontSize:13, lineHeight:1.5, minHeight:60, resize:"vertical" as const, fontFamily:"Georgia,serif", width:"100%", boxSizing:"border-box" as const }} />
                  <input value={newItem.link||""} onChange={e => setNewItem(p=>({...p,link:e.target.value}))} placeholder="Link (optional)"
                    style={{ background:"#fafaf7", border:"1px solid #e5e0d8", borderRadius:6, color:BROWN, padding:"7px 10px", fontSize:12, width:"100%", boxSizing:"border-box" as const }} />
                  <button onClick={addItem} style={{ background:AMBER, color:"#fff", border:"none", borderRadius:7, padding:"8px 0", fontWeight:700, fontSize:13, cursor:"pointer" }}>Add to Calendar</button>
                </div>
              )}
              {calItems.map(item => (
                <div key={item.id} style={{ background:"#fff", border:"1px solid #e5e0d8", borderRadius:8, padding:"10px 13px", display:"flex", gap:10, alignItems:"flex-start" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" as const }}>
                      <span style={{ fontSize:11, color:"#a8a29e" }}>{item.date}</span>
                      <span style={{ fontSize:11, color:"#78716c", fontWeight:600 }}>{item.platform}</span>
                      <span style={{ fontSize:11, color:"#a8a29e" }}>{item.type}</span>
                      <button onClick={() => cycleStatus(item.id)} style={{ background:statusBg[item.status], color:statusColor[item.status], border:`1px solid ${statusColor[item.status]}33`, borderRadius:99, padding:"1px 8px", fontSize:10, fontWeight:700, cursor:"pointer", textTransform:"uppercase" as const, letterSpacing:"0.05em" }}>
                        {item.status}
                      </button>
                    </div>
                    {editId === item.id ? (
                      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        <textarea value={editCopy} onChange={e => setEditCopy(e.target.value)}
                          style={{ background:"#fafaf7", border:"1px solid #e5e0d8", borderRadius:6, color:BROWN, padding:"7px 10px", fontSize:13, lineHeight:1.5, minHeight:60, resize:"vertical" as const, fontFamily:"Georgia,serif", width:"100%", boxSizing:"border-box" as const }} />
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={() => saveEdit(item.id)} style={{ background:AMBER, color:"#fff", border:"none", borderRadius:5, padding:"5px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>Save</button>
                          <button onClick={() => setEditId(null)} style={{ background:"#fff", border:"1px solid #e5e0d8", color:"#78716c", borderRadius:5, padding:"5px 10px", fontSize:11, cursor:"pointer" }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize:13, color:"#57534e", lineHeight:1.5, cursor:"pointer" }} onClick={() => startEdit(item)}>{item.copy}</div>
                    )}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:4, flexShrink:0 }}>
                    <button onClick={() => { setMessage(item.copy); setLink(item.link||""); setTab("post"); }} title="Use in Post tab" style={{ background:AMBER_BG, border:`1px solid ${AMBER}`, color:AMBER, borderRadius:5, padding:"3px 7px", fontSize:10, fontWeight:700, cursor:"pointer" }}>Post →</button>
                    <button onClick={() => deleteItem(item.id)} style={{ background:"#fff", border:"1px solid #fee2e2", color:"#dc2626", borderRadius:5, padding:"3px 7px", fontSize:10, cursor:"pointer" }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Queue */}
        {tab === "queue" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#a8a29e" }}>Profile Queue</div>
              <button onClick={loadQueue} disabled={queueLoading} style={{ background: AMBER_BG, border: `1px solid ${AMBER}`, color: AMBER, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                {queueLoading ? "Loading…" : "↻ Refresh"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["all","published","drafts"] as const).map(f => (
                <button key={f} onClick={() => setQueueFilter(f)} style={{ background: queueFilter===f ? AMBER : "#fff", border: "1px solid #e5e0d8", color: queueFilter===f ? "#fff" : "#78716c", borderRadius: 5, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{f}</button>
              ))}
            </div>
            {profiles.length === 0 && !queueLoading && (
              <div style={{ color: "#a8a29e", fontSize: 13, textAlign: "center", padding: 32 }}>Click Refresh to load profiles</div>
            )}
            {profiles
              .filter(p => queueFilter === "all" ? true : queueFilter === "published" ? p.published : !p.published)
              .map(p => (
                <div key={p.slug} style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 8, padding: "10px 13px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: BROWN, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: "#a8a29e", marginTop: 2 }}>{p.date} · <span style={{ color: p.published ? "#16a34a" : AMBER }}>{p.published ? "Published" : "Draft"}</span></div>
                  </div>
                  <button onClick={() => openEditor(p.slug)} style={{ background: "#fff", color: BROWN, border: "1px solid #d8cfc2", borderRadius: 5, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => { setMessage(`${p.title}\n\nhttps://southernlegends.blog/profiles/${p.slug}`); setLink(`https://southernlegends.blog/profiles/${p.slug}`); setTab("post"); }} style={{ background: AMBER, color: "#fff", border: "none", borderRadius: 5, padding: "5px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                    Post →
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Edit — in-place MDX profile editor */}
        {tab === "edit" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!editSlug && (
              <div style={{ color: "#a8a29e", fontSize: 13, textAlign: "center", padding: 32, lineHeight: 1.6 }}>
                Pick a profile to edit.<br />
                <button onClick={() => { setTab("queue"); if (profiles.length === 0) loadQueue(); }} style={{ marginTop: 12, background: AMBER, color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Go to Queue →</button>
              </div>
            )}
            {editSlug && editLoading && <div style={{ color: "#a8a29e", fontSize: 13, textAlign: "center", padding: 32 }}>Loading {editSlug}…</div>}
            {editSlug && !editLoading && (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#a8a29e" }}>Editing · {editSlug}</div>
                  <a href={`/profiles/${editSlug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 700, color: AMBER, textDecoration: "none", background: AMBER_BG, border: `1px solid ${AMBER}`, borderRadius: 6, padding: "4px 10px" }}>Preview →</a>
                </div>

                {/* Frontmatter form */}
                <div style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#78716c" }}>Title</label>
                    <input value={String(editFm.title ?? "")} onChange={e => setFm("title", e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#78716c" }}>Excerpt</label>
                    <textarea value={String(editFm.excerpt ?? "")} onChange={e => setFm("excerpt", e.target.value)} style={{ ...inp, minHeight: 52, resize: "vertical", fontFamily: "Georgia,serif", lineHeight: 1.5 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#78716c" }}>Subtitle</label>
                    <input value={String(editFm.subtitle ?? "")} onChange={e => setFm("subtitle", e.target.value)} style={inp} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#78716c" }}>Hero image</label>
                      <input value={String(editFm.heroImage ?? "")} onChange={e => setFm("heroImage", e.target.value)} placeholder="/images/profiles/…" style={inp} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 700, color: "#78716c" }}>Date</label>
                      <input value={String(editFm.date ?? "")} onChange={e => setFm("date", e.target.value)} placeholder="2026-01-01" style={inp} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#78716c" }}>Hero alt</label>
                    <input value={String(editFm.heroAlt ?? "")} onChange={e => setFm("heroAlt", e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "#78716c" }}>Tags (comma-separated)</label>
                    <input value={(Array.isArray(editFm.tags) ? editFm.tags : []).join(", ")} onChange={e => setFm("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))} style={inp} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#78716c" }}>Published</span>
                    <button onClick={() => setFm("published", !editFm.published)} style={{ background: editFm.published ? "#16a34a" : "#e5e0d8", color: editFm.published ? "#fff" : "#78716c", border: "none", borderRadius: 99, padding: "4px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      {editFm.published ? "● Published" : "○ Draft"}
                    </button>
                  </div>
                </div>

                {/* Body editor */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#a8a29e" }}>MDX Body</label>
                  <span style={{ fontSize: 11, color: "#a8a29e" }}>{editWords} words · ~{editReadMin} min</span>
                </div>
                <textarea value={editBody} onChange={e => setEditBody(e.target.value)} placeholder="MDX body…" spellCheck
                  style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 8, color: BROWN, padding: "12px 14px", fontSize: 14, lineHeight: 1.7, minHeight: 340, resize: "vertical", fontFamily: "Georgia, serif", width: "100%", boxSizing: "border-box" }}
                />

                <button onClick={saveProfile} disabled={editSaving} style={{ position: "sticky", bottom: 12, background: editSaved ? "#16a34a" : editSaving ? "#e5e0d8" : AMBER, color: editSaving ? "#a8a29e" : "#fff", border: "none", borderRadius: 8, padding: "13px 0", fontWeight: 700, fontSize: 15, cursor: editSaving ? "default" : "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }}>
                  {editSaving ? "⏳ Saving…" : editSaved ? "✓ Saved to disk" : "💾 Save profile"}
                </button>
                {editErr && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>Error: {editErr}</div>}
              </>
            )}
          </div>
        )}

        {/* Post */}
        {tab === "post" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#a8a29e" }}>Facebook Post</div>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your post…"
              style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 8, color: BROWN, padding: "10px 12px", fontSize: 14, lineHeight: 1.6, minHeight: 140, resize: "vertical", fontFamily: "Georgia, serif", width: "100%", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 11, color: "#a8a29e" }}>{message.length} chars</div>
              <button onClick={genPost} disabled={genningPost || (!message.trim() && !link.trim())} style={{ background: "none", border: `1px solid ${AMBER}`, borderRadius: 6, color: genningPost ? "#a8a29e" : AMBER, padding: "3px 10px", fontSize: 11, fontWeight: 700, cursor: genningPost ? "default" : "pointer" }}>
                {genningPost ? "⏳ Generating…" : "✨ Gen Post"}
              </button>
            </div>
            <input value={link} onChange={e => setLink(e.target.value)} placeholder="Link (optional)"
              style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 8, color: BROWN, padding: "9px 12px", fontSize: 13, width: "100%", boxSizing: "border-box" }}
            />
            <button onClick={postNow} disabled={posting || !message.trim()} style={{ background: posting ? "#e5e0d8" : AMBER, color: posting ? "#a8a29e" : "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: posting ? "default" : "pointer" }}>
              {posting ? "⏳ Posting…" : "🚀 Post to Facebook"}
            </button>
            {postResult && (
              <div style={{ background: postResult.startsWith("Error") ? "#fef2f2" : "#f0fdf4", border: `1px solid ${postResult.startsWith("Error") ? "#fecaca" : "#bbf7d0"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
                {postResult.startsWith("Error") ? postResult : <><span style={{ color: "#16a34a" }}>✓ Posted! </span><a href={postResult} target="_blank" style={{ color: AMBER }}>View on Facebook →</a></>}
              </div>
            )}
          </div>
        )}

        {/* Email */}
        {tab === "email" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#a8a29e" }}>Newsletter Broadcast</div>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject line"
              style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 8, color: BROWN, padding: "9px 12px", fontSize: 14, fontWeight: 600, width: "100%", boxSizing: "border-box" }}
            />
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Email body (plain text or HTML)…"
              style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 8, color: BROWN, padding: "10px 12px", fontSize: 13, lineHeight: 1.7, minHeight: 220, resize: "vertical", fontFamily: "Georgia, serif", width: "100%", boxSizing: "border-box" }}
            />
            <button onClick={sendEmail} disabled={sending || !subject.trim() || !body.trim()} style={{ background: sending ? "#e5e0d8" : BROWN, color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, fontSize: 14, cursor: sending ? "default" : "pointer" }}>
              {sending ? "⏳ Sending…" : "✉ Send Broadcast"}
            </button>
            {sendResult && (
              <div style={{ background: sendResult.startsWith("Error") ? "#fef2f2" : "#f0fdf4", border: `1px solid ${sendResult.startsWith("Error") ? "#fecaca" : "#bbf7d0"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: sendResult.startsWith("Error") ? "#dc2626" : "#16a34a" }}>
                {sendResult}
              </div>
            )}
          </div>
        )}

        {/* Ghostwriter */}
        {tab === "ghostwrite" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#a8a29e" }}>Caption Ghostwriter</div>
            <div style={{ fontSize: 12, color: "#78716c", lineHeight: 1.5 }}>Describe the story angle. Returns a warm, narrative Facebook caption in the Southern Legends voice.</div>
            <textarea value={angle} onChange={e => setAngle(e.target.value)} placeholder="e.g. 'Jay Jenkins has run the same hardware ls in Anniston for 38 years and still keeps the key to every house he's ever sold'"
              style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 8, color: BROWN, padding: "10px 12px", fontSize: 13, lineHeight: 1.6, minHeight: 80, resize: "vertical", fontFamily: "Georgia, serif", width: "100%", boxSizing: "border-box" }}
            />
            <button onClick={ghostwrite} disabled={writing || !angle.trim()} style={{ background: writing ? "#e5e0d8" : AMBER_BG, border: `1px solid ${AMBER}`, color: writing ? "#a8a29e" : AMBER, borderRadius: 8, padding: "10px 0", fontWeight: 700, fontSize: 13, cursor: writing ? "default" : "pointer" }}>
              {writing ? "⏳ Writing…" : "✍ Draft Caption"}
            </button>
            {ghostPost && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 8, padding: "14px 16px", fontSize: 14, lineHeight: 1.7, fontFamily: "Georgia, serif", color: BROWN, whiteSpace: "pre-wrap" }}>{ghostPost}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setMessage(ghostPost); setTab("post"); }} style={{ flex: 1, background: AMBER, color: "#fff", border: "none", borderRadius: 7, padding: "9px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Use This →</button>
                  <button onClick={() => navigator.clipboard.writeText(ghostPost)} style={{ background: "#fff", border: "1px solid #e5e0d8", color: "#78716c", borderRadius: 7, padding: "9px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Copy</button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
