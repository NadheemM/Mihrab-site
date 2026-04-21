import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';

export async function POST(req: Request) {
  try {
    const { name, category, description, contactInfo, location } = await req.json();

    if (!name || !category || !description || !contactInfo || !location) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectToDatabase();

    const newBusiness = new Business({
      name,
      category,
      description,
      contactInfo,
      location,
      isApproved: false // Requires admin approval
    });
    
    await newBusiness.save();

    return NextResponse.json({ success: true, message: 'Business listed successfully and pending approval' }, { status: 201 });
  } catch (error) {
    console.error('Business API POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
