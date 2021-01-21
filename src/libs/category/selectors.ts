import { RootState } from '../../reducers';

export const getSCTs = (state: RootState) => {
  return state.category.SCTs;
};
