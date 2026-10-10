'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const EDITORIAL_STATEMENT = `Southern Legends is a regional editorial platform for the Southern diaspora. We publish essays, profiles, and community voices from Northeast Alabama and the people who left, what they carried, and what they came back with.

We are not a newspaper. We are not a blog. We are a publication — with a masthead, a point of view, and contributors who know the territory from the inside.

Our thesis: the people who stayed built something. The people who left carry something. That intersection is where the real stories live.

Matt Headley is the founding editor. He has lived in Northeast Alabama for twenty-eight years. He was born somewhere else. That tension is the whole thing.`

const CONTRIBUTORS: {
  name: string
  role: string
  lens: string
  bio: string
  email?: string
  portrait?: string
  script: string
}[] = [
  {
    name: 'Jason Wright',
    role: 'Arts & Theater',
    lens: 'arts_theater',
    bio: 'Jason Wright builds sets, stages plays, and knows where every artist in Calhoun County is hiding. His lens is the stage — what performance reveals about a community.',
    email: 'writstuf@bellsouth.net',
    script: `My name is Jason Wright. I've been in theatre in Northeast Alabama my whole life. What I know is this: when a community can tell its own stories on a stage, something changes. I write for Southern Legends because these stories deserve a real audience — not just a flyer.`,
  },
  {
    name: 'Donna Barton',
    role: 'Journalism & Arts',
    lens: 'journalism_arts',
    bio: 'Donna Barton is the faith and arts editor at the Anniston Star. She has covered Northeast Alabama\'s cultural life for decades. She knows which stories the paper has room for — and which ones need more space.',
    email: 'donnafbarton@gmail.com',
    script: `I'm Donna Barton. I've been editing the faith section at the Star long enough to know what Anniston is made of. Southern Legends gives writers room to go where the deadline doesn't allow. That matters.`,
  },
  {
    name: 'Cher Dulaney',
    role: 'Business & Community',
    lens: 'business_chamber',
    bio: 'Cher Dulaney runs the Calhoun County Chamber of Commerce. She knows the economic texture of Northeast Alabama — who is building, who is holding on, and who just opened something worth knowing about.',
    email: 'cher@calhounchamber.com',
    script: `I'm Cher Dulaney. The Chamber's job is to know every business in this county. What Southern Legends does is tell you why those businesses matter — not just that they exist. That's the story the directory doesn't have room for.`,
  },
  {
    name: 'Kyle Bryan',
    role: 'Pastoral & Community',
    lens: 'pastoral_community',
    bio: 'Kyle Bryan is at Anniston First UMC. He works at the intersection of faith, neighborhood, and civic life — the part of Anniston that doesn\'t show up in economic development reports.',
    email: 'kyle@annistonfirst.info',
    script: `I'm Kyle Bryan. Ministry in a mid-size Southern city means you see things nobody is writing about — what holds communities together, what tears them apart. I write for Southern Legends because those stories deserve witnesses.`,
  },
  {
    name: 'Jean Ellison',
    role: 'Music & Arts',
    lens: 'music_arts',
    bio: 'Jean Ellison runs The Music Box on Noble Street. She has taught music in Anniston for years and plays in the Evergreens. Her lens is the cultural infrastructure that keeps a community alive.',
    script: `My name is Jean Ellison. I run The Music Box on Noble Street. Music is how a community remembers itself. When I write for Southern Legends, I'm trying to get that on the record before it disappears.`,
  },
  {
    name: 'Summer Jennings',
    role: 'Nonprofit & Outreach',
    lens: 'nonprofit_outreach',
    bio: 'Summer Jennings runs Jacksonville City Outreach. She works with people the economy has left behind — and she knows what actual community care looks like from the inside.',
    email: 'jaxoutreach36265@gmail.com',
    script: `I'm Summer Jennings. I run Jacksonville City Outreach. The people we serve don't get profiles in the paper. Southern Legends is one of the few places that asks what it actually costs to hold a community together.`,
  },
  {
    name: 'Heather Headley',
    role: 'Florals & Wedding',
    lens: 'florals_wedding',
    bio: 'Heather Headley runs Heather Florals and the Bloom Bar. She knows the wedding and events economy of Northeast Alabama from the inside — and what it takes to build something that lasts.',
    script: `I'm Heather Headley. I've been doing flowers in this community for years. What I know is that the vendors and makers who show up for the big moments are the ones holding the region together. I write about them.`,
  },
  {
    name: 'Brodie Boyd',
    role: 'Arts & Literary',
    lens: 'arts_literary',
    bio: 'Brodie Boyd writes and works in the literary arts in Northeast Alabama. He is one of the few people in the region who treats the local as worthy of serious literary attention.',
    script: `I'm Brodie Boyd. I've been writing about this region because I think it deserves the kind of attention that serious literature gives to place. Southern Legends is that project.`,
  },
]

const LENS_LABELS: Record<string, string> = {
  arts_theater: 'Arts & Theater',
  journalism_arts: 'Journalism',
  business_chamber: 'Business',
  pastoral_community: 'Pastoral',
  music_arts: 'Music',
  nonprofit_outreach: 'Nonprofit',
  florals_wedding: 'Florals',
  arts_literary: 'Literary',
}

export default function MastheadPage() {
  const [playing, setPlaying] = useState(false)
  const [loadingTTS, setLoadingTTS] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Record modal state
  const [recordingFor, setRecordingFor] = useState<(typeof CONTRIBUTORS)[0] | null>(null)
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState<Blob | null>(null)
  const [camStream, setCamStream] = useState<MediaStream | null>(null)
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([])
  const [selectedCam, setSelectedCam] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Enumerate cameras
  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then(devs => {
      const cams = devs.filter(d => d.kind === 'videoinput')
      setCameras(cams)
      if (cams.length) setSelectedCam(cams[0].deviceId)
    })
  }, [])

  // Listen button — Deepgram TTS
  const handleListen = async () => {
    if (playing && audioRef.current) {
      audioRef.current.pause()
      setPlaying(false)
      return
    }
    setLoadingTTS(true)
    try {
      const res = await fetch('/api/masthead/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: EDITORIAL_STATEMENT }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => setPlaying(false)
      audio.play()
      setPlaying(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingTTS(false)
    }
  }

  // Open record modal
  const openRecord = async (contributor: (typeof CONTRIBUTORS)[0]) => {
    setRecordingFor(contributor)
    setRecorded(null)
    try {
      const constraints: MediaStreamConstraints = {
        video: selectedCam ? { deviceId: { exact: selectedCam } } : true,
        audio: true,
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setCamStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (e) {
      console.error('Camera error', e)
    }
  }

  const closeRecord = useCallback(() => {
    camStream?.getTracks().forEach(t => t.stop())
    setCamStream(null)
    setRecordingFor(null)
    setRecording(false)
    setRecorded(null)
  }, [camStream])

  const startRecord = () => {
    if (!camStream) return
    chunksRef.current = []
    const mr = new MediaRecorder(camStream, { mimeType: 'video/webm;codecs=vp9,opus' })
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' })
      setRecorded(blob)
    }
    mr.start(250)
    mediaRecorderRef.current = mr
    setRecording(true)
  }

  const stopRecord = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const downloadRecording = () => {
    if (!recorded || !recordingFor) return
    const url = URL.createObjectURL(recorded)
    const a = document.createElement('a')
    a.href = url
    a.download = `sl-${recordingFor.name.toLowerCase().replace(/\s+/g, '-')}-intro.webm`
    a.click()
  }

  // Attach stream to video when modal opens
  useEffect(() => {
    if (camStream && videoRef.current) {
      videoRef.current.srcObject = camStream
      videoRef.current.play()
    }
  }, [camStream])

  return (
    <main className="no-x-overflow" style={{ background: '#FAFAF7', color: '#3F3B36', minHeight: '100vh', fontFamily: 'var(--font-heading)', overflowX: 'clip' }}>
      {/* Header */}
      <div style={{ background: '#1C1917', color: '#FAFAF7', padding: '7rem 1.5rem 2.5rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: '0.75rem', color: '#CA8A04', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
            <Link href="/" style={{ color: '#CA8A04', textDecoration: 'none' }}>Southern Legends</Link>
            {' '}› Masthead
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '0.5rem' }}>
            The Masthead
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
            southernlegends.org — Est. 2025
          </p>
        </div>
      </div>

      {/* Editorial Statement */}
      <section style={{ background: '#fff', borderBottom: '1px solid #E5E5E0' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem' }}>
          <p style={{ fontSize: '0.7rem', color: '#9A3412', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
            Editorial Statement
          </p>
          {EDITORIAL_STATEMENT.split('\n\n').map((p, i) => (
            <p key={i} style={{ fontSize: '1.125rem', lineHeight: 1.8, marginBottom: '1.25rem', color: '#3F3B36' }}>
              {p}
            </p>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleListen}
              disabled={loadingTTS}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: playing ? '#9A3412' : '#1C1917',
                color: '#fff', border: 'none', borderRadius: 8,
                padding: '0.75rem 1.25rem', fontSize: '0.875rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'var(--font-geist-sans, sans-serif)',
                transition: 'background 0.15s',
              }}
            >
              {loadingTTS ? '⟳ Loading…' : playing ? '◼ Stop' : '▶ Listen'}
            </button>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
              Powered by Deepgram TTS
            </span>
            {/* "Record a response" linked to /dialogue, which does not exist (audit C-10) — removed. */}
          </div>
        </div>
      </section>

      {/* Camera selector */}
      {cameras.length > 1 && (
        <div style={{ background: '#F5F4EF', borderBottom: '1px solid #E5E5E0', padding: '0.75rem 1.5rem' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.75rem', color: '#6B6560', fontFamily: 'var(--font-geist-sans, sans-serif)', fontWeight: 600 }}>Camera:</label>
            <select
              value={selectedCam}
              onChange={e => setSelectedCam(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: 6, border: '1px solid #E5E5E0', background: '#fff', fontFamily: 'var(--font-geist-sans, sans-serif)' }}
            >
              {cameras.map(c => (
                <option key={c.deviceId} value={c.deviceId}>{c.label || `Camera ${cameras.indexOf(c) + 1}`}</option>
              ))}
            </select>
            <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
              Canon DSLR: connect via USB/HDMI capture card, then select here
            </span>
          </div>
        </div>
      )}

      {/* Contributors */}
      <section style={{ padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: '0.7rem', color: '#9A3412', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
            Contributors
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(380px, 100%), 1fr))', gap: '1.5rem' }}>
            {CONTRIBUTORS.map(c => (
              <div
                key={c.name}
                style={{ background: '#fff', border: '1px solid #E5E5E0', borderRadius: 12, padding: '1.5rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#9A3412', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem', fontFamily: 'var(--font-geist-sans, sans-serif)', fontWeight: 700 }}>
                      {c.role}
                    </p>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>{c.name}</h2>
                  </div>
                  <button
                    onClick={() => openRecord(c)}
                    title={`Record intro for ${c.name}`}
                    style={{
                      background: '#1C1917', color: '#CA8A04', border: 'none',
                      borderRadius: 8, padding: '0.5rem 0.875rem',
                      fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'var(--font-geist-sans, sans-serif)',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}
                  >
                    🎙 Record
                  </button>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#6B6560', lineHeight: 1.7, margin: 0, fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                  {c.bio}
                </p>
                {c.email && (
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.75rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                    {c.email}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section style={{ background: '#1C1917', color: '#FAFAF7', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Your lens belongs here.
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 1.5rem', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
            Southern Legends publishes contributors who know Northeast Alabama from the inside — writers, musicians, pastors, makers, journalists.
            Commission-only to start. A platform that pays when it earns.
          </p>
          <a
            href="mailto:matt@gatherstudio.app?subject=Southern Legends contributor interest"
            style={{ background: '#9A3412', color: '#fff', padding: '0.875rem 1.75rem', borderRadius: 8, textDecoration: 'none', fontFamily: 'var(--font-geist-sans, sans-serif)', fontWeight: 600, fontSize: '1rem', display: 'inline-block' }}
          >
            Pitch a piece →
          </a>
        </div>
      </section>

      {/* Record Modal */}
      {recordingFor && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9000,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Modal header */}
          <div style={{ background: '#0a0a0a', borderBottom: '1px solid #222', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.65rem', color: '#CA8A04', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-geist-sans, sans-serif)', fontWeight: 700, marginBottom: 2 }}>
                Recording Intro
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: '#f0ede8', margin: 0 }}>{recordingFor.name}</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
              {!recording && !recorded && (
                <button onClick={startRecord} style={{ background: '#9A3412', color: '#fff', border: 'none', borderRadius: 8, padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                  ● Record
                </button>
              )}
              {recording && (
                <button onClick={stopRecord} style={{ background: '#CA8A04', color: '#000', border: 'none', borderRadius: 8, padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                  ◼ Stop
                </button>
              )}
              {recorded && (
                <button onClick={downloadRecording} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                  ↓ Download
                </button>
              )}
              <button onClick={closeRecord} style={{ background: 'none', border: '1px solid #333', color: '#9ca3af', borderRadius: 8, padding: '0.625rem 1rem', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                ✕ Close
              </button>
            </div>
          </div>

          {/* Main area: camera + teleprompter */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Camera feed */}
            <div style={{ flex: 1, position: 'relative', background: '#000' }}>
              <video
                ref={videoRef}
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {recording && (
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  background: '#ef4444', color: '#fff', borderRadius: 999,
                  padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700,
                  fontFamily: 'var(--font-geist-sans, sans-serif)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ width: 8, height: 8, background: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                  REC
                </div>
              )}
            </div>

            {/* Teleprompter */}
            <div style={{
              width: 340, background: '#060d09', borderLeft: '1px solid #1a2e1e',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #1a2e1e' }}>
                <p style={{ fontSize: '0.65rem', color: '#CA8A04', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-geist-sans, sans-serif)', fontWeight: 700 }}>
                  Teleprompter Script
                </p>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.25rem' }}>
                <p style={{
                  fontFamily: 'var(--font-heading)', fontSize: '1.25rem', lineHeight: 2,
                  color: '#f0ede8', whiteSpace: 'pre-wrap',
                }}>
                  {recordingFor.script}
                </p>
                <div style={{ marginTop: '2rem', borderTop: '1px solid #1a2e1e', paddingTop: '1rem' }}>
                  <p style={{ fontSize: '0.7rem', color: '#4b5563', fontFamily: 'var(--font-geist-sans, sans-serif)', marginBottom: '0.5rem' }}>Bio reference</p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.65, fontFamily: 'var(--font-geist-sans, sans-serif)' }}>
                    {recordingFor.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </main>
  )
}
