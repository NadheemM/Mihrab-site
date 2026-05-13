import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './page.module.css';

function CollaborationIllustration() {
  return (
    <svg
      viewBox="0 0 480 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={styles.illustration}
    >
      {/* Soft ambient blobs */}
      <ellipse cx="240" cy="200" rx="220" ry="185" fill="rgba(65,194,220,0.06)" />
      <ellipse cx="160" cy="180" rx="140" ry="130" fill="rgba(65,194,220,0.07)" />
      <ellipse cx="330" cy="220" rx="120" ry="110" fill="rgba(201,146,42,0.06)" />

      {/* Left octagon — teal org */}
      <polygon
        points="130,80 190,80 230,120 230,200 190,240 130,240 90,200 90,120"
        fill="rgba(65,194,220,0.13)"
        stroke="rgba(65,194,220,0.35)"
        strokeWidth="1.5"
      />
      {/* Left octagon inner */}
      <polygon
        points="140,100 180,100 205,125 205,195 180,220 140,220 115,195 115,125"
        fill="rgba(65,194,220,0.08)"
      />
      {/* Mosque dome in left octagon */}
      <path
        d="M160 195 L160 155 Q160 130 175 125 Q190 120 190 155 L190 195Z"
        fill="rgba(65,194,220,0.55)"
      />
      <ellipse cx="175" cy="125" rx="16" ry="12" fill="rgba(65,194,220,0.65)" />
      <line x1="175" y1="113" x2="175" y2="100" stroke="rgba(65,194,220,0.8)" strokeWidth="2" strokeLinecap="round" />
      <path d="M164 195 L186 195" stroke="rgba(65,194,220,0.5)" strokeWidth="2" strokeLinecap="round" />
      <path d="M155 195 L195 195" stroke="rgba(65,194,220,0.3)" strokeWidth="2" strokeLinecap="round" />

      {/* Right octagon — gold org */}
      <polygon
        points="260,100 320,100 360,140 360,220 320,260 260,260 220,220 220,140"
        fill="rgba(201,146,42,0.11)"
        stroke="rgba(201,146,42,0.32)"
        strokeWidth="1.5"
      />
      {/* Right octagon inner */}
      <polygon
        points="270,118 310,118 335,143 335,215 310,240 270,240 245,215 245,143"
        fill="rgba(201,146,42,0.07)"
      />
      {/* Crescent + star in right octagon */}
      <path
        d="M305 145 C285 148 278 165 283 180 C271 168 271 148 285 141 C291 138 298 138 305 140Z"
        fill="rgba(201,146,42,0.75)"
      />
      {/* 6-pointed star */}
      <polygon
        points="315,165 319,172 327,172 321,178 323,186 315,181 307,186 309,178 303,172 311,172"
        fill="rgba(201,146,42,0.8)"
      />

      {/* Connecting bridge / hands */}
      {/* Left hand reaching right */}
      <path
        d="M220 175 C225 172 232 170 238 172 C244 174 246 178 242 181 C238 184 230 183 224 180Z"
        fill="rgba(65,194,220,0.5)"
        stroke="rgba(65,194,220,0.4)"
        strokeWidth="0.5"
      />
      {/* Right hand reaching left */}
      <path
        d="M260 175 C255 172 248 170 242 172 C236 174 234 178 238 181 C242 184 250 183 256 180Z"
        fill="rgba(201,146,42,0.5)"
        stroke="rgba(201,146,42,0.4)"
        strokeWidth="0.5"
      />

      {/* Center connection glow */}
      <circle cx="240" cy="177" r="18" fill="rgba(201,146,42,0.12)" />
      <circle cx="240" cy="177" r="10" fill="rgba(201,146,42,0.25)" />

      {/* 8-pointed star at center */}
      <path
        d="M240 165 L243 173 L251 173 L245 178 L247 186 L240 181 L233 186 L235 178 L229 173 L237 173Z"
        fill="#C9922A"
        opacity="0.9"
      />

      {/* Dashed connecting arc */}
      <path
        d="M160 80 Q240 40 320 100"
        stroke="rgba(201,146,42,0.25)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        fill="none"
      />
      <path
        d="M160 240 Q240 290 320 260"
        stroke="rgba(65,194,220,0.22)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
        fill="none"
      />

      {/* Floating accent dots */}
      <circle cx="80"  cy="80"  r="4" fill="rgba(201,146,42,0.35)" />
      <circle cx="400" cy="120" r="4" fill="rgba(65,194,220,0.35)" />
      <circle cx="60"  cy="300" r="3" fill="rgba(65,194,220,0.25)" />
      <circle cx="420" cy="300" r="3" fill="rgba(201,146,42,0.25)" />
      <circle cx="240" cy="340" r="5" fill="rgba(201,146,42,0.2)" />

      {/* Small geometric accents */}
      <polygon points="390,80 396,90 384,90" fill="rgba(65,194,220,0.3)" />
      <polygon points="70,240 76,250 64,250"  fill="rgba(201,146,42,0.3)" />
    </svg>
  );
}

export default function TeamUpPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.grid}>

          {/* Left — text content */}
          <div className={styles.content}>
            <ScrollReveal variant="up" delay={0}>
              <span className="text-gold-label">Partnership</span>
              <h1 className={styles.heading}>
                <span className={styles.headingLight}>{"Let's"}</span>
                <br />
                <span className={styles.headingAccent}>Team-Up</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={150}>
              <p className={styles.body}>
                At Mihrab, we are dedicated to partnering with aligned organizations to uplift and
                serve the Ummah. We champion collaboration and shared resources to maximize our
                collective impact and avoid unnecessary duplication of effort.
              </p>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={300}>
              <Link href="/contact" className="btn btn-primary" style={{ display: 'inline-block' }}>
                Team Up with Us
              </Link>
            </ScrollReveal>
          </div>

          {/* Right — illustration */}
          <ScrollReveal variant="scale" delay={150} className={styles.illustrationWrap}>
            <CollaborationIllustration />
          </ScrollReveal>

        </div>
      </div>
    </div>
  );
}
