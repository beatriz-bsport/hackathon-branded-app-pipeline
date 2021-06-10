import { ErrorAndLoading } from '../types';
import { MemberMinimal } from '../member/types';

export type MemberRelation = {
  src_member: number;
  dst_member: number;
  src_name: string;
  dst_name: string;
  shared_consumer_payment_packs: Array<number>;
};

export type ConsumerPaymentPackLink = {
  id: number;
  is_active: boolean;
  src: number;
  dst: number;
  member_relation: number;
};

export type PrivateConsumerPassLink = {
  id: number;
  is_active: boolean;
  src: number;
  dst: number;
  member_relation: number;
};

export type RelationshipState = {
  member: ErrorAndLoading & {
    items: Array<MemberRelation>;
    createOrUpdate: ErrorAndLoading;
  };
  consumer_payment_pack_link: ErrorAndLoading & {
    items: Array<ConsumerPaymentPackLink>;
  };
  private_consumer_pass_link: ErrorAndLoading & {
    items: Array<PrivateConsumerPassLink>;
  };
  my_related_members: ErrorAndLoading & {
    list: MemberMinimal[];
  };
};
