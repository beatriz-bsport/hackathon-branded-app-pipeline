import { Action, ActionFunction1, ActionFunctionAny } from 'redux-actions';
import type {
  CheckDeleteEstablishmentData,
  DeleteEstablishmentSection,
} from './establishment';
import type {
  CheckDeleteEstablishmentGroupData,
  DeleteEstablishmentGroupSection,
} from './establishmentGroup';

export enum DeleteObjectVariant {
  ESTABLISHMENT = 'establishment',
  ESTABLISHMENT_GROUP = 'establishmentGroup',
}

interface CheckDeleteObjectData {
  can_destroy: boolean;
}

export type CheckDeleteObjectDataMap = {
  [DeleteObjectVariant.ESTABLISHMENT]: CheckDeleteEstablishmentData;
  [DeleteObjectVariant.ESTABLISHMENT_GROUP]: CheckDeleteEstablishmentGroupData;
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
  establishmentGroup: DeleteEstablishmentGroupSection;
};

export type CheckDeleteObjectActions<T extends CheckDeleteObjectData> = {
  loading: ActionFunction1<boolean, Action<boolean>>;
  error: ActionFunction1<Error | null, Action<Error | null>>;
  clear: ActionFunctionAny<Action<void>>;
  success: ActionFunction1<T & { id: number }, Action<T & { id: number }>>;
};
