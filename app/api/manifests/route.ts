import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const manifests = await prisma.manifest.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Parse the content string back to JSON
    const parsedData = manifests.map((m: any) => {
        try {
            return JSON.parse(m.content);
        } catch (e) {
            console.error('Failed to parse manifest content', m.id);
            return null;
        }
    }).filter(d => d !== null);

    return NextResponse.json(parsedData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch manifests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validation: Ensure ID exists
    if (!data.id) {
        return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const created = await prisma.manifest.create({
      data: {
        id: data.id,
        status: data.status || 'Draft',
        content: JSON.stringify(data)
      }
    });

    return NextResponse.json(JSON.parse(created.content));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create manifest' }, { status: 500 });
  }
}
