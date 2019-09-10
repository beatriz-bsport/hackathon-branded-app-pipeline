// @flow

export type MailState = {
  members: {
    createOrUpdate: {
      success: boolean,
      isloading: boolean,
      error: ?Error,
    },
  },
};
