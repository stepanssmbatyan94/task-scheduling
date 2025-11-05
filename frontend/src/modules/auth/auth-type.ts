import { z } from 'zod';

import type { UserProfile } from '../current-user/current-user-type';
import { loginSchema } from './auth-schema';

export type LoginForm = z.infer<typeof loginSchema>;

export type LoginResponse = {
  token: string;
  refreshToken: string;
  tokenExpires: number;
};

export type LoginSuccessResponse = LoginResponse & {
  user: UserProfile;
};
