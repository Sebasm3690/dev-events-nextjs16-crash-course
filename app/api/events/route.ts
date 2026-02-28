import { NextResponse, type NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/database/event.model';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const file = formData.get('image') as File;

    if (!file)
      return NextResponse.json(
        { message: 'Image file is required' },
        { status: 400 },
      );

    const rawTags = formData.get('tags');
    const rawAgenda = formData.get('agenda');

    if (!rawTags || typeof rawTags !== 'string' || !rawAgenda || typeof rawAgenda !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing tags/agenda' },
        { status: 400 },
      );
    }

    let tags;
    try {
      tags = JSON.parse(rawTags);
    } catch {
      return NextResponse.json(
        { error: 'Invalid or missing tags/agenda' },
        { status: 400 },
      );
    }

    let agenda;
    try {
      agenda = JSON.parse(rawAgenda);
    } catch {
      return NextResponse.json(
        { error: 'Invalid or missing tags/agenda' },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const eventData = Object.fromEntries(formData.entries());

    const event = {
      ...eventData,
      image: '', // Replace with the uploaded image URL
      tags: tags,
      agenda: agenda,
    };

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: 'DevEvent',
          },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          },
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;
    const createdEvent = await Event.create(event);

    return NextResponse.json(
      {
        message: 'Event created successfully',
        event: createdEvent,
      },
      { status: 201 },
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: 'Event creation failed',
        error: e instanceof Error ? e.message : 'Unknown',
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { message: 'Events fetched successfully', events },
      { status: 200 },
    );
  } catch (e) {
    console.error('Error fetching events:', e);
    return NextResponse.json(
      {
        message: 'Events fetching failed',
        error: e instanceof Error ? e.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
