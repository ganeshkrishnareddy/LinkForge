'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, SortDesc, Link2 } from 'lucide-react';
import LinkCard from '@/components/LinkCard';
import CreateLinkModal from '@/components/CreateLinkModal';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import styles from './page.module.css';

export default function LinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [qrLink, setQrLink] = useState(null);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetchLinks();
  }, []);

  const fetchLinks = async (searchQuery = '') => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      const res = await fetch(`/api/links?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    // Debounce
    clearTimeout(window._searchTimeout);
    window._searchTimeout = setTimeout(() => fetchLinks(val), 300);
  };

  const handleDelete = (id) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const handleCreated = (newLink) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Links</h1>
          <p className={styles.subtitle}>
            {links.length} link{links.length !== 1 ? 's' : ''} created
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} />
          <span>New Link</span>
        </button>
      </div>

      {/* Search */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search links by title, URL, or code..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Links List */}
      {loading ? (
        <div className={styles.loader}>
          <div className={styles.spinner} />
          <p>Loading links...</p>
        </div>
      ) : links.length > 0 ? (
        <div className={styles.linksList}>
          {links.map((link, index) => (
            <div key={link.id} style={{ animationDelay: `${index * 0.05}s` }}>
              <LinkCard
                link={link}
                baseUrl={baseUrl}
                onDelete={handleDelete}
                onShowQR={setQrLink}
                onShowAnalytics={(l) => window.open(`/dashboard?linkId=${l.id}`, '_self')}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Link2 size={32} />
          </div>
          <h3>{search ? 'No links found' : 'No links yet'}</h3>
          <p>
            {search
              ? 'Try a different search term'
              : 'Create your first shortened link to get started.'}
          </p>
          {!search && (
            <button
              className="btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} />
              <span>Create Your First Link</span>
            </button>
          )}
        </div>
      )}

      <CreateLinkModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleCreated}
      />

      <QRCodeDisplay
        link={qrLink}
        isOpen={!!qrLink}
        onClose={() => setQrLink(null)}
      />
    </div>
  );
}
