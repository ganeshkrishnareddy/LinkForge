import './globals.css';

export const metadata = {
  title: 'Free URL Shortener with Analytics & QR Codes | LinkForge',
  description: 'Shorten long URLs instantly with LinkForge. Track clicks, create custom short links, and generate QR codes — all for free. The best link shortener for creators, marketers, and developers.',
  keywords: ['free url shortener', 'best link shortener', 'custom short links', 'track link clicks', 'qr code generator', 'url analytics', 'link management', 'short url creator', 'click tracking', 'link shortener free'],
  openGraph: {
    title: 'LinkForge — Free URL Shortener with Analytics',
    description: 'Shorten URLs, track clicks, and generate QR codes. The smartest way to manage your links.',
    type: 'website',
    siteName: 'LinkForge',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkForge — Free URL Shortener with Analytics',
    description: 'Shorten URLs, track clicks, and generate QR codes for free.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
