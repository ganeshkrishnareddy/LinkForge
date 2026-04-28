# 🔗 LinkForge — Premium URL Shortener & Analytics Platform

A stunning, fully functional URL shortener with real-time analytics, QR code generation, and a premium dark-themed dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)

## ✨ Features

- **🔐 Authentication** — Secure signup & login with bcrypt password hashing and JWT sessions
- **🔗 URL Shortening** — Generate short URLs with custom aliases or auto-generated codes
- **📊 Analytics Dashboard** — Track clicks, devices, browsers, referrers with beautiful charts
- **📱 QR Code Generation** — Auto-generated QR codes for every link, downloadable as PNG
- **⏰ Link Expiration** — Set expiration dates for time-sensitive links
- **🎨 Premium UI** — Dark theme with glassmorphism, gradient effects, and smooth animations

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Authentication | NextAuth.js v5 |
| ORM | Prisma 6 |
| Database | MongoDB Atlas |
| Charts | Recharts |
| Icons | Lucide React |
| Styling | CSS Modules |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier: [mongodb.com/atlas](https://www.mongodb.com/atlas))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/linkforge.git
   cd linkforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your MongoDB connection string:
   ```
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/linkforge?retryWrites=true&w=majority"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma         # Database schema (User, Link, ClickEvent)
├── src/
│   ├── app/
│   │   ├── page.js           # Landing page
│   │   ├── globals.css       # Design system
│   │   ├── auth/             # Login & Signup pages
│   │   ├── dashboard/        # Dashboard pages (overview + links)
│   │   ├── [shortCode]/      # URL redirect handler
│   │   └── api/              # Backend API routes
│   │       ├── auth/         # Authentication endpoints
│   │       ├── links/        # Links CRUD + analytics
│   │       ├── shorten/      # Public URL shortener
│   │       ├── stats/        # Platform statistics
│   │       └── dashboard/    # Dashboard data aggregation
│   ├── components/           # Reusable UI components
│   └── lib/                  # Utilities (prisma, auth, helpers)
├── middleware.js              # Route protection
└── .env.example              # Environment variables template
```

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register a new user |
| POST | `/api/auth/[...nextauth]` | ❌ | NextAuth handler |
| GET | `/api/links` | ✅ | List user's links |
| POST | `/api/links` | ✅ | Create a new link |
| GET | `/api/links/[id]` | ✅ | Get single link |
| PUT | `/api/links/[id]` | ✅ | Update a link |
| DELETE | `/api/links/[id]` | ✅ | Delete a link |
| GET | `/api/links/[id]/analytics` | ✅ | Get link analytics |
| POST | `/api/shorten` | ❌ | Public URL shortener |
| GET | `/api/stats` | ❌ | Platform statistics |
| GET | `/api/dashboard` | ✅ | Dashboard overview data |
| GET | `/[shortCode]` | ❌ | Redirect & track click |

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```
DATABASE_URL=mongodb+srv://...
NEXTAUTH_SECRET=generate-a-strong-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 📝 License

MIT

---

Built with ❤️ using Next.js, Prisma, and MongoDB
