import { z } from 'zod';

export const OrderPayloadSchema = z.object({
    ticketId: z.number(),
    userId: z.number().optional(),
})

