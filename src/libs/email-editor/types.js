// @flow

export type EmailTemplate = {
  id: number,
  company: number,
  name: string,
  html: string,
  design: any,
};

export type email_template_state = {
  byId: Array<any, emailDesign>,
  allIds: Array<number>,
  isLoading: boolean,
  error: ?Error,
};
