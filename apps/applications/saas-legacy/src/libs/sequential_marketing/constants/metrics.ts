// ========== SIZES FOR WORKFLOW METRICS ==========

import type {
  CadenceGlobalMetrics,
  CadenceMembersInData,
  CadenceMembersOutData,
  MetricsPaginatedResponse,
} from '../types';

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
  MEMBER_TABLE_SEARCH_HEIGHT = '39px',
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
  INVALID = 'invalid',
}

export const CADENCE_METRICS_LIST_PAGINATION = 5;

export const INITIAL_GLOBAL_METRICS: CadenceGlobalMetrics = {
  count_members_that_entered: 0,
  success_rate: null,
  average_success_time: null,
  tags_count: 0,
  emails_count: 0,
  sms_count: 0,
  push_notif_count: 0,
};

export const INITIAL_MEMBERS_OUT_DATA: MetricsPaginatedResponse<CadenceMembersOutData> =
  {
    count: 0,
    next_page: 0,
    page_size: CADENCE_METRICS_LIST_PAGINATION,
    page: 1,
    results: [],
  };

export const INITIAL_MEMBERS_IN_DATA: MetricsPaginatedResponse<CadenceMembersInData> =
  {
    count: 0,
    next_page: 0,
    page_size: CADENCE_METRICS_LIST_PAGINATION,
    page: 1,
    results: [],
  };
