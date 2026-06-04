import { createApp } from './app'
import { connectDB } from './db'

const PORT = process.env.PORT || 8000
const app = createApp()

export async function startServer() {
  await connectDB()
  console.log('Connected to MongoDB')
  app.listen(PORT, () => {
    console.log(`OctoFit Tracker API running on http://localhost:${PORT}`)
  })
}

export function startServerWithCatch() {
  return startServer().catch((error) => {
    console.error('MongoDB connection error:', error)
  })
}

if (process.env.NODE_ENV !== 'test') {
  startServerWithCatch()
}

export default app
