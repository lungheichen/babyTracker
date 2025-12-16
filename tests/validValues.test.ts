import { describe, expect, it } from 'vitest'
import { isNumber } from '../src/helpers/validValues'

describe('validValues.isNumber', () => {
  it('returns true for numeric strings', () => {
    expect(isNumber('5')).toBe(true)
    expect(isNumber('0')).toBe(true)
    expect(isNumber('  12 ')).toBe(true)
  })

  it('returns false for non-numeric or empty strings', () => {
    expect(isNumber('abc')).toBe(false)
    expect(isNumber('   ')).toBe(false)
    expect(isNumber('')).toBe(false)
  })
})
