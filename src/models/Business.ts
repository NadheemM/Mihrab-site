import mongoose, { Schema, Document } from 'mongoose';

export interface IBusiness extends Document {
  name: string;
  category: string;
  description: string;
  contactInfo: string;
  location: string;
  isApproved: boolean;
  createdAt: Date;
}

const BusinessSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  contactInfo: { type: String, required: true },
  location: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Business || mongoose.model<IBusiness>('Business', BusinessSchema);
