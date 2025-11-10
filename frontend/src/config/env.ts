import { z } from 'zod';

const envSchema = z.object({
  APP_BASE_PATH: z.string().default('/'),
  API_BASE_URL: z
    .string()
    .default('http://localhost:3000/api/v1'),
  SOCKET_BASE_URL: z.string().default('http://localhost:3000'),
  MOCK_API: z.string().optional()
});

export const env = envSchema.parse(process.env);
