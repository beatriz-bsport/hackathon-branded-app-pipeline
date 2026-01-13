export type FetchReportParticipantsListParams = {
  // If not provided, defaults to today's date
  date?: string;
  establishments?: number[];
  coaches?: number[];
  // Group activities IDs
  activity__in?: number[];
  level_in?: number[];
};
