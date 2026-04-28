import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const [totalLinks, totalClicks, totalUsers] = await Promise.all([
      prisma.link.count(),
      prisma.clickEvent.count(),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      totalLinks,
      totalClicks,
      totalUsers,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { totalLinks: 0, totalClicks: 0, totalUsers: 0 },
      { status: 200 }
    );
  }
}
