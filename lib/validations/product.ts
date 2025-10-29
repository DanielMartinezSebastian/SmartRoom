import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  category: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateProductSchema = productSchema.partial();

export const roomProductSchema = z.object({
  roomId: z.string().uuid(),
  productId: z.string().uuid(),
  status: z.enum(['AVAILABLE', 'UNAVAILABLE', 'OUT_OF_STOCK']).default('AVAILABLE'),
  stock: z.number().min(0, 'Stock must be positive'),
});

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type RoomProductInput = z.infer<typeof roomProductSchema>;
