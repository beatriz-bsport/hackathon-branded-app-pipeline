export const ActiveTrialStatusId = {
  PURCHASED: 0,
  BOOKED: 1,
  ATTENDED: 2,
} as const;

export type ActiveTrialStatusId =
  (typeof ActiveTrialStatusId)[keyof typeof ActiveTrialStatusId];

export const ActiveTrialStatus = {
  PURCHASED: "purchased",
  BOOKED: "booked",
  ATTENDED: "attended",
} as const;

export type ActiveTrialStatus =
  (typeof ActiveTrialStatus)[keyof typeof ActiveTrialStatus];

export const ACTIVE_TRIAL_STATUS_BY_ID = {
  [ActiveTrialStatusId.PURCHASED]: ActiveTrialStatus.PURCHASED,
  [ActiveTrialStatusId.BOOKED]: ActiveTrialStatus.BOOKED,
  [ActiveTrialStatusId.ATTENDED]: ActiveTrialStatus.ATTENDED,
} as const satisfies Record<ActiveTrialStatusId, ActiveTrialStatus>;

export const CustomerLifecycleStateId = {
  LEAD: 1,
  ACTIVE: 2,
  CHURNED: 3,
  INACTIVE: 4,
  ARCHIVED: 5,
} as const;

export type CustomerLifecycleStateId =
  (typeof CustomerLifecycleStateId)[keyof typeof CustomerLifecycleStateId];

export const CustomerLifecycleState = {
  LEAD: "lead",
  ACTIVE: "active",
  CHURNED: "churned",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
} as const;

export type CustomerLifecycleState =
  (typeof CustomerLifecycleState)[keyof typeof CustomerLifecycleState];

export const CUSTOMER_LIFECYCLE_STATE_BY_ID = {
  [CustomerLifecycleStateId.LEAD]: CustomerLifecycleState.LEAD,
  [CustomerLifecycleStateId.ACTIVE]: CustomerLifecycleState.ACTIVE,
  [CustomerLifecycleStateId.CHURNED]: CustomerLifecycleState.CHURNED,
  [CustomerLifecycleStateId.INACTIVE]: CustomerLifecycleState.INACTIVE,
  [CustomerLifecycleStateId.ARCHIVED]: CustomerLifecycleState.ARCHIVED,
} as const satisfies Record<CustomerLifecycleStateId, CustomerLifecycleState>;
