import express from 'express'
import cors from 'cors'

export function createApp() {
  const app = express()
  app.use(cors())
  app.use(express.json())

  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'OctoFit Tracker API is running' })
  })

  return app
}
