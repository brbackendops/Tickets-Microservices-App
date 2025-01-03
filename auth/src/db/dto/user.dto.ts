import { z } from 'zod'

export const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5,"password must contain atleast 5 characters")
})


export type userPayload = z.infer<typeof userSchema>