import { Request, Response } from "express"
import { arrayToString, errorReturn, successReturn } from "../utils/utils"
import { prisma } from ".."
import { changeRoleSchema } from "../utils/zodValidation"


class adminController {


    users = async (req: Request, res: Response) => {
        try {
            const users = await prisma.user.findMany({
                skip: parseInt(req.query.skip as string) || 0,
                take: 5
            })

            successReturn(res, 200, users)

        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }

    getUserById = async (req: Request, res: Response) => {
        try {

            const user = await prisma.user.findFirstOrThrow({
                where: { id: req.params.id },
                include: { addresses: true }
            })

            successReturn(res, 200, user)

        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }

    changeUserRole = async (req: Request, res: Response) => {
        try {
            const zod = changeRoleSchema.safeParse(req.body)
            if (zod.error) return errorReturn(res, arrayToString(zod.error.errors))

            const user = await prisma.user.update({
                where: { id: req.params.id },
                data: { role: zod.data.role }
            })

            successReturn(res, 200, user)

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

export default new adminController();