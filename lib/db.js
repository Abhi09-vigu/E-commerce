import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Set it in .env to enable DB.')
}

let cached = global._mongoose
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    if (!MONGODB_URI) throw new Error('Missing MONGODB_URI')
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: undefined,
    }).then((mongoose) => mongoose)
  }
  cached.conn = await cached.promise
  return cached.conn
}
