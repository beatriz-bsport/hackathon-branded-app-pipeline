import { createSelector } from 'reselect';
import { RootState } from '../../reducers';

const _getData = (state: RootState) => state.terminal.reader.byId;
const _getReaderIds = (state: RootState) => state.terminal.reader.allIds;

export const getStripeReaders = createSelector(
  [_getData, _getReaderIds],
  (data, ids) => ids.map((id) => data[id]),
);
