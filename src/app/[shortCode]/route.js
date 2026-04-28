import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UAParser } from 'ua-parser-js';

export async function GET(request, { params }) {
  try {
    const { shortCode } = await params;

    const link = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (!link) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check expiration
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Parse user agent
    const userAgent = request.headers.get('user-agent') || '';
    const parser = new UAParser(userAgent);
    const browserInfo = parser.getBrowser();
    const deviceInfo = parser.getDevice();

    let device = 'Desktop';
    if (deviceInfo.type === 'mobile') device = 'Mobile';
    else if (deviceInfo.type === 'tablet') device = 'Tablet';

    // Get referrer
    const referrer = request.headers.get('referer') || request.headers.get('referrer') || null;
    let referrerDomain = 'Direct';
    if (referrer) {
      try {
        referrerDomain = new URL(referrer).hostname;
      } catch {
        referrerDomain = referrer;
      }
    }

    // Track click event (async, don't block redirect)
    prisma.clickEvent.create({
      data: {
        linkId: link.id,
        referrer: referrerDomain,
        userAgent: userAgent.substring(0, 500),
        browser: browserInfo.name || 'Unknown',
        device,
        country: 'Unknown', // Would need a geo-IP service for real data
      },
    }).then(() => {
      // Also increment the click counter
      return prisma.link.update({
        where: { id: link.id },
        data: { clicks: { increment: 1 } },
      });
    }).catch(console.error);

    return NextResponse.redirect(link.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
