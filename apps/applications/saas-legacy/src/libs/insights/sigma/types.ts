import { SIGMA_OUTBOUND_EVENTS } from './constants';

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookcharterror
 */
export type SigmaEventWorkbookChartError = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_CHART_ERROR;
  nodeId: string;
  message: string | undefined;
  code: string;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookerror
 */
export type SigmaEventWorkbookError = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_ERROR;
  message: string | undefined;
  code: string;
};

export type SigmaEventData =
  | SigmaEventWorkbookChartError
  | SigmaEventWorkbookError;
