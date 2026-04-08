export type ConsumerPaymentPackLink = {
  id: number;
  is_active: boolean;
  src: number;
  dst: number;
  member_relation: number;
};

export type FetchConsumerPaymentPackLinksParams = {
  member_relation?: number;
  is_active?: boolean;
  id__in?: number[];
};
