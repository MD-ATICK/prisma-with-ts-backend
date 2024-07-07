import { Request, Response } from "express"
import { arrayToString, errorReturn, successReturn } from "../utils/utils"
import { addressSchema } from "../utils/zodValidation"
import { prisma } from ".."
import NodeCache from 'node-cache'
const nodeCache = new NodeCache()

class AddressController {

    addAddress = async (req: Request, res: Response) => {
        try {
            const zod = addressSchema.safeParse(req.body)
            if (!zod.success) return errorReturn(res, arrayToString(zod.error.errors))

            const user = await prisma.user.findFirstOrThrow({
                where: {
                    id: req.user?.id
                }
            })

            const address = await prisma.address.create({
                data: {
                    ...zod.data,
                    userId: user.id
                },
                include: {
                    user: true
                }
            })

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    shippingAddress: address.id
                }
            })

            successReturn(res, 201, address)

        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }


    deleteAddress = async (req: Request, res: Response) => {
        try {
            const address = await prisma.address.delete({
                where: { id: req.params.id }
            })
            successReturn(res, 200, address)
        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }


    listAddress = async (req: Request, res: Response) => {
        try {

            const key = 'address'
            let addresses;
            if (nodeCache.has(key)) {
                addresses = nodeCache.get(key) as object[]
                return successReturn(res, 200, addresses)
            }

            addresses = await prisma.address.findMany({
                where: {
                    userId: req.user?.id
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            nodeCache.set(key, addresses)
            successReturn(res, 200, addresses)

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


export default new AddressController()

