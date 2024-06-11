import { API_V1_URI, getAuth } from '../../http';

import type { CheckDeleteEstablishmentData } from './types/establishment';

export const checkDeleteEstablishment = (establishmentId: number) => {
  return getAuth<CheckDeleteEstablishmentData>(
    `${API_V1_URI}/establishment/${establishmentId}/check_before_deletion/`,
  );
};
