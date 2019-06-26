// @flow
import type { MarketPlaceState } from './types';

const _getOffers = (state: MarketPlaceState) => state.offers.items;
const _getEstablishments = (state: MarketPlaceState) =>
  state.establishments.items;

const _getMetaActivities = (state: MarketPlaceState) =>
  state.metaActivities.items;

const _getActivities = (state: MarketPlaceState) => state.activities.items;
const _getCoaches = (state: MarketPlaceState) => state.coaches.items;

export default {
  _getOffers,
  _getEstablishments,
  _getMetaActivities,
  _getActivities,
  _getCoaches,
};
