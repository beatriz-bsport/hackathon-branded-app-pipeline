import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import { RootState } from '../../../reducers';
import { PrivatePassSelector } from './private-pass';
import { PrivatePass } from '../types';

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
  (selector: PrivatePassSelector) =>
    createSelector(
      [selector, _getAllPrivatePassCategoryIds, _getPrivatePassCategoryById],
      (privatePassList, privatePassCategoryIds, privatePassCategoryById) => {
        return [
          ...privatePassCategoryIds.map((categoryId) => ({
            ...privatePassCategoryById[categoryId],
            passes: privatePassList.filter(
              (pass: PrivatePass) => pass.category === categoryId,
            ),
          })),
          {
            name: '',
            id: null,
            category_ordering: privatePassCategoryIds.length,
            passes: privatePassList.filter(
              (pass: PrivatePass) => !pass.category,
            ),
          },
        ];
      },
    ),
);
