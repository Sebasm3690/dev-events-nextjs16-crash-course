import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface representing a Booking document
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  slug: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true, // Index for faster event-based queries
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (val: string) => EMAIL_REGEX.test(val),
        message: 'Please provide a valid email address',
      },
    },
  },
  { timestamps: true },
);

/**
 * Pre-save hook:
 * Verifies that the referenced eventId corresponds to an existing Event.
 * Prevents orphaned bookings by rejecting invalid event references.
 */
BookingSchema.pre('save', async function () {
  if (this.isModified('eventId')) {
    const eventExists = await Event.exists({ _id: this.eventId });

    if (!eventExists) {
      throw new Error('Referenced event does not exist.');
    }
  }
});

// Use existing model if already compiled (prevents OverwriteModelError in dev)
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
