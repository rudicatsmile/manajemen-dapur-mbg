import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.string().min(1, 'Pesan tidak boleh kosong').max(2000),
  poId: z.number().int().positive().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
