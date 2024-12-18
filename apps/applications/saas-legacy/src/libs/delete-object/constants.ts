import {
  deleteEstablishment,
  deleteEstablishmentGroup,
} from '#src/libs/establishment/actions';
import {
  checkDeleteEstablishment,
  checkDeleteEstablishmentActions,
  checkDeleteEstablishmentGroup,
  checkDeleteEstablishmentGroupActions,
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
} = {
  establishment: deleteEstablishment,
  establishmentGroup: deleteEstablishmentGroup,
};

export const CHECK_CAN_DELETE_OBJECT_FUNCTIONS: {
  [K in DeleteObjectVariant]: (id: number) => ThunkAction;
} = {
  establishment: checkDeleteEstablishment,
  establishmentGroup: checkDeleteEstablishmentGroup,
};

export const CHECK_CAN_DELETE_OBJECT_ACTIONS: {
  [K in DeleteObjectVariant]: CheckDeleteObjectActions<
    CheckDeleteObjectDataMap[K]
  >;
} = {
  establishment: checkDeleteEstablishmentActions,
  establishmentGroup: checkDeleteEstablishmentGroupActions,
};

export const DELETE_OBJECT_TRANSLATIONS: {
  [K in DeleteObjectVariant]: string;
} = {
  establishmentGroup: 'establishment',
  establishment: 'establishment',
};
