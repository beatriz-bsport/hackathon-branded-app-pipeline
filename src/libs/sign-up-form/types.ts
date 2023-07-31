export type PollField = {
  field_identifier: string;
  is_always_required: boolean;
  is_always_shown: boolean;
  show_on_creation: boolean;
  mandatory_on_creation: boolean;
  show_on_edition: boolean;
  editable_on_edition: boolean;
  label: string | null;
};

export type SignUpFormConfig = {
  id: number;
  company: number;
  poll_fields: Array<PollField>;
};
export type SignUpFormConfigDict = {
  id: number;
  company: number;
  poll_fields: { [key: string]: PollField };
};
export type PollState = {
  signUpForm: {
    config: object;
    loading: boolean;
    error: object | null;
  };
  upsert: {
    loading: boolean;
    error: object | null;
  };
  loading: boolean;
  error: object | null;
};
