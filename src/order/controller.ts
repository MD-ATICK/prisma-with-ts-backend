import { Request, Response } from "express"
import { prisma } from ".."
import { errorReturn, successReturn } from "../utils/utils"

class OrderController {

    createOrder = async (req: Request, res: Response) => {
        try {
            // make a $transaction for handle many model.
            await prisma.$transaction(async (tx) => {
                // in this - cart means product so how many products added.
                const carts = await tx.cart.findMany({
                    where: {
                        userId: req.user?.id
                    },
                    include: {
                        product: true
                    }
                })
                if (carts.length === 0) return errorReturn(res, 'cart is empty')

                // calculate total price - prev means previous return value.
                const price = carts.reduce((prev, current) => {
                    return prev + (current.quantity * current.product.price)
                }, 0)

                // user order address get. we also extends address model in formattedAddress
                if (!req.user?.shippingAddress) return errorReturn(res, 'user not auth')
                const address = await tx.address.findFirstOrThrow({
                    where: {
                        id: req.user?.shippingAddress
                    }
                })

                // now create an order. in products in relation but we add manually bu products : {create : ...} method.
                const order = await tx.order.create({
                    data: {
                        userId: req.user?.id,
                        netAmount: price,
                        address: address.formattedAddress,
                        products: {
                            create: carts.map(cart => {
                                return {
                                    productId: cart.productId,
                                    quantity: cart.quantity
                                }
                            })
                        }
                    }
                })
                //  close order creation.

                // set order event pending.
                const orderEvent = await tx.orderEvent.create({
                    data: {
                        orderId: order.id
                    }
                })

                // now empty all product from cart.
                await tx.cart.deleteMany({
                    where: {
                        userId: req.user.id
                    }
                })
                console.log({ order })

                return successReturn(res, 201, order)
            })
            // transition edd


        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }


    listOrders = async (req: Request, res: Response) => {
        try {
            const orders = await prisma.order.findMany({
                where: { userId: req.user?.id }
            })

            successReturn(res, 200, orders)
        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }

    cancelOrder = async (req: Request, res: Response) => {
        try {
            const order = await prisma.order.update({
                where: {
                    id: req.params.id
                },
                data: {
                    status: 'CANCELLED'
                }
            })

            await prisma.orderEvent.create({
                data: {
                    orderId: order.id,
                    status: 'CANCELLED'
                }
            })

            successReturn(res, 201, order)

        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }

    getOrderById = async (req: Request, res: Response) => {
        try {

            const order = await prisma.order.findFirstOrThrow({
                where: { id: req.params.id, userId: req.user?.id },
                include: {
                    products: true,
                    events: true
                }
            })

            successReturn(res, 200, order)

        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }
}

export default new OrderController()