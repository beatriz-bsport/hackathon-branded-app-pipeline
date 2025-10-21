export type TableRowData = {
  id: number;
  activityName: string;
  activityDate: string;
  teacherName: string;
  teacherSubstituteName?: string;
  teacherSubstituteRequired: boolean;
  fillRate: number;
  emptySpotsCount: number;
  hasWaitingList: boolean;
  waitingListCount: number;
};
