import { createSelector } from 'reselect';
import { RootState } from '../../reducers';

export const getBookingOptionConsumerList = (state) =>
  state.waitingList.option.items;

const _getForBookingIds = (state) => state.waitingList.option.forBooking.allIds;

const _getData = (state) => state.waitingList.option.byId;

export const getBookingOptionListForBooking = createSelector(
  [_getData, _getForBookingIds],
  (data, ids) => ids.map((id) => data[id]).filter((bp) => !bp.booking),
);

export const getBookingOptionListForBookingNotConvertible = createSelector(
  getBookingOptionListForBooking,
  (boList) => boList.filter((bo) => !bo.is_convertible),
);

export const getBookingOptionListForBookingConvertible = createSelector(
  getBookingOptionListForBooking,
  (boList) => boList.filter((bo) => bo.is_convertible),
);

export const getBookingOptionListForMember = (state: RootState) => {
  return state.waitingList.option.forMember.allIds.map(
    (id) => state.waitingList.option.byId[id],
  );
};
