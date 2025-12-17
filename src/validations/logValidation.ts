import { Request, Response, NextFunction } from 'express'
import { isNumber } from '../helpers/validValues'

const logValidation: any = {}

logValidation.gotLogs = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.logs) {
    return next({
      log: 'logValidation.gotLogs: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals.logs to be an object.',
      error: { err: 'logValidation.gotLogs: ERROR: Check server logs for details' }
    })
  } else if (res.locals.logs.length < 1) {
    console.log('No logs found confirm that this is correct')
  }
  return next()
}

logValidation.validFeedAmount = (req: Request, res: Response, next: NextFunction) => {
  // yeah, this is sloppy, but I have feed amount coming in as either through req.params through addLog or req.body through updateLog
  let feedAmount: string
  if (req.params.feedAmount) {
    feedAmount = req.params.feedAmount
  } else {
    feedAmount = req.body.feedAmount
  }
  if (!isNumber(feedAmount)) {
    return next({
      log: `logValidation.validFeedAmount: ERROR: Invalid or unfound required data on req.params - Expected req.params.feedAmount (${feedAmount}) to be a number.`,
      error: { err: `logValidation.validFeedAmount: ERROR: req.params.feedAmount (${feedAmount}) should be a number` }
    })
  } else if (+feedAmount < 0) {
    return next({
      log: 'logValidation.validFeedAmount: ERROR: Invalid or unfound required data on req.params - Expected req.params.feedAmount to be greater than or equal to zero.',
      error: {
        err: 'logValidation.validFeedAmount: ERROR: req.params.feedAmount should not be negative. What are you, crazy??? You cannot steal milk from the baby'
      }
    })
  }
  return next()
}

logValidation.gotLog = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.log) {
    return next({
      log: 'logValidation.gotLog: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals.log to be an object.',
      error: { err: 'logValidation.gotLog: ERROR: Check server logs for details' }
    })
    // } else if (res.locals.log.length !== 1) {
    //   // this is intentionally incorrect to check on error middleware
    //   // res.locals.log does not have property "length"
    //   return next({
    //     log: 'logValidation.gotLog: ERROR: No log - Expected res.locals.log to be of length 1.',
    //     error: { err: 'logValidation.gotLog: ERROR: Check server logs for details' }
    //   })
  } else if (Object.keys(res.locals.log).length === 0) {
    return next({
      log: 'logValidation.gotLog: ERROR: No log - Expected res.locals.log to not be empty',
      error: { err: 'logValidation.gotLog: ERROR: Check server logs for details' }
    })
  }
  return next()
}

logValidation.deletedLog = (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.deletedCount) {
    return next({
      log: 'logValidation.deletedLog: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals.deletedCount to be an object.',
      error: { err: 'logValidation.deletedLog: ERROR: Check server logs for details' }
    })
  } else if (res.locals.deletedCount !== 1) {
    return next({
      log: 'logValidation.deletedLog: ERROR: No log - Expected res.locals.deletedCount to be 1.',
      error: { err: 'logValidation.deletedLog: ERROR: Check server logs for details' }
    })
  }
  return next()
}

export default logValidation
