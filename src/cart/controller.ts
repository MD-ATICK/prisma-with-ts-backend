import { Request, Response } from "express";
import { arrayToString, errorReturn, successReturn } from "../utils/utils";
import { cartSchema, changeQuantitySchema } from "../utils/zodValidation";
import { prisma } from "..";


class cartController {

    addCart = async (req: Request, res: Response) => {
        try {

            const zod = cartSchema.safeParse(req.body)
            if (!zod.success) return errorReturn(res, arrayToString(zod.error.errors))

            await prisma.product.findFirstOrThrow({ where: { id: zod.data.productId } })
            if (!req.user) return errorReturn(res, 'user not found.')

            const existFind = await prisma.cart.findFirst({ where: { userId: req.user.id, productId: zod.data.productId } })
            if (existFind) return errorReturn(res, 'you already added into cart.')


            const cart = await prisma.cart.create({
                data: {
                    userId: req.user?.id,
                    productId: zod.data.productId,
                    quantity: zod.data.quantity
                },
                include: {
                    product: true,
                    user: true
                }
            })


            successReturn(res, 201, cart)
        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }

    getCarts = async (req: Request, res: Response) => {
        try {
            const carts = await prisma.cart.findMany({
                where: { userId: req.user?.id },
                include: {
                    product: true,
                    user: true
                }
            })
            successReturn(res, 200, carts)
        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }

    deleteCart = async (req: Request, res: Response) => {
        try {

            if (!req.params.id) return errorReturn(res, 'cart id not found.')

            const cart = await prisma.cart.delete({
                where: { id: req.params.id, userId: req.user?.id }
            })
            successReturn(res, 200, cart)

        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }

    changeQuantity = async (req: Request, res: Response) => {
        try {

            const zod = changeQuantitySchema.safeParse(req.body)
            if (zod.error) return errorReturn(res, arrayToString(zod.error.errors))

            if (!req.params.id) return errorReturn(res, 'id not found.')

            const cart = await prisma.cart.update({
                where: { id: req.params.id, userId: req.user?.id },
                data: {
                    quantity: zod.data.quantity,
                }
            })

            successReturn(res, 201, cart)
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

export default new cartController();