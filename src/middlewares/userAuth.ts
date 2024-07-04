import { NextFunction, Request, Response } from "express"
import { verify } from 'jsonwebtoken'
import { prisma } from ".."
import { errorReturn } from "../utils/utils"

interface userJwt {
    userId: string,
    email: string
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization
        if (!token) return errorReturn(res, "invalid token!")
        if (!process.env.SECRET_TOKEN_KEY) return errorReturn(res, "invalid secret key!")

        await verify(token, process.env.SECRET_TOKEN_KEY, async (err, verifyJwt) => {
            if (err) return errorReturn(res, err.message)

            const user = await prisma.user.findFirst({ where: { id: (verifyJwt as userJwt).userId } })
            if (!user) return errorReturn(res, "user not auth")

            req.user = user;
            next()
        })
    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}
export default authMiddleware;