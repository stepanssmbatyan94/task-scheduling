import { env } from '@/config/env';
import { mockReponse } from '@/mock-response-data';
import { Http } from '@/services/Http';
import type { Branch } from './branch-type';

const API_ENDPOINT = 'branches';

export async function fetchBranchAutocompleteApi(signal: AbortSignal) {
  if (env.MOCK_API == 'true') {
    return mockReponse.getBranchAutoComplete as SuccessResponse<Branch[]>;
  }

  return await Http.get<SuccessResponse<Branch[]>>(API_ENDPOINT + '/autocomplete', undefined, {
    signal
  });
}
