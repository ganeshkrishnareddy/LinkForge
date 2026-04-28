import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateShortCode, isValidUrl } from '@/lib/utils';
import QRCode from 'qrcode';

// Public URL shortening (for landing page demo — no auth required)
export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Please provide a valid URL' },
        { status: 400 }
      );
    }

    let shortCode = generateShortCode();

    // Ensure uniqueness
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.link.findUnique({
        where: { shortCode },
      });
      if (!existing) break;
      shortCode = generateShortCode();
      attempts++;
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${shortCode}`;

    const qrCode = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#eaeaf0',
        light: '#07070d',
      },
    });

    // For demo links, we need a placeholder user.
    // Find or create a demo user.
    let demoUser = await prisma.user.findUnique({
      where: { email: 'demo@linkforge.app' },
    });

    if (!demoUser) {
      const bcrypt = await import('bcryptjs');
      demoUser = await prisma.user.create({
        data: {
          name: 'Demo User',
          email: 'demo@linkforge.app',
          password: await bcrypt.hash('demo-password-not-for-login', 12),
        },
      });
    }

    const link = await prisma.link.create({
      data: {
        originalUrl: url,
        shortCode,
        qrCode,
        userId: demoUser.id,
      },
    });

    return NextResponse.json({
      shortUrl,
      shortCode: link.shortCode,
      qrCode: link.qrCode,
    }, { status: 201 });
  } catch (error) {
    console.error('Public shorten error:', error);
    return NextResponse.json(
      { error: 'Failed to shorten URL' },
      { status: 500 }
    );
  }
}
