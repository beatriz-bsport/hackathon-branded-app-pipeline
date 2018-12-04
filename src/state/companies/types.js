// @flow

import type { Immutable } from 'seamless-immutable';

type Company = {};

export type CompaniesAction =
  | { type: null }
  | {
      type: 'COMPANIES_FETCH_SUCCESS',
      company: Company,
    };

export type CompaniesState = Immutable<{
  company: ?Company,
}>;
