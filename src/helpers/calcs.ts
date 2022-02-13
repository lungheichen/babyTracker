import { ILog } from '../models/logModels'

export const totalFeedAmount = (logs: Array<ILog>) => {
  let total = 0
  logs.forEach((element) => {
    total += element.feedAmount
  })
  return total
}
