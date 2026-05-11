'use client';

import { useState } from 'react';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './page.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<{ type: '' | 'loading' | 'success' | 'error'; msg: string }>({ type: '', msg: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Sending your message…' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({ type: 'success', msg: 'Message sent! We will get back to you soon.' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', msg: 'Failed to send. Please try again later.' });
      }
    } catch {
      setStatus({ type: 'error', msg: 'An error occurred. Please try again.' });
    }
  };

  const statusClass = status.type === 'success'
    ? styles.statusSuccess
    : status.type === 'error'
    ? styles.statusError
    : styles.statusLoading;

  return (
    <div className={styles.page}>
      <div className="container">

        {/* Header */}
        <ScrollReveal variant="blur">
          <header className={styles.header}>
            <span className="text-gold-label">Get in Touch</span>
            <h1 className={styles.title}>Contact Us</h1>
          </header>
        </ScrollReveal>

        {/* Two-column layout */}
        <div className={styles.layout}>

          {/* Left — dark info card */}
          <ScrollReveal variant="left">
          <aside className={styles.infoCard} aria-label="Contact details">
            <div className={styles.infoCardContent}>
              <h2 className={styles.infoTitle}>We'd love to hear from you</h2>
              <p className={styles.infoSubtitle}>
                Have a question, suggestion, or need support? Reach out and we'll get back to you.
              </p>

              <div className={styles.infoRow}>
                <div className={styles.infoIcon} aria-hidden="true">
                  <Mail size={18} />
                </div>
                <div className={styles.infoRowText}>
                  <span className={styles.infoRowLabel}>Email</span>
                  <span className={styles.infoRowValue}>support@mihrab.in</span>
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoIcon} aria-hidden="true">
                  <MapPin size={18} />
                </div>
                <div className={styles.infoRowText}>
                  <span className={styles.infoRowLabel}>Location</span>
                  <span className={styles.infoRowValue}>Tamil Nadu, India</span>
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoIcon} aria-hidden="true">
                  <MessageSquare size={18} />
                </div>
                <div className={styles.infoRowText}>
                  <span className={styles.infoRowLabel}>Response time</span>
                  <span className={styles.infoRowValue}>Within 24 hours</span>
                </div>
              </div>
            </div>
          </aside>
          </ScrollReveal>

          {/* Right — form */}
          <ScrollReveal variant="right" delay={150}>
          <section className={styles.formPanel} aria-label="Contact form">
            {status.msg && (
              <div role="status" aria-live="polite" className={`${styles.statusMsg} ${statusClass}`}>
                {status.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.fieldGroup}>
                <label htmlFor="name" className={styles.label}>Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className={styles.input}
                  placeholder="Your full name"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className={styles.input}
                  placeholder="you@example.com"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="message" className={styles.label}>Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={styles.textarea}
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${styles.submitBtn}`}
                disabled={status.type === 'loading'}
              >
                {status.type === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </section>
          </ScrollReveal>

        </div>
      </div>
    </div>
  );
}
