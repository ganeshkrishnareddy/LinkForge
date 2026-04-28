'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Link2,
  BarChart3,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronRight,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/links', label: 'My Links', icon: Link2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Zap size={20} />
          </div>
          <span className={styles.logoText}>LinkForge</span>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <span className={styles.navLabel}>Menu</span>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {isActive(item.href) && <ChevronRight size={14} className={styles.activeIndicator} />}
              </Link>
            ))}
          </div>
        </nav>

        <div className={styles.footer}>
          <button
            className={styles.logoutBtn}
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
