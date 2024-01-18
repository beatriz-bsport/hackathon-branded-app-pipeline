// ========== SIZES FOR WORKFLOW METRICS ==========

export enum CadenceMetricsSizes {
  ICON_CONTAINER_SIZE = '36px',
  ICON_SIZE = '20px',

  FIGURE_FONT_SIZE = '24px',
  GLOBAL_METRICS_CARD_DESCRIPTION_SIZE = '84px',
  GLOBAL_METRICS_CARD_DESCRIPTION_LETTER_SPACING = '0.4px',

  PROGRESS_BAR_CONTAINER_GAP = '20px',
  DISABLED_PROGRESS_BAR_OPEN_IN_NEW_ICON_WIDTH = '16px',
  PROGRESS_LIST_CONTAINER_BORDER_RADIUS = '8px',

  MEMBER_TABLE_HEADER_HEIGHT = '32px',
}

/** Enumeration representing the status of a cadence.
 *
 * Possible values:
 * - ACTIVE: is currently active.
 * - PAUSED: is currently paused (is not active).
 * - NOT_LAUNCHED: has never been launched yet (is paused and has never been executed).
 */
export enum CadenceStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  NOT_LAUNCHED = 'not_launched',
}

export const CADENCE_METRICS_LIST_PAGINATION = 5;
