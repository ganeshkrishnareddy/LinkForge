import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET single link
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const link = await prisma.link.findFirst({
      where: { id, userId: session.user.id },
      include: {
        _count: { select: { clickEvents: true } },
      },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error('Get link error:', error);
    return NextResponse.json({ error: 'Failed to fetch link' }, { status: 500 });
  }
}

// PUT update a link
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, expiresAt } = await request.json();

    const link = await prisma.link.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const updated = await prisma.link.update({
      where: { id },
      data: {
        title: title !== undefined ? title : link.title,
        expiresAt: expiresAt !== undefined ? (expiresAt ? new Date(expiresAt) : null) : link.expiresAt,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update link error:', error);
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 });
  }
}

// DELETE a link
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const link = await prisma.link.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    await prisma.link.delete({ where: { id } });

    return NextResponse.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Delete link error:', error);
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
  }
}
