import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import Immutable from 'seamless-immutable';

import { RootState } from '../../../reducers';
import { PrivatePass, PrivatePassCategoryWithPasses } from '../types';

export type PrivatePassByCategorySelector<LPP = number> = (
  state: RootState,
) => Array<PrivatePass<LPP>> | PrivatePass<LPP>;

const _getAllPrivatePassCategoryIds = (state: RootState) =>
  state.privateService.privatePassCategory.allIds;

const _getPrivatePassCategoryById = (state: RootState) =>
  state.privateService.privatePassCategory.byId;

export const getPrivatePassCategories = createSelector(
  [_getAllPrivatePassCategoryIds, _getPrivatePassCategoryById],
  (privatePassCategoryIds, privatePassCategoryById) => {
    return privatePassCategoryIds.map(
      (categoryId) => privatePassCategoryById[categoryId],
    );
  },
);

export const getPrivatePassByCategoryWithPasses = memoize(
  (selector: PrivatePassByCategorySelector) =>
    createSelector(
      [selector, _getAllPrivatePassCategoryIds, _getPrivatePassCategoryById],
      (privatePassList, privatePassCategoryIds, privatePassCategoryById) => {
        return Immutable<PrivatePassCategoryWithPasses[]>([
          // @ts-expect-error
          ...privatePassCategoryIds.map((categoryId) => ({
            ...privatePassCategoryById[categoryId],
            // @ts-expect-error
            passes: privatePassList.filter(
              (pass: PrivatePass) => pass.category === categoryId,
            ),
          })),
          // @ts-expect-error
          {
            name: '',
            id: null,
            category_ordering: privatePassCategoryIds.length,
            // @ts-expect-error
            passes: privatePassList.filter(
              (pass: PrivatePass) => !pass.category,
            ),
          },
        ]);
      },
    ),
);
