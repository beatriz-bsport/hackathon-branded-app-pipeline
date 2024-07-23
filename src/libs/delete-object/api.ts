import { API_V1_URI, getAuth } from '../../http';

import type { CheckDeleteEstablishmentData } from './types/establishment';
import type { CheckDeleteEstablishmentGroupData } from './types/establishmentGroup';

export const checkDeleteEstablishment = (establishmentId: number) => {
  return getAuth<CheckDeleteEstablishmentData>(
    `${API_V1_URI}/establishment/${establishmentId}/check_before_deletion/`,
  );
};

export const checkDeleteEstablishmentGroup = (establishmentGroupId: number) => {
  return getAuth<CheckDeleteEstablishmentGroupData>(
    `${API_V1_URI}/establishment-group/${establishmentGroupId}/check_before_deletion/`,
  );
};
