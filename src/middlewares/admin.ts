import { NextFunction, Request, Response } from "express"
import { errorReturn } from "../utils/utils";



const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (user?.role === 'USER') {
            next()
        } else {
            errorReturn(res, 'role not allowed')
        }

    } catch (error) {
        errorReturn(res, (error as Error).message)
    }
}
export default adminMiddleware;