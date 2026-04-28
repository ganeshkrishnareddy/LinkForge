'use client';

import { useState } from 'react';
import styles from './Toast.module.css';

let toastId = 0;
let addToastFn = null;

export function showToast(message, type = 'success') {
  if (addToastFn) {
    addToastFn({ id: ++toastId, message, type });
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  addToastFn = (toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 3000);
  };

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
