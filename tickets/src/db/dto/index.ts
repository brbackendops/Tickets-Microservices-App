import { z } from 'zod';

const ticketSchema = z.object({
  id: z.number(),
  title: z.string(),
  userId: z.number(),
  price: z.string(),
  createdAt: z.string(),
});

const ticketPayload = ticketSchema.omit({
  id: true,
  createdAt: true,
});

const ticketUpdateSchema = z.object({
  title: z.string().optional(),
  userId: z.number().optional(),
  price: z.string().optional(),
});

export type ticketSchemaType = z.infer<typeof ticketSchema>;
export type ticketPayloadType = z.infer<typeof ticketPayload>;
export type ticketUpdateType = z.infer<typeof ticketUpdateSchema>;
