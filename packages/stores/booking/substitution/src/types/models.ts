/**
 * Model: ReplacementRequest
 * Serializer: ReplacementRequestSerializer
 */
export type SubstitutionRequest = {
  id: number;
  offer: number;
  reason: string;
  coach_answer: number[];
  status: number;
  has_requested_late: boolean;
  closing_date: string;
  company: number;
};
