export type FetchReportParticipantsListParams = {
  // If not provided, defaults to today's date
  date?: string;
  establishments?: number[];
  establishment__not_in?: number[];
  coaches?: number[];
  coach__not_in?: number[];
  // Group activities IDs
  activity__in?: number[];
  activity__not_in?: number[];
  level_in?: number[];
  level__not_in?: number[];
};
