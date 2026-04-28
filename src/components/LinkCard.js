'use client';

import { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Trash2,
  BarChart3,
  QrCode,
  Clock,
  MousePointerClick,
} from 'lucide-react';
import styles from './LinkCard.module.css';
import { showToast } from './Toast';
import { timeAgo } from '@/lib/utils';

export default function LinkCard({ link, onDelete, onShowQR, onShowAnalytics, baseUrl }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const shortUrl = `${baseUrl || ''}/${link.shortCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      showToast('Link copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/links/${link.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Link deleted', 'info');
        onDelete?.(link.id);
      } else {
        showToast('Failed to delete link', 'error');
      }
    } catch {
      showToast('Failed to delete link', 'error');
    }
    setIsDeleting(false);
  };

  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

  return (
    <div className={`${styles.card} ${isExpired ? styles.expired : ''}`}>
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            {link.title && <h3 className={styles.title}>{link.title}</h3>}
            {isExpired && <span className={styles.expiredBadge}>Expired</span>}
          </div>
          <div className={styles.shortUrl} onClick={copyToClipboard}>
            <span className={styles.shortUrlText}>{shortUrl.replace(/^https?:\/\//, '')}</span>
            <Copy size={14} className={styles.copyIcon} />
          </div>
        </div>

        <div className={styles.originalUrl}>
          <ExternalLink size={13} />
          <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
            {link.originalUrl.length > 60
              ? link.originalUrl.substring(0, 60) + '...'
              : link.originalUrl}
          </a>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <MousePointerClick size={13} />
            {link._count?.clickEvents ?? link.clicks ?? 0} clicks
          </span>
          <span className={styles.metaItem}>
            <Clock size={13} />
            {timeAgo(link.createdAt)}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actionBtn}
          onClick={copyToClipboard}
          title="Copy link"
        >
          <Copy size={16} />
        </button>
        {link.qrCode && (
          <button
            className={styles.actionBtn}
            onClick={() => onShowQR?.(link)}
            title="Show QR code"
          >
            <QrCode size={16} />
          </button>
        )}
        <button
          className={`${styles.actionBtn} ${styles.analyticsBtn}`}
          onClick={() => onShowAnalytics?.(link)}
          title="View analytics"
        >
          <BarChart3 size={16} />
        </button>
        <button
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete link"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
