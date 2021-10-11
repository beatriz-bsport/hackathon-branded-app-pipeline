import { RootState } from '../../reducers';

export const getQuickbooksApp = (state: RootState) => state.quickbooks.detail;
