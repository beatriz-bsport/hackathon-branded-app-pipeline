import { RootState } from '../../reducers';
import { getLocaleLanguage } from '#src/utils/language';

export const getSCTs = (state: RootState) => {
  return state.category.SCTs;
};

export const getEditableSCTs = (state: RootState) => {
  const language = getLocaleLanguage(state.theme.theme.locale);

  return language
    ? state.category.SCTs.filter((SCT) => SCT.language === language)
    : state.category.SCTs;
};

export const getSCTsLoading = (state: RootState) => state.category.isLoading;
