import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Masjid from '@/models/masjid';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await connectToDatabase();
    const masjid = await Masjid.findById(resolvedParams.id);
    if (!masjid) {
      return NextResponse.json({ error: 'Masjid not found' }, { status: 404 });
    }
    return NextResponse.json(masjid, { status: 200 });
  } catch (error) {
    console.error('Masjid GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { timings } = await req.json();

    if (!timings) {
      return NextResponse.json({ error: 'Timings data required' }, { status: 400 });
    }

    await connectToDatabase();
    const updatedMasjid = await Masjid.findByIdAndUpdate(
      resolvedParams.id,
      { timings, lastUpdated: new Date() },
      { new: true }
    );

    if (!updatedMasjid) {
      return NextResponse.json({ error: 'Masjid not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, masjid: updatedMasjid }, { status: 200 });
  } catch (error) {
    console.error('Masjid PUT Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
