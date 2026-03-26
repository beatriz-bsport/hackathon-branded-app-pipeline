/**
 * Outbound events are sent from Sigma to our host.
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference
 */
export const SIGMA_OUTBOUND_EVENTS = {
  // When a chart produces an error.
  WORKBOOK_CHART_ERROR: 'workbook:chart:error',
  // When a workbook produces an error.
  WORKBOOK_ERROR: 'workbook:error',
} as const;
