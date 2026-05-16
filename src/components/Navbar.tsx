'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';

const ORG_LINKS = [
  { name: 'About',    href: '/about' },
  { name: 'Collaborate', href: '/team-up' },
  { name: 'Contact',  href: '/contact' },
  { name: 'Feedback', href: 'https://chat.whatsapp.com/BziYMJFezhcF74rl7lqqnd', external: true },
];

const MAIN_LINKS = [
  { name: 'Home',     href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Gallery',  href: '/gallery' },
  { name: 'Masjids',  href: '/masjids' },
  { name: 'Blog',     href: '/blog' },
  { name: 'Business', href: '/business' },
  { name: 'Shop',     href: '/shop' },
];

export default function Navbar() {
  const pathname  = usePathname();
  const [isOpen,       setIsOpen]       = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [orgOpen,      setOrgOpen]      = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHome   = pathname === '/';
  const orgActive = ORG_LINKS.some(l => l.href === pathname);

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 72);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setOrgOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const menuId = 'primary-navigation';

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : styles.transparent}`}
      aria-label="Primary navigation"
    >
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} aria-label="Mihrab — Home">
          <div className={styles.logoPill}>
            <Image
              src="/logo.png"
              alt="Mihrab"
              width={100}
              height={30}
              className={styles.logoImg}
              priority
            />
          </div>
        </Link>

        <div
          id={menuId}
          className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}
          role="list"
        >
          {MAIN_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              role="listitem"
              className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
              aria-current={pathname === link.href ? 'page' : undefined}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* Organisation dropdown */}
          <div
            ref={dropdownRef}
            className={styles.dropdown}
            role="listitem"
          >
            <button
              className={`${styles.dropdownTrigger} ${orgActive ? styles.active : ''}`}
              onClick={() => setOrgOpen(o => !o)}
              aria-expanded={orgOpen}
              aria-haspopup="menu"
            >
              Organisation
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={`${styles.chevron} ${orgOpen ? styles.chevronOpen : ''}`}
              />
            </button>

            <div
              className={`${styles.dropdownMenu} ${orgOpen ? styles.dropdownVisible : ''}`}
              role="menu"
            >
              {ORG_LINKS.map((link) =>
                link.external ? (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    className={styles.dropdownItem}
                    onClick={() => { setOrgOpen(false); setIsOpen(false); }}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    role="menuitem"
                    className={`${styles.dropdownItem} ${pathname === link.href ? styles.dropdownItemActive : ''}`}
                    onClick={() => { setOrgOpen(false); setIsOpen(false); }}
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>

        <button
          className={styles.mobileMenuToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>
    </nav>
  );
}
