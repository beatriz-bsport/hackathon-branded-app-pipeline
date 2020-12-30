// @flow
//

export type MemberRelation = {
  src_member: number,
  dst_member: number,
  src_name: string,
  src_name: string,
  shared_consumer_payment_packs: Array<number>,
};

export type ConsumerPaymentPackLink = {
  id: number,
  is_active: boolean,
  src: number,
  dst: number,
  member_relation: number,
};

export type PrivateConsumerPassLink = {
  id: number,
  is_active: boolean,
  src: number,
  dst: number,
  member_relation: number,
};

export type RelationshipState = {
  member: {
    items: Array<MemberRelation>,
    loading: boolean,
    error: ?Error,
    createOrUpdate: {
      loading: boolean,
      error: ?Error,
    },
  },
  consumer_payment_pack_link: {
    items: Array<ConsumerPaymentPackLink>,
    loading: boolean,
    error: ?Error,
  },
  private_consumer_pass_link: {
    items: Array<PrivateConsumerPassLink>,
    loading: boolean,
    error: ?Error,
  },
};
