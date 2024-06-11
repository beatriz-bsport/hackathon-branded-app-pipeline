import { Action, ActionFunction1, ActionFunctionAny } from 'redux-actions';
import type {
  CheckDeleteEstablishmentData,
  DeleteEstablishmentSection,
} from './establishment';

export enum DeleteObjectVariant {
  ESTABLISHMENT = 'establishment',
}

interface CheckDeleteObjectData {
  can_destroy: boolean;
}

export type CheckDeleteObjectDataMap = {
  [DeleteObjectVariant.ESTABLISHMENT]: CheckDeleteEstablishmentData;
};

export type DeleteObjectSection<T extends CheckDeleteObjectData> = {
  canDestroy: boolean;
  error: Error | null;
  id: number | null;
  isLoading: boolean;
  checkData: T | null;
};

export type DeleteObjectState = {
  establishment: DeleteEstablishmentSection;
};
