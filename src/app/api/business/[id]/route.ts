import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { isApproved } = await req.json();
    const resolvedParams = await params;

    if (typeof isApproved !== 'boolean') {
      return NextResponse.json({ error: 'isApproved boolean is required' }, { status: 400 });
    }

    await connectToDatabase();

    const updatedBusiness = await Business.findByIdAndUpdate(
      resolvedParams.id,
      { isApproved },
      { new: true }
    );

    if (!updatedBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedBusiness }, { status: 200 });
  } catch (error) {
    console.error('Business Approval Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
