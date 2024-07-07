import { Request, Response } from "express"
import NodeCache from "node-cache"
import { prisma } from ".."
import { arrayToString, errorReturn, successReturn } from "../utils/utils"
import { productSchema } from "../utils/zodValidation"
const nodeCache = new NodeCache()

class ProductController {

    singleProduct = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const product = await prisma.product.findFirstOrThrow({
                where: {
                    id
                }
            })

            successReturn(res, 200, product)
        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }

    products = async (req: Request, res: Response) => {
        try {
            const key = 'products'
            let products;
            const search = 'atick'
            if (nodeCache.has(key)) {
                products = nodeCache.get(key) as any[]
                return successReturn(res, 200, products)
            }

            const count = await prisma.product.count()
            const skip = parseInt(req.query.skip as string) || 0
            products = await prisma.product.findMany({
                where: {
                    name: {
                        contains: search
                    }
                },
                skip,
                take: 5,
            })
            nodeCache.set(key, { get: 'cache', skip, count, products })
            successReturn(res, 200, { count: count, products: products })

        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }


    createProduct = async (req: Request, res: Response) => {
        try {
            const zod = productSchema.safeParse(req.body)
            if (!zod.success) return errorReturn(res, arrayToString(zod.error.errors))

            const product = await prisma.product.create({
                data: {
                    ...zod.data
                },
            })


            successReturn(res, 200, product)
        } catch (error) {
            errorReturn(res, (error as Error).message)
        }

    }

    updateProduct = async (req: Request, res: Response) => {
        try {
            const zod = productSchema.safeParse(req.body)
            if (!zod.success) return errorReturn(res, arrayToString(zod.error.errors))

            const id = req.params.id  // set (+) for if id is number.
            let product = await prisma.product.findFirst({ where: { id } })
            if (!product) return errorReturn(res, 'product not found')

            product = await prisma.product.update({
                where: { id },
                data: zod.data,
            })

            successReturn(res, 201, product)
        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }


    deleteProduct = async (req: Request, res: Response) => {
        try {
            const id = req.params.id

            let product = await prisma.product.findFirst({ where: { id } })
            if (!product) return errorReturn(res, 'product not found')

            product = await prisma.product.delete({ where: { id } })
            successReturn(res, 200, product)
        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }


    enterName = async (req: Request, res: Response) => {
        try {

        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }
}

export default new ProductController();