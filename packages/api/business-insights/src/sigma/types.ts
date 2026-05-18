import { SIGMA_OUTBOUND_EVENTS } from "./constants";

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#actionoutbound
 */
export type SigmaEventActionOutbound = {
  type: typeof SIGMA_OUTBOUND_EVENTS.ACTION_OUTBOUND;
  name: string;
  values: Record<string, unknown>;
};

/**
 * Narrowed type for the `create-summary` outbound action.
 * Sigma button must emit `action:outbound` with name=`create-summary` and
 * values containing `page-id`.
 */
export type SigmaEventCreateSummary = SigmaEventActionOutbound & {
  name: "create-summary";
  values: {
    "page-id"?: string;
    "documentation-url"?: string;
  };
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#documentelementnodata
 */
export type SigmaEventDocumentElementNodata = {
  type: typeof SIGMA_OUTBOUND_EVENTS.DOCUMENT_ELEMENT_NODATA;
  elementId: string;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#urlonchange
 */
export type SigmaEventUrlOnchange = {
  type: typeof SIGMA_OUTBOUND_EVENTS.URL_ONCHANGE;
  url: string;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookbookmarkonchange
 */
export type SigmaEventWorkbookBookmarkOnchange = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_BOOKMARK_ONCHANGE;
  bookmarkName: string;
  workbookId: string;
  versionTagName: string | null;
  bookmarkId: string;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookbookmarkoncreate
 */
export type SigmaEventWorkbookBookmarkOncreate = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_BOOKMARK_ONCREATE;
  bookmarkName: string;
  workbookId: string;
  versionTagName: string | null;
  bookmarkId: string;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookbookmarkondelete
 */
export type SigmaEventWorkbookBookmarkOndelete = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_BOOKMARK_ONDELETE;
  bookmarkName: string;
  workbookId: string;
  versionTagName: string | null;
  bookmarkId: string;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookbookmarkonupdate
 */
export type SigmaEventWorkbookBookmarkOnupdate = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_BOOKMARK_ONUPDATE;
  workbookId: string;
  versionTagName: string | null;
  bookmarkId: string;
  bookmarkName?: string;
  isShared?: boolean;
  isDefault?: boolean;
};

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
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookchartonvalueselect
 */
export type SigmaEventWorkbookChartOnvalueselect = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_CHART_ONVALUESELECT;
  nodeId: string;
  title: string;
  values: Record<string, unknown>;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookdataloaded
 */
export type SigmaEventWorkbookDataloaded = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_DATALOADED;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookerror
 */
export type SigmaEventWorkbookError = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_ERROR;
  message: string | undefined;
  code: string;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookexplorekeyonchange
 */
export type SigmaEventWorkbookExploreKeyOnchange = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_EXPLOREKEY_ONCHANGE;
  exploreKey: string;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookfullscreenonchange
 */
export type SigmaEventWorkbookFullscreenOnchange = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_FULLSCREEN_ONCHANGE;
  fullScreen: boolean;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookidonchange
 */
export type SigmaEventWorkbookIdOnchange = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_ID_ONCHANGE;
  id: string;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookloaded
 */
export type SigmaEventWorkbookLoaded = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_LOADED;
  workbook: {
    variables: Record<string, unknown>;
  };
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookondelete
 */
export type SigmaEventWorkbookOndelete = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_ONDELETE;
  id: string;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookpageheightonchange
 */
export type SigmaEventWorkbookPageheightOnchange = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_PAGEHEIGHT_ONCHANGE;
  pageHeight: number;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookpivottableoncellselect
 */
export type SigmaEventWorkbookPivottableOncellselect = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_PIVOTTABLE_ONCELLSELECT;
  nodeId: string;
  title: string;
  cells: Array<{
    type: string;
    value: unknown;
    columnName: string;
  }>;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookpublished
 */
export type SigmaEventWorkbookPublished = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_PUBLISHED;
  workbookId: string;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbooksaveas
 */
export type SigmaEventWorkbookSaveas = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_SAVEAS;
  workbookId: string;
  saveWorkbookId: string;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbooktableoncellselect
 */
export type SigmaEventWorkbookTableOncellselect = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_TABLE_ONCELLSELECT;
  nodeId: string;
  title: string;
  cells: Array<{
    type: string;
    value: unknown;
    columnName: string;
    underlyingData?: Array<Record<string, unknown>>;
  }>;
};

/**
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference#workbookvariablesonchange
 */
export type SigmaEventWorkbookVariablesOnchange = {
  type: typeof SIGMA_OUTBOUND_EVENTS.WORKBOOK_VARIABLES_ONCHANGE;
  workbook: {
    variables: Record<string, string>;
  };
};

export type SigmaEventData =
  | SigmaEventActionOutbound
  | SigmaEventDocumentElementNodata
  | SigmaEventUrlOnchange
  | SigmaEventWorkbookBookmarkOnchange
  | SigmaEventWorkbookBookmarkOncreate
  | SigmaEventWorkbookBookmarkOndelete
  | SigmaEventWorkbookBookmarkOnupdate
  | SigmaEventWorkbookChartError
  | SigmaEventWorkbookChartOnvalueselect
  | SigmaEventWorkbookDataloaded
  | SigmaEventWorkbookError
  | SigmaEventWorkbookExploreKeyOnchange
  | SigmaEventWorkbookFullscreenOnchange
  | SigmaEventWorkbookIdOnchange
  | SigmaEventWorkbookLoaded
  | SigmaEventWorkbookOndelete
  | SigmaEventWorkbookPageheightOnchange
  | SigmaEventWorkbookPivottableOncellselect
  | SigmaEventWorkbookPublished
  | SigmaEventWorkbookSaveas
  | SigmaEventWorkbookTableOncellselect
  | SigmaEventWorkbookVariablesOnchange;
