import { Schema, model, connect, Document } from 'mongoose'
import * as dotenv from 'dotenv'

// Enables variables from .env file as process.env
dotenv.config()

// const port = process.env.DB_PORT || 27017

interface IOptions {
  user?: string
  pass?: string
  dbName?: string
}

// mongoose.connect('mongodb://username:password@host:port/database?options...');
let uri: string
const options: IOptions = {}
if (process.env.NODE_ENV === 'production') {
  options.user = process.env.DB_USER
  options.pass = process.env.DB_PASS
  options.dbName = process.env.DB_NAME
  // options.host = process.env.DB_HOST
  // options.port = process.env.DB_PORT
  uri = `mongodb+srv://${options.user}:${options.pass}@cluster0.ow7t4g1.mongodb.net/?appName=Cluster0`
} else if (process.env.NODE_ENV === 'development') {
  // db:27017 must be used between Docker containers
  uri = 'mongodb://superadmin:admin@db:27017/babytracker?authSource=admin'
} else if (process.env.NODE_ENV === 'devlocal') {
  // this is for development w/o Docker containers
  uri = 'mongodb://superadmin:admin@localhost:27017/babytracker?authSource=admin'
}

export interface ILog extends Document {
  day: string
  time: string
  feedAmount: number
}

console.log(`NODE_ENV = ${process.env.NODE_ENV}`)

const logSchema = new Schema<ILog>({
  day: { type: String, required: true },
  time: { type: String, required: true },
  feedAmount: { type: Number, required: true }
})

const Log = model<ILog>('Log', logSchema)
async function main(): Promise<void> {
  await connect(uri, options)
}

// Only auto-connect when not running tests. Tests use their own in-memory
// MongoDB and call mongoose.connect() from `tests/setup.ts`.
if (process.env.NODE_ENV !== 'test') {
  main().catch((err) => console.log(err))
}

export default Log
