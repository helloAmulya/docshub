/**
 * MongoDB Connection Setup
 *
 * DEPLOYMENT REQUIREMENTS:
 * 1. Create a MongoDB Atlas account at https://cloud.mongodb.com
 * 2. Create a new cluster (free tier available)
 * 3. Create a database user with read/write permissions
 * 4. Get your connection string from Atlas
 * 5. Add MONGODB_URI to your environment variables
 *
 * Environment Variables Required:
 * - MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/truly-blog?retryWrites=true&w=majority
 *
 * For Vercel deployment:
 * 1. Go to your Vercel project settings
 * 2. Navigate to Environment Variables
 * 3. Add MONGODB_URI with your MongoDB connection string
 * 4. Make sure to add it for Production, Preview, and Development environments
 */

import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
