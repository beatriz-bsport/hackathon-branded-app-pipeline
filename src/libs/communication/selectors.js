import { createSelector } from 'reselect';

export const getIds = (state) => state.communication.emailContact.allIds;
export const getData = (state) => state.communication.emailContact.byId;

export const getEmailContact = createSelector(
  [getIds, getData],
  (ids, data) => ids.map((id) => data[id]),
);
