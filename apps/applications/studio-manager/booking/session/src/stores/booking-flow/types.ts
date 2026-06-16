export type DiscountState = {
  enabled: boolean;
  type: "percentage" | "amount";
  value: number;
  reason: string;
};

export interface BookingFlowState {
  memberId: number | null;
  consumerPaymentPackId: number | null;
  paymentPackId: number | null;
  sessionIds: number[];
  spotIndex: number | null;
  keepCredits: boolean;
  notifyMember: boolean;
  discount: DiscountState | null;
  billingGroupId: number | null;
}
