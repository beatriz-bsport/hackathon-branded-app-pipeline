export enum BroadcastChannelMessageType {
  accessControlMemberVisitCreate = 'ACCESS_CONTROL_MEMBER_VISIT_CREATE',
  accessControlMemberVisitRefresh = 'ACCESS_CONTROL_MEMBER_VISIT_REFRESH',
  accessControlSetEntryStatus = 'ACCESS_CONTROL_SET_ENTRY_STATUS',
}

export type BroadcastChannelMessage<PayloadType = any> = {
  type: BroadcastChannelMessageType;
  payload: PayloadType;
};

export type BroadcastChannelState = {
  // This local id is used to avoid listening to the messages sent by the same page
  senderLocalId: string | null;
};
