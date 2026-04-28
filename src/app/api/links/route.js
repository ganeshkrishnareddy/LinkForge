import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { generateShortCode, isValidUrl } from '@/lib/utils';
import QRCode from 'qrcode';

// GET all links for the authenticated user
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const links = await prisma.link.findMany({
      where: {
        userId: session.user.id,
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { originalUrl: { contains: search, mode: 'insensitive' } },
            { shortCode: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { [sort]: order },
      include: {
        _count: {
          select: { clickEvents: true },
        },
      },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Get links error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST create a new link
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, customCode, title, expiresAt } = await request.json();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Please provide a valid URL' },
        { status: 400 }
      );
    }

    let shortCode = customCode || generateShortCode();

    // Check if custom code is already taken
    if (customCode) {
      const existing = await prisma.link.findUnique({
        where: { shortCode: customCode },
      });
      if (existing) {
        return NextResponse.json(
          { error: 'This custom alias is already taken' },
          { status: 409 }
        );
      }
    }

    // Ensure unique short code
    let attempts = 0;
    while (!customCode && attempts < 5) {
      const existing = await prisma.link.findUnique({
        where: { shortCode },
      });
      if (!existing) break;
      shortCode = generateShortCode();
      attempts++;
    }

    // Generate QR code
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

    const link = await prisma.link.create({
      data: {
        originalUrl: url,
        shortCode,
        title: title || null,
        qrCode,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error('Create link error:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}
