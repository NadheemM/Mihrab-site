import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brand}>
          <Image src="/logo.png" alt="Mihrab App Logo" width={120} height={40} style={{ objectFit: 'contain', marginBottom: '1rem' }} />
          <p>Deepen your connection with your Masjid. Accurate prayer times, Qibla direction, and much more.</p>
        </div>
        
        <div className={styles.linksSection}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className={styles.socialSection}>
          <h4>Follow Us</h4>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Facebook"><FaFacebook size={24} /></a>
            <a href="#" aria-label="Twitter"><FaTwitter size={24} /></a>
            <a href="#" aria-label="Instagram"><FaInstagram size={24} /></a>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Mihrab App. All rights reserved.</p>
      </div>
    </footer>
  );
}
