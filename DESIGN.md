# Mihrab Design Tokens

## Color Palette

### Brand
| Token | Value | Usage |
|---|---|---|
| `--brand-teal` | `#41C2DC` | Primary brand — buttons, links, interactive |
| `--brand-teal-dark` | `#2A9BB8` | Hover state for teal |
| `--brand-teal-light` | `#A8E8F4` | Tint for icon bg accents |
| `--brand-gold` | `#C9922A` | Prestige accent — labels, ornaments, badges |
| `--brand-gold-light` | `#F5D78E` | Gold tint, tagline on dark |

### Surfaces
| Token | Value | Usage |
|---|---|---|
| `--surface-cream` | `#FAF6EE` | Primary page background |
| `--surface-warm-white` | `#FFFFFF` | Card, modal backgrounds |
| `--surface-muted` | `#F0EBE1` | Alternate section backgrounds |
| `--surface-dark` | `#1A2744` | Footer, hero, dark CTAs |
| `--surface-darker` | `#0F1A30` | Navbar |

### Text
| Token | Value | Usage |
|---|---|---|
| `--text-headline` | `#1A2744` | All display/h1/h2/h3 |
| `--text-body` | `#3D3529` | Body copy |
| `--text-muted` | `#7A6E60` | Secondary, captions |
| `--text-inverse` | `#FAF6EE` | Text on dark backgrounds |
| `--text-gold` | `#C9922A` | Gold labels (decorative only) |

### Semantic
| Token | Value |
|---|---|
| `--success` | `#2E7D52` |
| `--warning` | `#B45309` |
| `--error` | `#C0392B` |

### Prayer Time Colors (table row accents)
| Token | Value | Prayer |
|---|---|---|
| `--fajr-color` | `#6B8CAE` | Fajr (pre-dawn blue) |
| `--dhuhr-color` | `#C9922A` | Dhuhr (midday gold) |
| `--asr-color` | `#E07B39` | Asr (afternoon amber) |
| `--maghrib-color` | `#C0392B` | Maghrib (sunset red) |
| `--isha-color` | `#4A4880` | Isha (night indigo) |

---

## Typography

### Font Families
- **Display/Headings:** Cormorant Garamond — weights 400, 600, 700; italic variants
- **Body/UI:** DM Sans — weights 300, 400, 500, 600

### Google Fonts Import
```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap
```

### Type Scale
| Class | Size | Weight | Line-height | Tracking | Font |
|---|---|---|---|---|---|
| `.text-display` | clamp(3.5rem, 7vw, 5.5rem) | 700 | 1.0 | -0.03em | Cormorant |
| `.text-display-italic` | clamp(3.5rem, 7vw, 5.5rem) | 600 italic | 1.05 | -0.02em | Cormorant |
| `.text-h1` | clamp(2.5rem, 5vw, 3.5rem) | 600 | 1.1 | -0.02em | Cormorant |
| `.text-h2` | clamp(1.875rem, 3.5vw, 2.5rem) | 600 | 1.2 | -0.01em | Cormorant |
| `.text-h3` | clamp(1.375rem, 2.5vw, 1.75rem) | 600 | 1.3 | 0 | Cormorant |
| `.text-caption` | 0.75rem | 500 | 1.5 | 0.08em uppercase | DM Sans |
| `.text-gold-label` | 0.75rem | 600 | 1.5 | 0.10em uppercase | DM Sans |

---

## Spacing (8px base grid)
| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 48px |
| `--space-8` | 64px |
| `--space-9` | 96px |
| `--space-10` | 128px |

---

## Borders & Radius
| Token | Value |
|---|---|
| `--radius-sm` | 6px |
| `--radius-md` | 12px |
| `--radius-lg` | 16px |
| `--radius-xl` | 24px |
| `--radius-pill` | 999px |
| `--border-thin` | 1px solid rgba(201,146,42,0.2) — gold hairline |
| `--border-warm` | 1px solid rgba(61,53,41,0.12) — warm gray |

---

## Shadows
| Token | Value |
|---|---|
| `--shadow-sm` | 0 2px 8px rgba(26,39,68,0.06) |
| `--shadow-md` | 0 8px 24px rgba(26,39,68,0.10) |
| `--shadow-lg` | 0 16px 48px rgba(26,39,68,0.14) |
| `--shadow-glow` | 0 8px 32px rgba(65,194,220,0.20) — teal glow for CTA buttons |
| `--shadow-gold` | 0 4px 20px rgba(201,146,42,0.25) — gold glow for accent |

---

## Animation
| Token | Value |
|---|---|
| `--duration-fast` | 150ms |
| `--duration-base` | 250ms |
| `--duration-slow` | 400ms |
| `--duration-xslow` | 600ms |
| `--ease-smooth` | cubic-bezier(0.16, 1, 0.3, 1) |
| `--ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) |

---

## Contrast Compliance (WCAG AA)
| Pair | Ratio | Status |
|---|---|---|
| `--text-body` on `--surface-cream` | ~11:1 | Pass |
| `--text-headline` on `--surface-cream` | ~14:1 | Pass |
| `--text-muted` on `--surface-warm-white` | ~4.6:1 | Pass AA |
| `--text-inverse` on `--surface-dark` | ~14:1 | Pass |
| `--brand-gold` on `--surface-cream` | ~3.2:1 | Labels only — not body text |
| `--brand-gold` on `--surface-dark` | ~5.8:1 | Pass AA |
| White on `--brand-teal` | ~2.6:1 | FAIL — never use |
