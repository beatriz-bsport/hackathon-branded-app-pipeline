// @flow

export type TempPasswordState = {
  password: ?string,
  expiration_date: ?string,
  error: ?Error,
  loading: boolean,
};

export type LoginState = {
  tempPassword: TempPasswordState,
};
