import { RootState } from '../../reducers';

export const getSCTs = (state: RootState) => {
  return state.category.SCTs;
};

export const getEditableSCTs = (state: RootState) => {
  const language = state.theme.theme.locale
    ? state.theme.theme.locale.split('_')[0]
    : null;

  return language
    ? state.category.SCTs.filter((SCT) => SCT.language === language)
    : state.category.SCTs;
};

export const getSCTsLoading = (state: RootState) => state.category.isLoading;
