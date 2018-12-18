// @flow

import { createRestResource, createResource, asQueryParams } from './core';

export const reports = createRestResource('reports', 'reporting/reports');
export const reportResult = createResource('reportResult', {
  url: (reportId, dateStart, dateEnd) => {
    const query = asQueryParams({ dateStart, dateEnd });
    return `reporting/reports/${reportId}/generate/?${query}`;
  },
  verb: 'generate',
});
