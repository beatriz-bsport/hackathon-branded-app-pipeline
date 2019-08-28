import { Moment } from '../../i18n';

const getState = (state) => state.offer;

const getAll = (state) => getState(state).offers;

const get = (state, id) => getState(state).offers.find((o) => o.id === id);

// this will remove the offers already ended simply
const todayOffers = (state) => {
  return getAll(state).filter((offer) => {
    const momentDate = Moment();
    return (
      momentDate.isBefore(Moment(offer.date_start)) ||
      momentDate.isBetween(Moment(offer.date_start), Moment(offer.date_end))
    );
  });
};

export default { get, getAll, todayOffers };
