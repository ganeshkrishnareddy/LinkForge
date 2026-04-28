import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    // Verify link ownership
    const link = await prisma.link.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const since = new Date();
    since.setDate(since.getDate() - days);

    // Get click events
    const clickEvents = await prisma.clickEvent.findMany({
      where: {
        linkId: id,
        timestamp: { gte: since },
      },
      orderBy: { timestamp: 'desc' },
    });

    // Clicks over time
    const clicksByDate = {};
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      clicksByDate[key] = 0;
    }
    clickEvents.forEach((event) => {
      const key = event.timestamp.toISOString().split('T')[0];
      if (clicksByDate[key] !== undefined) {
        clicksByDate[key]++;
      }
    });

    // Browser stats
    const browsers = {};
    clickEvents.forEach((event) => {
      const browser = event.browser || 'Unknown';
      browsers[browser] = (browsers[browser] || 0) + 1;
    });

    // Device stats
    const devices = {};
    clickEvents.forEach((event) => {
      const device = event.device || 'Unknown';
      devices[device] = (devices[device] || 0) + 1;
    });

    // Referrer stats
    const referrers = {};
    clickEvents.forEach((event) => {
      const referrer = event.referrer || 'Direct';
      referrers[referrer] = (referrers[referrer] || 0) + 1;
    });

    // Country stats
    const countries = {};
    clickEvents.forEach((event) => {
      const country = event.country || 'Unknown';
      countries[country] = (countries[country] || 0) + 1;
    });

    // Recent clicks (last 10)
    const recentClicks = clickEvents.slice(0, 10).map((event) => ({
      id: event.id,
      browser: event.browser || 'Unknown',
      device: event.device || 'Unknown',
      referrer: event.referrer || 'Direct',
      country: event.country || 'Unknown',
      timestamp: event.timestamp,
    }));

    return NextResponse.json({
      totalClicks: clickEvents.length,
      clicksByDate: Object.entries(clicksByDate).map(([date, clicks]) => ({
        date,
        clicks,
      })),
      browsers: Object.entries(browsers)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      devices: Object.entries(devices)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      referrers: Object.entries(referrers)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
      countries: Object.entries(countries)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      recentClicks,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
