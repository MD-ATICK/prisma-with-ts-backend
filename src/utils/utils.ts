import dotenv from 'dotenv'
import { Response } from "express"
import { sign, verify } from 'jsonwebtoken'
import { ZodIssue } from 'zod'
dotenv.config()

export const successReturn = (res: Response, status: number, body: object) => {
    return res.status(status).json(body)
}
export const errorReturn = (res: Response, err: string) => {
    return res.status(400).json({ err })
}

export const createToken = (data: object) => {
    if (process.env.SECRET_TOKEN_KEY) {
        return sign(data, process.env.SECRET_TOKEN_KEY, { expiresIn: '7D' })
    } else {
        return ''
    }
}


export const arrayToString = (errors: ZodIssue[]): string => {
    if (errors) {
        const errorMsg = errors.map((err) => `${err.path.join('.')} - ${err.message}`)
        return errorMsg.join(' , ');
    } else {
        return ''
    }
}