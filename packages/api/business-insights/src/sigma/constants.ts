export const DEFAULT_SIGMA_LANGUAGE = "en";

const SIGMA_LANGUAGE_NL = "nl-nl";

export const SUPPORTED_SIGMA_LOCALES: ReadonlySet<string> = new Set([
  DEFAULT_SIGMA_LANGUAGE,
  SIGMA_LANGUAGE_NL,
  "fr", // fr-fr isn't supported
  "fr-ca",
  "es",
  "de",
  "it",
  "pt",
  "ru",
  "th",
  "ja",
  "pl",
]);

export const DEFAULT_SIGMA_LOCALE_BY_LANGUAGE: ReadonlyMap<string, string> =
  new Map([["nl", SIGMA_LANGUAGE_NL]]);

/**
 * Outbound events are sent from Sigma to our host.
 * @link https://help.sigmacomputing.com/docs/outbound-event-reference
 */
export const SIGMA_OUTBOUND_EVENTS = {
  // When a Generate iframe event workbook action is triggered
  ACTION_OUTBOUND: "action:outbound",
  // When there is no data in a table, pivot table, or chart in a workbook, report, or data model.
  DOCUMENT_ELEMENT_NODATA: "document:element:nodata",
  // When the URL path changes, but not when URL search parameters change.
  URL_ONCHANGE: "url:onchange",
  // When a user selects or deselects a bookmark.
  WORKBOOK_BOOKMARK_ONCHANGE: "workbook:bookmark:onchange",
  // When an embed user creates a bookmark using the embed UI.
  WORKBOOK_BOOKMARK_ONCREATE: "workbook:bookmark:oncreate",
  // When an embed user deletes a bookmark using the embed UI.
  WORKBOOK_BOOKMARK_ONDELETE: "workbook:bookmark:ondelete",
  // When an embed user updates a bookmark using the embed UI.
  WORKBOOK_BOOKMARK_ONUPDATE: "workbook:bookmark:onupdate",
  // When a chart produces an error.
  WORKBOOK_CHART_ERROR: "workbook:chart:error",
  // When user interactions with embedded visualization elements.
  WORKBOOK_CHART_ONVALUESELECT: "workbook:chart:onvalueselect",
  // When a workbook finishes loading its data.
  WORKBOOK_DATALOADED: "workbook:dataloaded",
  // When a workbook produces an error.
  WORKBOOK_ERROR: "workbook:error",
  // When a new exploration is created on an embed.
  WORKBOOK_EXPLOREKEY_ONCHANGE: "workbook:exploreKey:onchange",
  // When the user minimizes or maximizes an element.
  WORKBOOK_FULLSCREEN_ONCHANGE: "workbook:fullscreen:onchange",
  // When the ID of the displayed workbook changes.
  WORKBOOK_ID_ONCHANGE: "workbook:id:onchange",
  // When a workbook's metadata has loaded, but the elements haven't been evaluated.
  WORKBOOK_LOADED: "workbook:loaded",
  // When a user clicks Delete in the embed menu and a workbook is successfully deleted.
  WORKBOOK_ONDELETE: "workbook:ondelete",
  // Communicates the document height to the parent whenever it changes.
  WORKBOOK_PAGEHEIGHT_ONCHANGE: "workbook:pageheight:onchange",
  // When a user selects a cell or multiple cells in an embedded pivot table.
  WORKBOOK_PIVOTTABLE_ONCELLSELECT: "workbook:pivottable:oncellselect",
  // When a user saves and publishes a workbook in secure embeds.
  WORKBOOK_PUBLISHED: "workbook:published",
  // When a user successfully saves a workbook using the Save as option on the embed menu of the workbook.
  WORKBOOK_SAVEAS: "workbook:saveas",
  // When a user selects a cell or multiple cells in an embedded table.
  WORKBOOK_TABLE_ONCELLSELECT: "workbook:table:oncellselect",
  // When a user- or system-initiated update is applied to a control element within the embedded Sigma content.
  WORKBOOK_VARIABLES_ONCHANGE: "workbook:variables:onchange",
} as const;
