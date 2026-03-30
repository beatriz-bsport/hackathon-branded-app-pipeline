import { SIGMA_OUTBOUND_EVENTS } from './constants';
import type {
  SigmaEventWorkbookChartError,
  SigmaEventWorkbookError,
  SigmaEventData,
} from './types';

/**
 * Define a common pattern to create Error that are tracked afterwards on Sentry.
 */
export const buildSigmaError = ({ type, ...otherParams }: SigmaEventData) => {
  let stringifiedParams = '';
  try {
    stringifiedParams = JSON.stringify(otherParams);
  } catch {
    // Skip - silent failure
  }
  return new Error(`[SIGMA][${type}] ${stringifiedParams}`);
};

// ---------- EVENTS INFERENCE ----------

const isCleanEventData = (
  eventData: unknown,
): eventData is object & Record<'type', unknown> =>
  !!eventData && typeof eventData === 'object' && 'type' in eventData;

export const isSigmaEventWorkbookChartError = (
  eventData: unknown,
): eventData is SigmaEventWorkbookChartError =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_CHART_ERROR;

export const isSigmaEventWorkbookError = (
  eventData: unknown,
): eventData is SigmaEventWorkbookError =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_ERROR;
