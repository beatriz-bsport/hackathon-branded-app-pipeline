import { SIGMA_OUTBOUND_EVENTS } from "./constants";
import type {
  SigmaEventActionOutbound,
  SigmaEventCreateSummary,
  SigmaEventDocumentElementNodata,
  SigmaEventUrlOnchange,
  SigmaEventWorkbookBookmarkOnchange,
  SigmaEventWorkbookBookmarkOncreate,
  SigmaEventWorkbookBookmarkOndelete,
  SigmaEventWorkbookBookmarkOnupdate,
  SigmaEventWorkbookChartError,
  SigmaEventWorkbookChartOnvalueselect,
  SigmaEventWorkbookDataloaded,
  SigmaEventWorkbookError,
  SigmaEventWorkbookExploreKeyOnchange,
  SigmaEventWorkbookFullscreenOnchange,
  SigmaEventWorkbookIdOnchange,
  SigmaEventWorkbookLoaded,
  SigmaEventWorkbookOndelete,
  SigmaEventWorkbookPageheightOnchange,
  SigmaEventWorkbookPivottableOncellselect,
  SigmaEventWorkbookPublished,
  SigmaEventWorkbookSaveas,
  SigmaEventWorkbookTableOncellselect,
  SigmaEventWorkbookVariablesOnchange,
} from "./types";

const isCleanEventData = (eventData: unknown) =>
  !!eventData && typeof eventData === "object" && "type" in eventData;

export const isSigmaEventActionOutbound = (
  eventData: unknown,
): eventData is SigmaEventActionOutbound =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.ACTION_OUTBOUND;

export const isSigmaEventCreateSummary = (
  eventData: unknown,
): eventData is SigmaEventCreateSummary =>
  isSigmaEventActionOutbound(eventData) && eventData.name === "create-summary";

export const isSigmaEventDocumentElementNodata = (
  eventData: unknown,
): eventData is SigmaEventDocumentElementNodata =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.DOCUMENT_ELEMENT_NODATA;

export const isSigmaEventUrlOnchange = (
  eventData: unknown,
): eventData is SigmaEventUrlOnchange =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.URL_ONCHANGE;

export const isSigmaEventWorkbookBookmarkOnchange = (
  eventData: unknown,
): eventData is SigmaEventWorkbookBookmarkOnchange =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_BOOKMARK_ONCHANGE;

export const isSigmaEventWorkbookBookmarkOncreate = (
  eventData: unknown,
): eventData is SigmaEventWorkbookBookmarkOncreate =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_BOOKMARK_ONCREATE;

export const isSigmaEventWorkbookBookmarkOndelete = (
  eventData: unknown,
): eventData is SigmaEventWorkbookBookmarkOndelete =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_BOOKMARK_ONDELETE;

export const isSigmaEventWorkbookBookmarkOnupdate = (
  eventData: unknown,
): eventData is SigmaEventWorkbookBookmarkOnupdate =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_BOOKMARK_ONUPDATE;

export const isSigmaEventWorkbookChartError = (
  eventData: unknown,
): eventData is SigmaEventWorkbookChartError =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_CHART_ERROR;

export const isSigmaEventWorkbookChartOnvalueselect = (
  eventData: unknown,
): eventData is SigmaEventWorkbookChartOnvalueselect =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_CHART_ONVALUESELECT;

export const isSigmaEventWorkbookDataloaded = (
  eventData: unknown,
): eventData is SigmaEventWorkbookDataloaded =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_DATALOADED;

export const isSigmaEventWorkbookError = (
  eventData: unknown,
): eventData is SigmaEventWorkbookError =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_ERROR;

export const isSigmaEventWorkbookExploreKeyOnchange = (
  eventData: unknown,
): eventData is SigmaEventWorkbookExploreKeyOnchange =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_EXPLOREKEY_ONCHANGE;

export const isSigmaEventWorkbookFullscreenOnchange = (
  eventData: unknown,
): eventData is SigmaEventWorkbookFullscreenOnchange =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_FULLSCREEN_ONCHANGE;

export const isSigmaEventWorkbookIdOnchange = (
  eventData: unknown,
): eventData is SigmaEventWorkbookIdOnchange =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_ID_ONCHANGE;

export const isSigmaEventWorkbookLoaded = (
  eventData: unknown,
): eventData is SigmaEventWorkbookLoaded =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_LOADED;

export const isSigmaEventWorkbookOndelete = (
  eventData: unknown,
): eventData is SigmaEventWorkbookOndelete =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_ONDELETE;

export const isSigmaEventWorkbookPageheightOnchange = (
  eventData: unknown,
): eventData is SigmaEventWorkbookPageheightOnchange =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_PAGEHEIGHT_ONCHANGE;

export const isSigmaEventWorkbookPivottableOncellselect = (
  eventData: unknown,
): eventData is SigmaEventWorkbookPivottableOncellselect =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_PIVOTTABLE_ONCELLSELECT;

export const isSigmaEventWorkbookPublished = (
  eventData: unknown,
): eventData is SigmaEventWorkbookPublished =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_PUBLISHED;

export const isSigmaEventWorkbookSaveas = (
  eventData: unknown,
): eventData is SigmaEventWorkbookSaveas =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_SAVEAS;

export const isSigmaEventWorkbookTableOncellselect = (
  eventData: unknown,
): eventData is SigmaEventWorkbookTableOncellselect =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_TABLE_ONCELLSELECT;

export const isSigmaEventWorkbookVariablesOnchange = (
  eventData: unknown,
): eventData is SigmaEventWorkbookVariablesOnchange =>
  isCleanEventData(eventData) &&
  eventData.type === SIGMA_OUTBOUND_EVENTS.WORKBOOK_VARIABLES_ONCHANGE;
