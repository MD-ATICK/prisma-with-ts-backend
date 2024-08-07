import { PrismaClient } from '@prisma/client'
import express, { Express, Request, Response } from 'express'
import authRoute from './auth/route'
import productRoute from './product/route'
import addressRoute from './address/route'
import cartRoute from './cart/route'
import orderRoute from './order/route'
import adminRoute from './admin/route'
import { Redis } from 'ioredis'
const app: Express = express()
const port: number = 9999
export const redis: Redis = new Redis({
    host: 'redis-18919.c9.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 18919,
    password: '6IRJ0CBZpbd3OHy5KKuOVeyLgnk74rJk'
})

redis.on('connect', () => {
    console.log('🔴 Connected to Redis.')
})



export const prisma = new PrismaClient().$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    zipCode: true
                },
                compute: (address) => {
                    const { lineOne, lineTwo, city, country, zipCode } = address
                    return `${lineOne} , ${lineTwo} , ${city} , ${country} , ${zipCode}}`
                }
            }
        }
    }
})


app.get('/', (req: Request, res: Response) => {
    res.send('hello world.')
})

app.use(express.json())
app.use('/auth', authRoute)
app.use('/product', productRoute)
app.use('/address', addressRoute)
app.use('/cart', cartRoute)
app.use('/order', orderRoute)
app.use('/admin', adminRoute)

app.listen(port, () => {
    console.log(`🟢 Server is running on port ${port}.`)
})

