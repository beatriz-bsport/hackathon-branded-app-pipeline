// @flow
//

export type MemberMailData = {
  members: Array<number>,
  subject: string,
  body: string,
};

export type EmailContact = {
  date_created: string,
  member: {
    id: number,
    name: string,
  },
  data: {
    body: string,
    subject: string,
    email: string,
    status: number,
    uuid: string,
  },
};

export type MailState = {
  mail: {
    isloading: boolean,
    error: ?Error,
  },
  emailContact: {
    byId: {
      [id: string]: EmailContact,
    },
    allIds: Array<string>,
    loading: boolean,
    error: ?Error,
    page: ?number,
    count: number,
  },
};
