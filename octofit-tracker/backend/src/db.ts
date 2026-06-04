import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export async function connectDB(uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit-tracker') {
  return mongoose.connect(uri)
}
