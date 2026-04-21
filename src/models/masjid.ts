import mongoose, { Schema, Document } from 'mongoose';

export interface IMasjid extends Document {
  name: string;
  address: string;
  timings?: {
    fajr: { azaan: string; iqamah: string };
    zuhar: { azaan: string; iqamah: string };
    asar: { azaan: string; iqamah: string };
    maghrib: { azaan: string; iqamah: string };
    isha: { azaan: string; iqamah: string };
    jummah: { azaan: string; iqamah: string };
  };
  lastUpdated?: Date;
  createdAt: Date;
}

const MasjidSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  timings: {
    fajr: { azaan: { type: String, default: '5:15' }, iqamah: { type: String, default: '5:30' } },
    zuhar: { azaan: { type: String, default: '1:00' }, iqamah: { type: String, default: '1:15' } },
    asar: { azaan: { type: String, default: '4:45' }, iqamah: { type: String, default: '5:10' } },
    maghrib: { azaan: { type: String, default: '6:29' }, iqamah: { type: String, default: '6:29' } },
    isha: { azaan: { type: String, default: '8:00' }, iqamah: { type: String, default: '8:30' } },
    jummah: { azaan: { type: String, default: '12:30' }, iqamah: { type: String, default: '1:00' } },
  },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Masjid || mongoose.model<IMasjid>('Masjid', MasjidSchema);
