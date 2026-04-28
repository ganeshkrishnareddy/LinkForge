import { SessionProvider } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import ToastContainer from '@/components/Toast';
import styles from './layout.module.css';

export const metadata = {
  title: 'Dashboard — LinkForge',
  description: 'Manage your links and view analytics',
};

export default function DashboardLayout({ children }) {
  return (
    <SessionProvider>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>
          {children}
        </main>
        <ToastContainer />
      </div>
    </SessionProvider>
  );
}
