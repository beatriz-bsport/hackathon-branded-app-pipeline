import { createSelector } from 'reselect';
import { getAll as getPaymentPacks } from '../payment-packs/selectors';

const getState = (state) => state.consumerPaymentPack;

const getAll = (state) => getState(state).items;

const getActive = createSelector(
  getAll,
  (cpps) => cpps.filter((cpp) => !cpp.reverted),
);

const get = (state, id) => getAll(state).find((cpp) => cpp.id === id);

export const getConsumerPacks = (state) => state.consumerPaymentPack.items;

export const getConsumerPacksWithPaymentPack = createSelector(
  [getConsumerPacks, getPaymentPacks],
  (consumerPacks, paymentPacks) =>
    consumerPacks.map((cpp) => ({
      ...cpp,
      payment_pack: paymentPacks.find(
        (pp) => pp.id === parseInt(cpp.payment_pack_id, 10),
      ),
    })),
);

export default { get, getAll, getActive };
