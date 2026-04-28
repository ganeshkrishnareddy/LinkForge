'use client';

import { X, Download } from 'lucide-react';
import styles from './QRCodeDisplay.module.css';

export default function QRCodeDisplay({ link, isOpen, onClose }) {
  if (!isOpen || !link) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = link.qrCode;
    a.download = `linkforge-qr-${link.shortCode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>QR Code</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.qrWrapper}>
            <img src={link.qrCode} alt={`QR Code for ${link.shortCode}`} className={styles.qrImage} />
          </div>
          <p className={styles.shortUrl}>
            {link.shortCode}
          </p>
          <p className={styles.originalUrl}>
            {link.originalUrl.length > 50
              ? link.originalUrl.substring(0, 50) + '...'
              : link.originalUrl}
          </p>
          <button className="btn-primary" onClick={handleDownload} style={{ width: '100%' }}>
            <span>Download QR Code</span>
            <Download size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
