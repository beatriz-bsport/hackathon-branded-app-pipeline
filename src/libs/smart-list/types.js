// @flow

export type SmartList = {
  id: number,
  company: number,
  name: string,
  description: string,
  members: Array<Member>,
};

export type smart_list_state = {
  byId: Array<any, SmartList>,
  allIds: Array<number>,
  isLoading: boolean,
  error: ?Error,
};
