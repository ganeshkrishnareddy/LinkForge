'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Link2,
  MousePointerClick,
  TrendingUp,
  Zap,
  Plus,
  ExternalLink,
  Clock,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { ClicksAreaChart, DevicePieChart, BrowsersChart, ReferrersChart } from '@/components/AnalyticsCharts';
import CreateLinkModal from '@/components/CreateLinkModal';
import { timeAgo } from '@/lib/utils';
import styles from './page.module.css';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLinkCreated = () => {
    fetchStats();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ''} 👋
          </h1>
          <p className={styles.subtitle}>Here&apos;s an overview of your link performance</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} />
          <span>New Link</span>
        </button>
      </div>

      {loading ? (
        <div className={styles.loader}>
          <div className={styles.spinner} />
          <p>Loading your dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <StatsCard
              label="Total Links"
              value={stats?.totalLinks || 0}
              icon={Link2}
              color="purple"
              trend={stats?.totalLinks > 0 ? '+' + stats.totalLinks + ' total' : null}
            />
            <StatsCard
              label="Total Clicks"
              value={stats?.totalClicks || 0}
              icon={MousePointerClick}
              color="cyan"
              trend={stats?.clicksToday > 0 ? '+' + stats.clicksToday + ' today' : null}
            />
            <StatsCard
              label="Clicks Today"
              value={stats?.clicksToday || 0}
              icon={TrendingUp}
              color="green"
              trend={stats?.clicksToday > 0 ? 'Active' : 'No clicks yet'}
            />
            <StatsCard
              label="Avg. Clicks/Link"
              value={stats?.totalLinks ? Math.round(stats.totalClicks / stats.totalLinks) : 0}
              icon={Zap}
              color="orange"
              trend={stats?.totalClicks > 0 ? 'Performing' : null}
            />
          </div>

          {/* Charts Grid */}
          {stats?.totalClicks > 0 ? (
            <>
              <div className={styles.chartsGrid}>
                <div className={styles.chartLarge}>
                  <ClicksAreaChart data={stats?.clicksByDate || []} />
                </div>
                <div className={styles.chartSmall}>
                  <DevicePieChart data={stats?.devices || []} />
                </div>
              </div>

              <div className={styles.chartsGrid}>
                <div className={styles.chartSmall}>
                  <BrowsersChart data={stats?.browsers || []} />
                </div>
                <div className={styles.chartLarge}>
                  <ReferrersChart data={stats?.referrers || []} />
                </div>
              </div>
            </>
          ) : (
            <div className={styles.chartsEmpty}>
              <BarChart3 size={28} className={styles.chartsEmptyIcon} />
              <h3>Analytics will appear here</h3>
              <p>Once your links start getting clicks, you&apos;ll see detailed charts with device, browser, and referrer breakdowns.</p>
            </div>
          )}

          {/* Top Links */}
          {stats?.topLinks && stats.topLinks.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <TrendingUp size={18} />
                Top Performing Links
              </h2>
              <div className={styles.topLinks}>
                {stats.topLinks.map((link, index) => (
                  <div key={link.id} className={styles.topLinkItem}>
                    <span className={styles.topLinkRank}>#{index + 1}</span>
                    <div className={styles.topLinkInfo}>
                      <span className={styles.topLinkCode}>/{link.shortCode}</span>
                      <span className={styles.topLinkTitle}>
                        {link.title || link.originalUrl.substring(0, 40)}
                      </span>
                    </div>
                    <span className={styles.topLinkClicks}>
                      <MousePointerClick size={13} />
                      {link.clicks}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Links */}
          {stats?.recentLinks && stats.recentLinks.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Clock size={18} />
                Recent Links
              </h2>
              <div className={styles.recentLinks}>
                <div className={styles.recentHeader}>
                  <span>Short Link</span>
                  <span>Original URL</span>
                  <span>Clicks</span>
                  <span>Created</span>
                </div>
                {stats.recentLinks.map((link) => (
                  <div key={link.id} className={styles.recentItem}>
                    <span className={styles.recentCode}>/{link.shortCode}</span>
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.recentUrl}
                    >
                      <ExternalLink size={12} />
                      {link.originalUrl.length > 40
                        ? link.originalUrl.substring(0, 40) + '...'
                        : link.originalUrl}
                    </a>
                    <span className={styles.recentClicks}>
                      {link.clicks || 0}
                    </span>
                    <span className={styles.recentTime}>
                      {timeAgo(link.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {(!stats?.totalLinks || stats.totalLinks === 0) && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Sparkles size={32} />
              </div>
              <h3>Welcome to LinkForge! 🚀</h3>
              <p>Create your first shortened link to start tracking analytics.</p>

              <div className={styles.onboardingSteps}>
                <div className={styles.onboardingStep}>
                  <div className={styles.onboardingNum}>1</div>
                  <div>
                    <strong>Paste your long URL</strong>
                    <span>Drop any link you want to shorten</span>
                  </div>
                </div>
                <div className={styles.onboardingStep}>
                  <div className={styles.onboardingNum}>2</div>
                  <div>
                    <strong>Customize short link</strong>
                    <span>Choose a custom alias or auto-generate</span>
                  </div>
                </div>
                <div className={styles.onboardingStep}>
                  <div className={styles.onboardingNum}>3</div>
                  <div>
                    <strong>Track performance</strong>
                    <span>Watch clicks roll in with live analytics</span>
                  </div>
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={18} />
                <span>Create Your First Link</span>
              </button>
            </div>
          )}
        </>
      )}

      <CreateLinkModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleLinkCreated}
      />
    </div>
  );
}
