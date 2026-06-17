import { z } from 'zod';

export const UpdateSettingSchema = z.object({
  value: z.string(),
  type: z.enum(['string', 'json', 'image']).optional(),
  group: z.string().optional(),
});

export const BulkUpdateSettingsSchema = z.record(z.string(), z.string());
