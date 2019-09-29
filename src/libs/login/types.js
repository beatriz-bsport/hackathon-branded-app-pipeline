// @flow

export type LoginState = {
  tempPassword: {
    password: ?string,
    expiration_date: ?string,
    error: ?Error,
    loading: boolean,
  },
};
