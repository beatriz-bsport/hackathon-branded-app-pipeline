import api from '../api';
import types from './marketplace.types';

export function fetchCompany(companyId) {
  return async (dispatch) => {
    dispatch(startFetchCompany());

    try {
      const response = await api.marketplace.fetchCompany(companyId);
      const company = response.data;
      dispatch(fetchedCompany(company));
    } catch (err) {
      dispatch(errorFetchingCompany());
    }
  };
}

export function fetchedCompany(company) {
  return { type: types.MARKETPLACE_COMPANY_FETCH_SUCCESS, company };
}
export function startFetchCompany() {
  return { type: types.MARKETPLACE_COMPANY_FETCH_START };
}

export function errorFetchingCompany() {
  return { type: types.MARKETPLACE_COMPANY_FETCH_ERROR };
}

export function fetchCalendar(companyId) {
  return async (dispatch) => {
    dispatch(startFetchCalendar(companyId));

    try {
      const response = await api.marketplace.fetchCalendar(companyId);
      const offers = response.data;
      dispatch(fetchedCalendar(offers));
    } catch (err) {
      dispatch(errorFetchingCalendar());
    }
  };
}

export function fetchedCalendar(offers) {
  return { type: types.MARKETPLACE_CALENDAR_FETCH_SUCCESS, offers };
}
export function startFetchCalendar(companyId) {
  return { type: types.MARKETPLACE_CALENDAR_FETCH_START, companyId };
}

export function errorFetchingCalendar() {
  return { type: types.MARKETPLACE_CALENDAR_FETCH_ERROR };
}

export function fetchOffersByDay({ companyId, year, month, day }) {
  return async (dispatch) => {
    dispatch(startFetchOffersByDay());

    try {
      const response = await api.marketplace.fetchOffersByDay({
        companyId,
        year,
        month,
        day,
      });
      const offers = response.data;
      dispatch(fetchedOfferByDay(offers));
    } catch (err) {
      dispatch(errorFetchingOffersByDay());
    }
  };
}

export function fetchedOfferByDay(offers) {
  return { type: types.MARKETPLACE_OFFERS_BY_DAY_FETCH_SUCCESS, offers };
}
export function startFetchOffersByDay() {
  return { type: types.MARKETPLACE_OFFERS_BY_DAY_FETCH_START };
}

export function errorFetchingOffersByDay() {
  return { type: types.MARKETPLACE_OFFERS_BY_DAY_FETCH_ERROR };
}

export function fetchPaymentPacks(companyId) {
  return async (dispatch) => {
    dispatch(startFetchPaymentPacks());

    try {
      const response = await api.marketplace.fetchPaymentPacks(companyId);
      const paymentPacks = response.data;
      dispatch(fetchedPaymentPacks(paymentPacks));
    } catch (err) {
      dispatch(errorFetchingPaymentPacks());
    }
  };
}

export function fetchedPaymentPacks(paymentPacks) {
  return { type: types.MARKETPLACE_PACKS_FETCH_SUCCESS, paymentPacks };
}
export function startFetchPaymentPacks() {
  return { type: types.MARKETPLACE_PACKS_FETCH_START };
}

export function errorFetchingPaymentPacks() {
  return { type: types.MARKETPLACE_PACKS_FETCH_ERROR };
}
