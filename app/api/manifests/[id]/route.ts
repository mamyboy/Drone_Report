import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const id = (await params).id
  try {
    const manifest = await prisma.manifest.findUnique({
      where: { id }
    });

    if (!manifest) {
      return NextResponse.json({ error: 'Manifest not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(manifest.content));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch manifest' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id
  try {
    const data = await request.json();

    const updated = await prisma.manifest.update({
      where: { id },
      data: {
        status: data.status,
        content: JSON.stringify(data)
      }
    });

    return NextResponse.json(JSON.parse(updated.content));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update manifest' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id
  try {
    await prisma.manifest.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete manifest' }, { status: 500 });
  }
}
