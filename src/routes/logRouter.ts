import express, { Request, Response } from 'express'
import logController from '../controllers/logController'
import { totalFeedAmount } from '../helpers/calcs'
import logValidation from '../validations/logValidation'
const router = express.Router()

router.get(
  '/',
  // gather past data
  logController.getLogs,
  logValidation.gotLogs,
  (req: Request, res: Response) => {
    console.log(`Total feed amount from logs = ${totalFeedAmount(res.locals.logs)}`)
    res.status(200).json(res.locals.logs)
  }
)

// include something for checking logs for one day, or a certain time range
router.get('/day/:day', logController.getDayLogs, (req: Request, res: Response) => {
  res.status(200).json(res.locals.logs)
})

router.post(
  '/:feedAmount',
  logValidation.validFeedAmount,
  logController.addLog,
  logValidation.gotLog,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.log)
  }
)

// delete one.  Example:
// "61c9356a3f656caa94495769"
router.delete('/', logController.deleteLog, logValidation.deletedLog, (req: Request, res: Response) => {
  res.status(200).json(`deleted log with _id: ${res.locals._id}`)
})

router.delete(
  '/all',
  logController.deleteAllLogs,
  // logValidation.deletedLog,
  (req: Request, res: Response) => {
    res.status(200).json(`deleted logs. Total logs: ${res.locals.deletedCount}`)
  }
)

router.patch(
  '/:id',
  logValidation.validFeedAmount, // need to change this to body?
  // logValidation.validId,  // I don't need this only valid Ids should ever pass through
  logController.updateLog,
  logValidation.gotLog,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.log)
  }
)

export default router
