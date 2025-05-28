export type CadenceStatus = "active" | "paused" | "not_launched";

export type DestinationKind =
  | "step_to_outside"
  | "step_to_step"
  | "outside_to_step"
  | "cadence_to_outside";

export type DestinationStatus = "WIN" | "FAIL" | "NEUTRAL";

export type TriggerIdentifier = "empty" | "timeout" | "event";

export type ConnectedTriggerDict = {
  disabled?: boolean;
  trigger_config: {
    identifier: TriggerIdentifier;
    timeout?: number;
    [key: string]: unknown;
  };
  destination_config: {
    kind: DestinationKind;
    status: DestinationStatus;
    source_id?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type TrackingData = {
  member_pks_in: number[];
  by_member: Record<string, unknown>;
  [key: string]: unknown;
};

export type TrackingDataHistory = {
  date: number;
  tracking_data: TrackingData;
  [key: string]: unknown;
};

export type Cadence = {
  id: number;
  company_id: number;
  name: string;
  active: boolean;
  archived: boolean;
  date_created: string;
  date_updated: string;
  initialized: boolean;
  entries: ConnectedTriggerDict[];
  cadence_exits: ConnectedTriggerDict[];
  are_marketing_actions_disabled: boolean;
  cadence_status: CadenceStatus;
  tracking_data: TrackingData;
  tracking_data_history: TrackingDataHistory[];
  is_multiple_visit_allowed: boolean;
  is_tracking_data_stored_in_dynamo: boolean;
  priority_index: number;
};
