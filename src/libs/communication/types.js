// @flow
//

export type MemberMailData = {
  members: Array<number>,
  subject: string,
  body: string,
};

export type MailState = {
  members: {
    createOrUpdate: {
      success: boolean,
      isloading: boolean,
      error: ?Error,
    },
  },
};
