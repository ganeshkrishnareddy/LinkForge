import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's links
    const links = await prisma.link.findMany({
      where: { userId },
      include: {
        _count: { select: { clickEvents: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalLinks = links.length;
    const totalClicks = links.reduce((sum, link) => sum + link._count.clickEvents, 0);

    // Clicks over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentClicks = await prisma.clickEvent.findMany({
      where: {
        link: { userId },
        timestamp: { gte: sevenDaysAgo },
      },
      orderBy: { timestamp: 'desc' },
    });

    const clicksByDate = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      clicksByDate[key] = 0;
    }
    recentClicks.forEach((event) => {
      const key = event.timestamp.toISOString().split('T')[0];
      if (clicksByDate[key] !== undefined) {
        clicksByDate[key]++;
      }
    });

    // Top performing links
    const topLinks = [...links]
      .sort((a, b) => b._count.clickEvents - a._count.clickEvents)
      .slice(0, 5)
      .map((link) => ({
        id: link.id,
        shortCode: link.shortCode,
        title: link.title,
        originalUrl: link.originalUrl,
        clicks: link._count.clickEvents,
      }));

    // Browser breakdown (across all user's links)
    const allClickEvents = await prisma.clickEvent.findMany({
      where: { link: { userId } },
      select: { browser: true, device: true, referrer: true },
    });

    const browsers = {};
    const devices = {};
    const referrers = {};

    allClickEvents.forEach((event) => {
      const browser = event.browser || 'Unknown';
      browsers[browser] = (browsers[browser] || 0) + 1;
      
      const device = event.device || 'Unknown';
      devices[device] = (devices[device] || 0) + 1;

      const referrer = event.referrer || 'Direct';
      referrers[referrer] = (referrers[referrer] || 0) + 1;
    });

    return NextResponse.json({
      totalLinks,
      totalClicks,
      clicksToday: clicksByDate[new Date().toISOString().split('T')[0]] || 0,
      clicksByDate: Object.entries(clicksByDate).map(([date, clicks]) => ({
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        clicks,
      })),
      topLinks,
      browsers: Object.entries(browsers)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
      devices: Object.entries(devices)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
      referrers: Object.entries(referrers)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5),
      recentLinks: links.slice(0, 5),
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
