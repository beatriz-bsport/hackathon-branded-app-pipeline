import { deleteEstablishment } from '#src/libs/establishment/actions';
import {
  checkDeleteEstablishment,
  checkDeleteEstablishmentActions,
} from './actions';

import type { ThunkAction } from '#src/state/types';
import type {
  CheckDeleteObjectDataMap,
  DeleteObjectVariant,
  CheckDeleteObjectActions,
} from './types';

export enum DeleteObjectStatus {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export const DELETE_OBJECT_FUNCTIONS: {
  [K in DeleteObjectVariant]: (id: number) => ThunkAction;
} = { establishment: deleteEstablishment };

export const CHECK_CAN_DELETE_OBJECT_FUNCTIONS: {
  [K in DeleteObjectVariant]: (id: number) => ThunkAction;
} = { establishment: checkDeleteEstablishment };

export const CHECK_CAN_DELETE_OBJECT_ACTIONS: {
  [K in DeleteObjectVariant]: CheckDeleteObjectActions<
    CheckDeleteObjectDataMap[K]
  >;
} = {
  establishment: checkDeleteEstablishmentActions,
};
