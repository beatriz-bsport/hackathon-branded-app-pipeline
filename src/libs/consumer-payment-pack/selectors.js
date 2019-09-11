import { createSelector } from 'reselect';

const getState = (state) => state.consumerPaymentPack;

const getAll = (state) => getState(state).items;

const getActive = createSelector(
  getAll,
  (cpps) => cpps.filter((cpp) => !cpp.reverted),
);

const get = (state, id) => getAll(state).find((cpp) => cpp.id === id);

export default { get, getAll, getActive };
