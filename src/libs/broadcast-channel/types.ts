export enum BroadcastChannelMessageType {
  accessControlMemberVisitCreate = 'ACCESS_CONTROL_MEMBER_VISIT_CREATE',
  accessControlMemberVisitRefresh = 'ACCESS_CONTROL_MEMBER_VISIT_REFRESH',
  accessControlSetEntryStatus = 'ACCESS_CONTROL_SET_ENTRY_STATUS',
}

export type BroadcastChannelMessage<PayloadType = any> = {
  type: BroadcastChannelMessageType;
  payload: PayloadType;
};
