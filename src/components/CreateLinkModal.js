'use client';

import { useState } from 'react';
import { X, Link2, Sparkles, Calendar } from 'lucide-react';
import styles from './CreateLinkModal.module.css';
import { showToast } from './Toast';

export default function CreateLinkModal({ isOpen, onClose, onCreated }) {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [title, setTitle] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          customCode: customCode || undefined,
          title: title || undefined,
          expiresAt: expiresAt || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create link');
        setLoading(false);
        return;
      }

      showToast('Link created successfully!', 'success');
      setUrl('');
      setCustomCode('');
      setTitle('');
      setExpiresAt('');
      onCreated?.(data);
      onClose();
    } catch (err) {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Sparkles size={20} className={styles.headerIcon} />
            <h2>Create New Link</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>
              <Link2 size={14} />
              Destination URL <span className={styles.required}>*</span>
            </label>
            <input
              type="url"
              className="input-field"
              placeholder="https://example.com/your-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Title (optional)</label>
            <input
              type="text"
              className="input-field"
              placeholder="My awesome link"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Custom Alias (optional)</label>
              <div className={styles.aliasInput}>
                <span className={styles.aliasPrefix}>linkforge.app/</span>
                <input
                  type="text"
                  className="input-field"
                  placeholder="my-link"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                  style={{ paddingLeft: '8px' }}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                <Calendar size={14} />
                Expires (optional)
              </label>
              <input
                type="datetime-local"
                className="input-field"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <span>{loading ? 'Creating...' : 'Create Link'}</span>
              {!loading && <Sparkles size={16} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
