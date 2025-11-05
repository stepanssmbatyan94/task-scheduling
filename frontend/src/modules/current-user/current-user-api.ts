import { env } from '@/config/env';
import { mockReponse } from '@/mock-response-data';
import { Http } from '@/services/Http';
import type { UserProfile } from './current-user-type';

export async function fetchCurrentUserApi() {
  if (env.MOCK_API === 'true') {
    return mockReponse.login.user as UserProfile;
  }

  return Http.get<UserProfile>('auth/me');
}
