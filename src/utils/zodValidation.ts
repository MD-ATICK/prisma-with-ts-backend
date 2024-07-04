import { z } from "zod"

export const productSchema = z.object({
    name: z.string().nonempty('name is required'),
    price: z.number(),
    title: z.string().nonempty('Title is required'),
    description: z.string().nonempty('description is required'),
    tags: z.array(z.string()).nonempty("tags is required"),
})