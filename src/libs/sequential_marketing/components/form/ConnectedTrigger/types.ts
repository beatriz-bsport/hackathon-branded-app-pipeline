import type { Cadence } from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';
import type {
  EmailTemplate,
  EmailTemplateDetail,
} from '#libs/email-editor/types';

export type BaseFormComponentProps = {
  cadence?: Cadence;
  smartlists: SmartList[];
  tagList: any;
  emailListLoading: boolean;
  emails: Array<EmailTemplate>;
  emailDetailLoading: boolean;
  emailDetails: Array<EmailTemplateDetail>;
  getEmails: () => void;
  getEmailDetail: (id: number) => void;
  initial?: Cadence;
  toExit?: boolean;
  viewMode?: boolean;
};
