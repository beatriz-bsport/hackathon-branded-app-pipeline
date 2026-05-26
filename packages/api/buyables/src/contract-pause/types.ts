// #region Models

export type ContractPauseInfo = {
  invalid_for_pause: number[];
  valid_for_pause: number[];
};

export type ContractPause = {
  id: number;
  from_date: string;
  until_date: string;
  days: number;
  name: string;
  contract: number;
  processing: boolean;
  billing_plan_errors: number[];
  billing_plan_success: number[];
  billing_plan_impossible: number[];
  date_created: string;
  creator_staff_name: string;
};

// #endregion

// ----------------------------------------------------------------------------

// #region Params

export type FetchContractPauseInfoParams = {
  contract: number;
  from_date: string;
  until_date: string;
  contract_pause?: number;
};

export type CreateContractPauseParams = {
  contract: number;
  days: number;
  from_date: string;
  until_date: string;
  name?: string;
  action_pack_kind?: number;
};

export type UpdateContractPauseParams = CreateContractPauseParams & {
  contract_pause_id?: number;
};

// #endregion
