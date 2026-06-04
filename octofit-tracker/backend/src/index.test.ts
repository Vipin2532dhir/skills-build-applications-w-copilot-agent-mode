import request from 'supertest'
import { describe, it, expect, vi, afterEach } from 'vitest'
import app, { startServer, startServerWithCatch } from './index'
import * as db from './db'
import mongoose from 'mongoose'

vi.mock('./db', async () => {
  const actual = await vi.importActual<typeof import('./db')>('./db')
  return {
    ...actual,
    connectDB: vi.fn(actual.connectDB),
  }
})

describe('backend API', () => {
  it('returns health status', async () => {
    const response = await request(app).get('/api/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      status: 'OK',
      message: 'OctoFit Tracker API is running',
    })
  })
})

describe('database connectivity', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('connectDB calls mongoose.connect with a URI', async () => {
    const mockConnect = vi.spyOn(mongoose, 'connect').mockResolvedValue(mongoose as any)
    await db.connectDB('mongodb://example.com:27017/test')

    expect(mockConnect).toHaveBeenCalledWith('mongodb://example.com:27017/test')
  })

  it('connectDB rejects when mongoose.connect fails', async () => {
    const error = new Error('connection failed')
    vi.spyOn(mongoose, 'connect').mockRejectedValue(error)

    await expect(db.connectDB('mongodb://bad-uri')).rejects.toThrow('connection failed')
  })
})

describe('server startup', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('startServer calls connectDB and listen on the app', async () => {
    const connectSpy = vi.spyOn(db, 'connectDB').mockResolvedValue(mongoose as any)
    const listenMock = vi.spyOn(app, 'listen').mockImplementation((_, callback) => {
      callback?.()
      return {} as any
    })

    await startServer()

    expect(connectSpy).toHaveBeenCalled()
    expect(listenMock).toHaveBeenCalledWith(expect.any(Number), expect.any(Function))
  })

  it('startServer throws when connectDB fails', async () => {
    const error = new Error('db down')
    vi.spyOn(db, 'connectDB').mockRejectedValue(error)

    await expect(startServer()).rejects.toThrow('db down')
  })

  it('startServerWithCatch catches connection errors', async () => {
    const error = new Error('db down')
    vi.spyOn(db, 'connectDB').mockRejectedValue(error)
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await startServerWithCatch()

    expect(consoleErrorSpy).toHaveBeenCalledWith('MongoDB connection error:', error)
  })
})

describe('module import behavior', () => {
  it('calls startServerWithCatch when imported with NODE_ENV !== test', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    vi.resetModules()

    const connectMock = vi.fn(async () => mongoose as any)
    const listenMock = vi.fn((_, callback) => {
      callback?.()
      return {} as any
    })

    vi.doMock('./db', () => ({ connectDB: connectMock }))
    vi.doMock('./app', () => ({ createApp: () => ({ listen: listenMock }) }))

    await import('./index')

    expect(connectMock).toHaveBeenCalled()
    expect(listenMock).toHaveBeenCalled()

    process.env.NODE_ENV = originalEnv
  })
})
