'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './StatsCard.module.css';

export default function StatsCard({ label, value, icon: Icon, color = 'purple', suffix = '', trend = null }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    
    const target = typeof value === 'number' ? value : parseInt(value) || 0;
    if (target === 0) {
      setDisplayValue(0);
      return;
    }

    hasAnimated.current = true;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const colorStyles = {
    purple: { bg: 'rgba(124, 92, 252, 0.1)', border: 'rgba(124, 92, 252, 0.2)', text: '#a78bfa', iconBg: 'rgba(124, 92, 252, 0.15)' },
    cyan: { bg: 'rgba(0, 212, 200, 0.1)', border: 'rgba(0, 212, 200, 0.2)', text: '#00d4c8', iconBg: 'rgba(0, 212, 200, 0.15)' },
    green: { bg: 'rgba(0, 201, 167, 0.1)', border: 'rgba(0, 201, 167, 0.2)', text: '#00c9a7', iconBg: 'rgba(0, 201, 167, 0.15)' },
    orange: { bg: 'rgba(255, 197, 61, 0.1)', border: 'rgba(255, 197, 61, 0.2)', text: '#ffc53d', iconBg: 'rgba(255, 197, 61, 0.15)' },
  };

  const c = colorStyles[color] || colorStyles.purple;

  return (
    <div
      ref={ref}
      className={styles.card}
      style={{ '--card-bg': c.bg, '--card-border': c.border }}
    >
      <div className={styles.iconWrap} style={{ background: c.iconBg }}>
        {Icon && <Icon size={20} style={{ color: c.text }} />}
      </div>
      <div className={styles.content}>
        <span className={styles.value} style={{ color: c.text }}>
          {displayValue.toLocaleString()}{suffix}
        </span>
        <span className={styles.label}>{label}</span>
        {trend && <span className={styles.trend}>{trend}</span>}
      </div>
    </div>
  );
}
