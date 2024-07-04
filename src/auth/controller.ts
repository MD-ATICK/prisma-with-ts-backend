import { compareSync, hashSync } from 'bcrypt';
import { Request, Response } from "express";
import { prisma } from "..";
import { createToken, errorReturn, successReturn, } from "../utils/utils";

class UserController {

    register = async (req: Request, res: Response) => {
        try {
            const { password, email, name } = req.body;
            console.log(req.body)
            let user = await prisma.user.findFirst({ where: { email } })
            console.log({ user })
            if (user) return errorReturn(res, 'user already registered')

            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashSync(password, 10)
                }
            })

            successReturn(res, 201, user)
        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body
        console.log(email, password)
        let user = await prisma.user.findFirst({ where: { email } })
        if (!user) return errorReturn(res, "user not found")

        const isMatch = compareSync(password, user.password)
        if (!isMatch) return errorReturn(res, "incorrect password")

        const token = createToken({ userId: user.id, email: user.email })
        successReturn(res, 201, { user, token })
    }

    auth = async (req: Request, res: Response) => {
        try {
            const user = req.user
            if (!user) return errorReturn(res, "verify user not found.")
            successReturn(res, 200, user)
            // res.json(req.user)
        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }

    getUsers = async (req: Request, res: Response) => {
        try {
            // const users = await prisma.user.deleteMany({})
            const users = await prisma.user.findMany({})
            successReturn(res, 200, users)
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

export default new UserController()