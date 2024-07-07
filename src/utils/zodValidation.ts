import { z } from "zod"

export const productSchema = z.object({
    name: z.string().nonempty('name is required'),
    price: z.number(),
    description: z.string().nonempty('description is required'),
    tags: z.array(z.string()).nonempty("tags is required"),
})


export const addressSchema = z.object({
    lineOne: z.string().nonempty('line one is required'),
    lineTwo: z.string().nonempty('line two is required'),
    city: z.string().nonempty('city is required'),
    country: z.string().nonempty('country is required'),
    zipCode: z.number()
})


export const cartSchema = z.object({
    productId: z.string().nonempty('product id not defined'),
    quantity: z.number()
})

export const changeQuantitySchema = z.object({
    quantity: z.number()
})

export const changeRoleSchema = z.object({
    role: z.enum(['USER', "ADMIN"], {
        required_error: "role is required",
        invalid_type_error: "role must be USER or ADMIN"
    })
})
