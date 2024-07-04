import { PrismaClient } from '@prisma/client'
import express, { Express, Request, Response } from 'express'
import authRoute from './auth/route'
import productRoute from './product/route'
const app: Express = express()
export const prisma = new PrismaClient()
const port: number = 9999
app.get('/', (req: Request, res: Response) => {
    res.send('hello world.')
})

app.use(express.json())
app.use('/auth', authRoute)
app.use('/product', productRoute)

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})

