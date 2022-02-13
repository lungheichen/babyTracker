import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import logRouter from './routes/logRouter'

// attempting to get an Error type/interface to work
interface ValidationError extends Error {
  log: string
  error: { err: string }
}

dotenv.config()

const port = process.env.PORT || 8080
const app: Express = express()

// middleware for using req.body
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('hello, this has nothing haha...')
})

app.use('/logs', logRouter)

app.use(function (err: ValidationError, req: Request, res: Response, next: NextFunction) {
  console.error(err.log)
  res.status(500).send(err.error)
})

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`)
})
