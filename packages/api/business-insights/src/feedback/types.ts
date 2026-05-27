export interface FeedbackCreatePayload {
  value: boolean;
  trace_id?: string | null;
  rationale?: string;
}

export interface FeedbackCreateResponse {
  mlflow_logged: boolean;
  assessment_id: string | null;
}
