import mongoose, { type Mongoose } from 'mongoose';

// Ensure the MongoDB URI is defined in environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env.local',
  );
}

/**
 * Cache the Mongoose connection in the Node.js global scope
 * to prevent creating multiple connections during hot reloads in development.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the global object to include our cached connection
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to MongoDB using Mongoose.
 * Returns the cached connection if one already exists,
 * otherwise creates a new connection and caches it.
 */
async function connectToDatabase(): Promise<Mongoose> {
  // Return the existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one doesn't exist
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      dbName: 'devevents',
      bufferCommands: false,
    });
  }

  // Await the connection and cache it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
