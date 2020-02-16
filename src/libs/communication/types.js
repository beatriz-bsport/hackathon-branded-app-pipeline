// @flow
//

export type MemberMailData = {
  members: Array<number>,
  subject: string,
  body: string,
};

export type Recipient = {
  member: number,
  email_sent: number,
  campaign: string,
  read_count: number,
  last_read: ?string,
  links_opened: string,
  links_opened_count: number,
  status: number,
  spam_report: boolean,
  email: string,
  id: number,
};

export type Campaign = {
  uuid: string,
  data: {
    subject: string,
    body: string,
    uuid: string,
    recipient_list: Array<[number, string, string]>,
    tags_groups: Array<{ [string]: string }>,
  },
  total_recipients: number,
  date_created: string,
  total_read: number,
  total_click: number,
};

export type Report = {
  delivery_count: number,
  last_open: ?string,
  top_links: { [link: string]: number },
};

export type MailState = {
  recipient: {
    isloading: boolean,
    error: ?Error,
    byId: { [id: number]: Recipient },
    bulk: {
      loading: boolean,
      error: ?Error,
    },
    byCampaign: {
      allIds: Array<number>,
      loading: boolean,
      error: ?Error,
      page: ?number,
      count: number,
    },
  },
  campaign: {
    byId: { [uuid: string]: Campaign },
    report: {
      data: ?Report,
      loading: boolean,
      error: ?Error,
    },
    bySmartlist: {
      allIds: Array<string>,
      loading: boolean,
      error: ?Error,
      page: ?number,
      next_page: ?number,
      count: number,
    },
    byMember: {
      allIds: Array<string>,
      loading: boolean,
      error: ?Error,
      page: ?number,
      next_page: ?number,
      count: number,
    },
  },
};
