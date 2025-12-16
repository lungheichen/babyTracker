import { describe, expect, it } from 'vitest'
import logValidation from '../src/validations/logValidation'

describe('logValidation', () => {
  it('gotLogs -> errors when res.locals.logs is missing', () => {
    const req = {} as any
    const res = { locals: {} } as any
    logValidation.gotLogs(req, res, (arg: any) => {
      expect(arg).toBeDefined()
      expect(arg.log).toContain('logValidation.gotLogs')
    })
  })

  it('validFeedAmount -> accepts valid param and rejects invalid', () => {
    const reqGood = { params: { feedAmount: '3' }, body: {} } as any
    const res = { locals: {} } as any
    logValidation.validFeedAmount(reqGood, res, (arg: any) => {
      expect(arg).toBeUndefined()
    })

    const reqBad = { params: { feedAmount: 'x' }, body: {} } as any
    logValidation.validFeedAmount(reqBad, res, (arg: any) => {
      expect(arg).toBeDefined()
      expect(arg.log).toContain('validFeedAmount')
    })
  })

  it('gotLog -> errors when res.locals.log missing', () => {
    const req = {} as any
    const res = { locals: {} } as any
    logValidation.gotLog(req, res, (arg: any) => {
      expect(arg).toBeDefined()
      expect(arg.log).toContain('gotLog')
    })
  })

  it('deletedLog -> expects deletedCount to be 1', () => {
    const req = {} as any
    const resBad = { locals: {} } as any
    logValidation.deletedLog(req, resBad, (arg: any) => {
      expect(arg).toBeDefined()
      expect(arg.log).toContain('deletedLog')
    })

    const resGood = { locals: { deletedCount: 1 } } as any
    logValidation.deletedLog(req, resGood, (arg: any) => {
      expect(arg).toBeUndefined()
    })
  })
})
