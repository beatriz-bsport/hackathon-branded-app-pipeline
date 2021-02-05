import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { parseQueryString } from '../../../http';
import consumerReducer from '../reducers';
import {RootState} from "../../../reducers";

const mockAxios = new MockAdapter(axios);

/**
 * Setup a Store
 */


const appReducer = combineReducers({ consumer: consumerReducer });

const rootReducer = (state: RootState, action: any) => {
  if (action && action.type === '__RESET_STORE__') {
    state = undefined;
  }
  return appReducer(state, action);
};

const store = createStore(rootReducer, applyMiddleware(thunk));

let bookings: any[] = [];
let privateBookings: any[] = [];

const commonPagination = (page: number, page_size: number, source: any) => {
  page = parseInt(page);
  page_size = parseInt(page_size);

  const start = (page - 1) * page_size;
  const end = page * page_size;
  const results = [];

  let next_page: number | null = page + 1;

  for (let i = start; i < end && i < source.length; i += 1) {
    results.push(source[i]);
  }

  if (!source[end + 1]) {
    next_page = null;
  }

  return {
    results,
    next_page,
  };
};

mockAxios
  .onGet(/(\/api\/v1\/private_service\/private_booking)/i)
  .reply((config) => {
    const { page, page_size } = parseQueryString(config.url);
    return [200, commonPagination(page, page_size, privateBookings)];
  });

mockAxios.onGet(/(\/api\/v1\/booking)/i).reply((config) => {
  const { page, page_size } = parseQueryString(config.url);
  return [200, commonPagination(page, page_size, bookings)];
});

const setBookings = (_bookings: any[]) => {
  bookings = _bookings;
};

const setPrivateBookings = (_privateBookings: any[]) => {
  privateBookings = _privateBookings;
};

export { store, setBookings, setPrivateBookings };
