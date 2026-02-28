import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import type { IEvent } from '@/database/event.model';

// Slug validation: only lowercase alphanumeric characters and hyphens
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type RouteParams = { params: Promise<{ slug: string }> };

/**
 * GET /api/events/[slug]
 * Returns a single event matching the provided slug.
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Validate slug format
    if (!slug || !SLUG_REGEX.test(slug)) {
      return NextResponse.json(
        { message: 'Invalid or missing slug parameter' },
        { status: 400 },
      );
    }

    await connectDB();

    const event: IEvent | null = await Event.findOne({ slug }).lean();

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug "${slug}" not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Event fetched successfully', event },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error fetching event by slug:', error);
    return NextResponse.json(
      {
        message: 'Failed to fetch event',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
