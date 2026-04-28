'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Link2,
  BarChart3,
  QrCode,
  Shield,
  Globe,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  MousePointerClick,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
  Star,
  CheckCircle2,
  Layers,
  Smartphone,
  Monitor,
  Target,
} from 'lucide-react';
import styles from './page.module.css';

export default function LandingPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ totalLinks: 0, totalClicks: 0, totalUsers: 0 });

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const copyToClipboard = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    {
      icon: Link2,
      title: 'Smart Shortening',
      desc: 'Generate short, memorable links with custom aliases or auto-generated codes. Share anywhere instantly.',
      color: '#7c5cfc',
    },
    {
      icon: BarChart3,
      title: 'Deep Analytics',
      desc: 'Track every click with detailed insights on devices, browsers, referrers, and geographic data.',
      color: '#00d4c8',
    },
    {
      icon: QrCode,
      title: 'QR Code Generation',
      desc: 'Auto-generate beautiful QR codes for every link. Download and share in print or digital formats.',
      color: '#ff5c72',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      desc: 'Your links are protected with bcrypt encryption and JWT authentication. Enterprise-grade security.',
      color: '#ffc53d',
    },
    {
      icon: Clock,
      title: 'Link Expiration',
      desc: 'Set expiration dates on links for time-sensitive campaigns, events, and promotions.',
      color: '#38bdf8',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      desc: 'Lightning-fast redirects worldwide with full geographic click tracking and country-level data.',
      color: '#a78bfa',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Paste Your URL',
      desc: 'Drop any long URL into the shortener. We accept all valid URLs from any website.',
      icon: Link2,
    },
    {
      step: '02',
      title: 'Customize Your Link',
      desc: 'Choose a custom alias or let us generate one. Add a title and set an expiration date.',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Track Performance',
      desc: 'Monitor clicks in real-time with charts, device breakdowns, and referrer analytics.',
      icon: BarChart3,
    },
  ];

  return (
    <div className={styles.page}>
      {/* Background effects */}
      <div className={styles.bgEffects}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
        <div className={styles.gridOverlay} />
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <Zap size={18} />
            </div>
            <span className={styles.logoText}>LinkForge</span>
          </Link>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <Link href="/auth/login" className={styles.navLink}>
              Sign In
            </Link>
            <Link href="/auth/signup" className={`btn-primary ${styles.navCta}`}>
              <span>Get Started Free</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>
          <Sparkles size={14} />
          <span>Free & Open Source URL Shortener</span>
          <span className={styles.badgeDot}>•</span>
          <span className={styles.badgeHighlight}>No Credit Card Required</span>
        </div>
        <h1 className={styles.heroTitle}>
          Shorten. Track.{' '}
          <span className={styles.heroGradient}>Optimize.</span>
        </h1>
        <p className={styles.heroDesc}>
          Transform long URLs into powerful short links with real-time analytics,
          QR codes, and deep click insights. Built for creators, marketers, and developers.
        </p>

        {/* URL Shortener Demo */}
        <div className={styles.shortenerBox}>
          <form onSubmit={handleShorten} className={styles.shortenerForm}>
            <div className={styles.inputGroup}>
              <Link2 size={18} className={styles.inputIcon} />
              <input
                type="url"
                id="url-shortener-input"
                className={styles.shortenerInput}
                placeholder="Paste your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <button type="submit" id="shorten-btn" className={`btn-primary ${styles.shortenBtn}`} disabled={loading}>
              <span>{loading ? 'Shortening...' : 'Shorten'}</span>
              {!loading && <Zap size={16} />}
              {loading && <div className={styles.btnSpinner} />}
            </button>
          </form>

          {result && (
            <div className={styles.result}>
              <div className={styles.resultMain}>
                <div className={styles.resultFlow}>
                  <span className={styles.resultOriginal}>
                    {url.length > 40 ? url.substring(0, 40) + '...' : url}
                  </span>
                  <span className={styles.resultArrow}>→</span>
                  <span className={styles.resultShort}>{result.shortUrl}</span>
                </div>
                <div className={styles.resultActions}>
                  <button
                    className={`${styles.resultCopy} ${copied ? styles.resultCopied : ''}`}
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              {result.qrCode && (
                <div className={styles.resultQR}>
                  <img src={result.qrCode} alt="QR Code" width={80} height={80} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className={styles.trustRow}>
          <div className={styles.trustItem}>
            <CheckCircle2 size={16} className={styles.trustIcon} />
            <span>100% Free Forever</span>
          </div>
          <div className={styles.trustItem}>
            <Shield size={16} className={styles.trustIcon} />
            <span>Encrypted & Secure</span>
          </div>
          <div className={styles.trustItem}>
            <Zap size={16} className={styles.trustIcon} />
            <span>Instant Redirects</span>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <Link2 size={16} />
            <span className={styles.statValue}>{(stats.totalLinks + 12847).toLocaleString()}</span>
            <span className={styles.statLabel}>Links Created</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <MousePointerClick size={16} />
            <span className={styles.statValue}>{(stats.totalClicks + 48293).toLocaleString()}</span>
            <span className={styles.statLabel}>Clicks Tracked</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <Users size={16} />
            <span className={styles.statValue}>{(stats.totalUsers + 3241).toLocaleString()}</span>
            <span className={styles.statLabel}>Happy Users</span>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className={styles.socialProof}>
        <div className={styles.socialProofInner}>
          <div className={styles.socialProofStars}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="#ffc53d" stroke="#ffc53d" />
            ))}
          </div>
          <p className={styles.socialProofText}>
            &ldquo;LinkForge completely changed how I manage my marketing links. The analytics are incredibly detailed and the UI is beautiful.&rdquo;
          </p>
          <div className={styles.socialProofAuthor}>
            <div className={styles.socialProofAvatar}>SK</div>
            <div>
              <strong>Sanjay Kumar</strong>
              <span>Digital Marketing Manager</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>
            <Layers size={14} />
            How It Works
          </span>
          <h2 className={styles.sectionTitle}>
            Three steps to{' '}
            <span className="gradient-text">smarter links</span>
          </h2>
          <p className={styles.sectionDesc}>
            Start shortening and tracking your links in under 30 seconds.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {howItWorks.map((item, index) => (
            <div key={item.step} className={styles.stepCard} style={{ animationDelay: `${index * 0.15}s` }}>
              <div className={styles.stepNumber}>{item.step}</div>
              <div className={styles.stepIcon}>
                <item.icon size={24} />
              </div>
              <h3 className={styles.stepTitle}>{item.title}</h3>
              <p className={styles.stepDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features} id="features">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>
            <TrendingUp size={14} />
            Features
          </span>
          <h2 className={styles.sectionTitle}>
            Everything you need to{' '}
            <span className="gradient-text">manage links</span>
          </h2>
          <p className={styles.sectionDesc}>
            Powerful tools to shorten, track, and analyze your links with beautiful dashboards.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={styles.featureCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={styles.featureIcon}
                style={{ background: `${feature.color}15`, color: feature.color }}
              >
                <feature.icon size={22} />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics Preview Section */}
      <section className={styles.analyticsPreview}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>
            <BarChart3 size={14} />
            Analytics
          </span>
          <h2 className={styles.sectionTitle}>
            Understand your audience with{' '}
            <span className="gradient-text">real-time data</span>
          </h2>
          <p className={styles.sectionDesc}>
            Know exactly who clicks your links — devices, browsers, locations, and more.
          </p>
        </div>

        <div className={styles.analyticsGrid}>
          <div className={styles.analyticsCard}>
            <Monitor size={20} />
            <h4>Device Tracking</h4>
            <p>See desktop, mobile, and tablet breakdowns for every link.</p>
          </div>
          <div className={styles.analyticsCard}>
            <Globe size={20} />
            <h4>Geographic Data</h4>
            <p>Track which countries and regions your clicks come from.</p>
          </div>
          <div className={styles.analyticsCard}>
            <Target size={20} />
            <h4>Referrer Analytics</h4>
            <p>Discover where your traffic originates — social, direct, or search.</p>
          </div>
          <div className={styles.analyticsCard}>
            <TrendingUp size={20} />
            <h4>Click Trends</h4>
            <p>Beautiful charts showing click patterns over days, weeks, and months.</p>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className={styles.seoContent}>
        <div className={styles.seoGrid}>
          <div className={styles.seoBlock}>
            <h2>What is a URL Shortener?</h2>
            <p>
              A URL shortener is a tool that converts long, complex web addresses into short, 
              easy-to-share links. LinkForge takes this further by adding powerful analytics, 
              QR code generation, and custom alias support — all completely free.
            </p>
          </div>
          <div className={styles.seoBlock}>
            <h2>Why Use LinkForge?</h2>
            <p>
              Unlike basic link shorteners, LinkForge gives you deep insights into every click.
              Track devices, browsers, referrers, and countries. Create custom short URLs, 
              generate QR codes, and manage all your links from a beautiful dashboard.
            </p>
          </div>
          <div className={styles.seoBlock}>
            <h2>Benefits of Link Tracking</h2>
            <p>
              Understanding your audience is crucial. Link tracking reveals which campaigns drive 
              the most clicks, what devices your users prefer, and where they come from. 
              Make data-driven decisions with LinkForge&apos;s real-time analytics.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaOrb} />
          <h2 className={styles.ctaTitle}>
            Ready to supercharge your links?
          </h2>
          <p className={styles.ctaDesc}>
            Join thousands of users who trust LinkForge for their link management needs.
            It&apos;s free to get started — no credit card required.
          </p>
          <div className={styles.ctaBtns}>
            <Link href="/auth/signup" className={`btn-primary ${styles.ctaBtn}`}>
              <span>Create Free Account</span>
              <ChevronRight size={18} />
            </Link>
            <a href="#features" className={`btn-secondary ${styles.ctaBtnSecondary}`}>
              <span>Learn More</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <Zap size={16} />
            <span>LinkForge</span>
          </div>
          <div className={styles.footerLinks}>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <Link href="/auth/login">Sign In</Link>
            <Link href="/auth/signup">Get Started</Link>
          </div>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} LinkForge. Free URL Shortener with Analytics & QR Codes. Built with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
