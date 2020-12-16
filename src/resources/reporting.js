// @flow

import { API_URI } from '../http.ts';

import { uri, createRestResource, createResource } from './core';

export const reports = createRestResource('reports', 'reporting/reports');
export const reportResult = createResource('reportResult', {
  url: uri`reporting/reports/:reportId/generate/:?params`,
  verb: 'generate',
});
export const reportMetadata = createResource('reportMetadata', {
  url: 'reporting/',
  verb: 'get',
});

export const urls = {
  export: uri`${API_URI}/reporting/reports/:reportId/export/:?params`,
};
