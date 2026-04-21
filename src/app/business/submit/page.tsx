'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubmitBusinessPage() {
  const [formData, setFormData] = useState({ name: '', category: '', description: '', contactInfo: '', location: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Submitting your business...' });
    
    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({ type: 'success', msg: 'Your business has been submitted! It will appear in the directory once approved by an admin.' });
        setFormData({ name: '', category: '', description: '', contactInfo: '', location: '' });
      } else {
        setStatus({ type: 'error', msg: 'Failed to submit business. Please try again later.' });
      }
    } catch (error) {
      setStatus({ type: 'error', msg: 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 2rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/business" style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          &larr; Back to Directory
        </Link>
      </div>
      
      <div className="glass-panel" style={{ padding: '3rem', borderRadius: '1rem' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '1rem', textAlign: 'center', fontSize: '2.5rem' }}>
          List Your Business
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0.8 }}>
          Join the Mihrab App network. Submit your details below and we'll review your listing shortly.
        </p>

        {status.msg && (
          <div style={{
            padding: '1rem',
            marginBottom: '2rem',
            borderRadius: '0.5rem',
            backgroundColor: status.type === 'success' ? '#dcfce7' : status.type === 'error' ? '#fee2e2' : '#e0f2fe',
            color: status.type === 'success' ? '#166534' : status.type === 'error' ? '#991b1b' : '#075985',
            textAlign: 'center'
          }}>
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Business Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--background)' }}
              />
            </div>
            
            <div>
              <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
              <input
                type="text"
                id="category"
                name="category"
                placeholder="e.g. Halal Food, Education, Services"
                value={formData.category}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--background)' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Location / Address</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--background)' }}
            />
          </div>

          <div>
            <label htmlFor="contactInfo" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Contact Info (Phone/Email)</label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--background)' }}
            />
          </div>

          <div>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Business Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--background)', resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={status.type === 'loading'}>
            {status.type === 'loading' ? 'Submitting...' : 'Submit Business Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
