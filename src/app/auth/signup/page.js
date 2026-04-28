'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Zap, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import styles from './page.module.css';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Create account
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Account created! Please sign in.');
        router.push('/auth/login');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgEffects}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Zap size={20} />
          </div>
          <span className={styles.logoText}>LinkForge</span>
        </Link>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>Create an account</h1>
            <p className={styles.subtitle}>Start shortening & tracking your links</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <div className={styles.inputWrap}>
                <User size={16} className={styles.inputIcon} />
                <input
                  id="signup-name"
                  type="text"
                  className={styles.input}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <div className={styles.inputWrap}>
                <Mail size={16} className={styles.inputIcon} />
                <input
                  id="signup-email"
                  type="email"
                  className={styles.input}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="signup-submit"
              type="submit"
              className={`btn-primary ${styles.submitBtn}`}
              disabled={loading}
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className={styles.footerText}>
            Already have an account?{' '}
            <Link href="/auth/login" className={styles.footerLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
