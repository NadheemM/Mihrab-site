import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <div className={styles.footerWrapper}>
      <footer className={styles.footer}>
        <div className={`container ${styles.footerContainer}`}>

          {/* Brand column */}
          <div className={styles.brand}>
            <div className={styles.logoPill}>
              <Image
                src="/logo.png"
                alt="Mihrab App"
                width={110}
                height={34}
                className={styles.logoImg}
              />
            </div>
            <p className={styles.brandTagline}>
              Connecting the Ummah
            </p>
            <p className={styles.brandDesc}>
              Accurate prayer times, masjid directory, community news, and local business listings — all in one place.
            </p>
          </div>

          {/* Quick links */}
          <div className={styles.linksSection}>
            <span className={styles.sectionHeading}>Quick Links</span>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/masjids">Masjids</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/contact">Feedback</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className={styles.socialSection}>
            <span className={styles.sectionHeading}>Follow Us</span>
            <div className={styles.socialIcons}>
              <a href="https://www.instagram.com/mihrab.app/" target="_blank" rel="noopener noreferrer" aria-label="Follow Mihrab on Instagram">
                <FaInstagram size={18} aria-hidden="true" />
              </a>
              <a href="https://www.facebook.com/people/Mihrab-Global/61582239911157/" target="_blank" rel="noopener noreferrer" aria-label="Follow Mihrab on Facebook">
                <FaFacebook size={18} aria-hidden="true" />
              </a>
              <a href="https://www.youtube.com/channel/UCE04iw7YfSebz1Rkg9e7Low" target="_blank" rel="noopener noreferrer" aria-label="Follow Mihrab on YouTube">
                <FaYoutube size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className={styles.copyright}>
          <p className={styles.copyrightText}>
            &copy; {new Date().getFullYear()} Mihrab App. All rights reserved.
          </p>
          <span className={styles.copyrightDiamond} aria-hidden="true">◆</span>
          <p className={styles.copyrightText}>
            Made with care for the community
          </p>
        </div>
      </footer>
    </div>
  );
}
