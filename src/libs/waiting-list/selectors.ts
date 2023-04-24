// @ts-nocheck
import { createSelector } from 'reselect';
import { RootState } from '../../reducers';

export const getBookingOptionConsumerList = (state: RootState) =>
  state.waitingList.option.items;

const _getForBookingIds = (state: RootState) =>
  state.waitingList.option.forBooking.allIds;

const _getForMemberIds = (state: RootState) =>
  state.waitingList.option.forMember.allIds;

const _getData = (state: RootState) => state.waitingList.option.byId;

export const getBookingOptionListForBooking = createSelector(
  [_getData, _getForBookingIds],
  (data, ids) => ids.map((id) => data[id]).filter((option) => !option.booking),
);

export const getBookingOptionListForBookingNotConvertible = createSelector(
  getBookingOptionListForBooking,
  (bookingOptionList) =>
    bookingOptionList.filter((bookingOption) => !bookingOption.is_convertible),
);

export const getBookingOptionListForBookingConvertible = createSelector(
  getBookingOptionListForBooking,
  (bookingOptionList) =>
    bookingOptionList.filter((bookingOption) => bookingOption.is_convertible),
);

export const getBookingOptionListForMember = createSelector(
  [_getData, _getForMemberIds],
  (data, ids) => ids.map((id) => data[id]),
);
