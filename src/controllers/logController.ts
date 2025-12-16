import { Request, Response, NextFunction } from 'express'
import { Query, Document } from 'mongoose'
import Log, { ILog } from '../models/logModels'
import { DeleteResult, ObjectId } from 'mongodb'

const logController: any = {}

// interface ProjectQueryHelpers {
//   byName(name: string): Query<any, Document<Log>> & ProjectQueryHelpers
// }

logController.getLogs = (req: Request, res: Response, next: NextFunction) => {
  Log.find({}, null, (err: Error, logs: Query<any, Document<ILog>>) => {
    if (err) {
      // Check this again
      console.log('we have a problem with getLogs...')
    }
    console.log()
    res.locals.logs = logs
    next()
  })
}

logController.getDayLogs = (req: Request, res: Response, next: NextFunction) => {
  const today = new Date()
  const dayParam: String = req.params.day
  let day: String

  if (dayParam === 'today') {
    day = today.toDateString()
  } else if (dayParam === 'yesterday') {
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    day = yesterday.toDateString()
  } else {
    day = dayParam
  }
  Log.find({ day: day }, null, (err: Error, logs: Query<any, Document<ILog>>) => {
    if (err) {
      // Check this again
      console.log('we have a problem with getLogs...')
    }
    res.locals.logs = logs
    console.log(Object.keys(logs).length)
    next()
  })
}

logController.addLog = async (req: Request, res: Response, next: NextFunction) => {
  const date = new Date()
  const feedAmount = Number(req.params.feedAmount)
  const log: ILog = await Log.create({
    day: date.toDateString(),
    time: date.toTimeString(),
    feedAmount: feedAmount
  })
  console.log('Added log on', log.time)
  res.locals.log = log
  return next()
}

// Delete One Log...
logController.deleteLog = async (req: Request, res: Response, next: NextFunction) => {
  const _id: string = req.body._id // this will already check that it isn't null
  const deleteResponse: DeleteResult = await Log.deleteOne({
    _id: new ObjectId(_id)
  })
  res.locals.deletedCount = deleteResponse.deletedCount
  console.log(`res.locals.deletedCount = ${res.locals.deletedCount}`)
  res.locals._id = _id
  next()
}

// Delete All Logs...
logController.deleteAllLogs = async (req: Request, res: Response, next: NextFunction) => {
  const deleteResponse: DeleteResult = await Log.deleteMany({})
  res.locals.deletedCount = deleteResponse.deletedCount
  console.log(`res.locals.deletedCount = ${res.locals.deletedCount}`)
  next()
}
// for now, use:
// mongo
// use babyTracker
// db.logs.deleteMany({})

// should be able to update date, time, or feed amount using id
logController.updateLog = async (req: Request, res: Response, next: NextFunction) => {
  // format should be:
  // day: Sun Jan 02 2022
  // time: 19:27:59 GMT-0500 (Eastern Standard Time)
  // feedAmount: number
  // const _id = req?.params?._id  // https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial suggested using those question marks
  const _id = req.params.id // this will already check that it isn't null
  const updatedLog: ILog = req.body
  const log = await Log.updateOne(
    {
      _id: new ObjectId(_id)
    },
    {
      $set: updatedLog
    }
  )
  console.log('Replaced log with _id = ', _id)
  res.locals.log = log
  return next()
}

// db.logs.update({feedAmount: 0}, {$set: {feedAmount: 10}})

export default logController
