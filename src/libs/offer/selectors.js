import { createSelector } from 'reselect';
import { Moment } from '../../i18n';

const getState = (state) => state.offer;

const getAll = (state) => getState(state).offers;

const get = (state, id) => getState(state).offers.find((o) => o.id === id);

// this will remove the offers already ended simply
const todayOffers = createSelector(
  getAll,
  (offers) =>
    offers.filter((offer) => {
      const momentDate = Moment();
      return (
        momentDate.isBefore(Moment(offer.date_start)) ||
        momentDate.isBetween(Moment(offer.date_start), Moment(offer.date_end))
      );
    }),
);

export const compatiblePacksWithOffer = (state) =>
  state.offer.compatiblePacks.items;

export const compatiblePacksWithOfferAndEnabled = createSelector(
  compatiblePacksWithOffer,
  (items) => items.filter((pp) => !pp.disabled),
);

export default { get, getAll, todayOffers };
