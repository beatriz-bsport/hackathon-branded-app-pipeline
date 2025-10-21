export type FetchSubstitutionRequestsParams = {
  /** Ordering of results on offer_date_start, e.g. `offer__date_start` or `-offer__date_start`. */
  ordering?: string;

  /** Filter by teacher ID. */
  coach?: number;

  /** Filter by a list of teacher IDs. */
  coach__in?: number[];

  /** Filter by company ID (linked to offer’s activity company). */
  company?: number;

  /** Filter by a list of establishment IDs. */
  establishment__in?: number[];

  /** Filter by a list of establishment group IDs. */
  establishment_group__in?: number[];

  /** Filter by a list of category IDs (activity__SCT_id). */
  category__in?: number[];

  /** Filter by a list of meta activity IDs. */
  meta_activity__in?: number[];

  /** Filter offers with a start date greater than or equal to this date (YYYY-MM-DD). */
  offer__date_start__gte?: string;

  /** Filter offers with a start date less than or equal to this date (YYYY-MM-DD). */
  offer__date_start__lte?: string;

  /**
   * If true, return only substitution requests belonging to the current teacher.
   * If false, exclude those belonging to the current teacher.
   */
  me?: boolean;

  /** Filter by substitution request status ID. */
  status?: number;

  /** Filter by a list of status IDs. */
  status__in?: number[];

  /** Filter by a specific ID. WARNING: Not a real "in lookup" */
  offer__in?: number;

  /** Whether the substitution request was submitted late. */
  has_requested_late?: boolean;

  /**
   * If true, returns only substitution requests whose closing date has passed.
   * If false, returns only those whose closing date is still in the future.
   */
  closing_date_exceeded?: boolean;

  /**
   * If true, return requests for offers in the past.
   * If false, return requests for offers in the future.
   */
  offer_is_in_the_past?: boolean;

  /** Whether the related offer is currently available. */
  offer_available?: boolean;

  /** Number of items per page (for pagination). */
  page_size?: number;

  /** Page number of the results (for pagination). */
  page?: number;
};
