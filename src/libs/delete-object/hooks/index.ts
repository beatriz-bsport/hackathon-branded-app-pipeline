import type { DeleteObjectVariant } from '../types';
import { DeleteObjectStatus } from '../constants';
import { useDeleteEstablishmentWarningMessages } from './establishment';

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
};
