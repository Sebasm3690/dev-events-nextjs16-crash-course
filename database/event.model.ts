import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface representing an Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: { type: String, unique: true, index: true },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    image: { type: String, required: [true, "Image URL is required"] },
    venue: { type: String, required: [true, "Venue is required"], trim: true },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: { type: String, required: [true, "Date is required"] },
    time: { type: String, required: [true, "Time is required"] },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be online, offline, or hybrid",
      },
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (val: string[]) => val.length > 0,
        message: "Agenda must contain at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (val: string[]) => val.length > 0,
        message: "Tags must contain at least one item",
      },
    },
  },
  { timestamps: true }
);

/**
 * Pre-save hook:
 * 1. Generates a URL-friendly slug from the title (only when title changes).
 * 2. Normalizes `date` to ISO format (YYYY-MM-DD).
 * 3. Normalizes `time` to 24-hour format (HH:MM).
 */
EventSchema.pre("save", function (next) {
  // Generate slug from title only if the title was modified
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Collapse consecutive hyphens
  }

  // Normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified("date")) {
    const parsed = new Date(this.date);
    if (isNaN(parsed.getTime())) {
      return next(new Error("Invalid date format. Please provide a valid date."));
    }
    this.date = parsed.toISOString().split("T")[0];
  }

  // Normalize time to consistent 24-hour format (HH:MM)
  if (this.isModified("time")) {
    const timeMatch = this.time
      .trim()
      .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);

    if (!timeMatch) {
      return next(
        new Error("Invalid time format. Use HH:MM or HH:MM AM/PM.")
      );
    }

    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2];
    const period = timeMatch[3]?.toUpperCase();

    // Validate hour bounds based on format
    if (period) {
      // 12-hour format: hours must be 1-12
      if (hours < 1 || hours > 12) {
        return next(new Error("Invalid time: hours must be 1-12 for AM/PM format."));
      }
    } else {
      // 24-hour format: hours must be 0-23
      if (hours < 0 || hours > 23) {
        return next(new Error("Invalid time: hours must be 0-23."));
      }
    }

    // Convert 12-hour format to 24-hour if AM/PM is provided
    if (period) {
      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
    }

    this.time = `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  next();
});

// Use existing model if already compiled (prevents OverwriteModelError in dev)
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
