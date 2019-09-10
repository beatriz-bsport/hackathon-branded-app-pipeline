// @flow
//

export type MemberMailData = {
  members: Array<number>,
  subject: string,
  body: string,
};

export type MailState = {
  mail: {
    success: boolean,
    isloading: boolean,
    error: ?Error,
  },
};
