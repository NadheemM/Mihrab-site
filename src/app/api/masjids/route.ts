import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Masjid from '@/models/masjid';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Auto-seed the initial 5 dummy masjids and overwrite legacy ones
    const count = await Masjid.countDocuments();
    // Since we added a new schema requirement, we will drop any that don't have timings or just re-seed if <=5
    if (count <= 5) {
      await Masjid.deleteMany({}); // Reset for development to inject timings
      const initialMasjids = [
        { 
          name: "Al Huda Masjid", address: "Al Huda Complex, Fort, Vaniyambadi",
          timings: {
            fajr: { azaan: '5:15', iqamah: '5:30' },
            zuhar: { azaan: '1:00', iqamah: '1:15' },
            asar: { azaan: '4:45', iqamah: '5:10' },
            maghrib: { azaan: '6:29', iqamah: '6:29' },
            isha: { azaan: '8:00', iqamah: '8:30' },
            jummah: { azaan: '12:30', iqamah: '1:00' }
          }
        },
        { 
          name: "Chennampet Masjid", address: "84, Chennampet, Vaniyambadi",
          timings: {
            fajr: { azaan: '5:10', iqamah: '5:40' },
            zuhar: { azaan: '1:00', iqamah: '1:30' },
            asar: { azaan: '4:45', iqamah: '5:05' },
            maghrib: { azaan: '6:29', iqamah: '6:29' },
            isha: { azaan: '8:00', iqamah: '8:30' },
            jummah: { azaan: '12:30', iqamah: '1:30' }
          }
        },
        { 
          name: "Islamiah College Masjid", address: "Main Rd, New Town, Vaniyambadi",
          timings: {
            fajr: { azaan: '5:25', iqamah: '5:40' },
            zuhar: { azaan: '12:50', iqamah: '1:10' },
            asar: { azaan: '4:50', iqamah: '5:05' },
            maghrib: { azaan: '6:29', iqamah: '6:29' },
            isha: { azaan: '7:30', iqamah: '8:15' },
            jummah: { azaan: '12:30', iqamah: '1:10' }
          }
        },
        { 
          name: "Madeena Masjid", address: "1st St, Ghafoorabad, Vaniyambadi",
          timings: {
            fajr: { azaan: '5:15', iqamah: '5:35' },
            zuhar: { azaan: '12:45', iqamah: '1:05' },
            asar: { azaan: '4:55', iqamah: '5:10' },
            maghrib: { azaan: '6:29', iqamah: '6:29' },
            isha: { azaan: '7:45', iqamah: '8:10' },
            jummah: { azaan: '12:30', iqamah: '1:30' }
          }
        },
        { 
          name: "Madrasa Madinul Uloom", address: "Jinnah Road, Khaderpet, Vaniyambadi",
          timings: {
            fajr: { azaan: '5:20', iqamah: '5:50' },
            zuhar: { azaan: '12:45', iqamah: '1:00' },
            asar: { azaan: '4:45', iqamah: '5:00' },
            maghrib: { azaan: '6:29', iqamah: '6:29' },
            isha: { azaan: '8:10', iqamah: '8:30' },
            jummah: { azaan: '12:30', iqamah: '1:00' }
          }
        }
      ];
      await Masjid.insertMany(initialMasjids);
    }
    
    const masjids = await Masjid.find().sort({ createdAt: 1 }); // Oldest first
    return NextResponse.json(masjids, { status: 200 });
  } catch (error) {
    console.error('Masjids API GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, address } = await req.json();

    if (!name || !address) {
      return NextResponse.json({ error: 'Name and address are required' }, { status: 400 });
    }

    await connectToDatabase();
    const newMasjid = new Masjid({ name, address });
    await newMasjid.save();

    return NextResponse.json({ success: true, masjid: newMasjid }, { status: 201 });
  } catch (error) {
    console.error('Masjids API POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
