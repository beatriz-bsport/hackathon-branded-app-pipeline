import { createAction } from 'redux-actions';

export const fetchOfferBulkActions = {
  isLoading: createAction('OFFER/BULK/IS_LOADING'),
  error: createAction('OFFER/BULK/ERROR'),
  success: createAction('OFFER/BULK/SUCCESS'),
};

export const fetchGroupOfferActions = {
  error: createAction('META_ACTIVITIES/GROUP/DETAIL/ERROR'),
  loading: createAction('META_ACTIVITIES/GROUP/DETAIL/IS_LOADING'),
  success: createAction('META_ACTIVITIES/GROUP/DETAIL/SUCCESS'),
};
