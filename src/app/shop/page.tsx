import { Star, ShoppingBag } from 'lucide-react';
import styles from './page.module.css';

const PRODUCTS = [
  {
    id: 1,
    name: 'KETOSTICS Premium Velvet Prayer Mat',
    description: 'Luxuriously soft velvet musallah with an intricate printed Islamic design. Non-slip backing, foldable, and travel-ready.',
    price: 499,
    image: 'https://m.media-amazon.com/images/I/51mOdFHHL3L.jpg',
    category: 'Prayer Essentials',
    sold: 128,
    rating: 4.5,
    affiliateUrl: 'https://amzn.to/4cQ5OIb',
  },
  {
    id: 2,
    name: 'KETOSTICS Premium Velvet Prayer Mat',
    description: 'Luxuriously soft velvet musallah with an intricate printed Islamic design. Non-slip backing, foldable, and travel-ready.',
    price: 499,
    image: 'https://m.media-amazon.com/images/I/51mOdFHHL3L.jpg',
    category: 'Prayer Essentials',
    sold: 128,
    rating: 4.5,
    affiliateUrl: 'https://amzn.to/4cQ5OIb',
  },
  {
    id: 3,
    name: 'KETOSTICS Premium Velvet Prayer Mat',
    description: 'Luxuriously soft velvet musallah with an intricate printed Islamic design. Non-slip backing, foldable, and travel-ready.',
    price: 499,
    image: 'https://m.media-amazon.com/images/I/51mOdFHHL3L.jpg',
    category: 'Prayer Essentials',
    sold: 128,
    rating: 4.5,
    affiliateUrl: 'https://amzn.to/4cQ5OIb',
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className={styles.starRow} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          aria-hidden="true"
          className={s <= Math.floor(rating) ? styles.starFilled : styles.starEmpty}
        />
      ))}
      <span className={styles.ratingNum}>{rating}</span>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className={styles.page}>

      {/* ── Hero band ── */}
      <section className={styles.hero} aria-label="Shop hero">
        <div className={styles.heroContent}>
          <span className="text-gold-label">Mihrab Shop</span>
          <h1 className={styles.heroTitle}>Curated Islamic Essentials</h1>
          <p className={styles.heroSub}>
            Handpicked products to enrich your spiritual practice — sourced and
            recommended by the Mihrab team.
          </p>
        </div>
      </section>

      {/* ── Products grid ── */}
      <section className={styles.productsSection} aria-labelledby="products-heading">
        <div className="container">
          <h2 id="products-heading" className={styles.sectionHeading}>Products</h2>

          <div className={styles.grid} role="list">
            {PRODUCTS.map((p) => (
              <article key={p.id} className={styles.card} role="listitem">

                {/* Image */}
                <div className={styles.cardImgWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className={styles.cardImg}
                  />
                </div>

                {/* Body */}
                <div className={styles.cardBody}>
                  <h3 className={styles.cardName}>{p.name}</h3>

                  <StarRow rating={p.rating} />

                  <p className={styles.cardDesc}>{p.description}</p>

                  <p className={styles.cardPrice}>
                    <span className={styles.rupee}>₹</span>{p.price.toLocaleString('en-IN')}.00
                  </p>

                  {p.sold > 0 && (
                    <p className={styles.soldBadge}>{p.sold} people bought this</p>
                  )}

                  <p className={styles.cardCategory}>Category: {p.category}</p>

                  <a
                    href={p.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewBtn}
                    aria-label={`View ${p.name} on Amazon`}
                  >
                    <ShoppingBag size={15} aria-hidden="true" />
                    View product
                  </a>
                </div>

              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coming soon ── */}
      <section className={styles.comingSoon} aria-label="Coming soon">
        <div className="container">
          <div className={styles.comingSoonInner}>
            <span className="text-gold-label">Coming Soon</span>
            <h2 className={styles.comingSoonTitle}>More Products on the Way</h2>
            <p className={styles.comingSoonSub}>
              We are curating more Islamic essentials — Quran stands, tasbeeh counters,
              attar, and more. Download Mihrab to be the first to know.
            </p>
            <div className={styles.comingSoonCtas}>
              <a
                href="https://play.google.com/store/apps/details?id=in.mihrab.app&hl=en_IN"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Google Play
              </a>
              <a
                href="https://apps.apple.com/in/app/mihrab/id6630381320"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                App Store
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
