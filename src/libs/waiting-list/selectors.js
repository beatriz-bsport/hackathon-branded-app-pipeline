import { createSelector } from 'reselect';

export const getBookingOptionConsumerList = (state) =>
  state.waitingList.option.items;

const _getForBookingIds = (state) => state.waitingList.option.forBooking.allIds;

const _getData = (state) => state.waitingList.option.byId;

export const getBookingOptionListForBooking = createSelector(
  [_getData, _getForBookingIds],
  (data, ids) => ids.map((id) => data[id]),
);

export const getBookingOptionListForBookingNotConvertible = createSelector(
  getBookingOptionListForBooking,
  (boList) => boList.filter((bo) => !bo.is_convertible),
);
export const getBookingOptionListForBookingConvertible = createSelector(
  getBookingOptionListForBooking,
  (boList) => boList.filter((bo) => bo.is_convertible),
);
