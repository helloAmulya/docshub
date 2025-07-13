/**
 * MongoDB Post Model
 *
 * This replaces the mock database with a real MongoDB schema
 * Make sure to run this after setting up your MongoDB connection
 */

import mongoose from "mongoose"

export interface IPost extends mongoose.Document {
  title: string
  slug: string
  content: string
  excerpt: string
  published: boolean
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  },
)

// Create indexes for better performance
// PostSchema.index({ slug: 1 }) // removed because already handled by unique: true in schema
PostSchema.index({ published: 1, createdAt: -1 })
PostSchema.index({ title: "text", content: "text" }) // For search functionality

// Prevent model re-compilation during development
export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema)
