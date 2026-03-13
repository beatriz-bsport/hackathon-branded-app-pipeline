import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import Immutable from 'seamless-immutable';

import { RootState } from '../../../reducers';
import type {
  PrivatePass,
  PrivatePassCategory,
  PrivatePassCategoryWithPasses,
} from '../types';
import { filterIneligibleTags } from '@bsport/common/lib/master-data/tags-eligibility';

export type PrivatePassByCategorySelector<LPP = number> = (
  state: RootState,
) => Array<PrivatePass<LPP>>;

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

const _passesByCategory = (
  privatePassList: PrivatePass[],
  privatePassCategoryIds: number[],
  privatePassCategoryById: { [id: number]: PrivatePassCategory },
) => {
  return Immutable<PrivatePassCategoryWithPasses[]>([
    // @ts-expect-error
    ...privatePassCategoryIds.map((categoryId) => ({
      ...privatePassCategoryById[categoryId],
      passes: privatePassList.filter(
        (pass: PrivatePass) => pass.category === categoryId,
      ),
    })),
    // @ts-expect-error
    {
      name: '',
      id: null,
      category_ordering: privatePassCategoryIds.length,
      passes: privatePassList.filter((pass: PrivatePass) => !pass.category),
    },
  ]);
};

export const getPrivatePassByCategoryWithPasses = memoize(
  (selector: PrivatePassByCategorySelector) =>
    createSelector(
      [selector, _getAllPrivatePassCategoryIds, _getPrivatePassCategoryById],
      (privatePassList, privatePassCategoryIds, privatePassCategoryById) => {
        return _passesByCategory(
          privatePassList,
          privatePassCategoryIds,
          privatePassCategoryById,
        );
      },
    ),
);

export const getPrivatePassByCategoryWithEligiblePasses = memoize(
  (selector: PrivatePassByCategorySelector) =>
    createSelector(
      [
        selector,
        _getAllPrivatePassCategoryIds,
        _getPrivatePassCategoryById,
        (_, authenticated: boolean) => authenticated,
        (_, __, memberTagList: number[]) => memberTagList,
      ],
      (
        privatePassList,
        privatePassCategoryIds,
        privatePassCategoryById,
        authenticated,
        memberTagList,
      ) => {
        return _passesByCategory(
          filterIneligibleTags(privatePassList, {
            memberTagIdsList: memberTagList,
            authenticated,
          }),
          privatePassCategoryIds,
          privatePassCategoryById,
        );
      },
    ),
);
