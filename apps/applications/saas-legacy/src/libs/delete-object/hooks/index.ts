import type { DeleteObjectVariant } from '../types';
import { DeleteObjectStatus } from '../constants';
import { useDeleteEstablishmentWarningMessages } from './establishment';
import { useDeleteEstablishmentGroupWarningMessages } from './establishmentGroup';

export type WarningMessagesHook = () => {
  infoMessages: string[];
  warningMessages: string[];
  errorMessages: string[];
  deleteObjectStatus: DeleteObjectStatus;
};

export const useDeleteObjectWarningMessages: {
  [V in DeleteObjectVariant]: WarningMessagesHook;
} = {
  establishment: useDeleteEstablishmentWarningMessages,
  establishmentGroup: useDeleteEstablishmentGroupWarningMessages,
};
