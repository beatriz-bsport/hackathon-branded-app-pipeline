// @flow

export type Task = {
  member: Member,
  task_owners: Array<User>,
  name: string,
  description: string,
  status: number,
  date_due: string,
  author: User,
  id: number,
};

export type TaskData = {
  member_id?: number,
  task_owner_ids: Array<number>,
  name: string,
  description: string,
  status: number,
  date_due: string,
  id?: number,
};

export type ReminderState = {
  task: {
    byId: { [number]: Task },
    byMember: {
      allIds: Array<number>,
      loading: boolean,
      error: ?Error,
    },
    createOrUpdate: {
      loading: boolean,
      error: ?Error,
    },
  },
};
