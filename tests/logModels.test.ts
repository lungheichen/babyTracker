import { describe, expect, it } from 'vitest'
import Log from '../src/models/logModels'

describe('logModels (src) exports', () => {
  it('exports a model with expected methods', () => {
    expect(Log).toBeDefined()
    expect(typeof (Log as any).find).toBe('function')
    expect(typeof (Log as any).create).toBe('function')
    expect(typeof (Log as any).deleteOne).toBe('function')
  })
})
