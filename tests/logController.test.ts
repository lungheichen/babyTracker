import { describe, expect, it } from 'vitest'
import request from 'supertest'

// Integration tests using in-memory MongoDB (setup in tests/setup.ts)
// Tests import `src` so Vitest can run TypeScript directly.
process.env.NODE_ENV = 'test'

import app from '../src/index'

describe('logController integration (supertest)', () => {
  let createdId: string | null = null

  it.skip('POST /logs/:feedAmount should create a log', async () => {
    const res = await request(app).post('/logs/4').send()
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('feedAmount')
    expect(res.body.feedAmount).toBe(4)
    createdId = res.body._id
  })

  it.skip('GET /logs should return an array including created entries', async () => {
    const res = await request(app).get('/logs')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    const found = res.body.find((l: any) => l._id === createdId)
    expect(found).toBeTruthy()
  })

  it.skip('DELETE /logs should delete the created log', async () => {
    const res = await request(app).delete('/logs').send({ _id: createdId })
    expect(res.status).toBe(200)
    expect(res.text).toContain('deleted log')
  })
})
