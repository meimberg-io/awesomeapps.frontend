import { NextRequest, NextResponse } from 'next/server';
import { fetchNewServiceBySlug } from '@/lib/strapi';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const newService = await fetchNewServiceBySlug(slug);
    
    return NextResponse.json({ newService: newService || null });
  } catch (error) {
    console.error('Error fetching newService:', error);
    return NextResponse.json({ error: 'Failed to fetch newService' }, { status: 500 });
  }
}


