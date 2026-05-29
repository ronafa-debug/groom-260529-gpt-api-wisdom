import 'dotenv/config'
import express from 'express'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import dailyHandler from '../api/wisdom/daily'
import generateHandler from '../api/wisdom/generate'

type VercelHandler = (req: VercelRequest, res: VercelResponse) => Promise<unknown> | unknown

function toExpress(handler: VercelHandler) {
  return async (req: express.Request, res: express.Response) => {
    await handler(req as unknown as VercelRequest, res as unknown as VercelResponse)
  }
}

const app = express()
const port = Number(process.env.API_PORT ?? 3000)

app.use(express.json())
app.get('/api/wisdom/daily', toExpress(dailyHandler))
app.post('/api/wisdom/generate', toExpress(generateHandler))

app.listen(port, () => {
  console.log(`API dev server ready at http://localhost:${port}`)
})
