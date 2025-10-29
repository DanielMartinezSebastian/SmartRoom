import { z } from 'zod';

export const purchaseSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export type PurchaseInput = z.infer<typeof purchaseSchema>;
