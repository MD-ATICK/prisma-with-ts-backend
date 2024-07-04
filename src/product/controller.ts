import { Request, Response } from "express"
import { productSchema } from "../utils/zodValidation"
import { arrayToString, errorReturn, successReturn } from "../utils/utils"

class ProductController {
  
    products = async (req: Request, res: Response) => {
        try {

        } catch (error) {
            errorReturn(res, (error as Error).message)
        }
    }


    createProduct = async (req: Request, res: Response) => {
        try {
            const zod = productSchema.safeParse(req.body)
            if (!zod.success) return errorReturn(res, arrayToString(zod.error.errors))
            const { name, price, description, title, tags } = zod.data
            
            successReturn(res, 200, zod.data)
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