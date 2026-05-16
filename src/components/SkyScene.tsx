'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import CameraParallax from '@/components/CameraParallax';
import { usePrayerTimes } from '@/lib/usePrayerTimes';

// ── Arc: east horizon → zenith → west horizon ─────────────────────────────
const arcCurve = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(-14, -2, -15),
  new THREE.Vector3(  0,  8, -15),
  new THREE.Vector3( 14, -2, -15),
);

// ── Sun elevation helper ──────────────────────────────────────────────────
function approxSunY(h: number): number {
  if (h < 6 || h >= 19) return 0;
  return Math.sin(((h - 6) / 13) * Math.PI);
}

// ── 12-hour time formatter ────────────────────────────────────────────────
function fmt12(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
}

// ── Prayer name / raw-time pairs ──────────────────────────────────────────
const PRAYER_KEYS: [string, string][] = [
  ['Fajr',    'Fajr'],
  ['Dhuhr',   'Dhuhr'],
  ['Asr',     'Asr'],
  ['Maghrib', 'Maghrib'],
  ['Isha',    'Isha'],
];

// ── Sky colour ramp ────────────────────────────────────────────────────────
const SKY_RAMP: [number, string][] = [
  [ 4.5, '#020024'],
  [ 5.5, '#1a1040'],
  [ 6.5, '#8B3A3A'],
  [ 7.5, '#87CEEB'],
  [16.0, '#4facfe'],
  [17.5, '#E89B4A'],
  [18.5, '#c4602a'],
  [20.0, '#3d1030'],
  [21.0, '#0d0420'],
];
function skyColorAtHour(h: number): string {
  for (const [cut, col] of SKY_RAMP) if (h < cut) return col;
  return '#020024';
}

// ── Canvas texture builders ───────────────────────────────────────────────
function makeGlowTexture(inner: string, mid: string, outer: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0,    inner);
  g.addColorStop(0.15, mid);
  g.addColorStop(0.5,  outer);
  g.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function makeCloudTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  const puffs = [
    { x: 128, y: 130, r: 82 }, { x: 168, y: 105, r: 58 },
    { x:  95, y: 115, r: 55 }, { x: 158, y: 150, r: 44 },
    { x:  88, y: 148, r: 40 }, { x: 180, y: 132, r: 34 },
    { x:  68, y: 120, r: 37 },
  ];
  for (const p of puffs) {
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    g.addColorStop(0,   'rgba(255,255,255,0.36)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.12)');
    g.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
  }
  return new THREE.CanvasTexture(c);
}

function makeHazeTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0,    'rgba(255,255,255,0)');
  g.addColorStop(0.28, 'rgba(255,255,255,0.12)');
  g.addColorStop(0.5,  'rgba(255,255,255,0.32)');
  g.addColorStop(0.72, 'rgba(255,255,255,0.12)');
  g.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 128);
  return new THREE.CanvasTexture(c);
}

// ── Background + exponential fog ──────────────────────────────────────────
function DynamicBackground() {
  const { scene } = useThree();
  const fog     = useMemo(() => new THREE.FogExp2(0x0d0510, 0.018), []);
  const current = useRef(new THREE.Color('#020024'));
  const target  = useRef(new THREE.Color('#020024'));

  useEffect(() => {
    scene.fog = fog;
    scene.background = current.current;
    return () => { scene.fog = null; };
  }, [scene, fog]);

  useFrame(() => {
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    target.current.set(skyColorAtHour(h));
    current.current.lerp(target.current, 0.004);
    fog.color.copy(current.current).multiplyScalar(0.38);
  });
  return null;
}

// ── Star field — 8 000 stars, 3 sizes, hemisphere, slow drift ─────────────
function StarField() {
  const groupRef = useRef<THREE.Group>(null);
  const m1Ref    = useRef<THREE.PointsMaterial>(null);
  const m2Ref    = useRef<THREE.PointsMaterial>(null);
  const m3Ref    = useRef<THREE.PointsMaterial>(null);

  const { g1, g2, g3 } = useMemo(() => {
    const R = 110;
    const make = (count: number) => {
      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        // Full sphere — covers entire viewport including below horizon
        const phi      = Math.random() * Math.PI * 2;
        const cosTheta = Math.random() * 2 - 1;
        const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
        pos[i * 3]     = R * sinTheta * Math.cos(phi);
        pos[i * 3 + 1] = R * cosTheta;
        pos[i * 3 + 2] = R * sinTheta * Math.sin(phi);
        // 70% white, 20% blue-tint, 10% warm yellow
        const r = Math.random();
        if (r < 0.70)      { col[i*3]=1;     col[i*3+1]=1;     col[i*3+2]=1;    }
        else if (r < 0.90) { col[i*3]=0.67;  col[i*3+1]=0.80;  col[i*3+2]=1;   }
        else               { col[i*3]=1;     col[i*3+1]=0.93;  col[i*3+2]=0.67; }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
      return geo;
    };
    return { g1: make(4800), g2: make(2400), g3: make(800) };
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.000015;
    const h           = new Date().getHours() + new Date().getMinutes() / 60;
    const nightFactor = Math.max(0, 1 - approxSunY(h) * 2.2);
    if (m1Ref.current) m1Ref.current.opacity = nightFactor;
    if (m2Ref.current) m2Ref.current.opacity = nightFactor;
    if (m3Ref.current) m3Ref.current.opacity = nightFactor;
  });

  return (
    <group ref={groupRef}>
      <points geometry={g1}>
        <pointsMaterial ref={m1Ref} vertexColors size={0.12} sizeAttenuation transparent opacity={1} depthWrite={false} fog={false} />
      </points>
      <points geometry={g2}>
        <pointsMaterial ref={m2Ref} vertexColors size={0.20} sizeAttenuation transparent opacity={1} depthWrite={false} fog={false} />
      </points>
      <points geometry={g3}>
        <pointsMaterial ref={m3Ref} vertexColors size={0.34} sizeAttenuation transparent opacity={1} depthWrite={false} fog={false} />
      </points>
    </group>
  );
}

// ── Atmospheric horizon haze ──────────────────────────────────────────────
function HorizonHaze() {
  const ref = useRef<THREE.Sprite>(null);
  const tex = useMemo(() => makeHazeTexture(), []);

  useFrame(() => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.SpriteMaterial;
    const h   = new Date().getHours() + new Date().getMinutes() / 60;
    const isGolden = (h >= 5 && h < 8) || (h >= 17 && h < 20);
    const isDay    =  h >= 8 && h < 17;
    if (isGolden)    { mat.color.set(0xff7730); mat.opacity = 0.55; }
    else if (isDay)  { mat.color.set(0x6699cc); mat.opacity = 0.30; }
    else             { mat.color.set(0x220033); mat.opacity = 0.18; }
  });

  return (
    <sprite ref={ref} position={[0, -1, -25]} scale={[60, 8, 1]}>
      <spriteMaterial map={tex} transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

// ── Label card styles ─────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  pointerEvents:          'none',
  userSelect:             'none',
  textAlign:              'center',
  background:             'rgba(6, 12, 38, 0.38)',
  backdropFilter:         'blur(20px) saturate(140%)',
  WebkitBackdropFilter:   'blur(20px) saturate(140%)',
  borderRadius:           '12px',
  padding:                '10px 22px 12px',
  border:                 '1px solid rgba(255,255,255,0.10)',
  boxShadow:              '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
  minWidth:               '130px',
  animation:              'skyLabelIn 1.4s ease-out forwards',
};
const CAP: React.CSSProperties = {
  display: 'block', fontSize: '10px', letterSpacing: '0.18em',
  textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
  marginBottom: '5px', color: 'rgba(255,255,255,0.55)',
};
const TIME: React.CSSProperties = {
  display: 'block', fontSize: '22px', fontWeight: 700,
  fontFamily: 'Cormorant Garamond, Georgia, serif',
  letterSpacing: '0.03em', color: '#FFFFFF',
  whiteSpace: 'nowrap',
};

// ── Prayer timeline icons ─────────────────────────────────────────────────
const PRAYER_SVG_ICONS = [
  /* Fajr — crescent */
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  /* Dhuhr — full sun */
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  /* Asr — afternoon sun (fewer rays) */
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="3.22" y1="5.22" x2="5.64" y2="7.64"/><line x1="18.36" y1="16.36" x2="20.78" y2="18.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>,
  /* Maghrib — sunset */
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="2" y1="18" x2="4" y2="18"/><line x1="20" y1="18" x2="22" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/></svg>,
  /* Isha — night crescent with star */
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><circle cx="18.5" cy="4.5" r="0.5" fill="currentColor" stroke="none"/></svg>,
];

// ── Celestial bodies + arc + labels ──────────────────────────────────────
function CelestialBodies({ prayer }: { prayer: ReturnType<typeof usePrayerTimes> }) {
  const sunCore   = useRef<THREE.Sprite>(null);
  const sunCorona = useRef<THREE.Sprite>(null);
  const sunBloom  = useRef<THREE.Sprite>(null);
  const sunLight  = useRef<THREE.PointLight>(null);
  const moonCore  = useRef<THREE.Sprite>(null);
  const moonBloom = useRef<THREE.Sprite>(null);
  const moonShift = useRef<THREE.Sprite>(null);
  const arcRef    = useRef<THREE.Mesh>(null);
  const arcGRef   = useRef<THREE.Mesh>(null);
  const srCapRef  = useRef<HTMLSpanElement>(null);
  const srTimeRef = useRef<HTMLSpanElement>(null);
  const ssCapRef  = useRef<HTMLSpanElement>(null);
  const ssTimeRef = useRef<HTMLSpanElement>(null);
  const srCardRef = useRef<HTMLDivElement>(null);
  const ssCardRef = useRef<HTMLDivElement>(null);
  const npTimelineRef = useRef<HTMLDivElement>(null);
  const npItem0 = useRef<HTMLDivElement>(null);
  const npItem1 = useRef<HTMLDivElement>(null);
  const npItem2 = useRef<HTMLDivElement>(null);
  const npItem3 = useRef<HTMLDivElement>(null);
  const npItem4 = useRef<HTMLDivElement>(null);
  const prevActiveIdx = useRef(-1);
  const cwCardRef  = useRef<HTMLDivElement>(null);
  const cwNameRef  = useRef<HTMLSpanElement>(null);
  const cwTimeRef  = useRef<HTMLSpanElement>(null);
  const cwNextRef  = useRef<HTMLSpanElement>(null);
  const hdCardRef  = useRef<HTMLDivElement>(null);

  const [hijriDate, setHijriDate] = useState<{
    gregorian: string;
    hijriDateLine: string;
    hijriYear: string;
  } | null>(null);
  const [userLocation, setUserLocation] = useState<string>('');

  // Fetch Hijri date on mount and refresh daily at midnight
  useEffect(() => {
    const fetchHijriDate = async () => {
      const today = new Date();
      const day   = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year  = today.getFullYear();
      const dateStr = `${day}-${month}-${year}`;
      try {
        const res = await fetch(`https://api.aladhan.com/v1/gToH/${dateStr}`);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        const hijri = data.data?.hijri;
        if (hijri) {
          const weekday  = today.toLocaleDateString('en-GB', { weekday: 'long' });
          const gregDate = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
          setHijriDate({
            gregorian:    `${weekday}, ${gregDate}`,
            hijriDateLine: `${hijri.day} ${hijri.month.en}`,
            hijriYear:     hijri.year,
          });
        }
      } catch (err) {
        console.error('Hijri date fetch failed:', err);
      }
    };

    fetchHijriDate();

    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const timeoutId = setTimeout(() => {
      fetchHijriDate();
      intervalId = setInterval(fetchHijriDate, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, []);

  // Reverse-geocode the user's position for the location chip (BigDataCloud, no key required)
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (!res.ok) return;
          const d = await res.json();
          const city    = d.city || d.locality || d.principalSubdivision || '';
          const country = d.countryName || '';
          setUserLocation(city && country ? `${city}, ${country}` : country || city);
        } catch { /* silent — location chip simply stays hidden */ }
      },
      () => { /* permission denied — hide location chip */ },
      { timeout: 8000 }
    );
  }, []);

  // Glow sprite textures
  const sCoreT   = useMemo(() => makeGlowTexture('rgba(255,255,230,1)',   'rgba(255,220,100,0.8)', 'rgba(255,180,50,0.18)'),  []);
  const sCoronaT = useMemo(() => makeGlowTexture('rgba(255,200,80,0.7)',  'rgba(255,160,40,0.4)',  'rgba(255,120,20,0.07)'),  []);
  const sBloomT  = useMemo(() => makeGlowTexture('rgba(255,140,30,0.28)', 'rgba(255,100,10,0.09)', 'rgba(255,80,0,0.02)'),   []);
  const mCoreT   = useMemo(() => makeGlowTexture('rgba(220,230,255,1)',   'rgba(180,200,240,0.6)', 'rgba(140,160,220,0.10)'), []);
  const mBloomT  = useMemo(() => makeGlowTexture('rgba(155,168,220,0.32)','rgba(120,130,200,0.10)','rgba(90,100,180,0.02)'), []);

  // Arc tube geometries
  const arcGeo  = useMemo(() => new THREE.TubeGeometry(arcCurve, 80, 0.04, 8, false), []);
  const arcGGeo = useMemo(() => new THREE.TubeGeometry(arcCurve, 80, 0.12, 8, false), []);

  // Inject label fade-in keyframes once (respects prefers-reduced-motion)
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = `
      @media (prefers-reduced-motion: no-preference) {
        @keyframes skyLabelIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes npPulse{0%,100%{box-shadow:0 0 0 0 rgba(65,194,220,0.35)}50%{box-shadow:0 0 0 6px rgba(65,194,220,0)}}
      }
      @media (prefers-reduced-motion: reduce) {
        @keyframes skyLabelIn{from{opacity:1}to{opacity:1}}
        @keyframes npPulse{from{box-shadow:none}to{box-shadow:none}}
      }
    `;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  useFrame(() => {
    const hour    = new Date().getHours() + new Date().getMinutes() / 60;
    const showSun = prayer
      ? hour >= prayer.fajr && hour < prayer.maghrib
      : hour >= 6 && hour < 19;

    // Day arc progress 0 → 1
    let dayP = 0.5;
    if (prayer) {
      const { fajr, dhuhr, asr, maghrib, isha } = prayer;
      if      (hour < fajr)    dayP = 0;
      else if (hour < dhuhr)   dayP = ((hour - fajr)    / (dhuhr   - fajr))   * 0.4;
      else if (hour < asr)     dayP = 0.4 + ((hour - dhuhr)   / (asr   - dhuhr)) * 0.2;
      else if (hour < maghrib) dayP = 0.6 + ((hour - asr)     / (maghrib - asr)) * 0.2;
      else if (hour < isha)    dayP = 0.8 + ((hour - maghrib) / (isha - maghrib)) * 0.1;
      else                     dayP = 1;
    } else {
      dayP = Math.max(0, Math.min(1, (hour - 6) / 13));
    }

    const sunPos = arcCurve.getPoint(dayP);

    // Colour temperature based on arc fraction
    let coreCol: number, lightCol: number;
    const f = dayP;
    if      (f < 0.10 || f > 0.90) { coreCol = 0xff9922; lightCol = 0xff6600; }
    else if (f < 0.35 || f > 0.65) { coreCol = 0xffee44; lightCol = 0xffdd88; }
    else                            { coreCol = 0xFFFF99; lightCol = 0xffffff; }

    // Sun sprites
    for (const r of [sunCore, sunCorona, sunBloom] as React.RefObject<THREE.Sprite>[]) {
      if (r.current) { r.current.position.copy(sunPos); r.current.visible = showSun; }
    }
    if (sunCore.current)
      (sunCore.current.material as THREE.SpriteMaterial).color.set(coreCol);

    // Sun point light
    if (sunLight.current) {
      sunLight.current.position.set(sunPos.x, sunPos.y, sunPos.z + 4);
      sunLight.current.intensity = showSun ? Math.sin(dayP * Math.PI) * 3.2 : 0;
      sunLight.current.color.set(lightCol);
    }

    // Arc tube (day only)
    if (arcRef.current)  arcRef.current.visible  = showSun;
    if (arcGRef.current) arcGRef.current.visible = showSun;

    // Night arc progress — moon traverses same curve in reverse
    const mag           = prayer?.maghrib ?? 19;
    const faj           = prayer?.fajr   ?? 6;
    const nightDur      = (faj + 24) - mag;
    const hoursAfterMag = hour >= mag ? hour - mag : (hour + 24) - mag;
    const nightP        = Math.min(1, Math.max(0, hoursAfterMag / nightDur));
    const moonPos       = arcCurve.getPoint(1 - nightP);

    for (const r of [moonCore, moonBloom] as React.RefObject<THREE.Sprite>[]) {
      if (r.current) { r.current.position.copy(moonPos); r.current.visible = !showSun; }
    }
    if (moonShift.current) {
      moonShift.current.position.set(moonPos.x + 0.3, moonPos.y + 0.2, moonPos.z);
      moonShift.current.visible = !showSun;
    }

    // Dynamic label colours + card alpha
    const isGolden  = (hour >= 5 && hour < 8) || (hour >= 17 && hour < 20);
    const isNight   =  hour >= 20 || hour < 5;
    const isDay     =  hour >= 8  && hour < 17;
    const timeColor = isGolden ? '#FFB347' : isNight ? '#C4D4F0' : '#FFFFFF';
    const capColor  = isGolden ? 'rgba(255,165,50,0.9)' : isNight ? 'rgba(180,205,240,0.7)' : 'rgba(255,255,255,0.6)';
    for (const r of [srCapRef, ssCapRef])   if (r.current) r.current.style.color = capColor;
    for (const r of [srTimeRef, ssTimeRef]) if (r.current) r.current.style.color = timeColor;
    // Card alpha: more opaque against bright sky, lighter at night
    const alpha   = isGolden ? 0.65 : isDay ? 0.52 : 0.38;
    const cardBg  = `rgba(6,12,38,${alpha})`;
    if (srCardRef.current) srCardRef.current.style.background = cardBg;
    if (ssCardRef.current) ssCardRef.current.style.background = cardBg;
    if (npTimelineRef.current) npTimelineRef.current.style.background = cardBg;
    if (cwCardRef.current)     cwCardRef.current.style.background     = cardBg;
    if (hdCardRef.current)     hdCardRef.current.style.background     = cardBg;

    // Highlight upcoming prayer in timeline
    if (prayer) {
      const hours = [prayer.fajr, prayer.dhuhr, prayer.asr, prayer.maghrib, prayer.isha];
      let activeIdx = hours.findIndex(h => h > hour);
      if (activeIdx === -1) activeIdx = 0;
      if (activeIdx !== prevActiveIdx.current) {
        prevActiveIdx.current = activeIdx;
        [npItem0, npItem1, npItem2, npItem3, npItem4].forEach((ref, i) => {
          if (!ref.current) return;
          const on = i === activeIdx;
          ref.current.style.background  = on ? 'rgba(65,194,220,0.13)'  : 'transparent';
          ref.current.style.borderColor = on ? 'rgba(65,194,220,0.45)'  : 'rgba(255,255,255,0.08)';
          ref.current.style.transform   = on ? 'translateY(-5px)'       : 'translateY(0)';
          ref.current.style.boxShadow   = on ? '0 0 16px rgba(65,194,220,0.2), 0 6px 16px rgba(0,0,0,0.4)' : 'none';
          ref.current.style.animation   = on ? 'npPulse 2.5s ease-in-out infinite' : 'none';
        });
        // Current Waqth card text
        const cwIdx = (activeIdx - 1 + 5) % 5;
        const RK = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        if (cwNameRef.current) cwNameRef.current.textContent = RK[cwIdx];
        if (cwTimeRef.current) cwTimeRef.current.textContent = prayer.raw[RK[cwIdx]] ? fmt12(prayer.raw[RK[cwIdx]]) : '—';
        if (cwNextRef.current) cwNextRef.current.textContent = `Next: ${RK[activeIdx]}  ${prayer.raw[RK[activeIdx]] ? fmt12(prayer.raw[RK[activeIdx]]) : '—'}`;
      }
    }
  });

  const sunrise = prayer?.sunrise ?? '—';
  const sunset  = prayer?.sunset  ?? '—';
  const npItems = [npItem0, npItem1, npItem2, npItem3, npItem4];

  return (
    <>
      {/* Arc tube — glowing trail visible daytime only */}
      <mesh ref={arcRef} geometry={arcGeo} visible={false}>
        <meshBasicMaterial color={0xffcc44} transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={arcGRef} geometry={arcGGeo} visible={false}>
        <meshBasicMaterial color={0xff9900} transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Sun — bloom → corona → core (large to small) */}
      <sprite ref={sunBloom}  visible={false} scale={[18, 18, 1]}>
        <spriteMaterial map={sBloomT}  transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite ref={sunCorona} visible={false} scale={[9, 9, 1]}>
        <spriteMaterial map={sCoronaT} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite ref={sunCore}   visible={false} scale={[7.5, 7.5, 1]}>
        <spriteMaterial map={sCoreT}   transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      <pointLight ref={sunLight} intensity={0} distance={90} decay={1.5} />

      {/* Moon — bloom + core + offset scatter */}
      <sprite ref={moonBloom}  visible={false} scale={[18, 18, 1]}>
        <spriteMaterial map={mBloomT} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite ref={moonCore}   visible={false} scale={[7.5, 7.5, 1]}>
        <spriteMaterial map={mCoreT}  transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite ref={moonShift}  visible={false} scale={[9, 9, 1]}>
        <spriteMaterial map={mBloomT} transparent opacity={0.35} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>

      {/* Prayer timeline — horizontal band, bottom center */}
      <Html center position={[0, -6.5, -12]}>
        <div
          ref={npTimelineRef}
          aria-hidden="true"
          style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(6,12,38,0.52)',
            backdropFilter: 'blur(20px) saturate(140%)',
            WebkitBackdropFilter: 'blur(20px) saturate(140%)',
            borderRadius: '16px',
            padding: '12px 18px',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
            width: 'min(640px, 90vw)',
            animation: 'skyLabelIn 1.4s ease-out forwards',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {/* Left label */}
          <div style={{
            flexShrink: 0, paddingRight: '16px', marginRight: '16px',
            borderRight: '1px solid rgba(255,255,255,0.12)',
          }}>
            <span style={{
              display: 'block', fontSize: '9px', letterSpacing: '0.18em',
              textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
              color: 'rgba(65,194,220,0.9)', marginBottom: '4px',
            }}>Upcoming Waqth</span>
            <span style={{
              display: 'block', fontSize: '15px', fontWeight: 700,
              fontFamily: 'Cormorant Garamond, Georgia, serif', color: '#FFFFFF',
              whiteSpace: 'nowrap',
            }}>The Path of Light</span>
          </div>
          {/* Prayer items */}
          <div style={{ display: 'flex', flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
            {PRAYER_KEYS.map(([name, key], i) => {
              const raw = prayer?.raw?.[key] ?? '';
              return (
                <div
                  key={name}
                  ref={npItems[i]}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '3px', padding: '8px 12px', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
                    transition: 'transform 350ms ease, background 350ms ease, box-shadow 350ms ease, border-color 350ms ease',
                  }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', lineHeight: '1' }}>
                    {PRAYER_SVG_ICONS[i]}
                  </span>
                  <span style={{
                    fontFamily: 'DM Sans, sans-serif', fontSize: '11px',
                    fontWeight: 500, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.06em',
                  }}>{name}</span>
                  <span style={{
                    fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '14px',
                    fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap',
                  }}>{raw ? fmt12(raw) : '—'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Html>

      {/* Current Waqth card — top left */}
      <Html center position={[-12, 2.5, -12]}>
        <div
          ref={cwCardRef}
          aria-hidden="true"
          style={{
            pointerEvents:        'none',
            userSelect:           'none',
            background:           'rgba(6, 12, 38, 0.52)',
            backdropFilter:       'blur(20px) saturate(140%)',
            WebkitBackdropFilter: 'blur(20px) saturate(140%)',
            borderRadius:         '14px',
            padding:              '13px 18px 14px',
            border:               '1px solid rgba(255,255,255,0.10)',
            boxShadow:            '0 4px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
            minWidth:             '170px',
            animation:            'skyLabelIn 1.4s ease-out forwards',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '7px' }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
              background: '#4ade80', boxShadow: '0 0 7px rgba(74,222,128,0.9)',
              display: 'inline-block',
            }} />
            <span style={{
              fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
              fontFamily: 'DM Sans, sans-serif', color: 'rgba(65,194,220,0.9)',
            }}>Current Waqth</span>
          </div>

          {/* Prayer name — big */}
          <span ref={cwNameRef} style={{
            display: 'block', fontSize: '26px', fontWeight: 700,
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            letterSpacing: '0.02em', color: '#FFFFFF',
            whiteSpace: 'nowrap', lineHeight: 1.1, marginBottom: '3px',
          }}>—</span>

          {/* Prayer start time — muted */}
          <span ref={cwTimeRef} style={{
            display: 'block', fontFamily: 'DM Sans, sans-serif',
            fontSize: '12px', color: 'rgba(255,255,255,0.48)',
            letterSpacing: '0.03em', marginBottom: '10px',
          }}>—</span>

          {/* Next prayer */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.09)', paddingTop: '8px' }}>
            <span ref={cwNextRef} style={{
              display: 'block', fontFamily: 'DM Sans, sans-serif',
              fontSize: '11px', letterSpacing: '0.04em',
              color: 'rgba(65,194,220,0.85)', whiteSpace: 'nowrap',
            }}>Next: —</span>
          </div>
        </div>
      </Html>

      {/* Hijri date card — top right */}
      <Html center position={[12, 2.5, -12]}>
        <div
          ref={hdCardRef}
          aria-hidden="true"
          style={{
            pointerEvents:        'none',
            userSelect:           'none',
            background:           'rgba(6, 12, 38, 0.72)',
            backdropFilter:       'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            borderRadius:         '18px',
            padding:              '16px 20px 18px',
            border:               '1px solid rgba(255,255,255,0.11)',
            boxShadow:            '0 6px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
            minWidth:             '310px',
            animation:            'skyLabelIn 1.4s ease-out forwards',
            overflow:             'hidden',
          }}
        >
          {/* Date + location row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '10px', marginBottom: '13px', flexWrap: 'wrap', rowGap: '8px',
          }}>
            {/* Gregorian date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
                <circle cx="12" cy="16" r="1.2" fill="rgba(255,255,255,0.55)" stroke="none"/>
              </svg>
              <span style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 500,
                color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap',
              }}>
                {hijriDate?.gregorian ?? '—'}
              </span>
            </div>

            {/* Location chip — only shown when we have a location */}
            {userLocation && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'rgba(201,146,42,0.13)',
                border: '1px solid rgba(201,146,42,0.32)',
                borderRadius: '20px', padding: '4px 10px',
                flexShrink: 0,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C9922A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.686 2 6 4.686 6 8c0 4.418 6 12 6 12s6-7.582 6-12c0-3.314-2.686-6-6-6z"/>
                  <circle cx="12" cy="8" r="2.5"/>
                </svg>
                <span style={{
                  fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600,
                  color: '#C9922A', whiteSpace: 'nowrap',
                }}>
                  {userLocation}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.09)', marginBottom: '10px' }} />

          {/* Hijri date — original compact style */}
          <span style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '16px', fontWeight: 600,
            color: '#FFFFFF', lineHeight: 1.25, display: 'block',
          }}>
            {hijriDate ? `${hijriDate.hijriDateLine} ${hijriDate.hijriYear}` : '—'}
          </span>
        </div>
      </Html>

      {/* Sunrise label */}
      <Html center position={[-11, -1.5, -13]}>
        <div ref={srCardRef} style={CARD}>
          <span ref={srCapRef}  style={CAP}>Sunrise</span>
          <span ref={srTimeRef} style={TIME}>{sunrise}</span>
        </div>
      </Html>

      {/* Sunset label */}
      <Html center position={[11, -1.5, -13]}>
        <div ref={ssCardRef} style={CARD}>
          <span ref={ssCapRef}  style={CAP}>Sunset</span>
          <span ref={ssTimeRef} style={TIME}>{sunset}</span>
        </div>
      </Html>
    </>
  );
}

// ── Volumetric cloud clusters ─────────────────────────────────────────────
const CLOUDS = [
  // ── Near layer ──────────────────────────────────────────────────────────
  { pos: [-12, -1.5, -20] as const, scale: 11.0, op: 0.50, speed: 1.00 },
  { pos: [  8, -1.0, -24] as const, scale: 14.0, op: 0.50, speed: 0.70 },
  { pos: [ -5, -2.5, -19] as const, scale: 8.0,  op: 0.60, speed: 1.30 },
  { pos: [ -22,-2.0, -16] as const, scale: 10.0, op: 0.52, speed: 1.20 },
  { pos: [  20,-2.5, -17] as const, scale: 9.0,  op: 0.48, speed: 1.05 },
  { pos: [   3,-1.5, -18] as const, scale: 11.0, op: 0.55, speed: 0.90 },
  { pos: [-10,  0.0, -17] as const, scale: 10.0, op: 0.52, speed: 0.95 },
  { pos: [ 18, -1.5, -21] as const, scale: 11.0, op: 0.48, speed: 0.85 },
  { pos: [-20, -1.0, -18] as const, scale: 10.0, op: 0.55, speed: 1.10 },
  // ── Mid layer ───────────────────────────────────────────────────────────
  { pos: [  0,  0.0, -22] as const, scale: 15.0, op: 0.50, speed: 0.80 },
  { pos: [ 14, -2.0, -28] as const, scale: 12.0, op: 0.50, speed: 0.50 },
  { pos: [ -7, -2.0, -23] as const, scale: 13.0, op: 0.42, speed: 0.72 },
  { pos: [ 11, -1.0, -25] as const, scale: 12.0, op: 0.40, speed: 0.58 },
  { pos: [ 13, -3.5, -26] as const, scale: 14.0, op: 0.35, speed: 0.65 },
  { pos: [-15, -1.5, -28] as const, scale: 14.0, op: 0.30, speed: 0.42 },
  { pos: [ -3, -2.5, -30] as const, scale: 16.0, op: 0.28, speed: 0.45 },
  { pos: [  6, -0.5, -33] as const, scale: 18.0, op: 0.24, speed: 0.38 },
  { pos: [ 16, -3.5, -32] as const, scale: 15.0, op: 0.25, speed: 0.60 },
  { pos: [-18, -3.0, -35] as const, scale: 18.0, op: 0.22, speed: 0.40 },
  // ── Far layer ───────────────────────────────────────────────────────────
  { pos: [  8, -2.5, -36] as const, scale: 16.0, op: 0.21, speed: 0.32 },
  { pos: [ -8, -0.5, -40] as const, scale: 19.0, op: 0.20, speed: 0.30 },
  { pos: [ 10, -1.5, -38] as const, scale: 16.0, op: 0.22, speed: 0.35 },
  { pos: [ -2, -3.0, -44] as const, scale: 20.0, op: 0.20, speed: 0.25 },
  { pos: [ -5, -1.0, -48] as const, scale: 18.0, op: 0.18, speed: 0.22 },
];

// Per-sprite offsets within each cluster: [dx, dy, dz, scaleRatio]
const OFFSETS: [number, number, number, number][] = [
  [  0,    0,    0,   1.00 ],
  [  0.9,  0.25,-0.5, 0.72 ],
  [ -0.7, -0.15, 0.4, 0.68 ],
  [  0.5,  0.55,-0.8, 0.60 ],
  [ -1.1,  0.10, 0.3, 0.55 ],
  [  0.8, -0.35, 0.6, 0.48 ],
];

function CloudCluster({
  def, tex,
}: {
  def: typeof CLOUDS[0]; tex: THREE.CanvasTexture;
}) {
  const gRef     = useRef<THREE.Group>(null);
  const baseOps  = useMemo(() => OFFSETS.map(([,,,sr]) => def.op * (0.5 + sr * 0.5)), [def.op]);

  useFrame(() => {
    if (!gRef.current) return;
    // Slow horizontal drift + wrap
    gRef.current.position.x += def.speed * 0.0008;
    if (gRef.current.position.x > 42) gRef.current.position.x = -42;

    const h        = new Date().getHours() + new Date().getMinutes() / 60;
    const isGolden = (h >= 5 && h < 8) || (h >= 17 && h < 20);
    const isNight  =  h >= 20 || h < 5;
    const factor   = isNight ? 0.45 : isGolden ? 1.55 : Math.max(0.3, approxSunY(h));
    const tint     = isNight ? 0x8899bb : isGolden ? 0xff8844 : 0xffffff;

    gRef.current.children.forEach((child, i) => {
      const mat = (child as THREE.Sprite).material as THREE.SpriteMaterial;
      mat.opacity = Math.min(0.95, (baseOps[i] ?? def.op) * factor);
      mat.color.set(tint);
    });
  });

  return (
    <group ref={gRef} position={[def.pos[0], def.pos[1], def.pos[2]]}>
      {OFFSETS.map(([dx, dy, dz, sr], i) => (
        <sprite
          key={i}
          userData={{ baseOpacity: baseOps[i] }}
          position={[dx * def.scale * 0.38, dy * def.scale * 0.18, dz]}
          scale={[def.scale * sr, def.scale * sr * 0.55, 1]}
        >
          <spriteMaterial
            map={tex}
            transparent
            opacity={baseOps[i]}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

function VolumetricClouds() {
  const tex = useMemo(() => makeCloudTexture(), []);
  return (
    <>
      {CLOUDS.map((def, i) => <CloudCluster key={i} def={def} tex={tex} />)}
    </>
  );
}

// ── Scene orchestrator ─────────────────────────────────────────────────────
function SceneContents() {
  const prayer     = usePrayerTimes();
  const ambientRef = useRef<THREE.AmbientLight>(null);

  useFrame(() => {
    if (!ambientRef.current) return;
    const h = new Date().getHours() + new Date().getMinutes() / 60;
    ambientRef.current.intensity = Math.max(0.12, approxSunY(h) * 1.4);
  });

  return (
    <>
      <DynamicBackground />
      <StarField />
      <HorizonHaze />
      <VolumetricClouds />
      <CelestialBodies prayer={prayer} />
      <ambientLight ref={ambientRef} intensity={0.5} />
      <CameraParallax mouseStrength={0.6} damp={0.04} />
    </>
  );
}

// ── Canvas ─────────────────────────────────────────────────────────────────
export default function SkyScene() {
  return (
    <Canvas
      camera={{ position: [0, 1, 5], fov: 60 }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%' }}
    >
      <SceneContents />
    </Canvas>
  );
}
