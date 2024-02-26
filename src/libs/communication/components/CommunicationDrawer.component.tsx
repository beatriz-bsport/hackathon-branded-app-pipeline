import React, { Component } from 'react';
import moment, { Moment } from 'moment-timezone';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Collapse from '@material-ui/core/Collapse';
import Radio from '@material-ui/core/Radio';
import RepeatIcon from '@material-ui/icons/Repeat';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import TimePicker from 'material-ui-pickers/TimePicker';

import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
} from '@bsport/common/lib/master-data/communication-kind';

import Config from '../../../config';

import DatePickerSelector, {
  Values as DatePickerSelectorValues,
} from '#components/date/DatePickerSelector.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';

// @ts-expect-error
import ReceiversCollapseItem from './ReceiversCollapseItem.component';
// @ts-expect-error
import SelectTemplate from './SelectTemplate.component';
// @ts-expect-error
import WriteEmail from './WriteEmail.component';
// @ts-expect-error
import WriteSMS from './WriteSMS.component';
import WriteNotification from './WriteNotification.component';
// @ts-expect-error
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
import CommunicationSMSCostReminderModal from '#libs/communication-v2/CommunicationSMSCostReminderModal.component';
import {
  MAX_LENGTH_PUSH_TITLE,
  MAX_LENGTH_PUSH_CONTENT,
} from '#libs/communication/constants';
import {
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  UPSELL_IDENTIFIER_SMS,
} from '#libs/platform-billing/upsell-identifiers';
import { isAmPmTimeFormat } from '#utils/datetime';
import { hasUpsell } from '#libs/platform-billing/utils';

import type { MemberMailData } from '#libs/communication/types';
import type { Member } from '#libs/member/types';
import type { FeatureList } from '#libs/company/types';
import type { DateFilterEnum } from '#libs/datatype-filtering/types';
import type {
  CommunicationScheduled,
  CommunicationScheduledCreate,
} from '#libs/communication-v2/types';

import type { OptionCallback } from '../../../state/types';
import type { ResolvedGenericTags } from '#libs/email-editor/types';

const WRITE_EMAIL = 0;
const SELECT_EMAIL = 1;
const SEND_SMS = 2;
const SEND_PUSH_NOTIFICATION = 3;

const COMPANY_ALLOWED_TO_SEND_SMARTLIST_COMMUNICATION_WITH_DB_ERROR = [
  1149, 1150, 1148, 1151, 1147, 1146, 1860, 1557, 1861, 1152, 1145, 1144, 1143,
  1155, 1142, 1141, 1153, 1399, 1140, 1139, 1138, 1136, 1134, 1154, 1135,
];
type Props = {
  actionType: number;
  classes: Object;
  communicationScheduledToEdit?: CommunicationScheduled;
  companyId?: number;
  countTotal: number | null;
  countWithEmail: number | null;
  countWithPhone: number | null;
  editScheduledMessage?: (
    data: CommunicationScheduled,
    options?: OptionCallback,
  ) => void;
  emailDetailLoading: boolean;
  emailDetails: Array<any>;
  emailListLoading: boolean;
  emails: Array<any>;
  fetchNextPage?: (page: number, page_size: number) => void;
  fetchPreviousPage?: (page: number, page_size: number) => void;
  getEmailDetail: (id: number) => void;
  getEmails: () => void;
  hideAutoResend?: boolean;
  hideMemberList?: boolean;
  hideTemplateMail: boolean;
  hideWrittenMail: boolean;
  hoursToSend?: { min: number; max: number };
  mailDefaultTitle?: string;
  membersAllLoading: boolean;
  membersByPageLoading: boolean;
  membersToDisplay: Array<Member>;
  memberToDisplayError?: Error | null;
  onCancel: () => void;
  open: boolean;
  page_size: number;
  page: number;
  receiversNotEditable: boolean;
  resolvedGenericTags: ResolvedGenericTags;
  schedule?: (data: Omit<CommunicationScheduledCreate, 'smartlist'>) => void;
  send?: (data: MemberMailData) => void;
  sendNow?: (id: number) => void;
  showEmailConsentWarning?: boolean;
  showSmsConsentWarning?: boolean;
  timezone: string;
} & WithTranslation &
  WithStyles;

type State = {
  actionType: number;
  communicationScheduledDate: string | null;
  communicationScheduledTimePeriod: DateFilterEnum;
  isCommunicationScheduled: boolean;
  isSmsCostReminderModalOpen: boolean;
  mailContent: string;
  mailTitle: string | null;
  notificationContent: string;
  notificationTitle: string;
  openCommunicationSchedulingSection: boolean;
  openRefreshDialog: boolean;
  openResendSection: boolean;
  page_size: number;
  resendCount: number;
  resendDelay: number;
  selectedTemplate: null;
  smsContent: string;
  unCheckedMembers: {
    phone: Array<number>;
    email: Array<number>;
    notification: Array<number>;
  };
};
const MEMBER_PAGE_SIZE = 5;

const getCorrespondingActionType = (kind: number, has_design: boolean) => {
  switch (kind) {
    case COMMUNICATION_KIND_EMAIL:
      if (has_design) return SELECT_EMAIL;
      return WRITE_EMAIL;
    case COMMUNICATION_KIND_SMS:
      return SEND_SMS;
    case COMMUNICATION_KIND_PUSH_NOTIFICATION:
      return SEND_PUSH_NOTIFICATION;
    default:
      return SELECT_EMAIL;
  }
};

export class CommunicationDrawer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      actionType: props.actionType ? props.actionType : SELECT_EMAIL,
      communicationScheduledDate: this.getScheduledDate(),
      communicationScheduledTimePeriod: 'custom',
      isCommunicationScheduled: false,
      isSmsCostReminderModalOpen: false,
      mailContent: '',
      mailTitle: props.mailDefaultTitle || null,
      notificationContent: '',
      notificationTitle: '',
      openCommunicationSchedulingSection: false,
      openRefreshDialog: false,
      openResendSection: false,
      page_size: props.page_size || MEMBER_PAGE_SIZE,
      resendCount: 0,
      resendDelay: 0,
      selectedTemplate: null,
      smsContent: '',
      unCheckedMembers: { phone: [], email: [], notification: [] },
    };
  }

  /**
   * Gets the scheduled date by adding one hour to the current time.
   * @returns {Date} The current date with one hour added.
   */
  getScheduledDate = () => {
    const scheduledDate = new Date();
    scheduledDate.setHours(scheduledDate.getHours() + 1);
    return scheduledDate;
  };

  componentDidMount() {
    this.props.getEmails();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.open === true && prevProps.open === false) {
      this.setState({
        communicationScheduledDate: this.getScheduledDate(),
      });
    }
    if (prevProps.mailDefaultTitle !== this.props.mailDefaultTitle) {
      // eslint-disable-next-line
      this.setState({
        mailContent: '',
        mailTitle: this.props.mailDefaultTitle,
      });
    }
    if (
      this.props.communicationScheduledToEdit &&
      this.props.communicationScheduledToEdit !==
        prevProps.communicationScheduledToEdit
    ) {
      this.updateStateIfCommunicationEdition();
    }
  }

  getInputChangeHandler =
    (inputName: string, minValue: number, maxValue: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let sanitizedValue = event.target.value;
      if (Number.isNaN(parseInt(sanitizedValue))) sanitizedValue = 0;
      sanitizedValue = Math.max(minValue, sanitizedValue);
      sanitizedValue = Math.min(maxValue, sanitizedValue);

      this.setState({ [inputName]: sanitizedValue });
    };

  handleToggle = (_value: string) => () => {
    const value = parseInt(_value, 10);
    this.setState((prevState) => {
      if ([SELECT_EMAIL, WRITE_EMAIL].includes(prevState.actionType)) {
        const newList = prevState.unCheckedMembers.email.includes(value)
          ? prevState.unCheckedMembers.email.filter((i) => i !== value)
          : [value, ...prevState.unCheckedMembers.email];
        return {
          ...prevState,
          unCheckedMembers: { ...prevState.unCheckedMembers, email: newList },
        };
      }
      if (SEND_SMS === prevState.actionType) {
        const newList = prevState.unCheckedMembers.phone.includes(value)
          ? prevState.unCheckedMembers.phone.filter((i) => i !== value)
          : [value, ...prevState.unCheckedMembers.phone];
        return {
          ...prevState,
          unCheckedMembers: { ...prevState.unCheckedMembers, phone: newList },
        };
      }
      if (SEND_PUSH_NOTIFICATION === prevState.actionType) {
        const newList = prevState.unCheckedMembers.notification.includes(value)
          ? prevState.unCheckedMembers.notification.filter((i) => i !== value)
          : [value, ...prevState.unCheckedMembers.notification];
        return {
          ...prevState,
          unCheckedMembers: {
            ...prevState.unCheckedMembers,
            notification: newList,
          },
        };
      }
      return prevState;
    });
  };

  handleCostReminderModalOnClose = () =>
    this.setState({ isSmsCostReminderModalOpen: false });

  handleSmsSendingOnClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    if (this.state.isCommunicationScheduled) {
      if (this.props.communicationScheduledToEdit) {
        this.props.editScheduledMessage({
          ...this.props.communicationScheduledToEdit,
          text: this.state.smsContent,
          title: '',
          email_design: null,
          communication_kind: COMMUNICATION_KIND_SMS,
          datetime_scheduled: this.state.communicationScheduledDate,
        });
      } else {
        this.props.schedule({
          text: this.state.smsContent,
          communication_kind: COMMUNICATION_KIND_SMS,
          datetime_scheduled: this.state.communicationScheduledDate,
        });
      }
    } else if (this.props.communicationScheduledToEdit) {
      const communicationScheduledId =
        this.props.communicationScheduledToEdit.id;
      this.props.editScheduledMessage(
        {
          ...this.props.communicationScheduledToEdit,
          text: this.state.smsContent,
          title: '',
          email_design: null,
          communication_kind: COMMUNICATION_KIND_SMS,
          datetime_scheduled: this.state.communicationScheduledDate,
        },
        {
          onSuccess: () => this.props.sendNow(communicationScheduledId),
        },
      );
    } else {
      this.props.send({
        member_blacklist: this.state.unCheckedMembers.email,
        sms: this.state.smsContent,
      });
    }
    this.onClose();
    this.props.onCancel();
  };

  renderCommunicationTypeChoice = () => {
    const { classes, t } = this.props;
    return (
      <div className={classes.radioContainer}>
        {!this.props.hideWrittenMail && (
          <FormControlLabel
            classes={{ label: classes.center }}
            control={
              <Radio
                checked={this.state.actionType === WRITE_EMAIL}
                onChange={() =>
                  this.setState({
                    actionType: WRITE_EMAIL,
                    mailTitle: this.props.mailDefaultTitle || '',
                  })
                }
              />
            }
            label={t('mail.writeMail')}
            labelPlacement="bottom"
          />
        )}
        {!this.props.hideTemplateMail && (
          <FormControlLabel
            classes={{ label: classes.center }}
            control={
              <Radio
                checked={this.state.actionType === SELECT_EMAIL}
                onChange={() =>
                  this.setState((prevState) => ({
                    actionType: SELECT_EMAIL,
                    mailTitle: prevState.selectedTemplate
                      ? this.props.emails.find(
                          (email) => email.id === prevState.selectedTemplate,
                        ).subject
                      : this.props.mailDefaultTitle || '',
                  }))
                }
              />
            }
            label={t('mail.selectTemplate')}
            labelPlacement="bottom"
          />
        )}
        <FeatureListProvider>
          {(featureList: FeatureList) => (
            <FormControlLabel
              classes={{ label: classes.center }}
              control={
                <Radio
                  checked={this.state.actionType === SEND_SMS}
                  disabled={!hasUpsell(featureList, UPSELL_IDENTIFIER_SMS)}
                  onChange={() =>
                    this.setState({
                      actionType: SEND_SMS,
                    })
                  }
                />
              }
              label={t('mail.sendSms')}
              labelPlacement="bottom"
            />
          )}
        </FeatureListProvider>
        <FeatureListProvider>
          {(featureList: FeatureList) => (
            <FormControlLabel
              classes={{ label: classes.center }}
              control={
                <Radio
                  checked={this.state.actionType === SEND_PUSH_NOTIFICATION}
                  disabled={
                    Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
                    !hasUpsell(featureList, UPSELL_IDENTIFIER_PUSH_NOTIFICATION)
                  }
                  onChange={() =>
                    this.setState({
                      actionType: SEND_PUSH_NOTIFICATION,
                    })
                  }
                />
              }
              label={t('mail.sendNotification')}
              labelPlacement="bottom"
            />
          )}
        </FeatureListProvider>
      </div>
    );
  };

  renderConsentWarning = () => {
    const { t, classes } = this.props;
    if (
      this.props.showEmailConsentWarning &&
      [WRITE_EMAIL, SELECT_EMAIL].includes(this.state.actionType)
    ) {
      return (
        <div className={classes.emailConsentWarningContainer}>
          <div className={classes.warningParagraph}>
            <Typography variant="caption">
              {t('mail.warningConsent1')}
            </Typography>
          </div>
          <div className={classes.warningParagraph}>
            <Typography variant="caption">
              {t('mail.warningConsent2')}
            </Typography>
          </div>
        </div>
      );
    }
    if (
      this.props.showSmsConsentWarning &&
      this.state.actionType === SEND_SMS
    ) {
      return (
        <div className={classes.emailConsentWarningContainer}>
          <div className={classes.warningParagraph}>
            <Typography variant="caption">
              {t('sms.warningConsent1')}
            </Typography>
          </div>
          <div className={classes.warningParagraph}>
            <Typography variant="caption">
              {t('sms.warningConsent2')}
            </Typography>
          </div>
        </div>
      );
    }
    return null;
  };

  onClose = () => {
    this.setState({
      unCheckedMembers: { phone: [], email: [], notification: [] },
      mailTitle: this.props.mailDefaultTitle || null,
      mailContent: '',
      actionType: this.props.actionType ? this.props.actionType : SELECT_EMAIL,
      selectedTemplate: null,
      smsContent: '',
      notificationTitle: '',
      notificationContent: '',
      isSmsCostReminderModalOpen: false,
    });
  };

  openMemberPage = (event: SyntheticEvent<any>, id: number) => {
    event.preventDefault();
    const url = `/member/edit/${id}`;
    const win = window.open(url);
    win.focus();
    this.setState({ openRefreshDialog: true });
  };

  checkIsMessageSchedulable = () => {
    const communicationScheduledDate = new Date(
      this.state.communicationScheduledDate,
    );

    return communicationScheduledDate > new Date(Date.now() + 5 * 60 * 1000);
  };

  checkIsMessageScheduledDuringNighttime = () => {
    const communicationScheduledHour = new Date(
      this.state.communicationScheduledDate,
    ).getHours();

    if (!!this.props?.hoursToSend?.min && !!this.props?.hoursToSend?.max) {
      return (
        this.props.hoursToSend.min <= communicationScheduledHour &&
        communicationScheduledHour < this.props.hoursToSend.max
      );
    }

    return true;
  };

  checkErrors = () => {
    let resendConfigurationIsValid = true;
    if (this.state.resendCount + this.state.resendDelay > 0) {
      resendConfigurationIsValid =
        this.state.resendCount > 0 && this.state.resendDelay > 0;
    }
    const companyAllowedToSendCommunicationWithError =
      COMPANY_ALLOWED_TO_SEND_SMARTLIST_COMMUNICATION_WITH_DB_ERROR.includes(
        this.props.companyId,
      );

    // TODO : DIRTY HOTFIX TO Be ABLE TO SEND COMMUNICATION EVEN WHEN MEMBER PREVIEW FAILS
    const disregardMemberCount =
      (!!this.props.memberToDisplayError &&
        companyAllowedToSendCommunicationWithError) ||
      this.props.hideMemberList;

    switch (this.state.actionType) {
      case WRITE_EMAIL:
        return (
          !resendConfigurationIsValid ||
          this.state.mailContent === '' ||
          this.state.mailTitle === '' ||
          (!disregardMemberCount &&
            !(
              this.props.countWithEmail >
              (this.state.unCheckedMembers.email?.length || 0)
            ))
        );
      case SEND_SMS:
        return (
          this.state.smsContent === '' ||
          (!disregardMemberCount &&
            !(
              this.props.countWithPhone >
              (this.state.unCheckedMembers.phone?.length || 0)
            ))
        );
      case SELECT_EMAIL:
        return (
          !resendConfigurationIsValid ||
          !this.state.selectedTemplate ||
          this.state.mailTitle === '' ||
          (!disregardMemberCount &&
            !(
              this.props.countWithEmail >
              (this.state.unCheckedMembers.email?.length || 0)
            ))
        );
      case SEND_PUSH_NOTIFICATION:
        if (
          this.state.notificationTitle === '' ||
          this.state.notificationContent === ''
        )
          return true;

        if (
          this.state.notificationTitle?.length > MAX_LENGTH_PUSH_TITLE ||
          this.state.notificationContent?.length > MAX_LENGTH_PUSH_CONTENT
        )
          return true;
        break;
      default:
        break;
    }
    return false;
  };

  onSubmit = (ev) => {
    ev.preventDefault();
    switch (this.state.actionType) {
      case WRITE_EMAIL:
        if (this.state.isCommunicationScheduled) {
          if (this.props.communicationScheduledToEdit) {
            this.props.editScheduledMessage({
              ...this.props.communicationScheduledToEdit,
              email_design: null,
              title: this.state.mailTitle,
              text: this.state.mailContent,
              communication_kind: COMMUNICATION_KIND_EMAIL,
              datetime_scheduled: this.state.communicationScheduledDate,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            });
          } else {
            this.props.schedule({
              title: this.state.mailTitle,
              text: this.state.mailContent,
              communication_kind: COMMUNICATION_KIND_EMAIL,
              datetime_scheduled: this.state.communicationScheduledDate,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            });
          }
        } else if (this.props.communicationScheduledToEdit) {
          const communicationScheduledId =
            this.props.communicationScheduledToEdit.id;
          this.props.editScheduledMessage(
            {
              ...this.props.communicationScheduledToEdit,
              email_design: null,
              title: this.state.mailTitle,
              text: this.state.mailContent,
              communication_kind: COMMUNICATION_KIND_EMAIL,
              datetime_scheduled: this.state.communicationScheduledDate,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            },
            {
              onSuccess: () => this.props.sendNow(communicationScheduledId),
            },
          );
        } else {
          this.props.send({
            member_blacklist: this.state.unCheckedMembers.email,
            subject: this.state.mailTitle,
            body: this.state.mailContent,
            email_resend_count: this.state.resendCount,
            email_resend_delay: this.state.resendDelay,
          });
        }
        this.onClose();
        this.props.onCancel();
        break;
      case SEND_SMS:
        this.setState({ isSmsCostReminderModalOpen: true });
        break;
      case SELECT_EMAIL:
        if (this.state.isCommunicationScheduled) {
          if (this.props.communicationScheduledToEdit) {
            this.props.editScheduledMessage({
              ...this.props.communicationScheduledToEdit,
              title: this.state.mailTitle,
              email_design: this.state.selectedTemplate,
              text: '',
              communication_kind: COMMUNICATION_KIND_EMAIL,
              datetime_scheduled: this.state.communicationScheduledDate,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            });
          } else {
            this.props.schedule({
              title: this.state.mailTitle,
              email_design: this.state.selectedTemplate,
              communication_kind: COMMUNICATION_KIND_EMAIL,
              datetime_scheduled: this.state.communicationScheduledDate,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            });
          }
        } else if (this.props.communicationScheduledToEdit) {
          const communicationScheduledId =
            this.props.communicationScheduledToEdit.id;
          this.props.editScheduledMessage(
            {
              ...this.props.communicationScheduledToEdit,
              title: this.state.mailTitle,
              email_design: this.state.selectedTemplate,
              text: '',
              communication_kind: COMMUNICATION_KIND_EMAIL,
              datetime_scheduled: this.state.communicationScheduledDate,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            },
            {
              onSuccess: () => this.props.sendNow(communicationScheduledId),
            },
          );
        } else {
          this.props.send({
            member_blacklist: this.state.unCheckedMembers.email,
            email_template: this.state.selectedTemplate,
            subject: this.state.mailTitle,
            email_resend_count: this.state.resendCount,
            email_resend_delay: this.state.resendDelay,
          });
        }
        this.onClose();
        this.props.onCancel();
        break;
      case SEND_PUSH_NOTIFICATION:
        if (this.state.isCommunicationScheduled) {
          if (this.props.communicationScheduledToEdit) {
            this.props.editScheduledMessage({
              ...this.props.communicationScheduledToEdit,
              title: this.state.notificationTitle,
              text: this.state.notificationContent,
              email_design: null,
              communication_kind: COMMUNICATION_KIND_PUSH_NOTIFICATION,
              datetime_scheduled: this.state.communicationScheduledDate,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            });
          } else {
            this.props.schedule({
              title: this.state.notificationTitle,
              text: this.state.notificationContent,
              communication_kind: COMMUNICATION_KIND_PUSH_NOTIFICATION,
              datetime_scheduled: this.state.communicationScheduledDate,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            });
          }
        } else if (this.props.communicationScheduledToEdit) {
          const communicationScheduledId =
            this.props.communicationScheduledToEdit.id;
          this.props.editScheduledMessage(
            {
              ...this.props.communicationScheduledToEdit,
              title: this.state.notificationTitle,
              text: this.state.notificationContent,
              email_design: null,
              communication_kind: COMMUNICATION_KIND_PUSH_NOTIFICATION,
              datetime_scheduled: this.state.communicationScheduledDate,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            },
            {
              onSuccess: () => this.props.sendNow(communicationScheduledId),
            },
          );
        } else {
          this.props.send({
            member_blacklist: this.state.unCheckedMembers.notification,
            notification_title: this.state.notificationTitle,
            notification_content: this.state.notificationContent,
          });
        }
        this.onClose();
        this.props.onCancel();
        break;
      default:
        this.onClose();
        this.props.onCancel();
        break;
    }
  };

  getUncheckedMember = () => {
    switch (this.state.actionType) {
      case SEND_SMS:
        return this.state.unCheckedMembers.phone;
      case WRITE_EMAIL:
      case SELECT_EMAIL:
        return this.state.unCheckedMembers.email;
      case SEND_PUSH_NOTIFICATION:
        return this.state.unCheckedMembers.notification;
      default:
        break;
    }
    return [];
  };

  changeDisplayResendSection = () =>
    this.setState((previousState) => ({
      openResendSection: !previousState.openResendSection,
    }));

  changeDisplayCommunicationSchedulingSection = () =>
    this.setState((previousState) => ({
      openCommunicationSchedulingSection:
        !previousState.openCommunicationSchedulingSection,
    }));

  updateCommunicationScheduledDate = (values: DatePickerSelectorValues) => {
    this.setState(() => ({
      communicationScheduledDate: values.date,
      communicationScheduledTimePeriod: values.timePeriod,
    }));
  };

  updateCommunicationScheduledTime = (value: Moment) => {
    this.setState(() => ({
      communicationScheduledDate: value,
    }));
  };

  enableCommunicationScheduling = () =>
    this.setState({
      isCommunicationScheduled: true,
    });

  disableCommunicationScheduling = () =>
    this.setState({
      isCommunicationScheduled: false,
    });

  updateStateIfCommunicationEdition = () => {
    if (this.props.communicationScheduledToEdit) {
      this.setState({
        isCommunicationScheduled: true,
        communicationScheduledDate:
          this.props.communicationScheduledToEdit.datetime_scheduled,
        mailTitle:
          this.props.communicationScheduledToEdit.title ||
          this.props.mailDefaultTitle ||
          null,
        mailContent: this.props.communicationScheduledToEdit.text || '',
        actionType: getCorrespondingActionType(
          this.props.communicationScheduledToEdit.communication_kind,
          !!this.props.communicationScheduledToEdit.email_design,
        ),
        selectedTemplate:
          this.props.communicationScheduledToEdit.email_design || null,
        smsContent: this.props.communicationScheduledToEdit.text || '',
        notificationTitle: this.props.communicationScheduledToEdit.title || '',
        notificationContent: this.props.communicationScheduledToEdit.text || '',
        resendCount:
          this.props.communicationScheduledToEdit.email_resend_count || 0,
        resendDelay:
          this.props.communicationScheduledToEdit.email_resend_delay || 0,
      });
    }
  };

  render() {
    const {
      open,
      emailDetailLoading,
      emailDetails,
      emailListLoading,
      emails,
      hideTemplateMail,
      hideWrittenMail,
      mailDefaultTitle,
      membersAllLoading,
      membersByPageLoading,
      membersToDisplay,
      onCancel,
      page,
      receiversNotEditable,
      getEmailDetail,
      getEmails,
      fetchNextPage,
      fetchPreviousPage,
      t,
      resolvedGenericTags,
      classes,
      hideAutoResend,
      hideMemberList,
    } = this.props;

    return (
      <>
        <GenericResponsiveDrawer
          onClose={() => {
            this.onClose();
            onCancel();
          }}
          open={open}
          title={t('mail.dialogTitle')}
        >
          <>
            <div>
              <form onSubmit={this.onSubmit}>
                <GenericResponsiveDialog
                  maxWidth="sm"
                  open={this.state.openRefreshDialog}
                >
                  <DialogContent>
                    <p>
                      {this.state.actionType === SEND_SMS
                        ? t('mail.refreshTextPhone')
                        : t('mail.refreshText')}
                    </p>
                    <DialogActions>
                      <Button
                        color="secondary"
                        onClick={() =>
                          this.setState({ openRefreshDialog: false })
                        }
                      >
                        {t('common.cancel')}
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => document.location.reload(true)}
                        type="submit"
                        variant="outlined"
                      >
                        {t('common.refresh')}
                      </Button>
                    </DialogActions>
                  </DialogContent>
                </GenericResponsiveDialog>
                {this.renderCommunicationTypeChoice()}
                {this.renderConsentWarning()}
                {!hideMemberList && (
                  <ReceiversCollapseItem
                    fetchNextPage={() =>
                      fetchNextPage(page, this.state.page_size)
                    }
                    fetchPreviousPage={() =>
                      fetchPreviousPage(page, this.state.page_size)
                    }
                    handleToggle={this.handleToggle}
                    keyword={
                      this.state.actionType === SEND_SMS ? 'phone' : 'email'
                    }
                    loading={membersAllLoading}
                    members={membersToDisplay}
                    membersByPageLoading={membersByPageLoading}
                    membersCount={this.props.countTotal}
                    openMemberPage={this.openMemberPage}
                    page={page}
                    page_size={this.state.page_size}
                    receiversNotEditable={receiversNotEditable}
                    uncheckedMembers={this.getUncheckedMember()}
                  />
                )}
                {this.state.actionType === SELECT_EMAIL &&
                  !hideTemplateMail && (
                    <SelectTemplate
                      emailDetailLoading={emailDetailLoading}
                      emailDetails={emailDetails}
                      emailListLoading={emailListLoading}
                      emails={emails.filter(
                        (email) => !email.is_default_bsport_template,
                      )}
                      getEmailDetail={getEmailDetail}
                      getEmails={getEmails}
                      mailDefaultTitle={mailDefaultTitle}
                      onCancel={onCancel}
                      onChangeTemplate={(id) => {
                        this.setState({
                          selectedTemplate: id,
                          mailTitle: id
                            ? emails.find((email) => email.id === id).subject
                            : '',
                        });
                      }}
                      onChangeTitle={(text) =>
                        this.setState({ mailTitle: text })
                      }
                      resolvedGenericTags={resolvedGenericTags}
                      selectedMail={this.state.selectedTemplate}
                      title={this.state.mailTitle}
                    />
                  )}
                {this.state.actionType === WRITE_EMAIL && !hideWrittenMail && (
                  <WriteEmail
                    mailContent={this.state.mailContent}
                    onChangeContent={(text) =>
                      this.setState({ mailContent: text })
                    }
                    onChangeTitle={(text) => this.setState({ mailTitle: text })}
                    title={this.state.mailTitle}
                  />
                )}
                {this.state.actionType === SEND_SMS && (
                  <WriteSMS
                    countReceivers={
                      this.props.countWithPhone -
                        this.state.unCheckedMembers.phone?.length || 0
                    }
                    onChangeContent={(text) =>
                      this.setState({ smsContent: text })
                    }
                    smsContent={this.state.smsContent}
                  />
                )}
                {this.state.actionType === SEND_PUSH_NOTIFICATION && (
                  <WriteNotification
                    notificationContent={this.state.notificationContent}
                    notificationTitle={this.state.notificationTitle}
                    onNotificationContentChange={(text) => {
                      this.setState({ notificationContent: text });
                    }}
                    onNotificationTitleChange={(text) => {
                      this.setState({ notificationTitle: text });
                    }}
                  />
                )}

                <div className={classes.resendSectionContainer}>
                  <ButtonBase
                    className={classes.sectionTitleContainer}
                    onClick={this.changeDisplayCommunicationSchedulingSection}
                  >
                    <div className={classes.sectionTitle}>
                      <WatchLaterIcon className={classes.sectionTitleIcon} />
                      <Typography variant="h6">
                        {t('scheduled.sectionTitle')}
                      </Typography>
                    </div>
                    {this.state.openCommunicationSchedulingSection ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </ButtonBase>
                  <Collapse in={this.state.openCommunicationSchedulingSection}>
                    <div className={classes.radioButtonContainer}>
                      <FormControlLabel
                        classes={{ label: classes.center }}
                        control={
                          <Radio
                            checked={!this.state.isCommunicationScheduled}
                            onChange={this.disableCommunicationScheduling}
                          />
                        }
                        label={t('scheduled.sendImmediately')}
                        labelPlacement="right"
                      />
                      <FormControlLabel
                        classes={{ label: classes.center }}
                        control={
                          <Radio
                            checked={this.state.isCommunicationScheduled}
                            onChange={this.enableCommunicationScheduling}
                          />
                        }
                        label={t('scheduled.scheduleForLater')}
                        labelPlacement="right"
                      />
                    </div>
                    {this.state.isCommunicationScheduled && (
                      <>
                        <div className={classes.datePickerContainer}>
                          <Typography variant="body1">
                            {t('scheduled.when')}
                          </Typography>
                          <div className={classes.datePickerSection}>
                            <DatePickerSelector
                              isFullWidth
                              singleDate
                              date={moment(
                                this.state.communicationScheduledDate,
                              ).unix()}
                              onSubmit={this.updateCommunicationScheduledDate}
                              timePeriod={
                                this.state.communicationScheduledTimePeriod
                              }
                            />
                            <Typography variant="body1">
                              {t('scheduled.at')}
                            </Typography>
                            <TimePicker
                              required
                              adornmentPosition="start"
                              ampm={isAmPmTimeFormat()}
                              className={classes.timePicker}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AccessTimeIcon
                                      className={classes.timePickerIcon}
                                    />
                                  </InputAdornment>
                                ),
                              }}
                              onChange={this.updateCommunicationScheduledTime}
                              size="small"
                              value={moment(
                                this.state.communicationScheduledDate,
                              ).tz(this.props.timezone)}
                              variant="outlined"
                            />
                          </div>
                        </div>
                        {!this.checkIsMessageSchedulable() && (
                          <Alert
                            className={classes.alert}
                            severity="error"
                            variant="outlined"
                          >
                            {t('scheduled.datetimeLimit')}
                          </Alert>
                        )}
                        {!this.checkIsMessageScheduledDuringNighttime() && (
                          <Alert
                            className={classes.alert}
                            severity="warning"
                            variant="outlined"
                          >
                            {t('scheduled.nighttimeLimit')}
                          </Alert>
                        )}
                      </>
                    )}
                  </Collapse>
                </div>
                {!hideAutoResend &&
                  [WRITE_EMAIL, SELECT_EMAIL].includes(
                    this.state.actionType,
                  ) && (
                    <div className={classes.resendSectionContainer}>
                      <ButtonBase
                        className={classes.sectionTitleContainer}
                        onClick={this.changeDisplayResendSection}
                      >
                        <div className={classes.sectionTitle}>
                          <RepeatIcon className={classes.sectionTitleIcon} />
                          <Typography variant="h6">
                            {t('resendSection.title')}
                          </Typography>
                        </div>
                        {this.state.openResendSection ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </ButtonBase>
                      <Collapse in={this.state.openResendSection}>
                        <div className={classes.inputContainer}>
                          <TextField
                            fullWidth
                            helperText={t(
                              'resendSection.resendCount.helperText',
                            )}
                            inputProps={{ min: 0, max: 5 }}
                            label={t('resendSection.resendCount.label')}
                            onChange={this.getInputChangeHandler(
                              'resendCount',
                              0,
                              5,
                            )}
                            type="number"
                            value={this.state.resendCount}
                          />
                        </div>

                        <div className={classes.inputContainer}>
                          <TextField
                            fullWidth
                            helperText={t(
                              'resendSection.resendDelay.helperText',
                            )}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment
                                  className={classes.adornment}
                                  position="end"
                                >
                                  <Typography>
                                    {t('common:day', {
                                      count: this.state.resendDelay,
                                    })}
                                  </Typography>
                                </InputAdornment>
                              ),
                              inputProps: { min: 0, max: 180 },
                            }}
                            label={t('resendSection.resendDelay.label')}
                            onChange={this.getInputChangeHandler(
                              'resendDelay',
                              0,
                              180,
                            )}
                            type="number"
                            value={this.state.resendDelay}
                          />
                        </div>
                      </Collapse>
                    </div>
                  )}
                {/* TODO translate */}
                {!!this.props.memberToDisplayError &&
                  !this.props.membersByPageLoading && (
                    <Alert className={classes.alertCentered} severity="warning">
                      {`We are currently encountering a problem loading the members
                    within this smart list. Please note that you won't be able
                    to preview the number of members that will be reached by
                    this communication.`}
                    </Alert>
                  )}
                <DialogActions>
                  <Button
                    color="secondary"
                    onClick={() => {
                      this.onClose();
                      onCancel();
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    color="primary"
                    disabled={
                      (this.state.isCommunicationScheduled &&
                        !this.checkIsMessageSchedulable()) ||
                      this.checkErrors()
                    }
                    type="submit"
                    variant="outlined"
                  >
                    {this.state.isCommunicationScheduled
                      ? t('scheduled.schedule')
                      : t('common.submit')}
                  </Button>
                </DialogActions>
              </form>
            </div>
          </>
        </GenericResponsiveDrawer>
        <CommunicationSMSCostReminderModal
          handleClose={this.handleCostReminderModalOnClose}
          open={this.state.isSmsCostReminderModalOpen}
          sendMessageOnClick={this.handleSmsSendingOnClick}
        />
      </>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    radioContainer: {
      marginBottom: theme.spacing(2),
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    emailConsentWarningContainer: {
      border: 'solid 1px rgb(255, 0, 0)',
      borderRadius: '5px',
      background: '#FCEAEA',
      padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
      marginBottom: theme.spacing(2),
    },
    warningParagraph: {
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
    },
    center: { textAlign: 'center' },
    sectionTitleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: theme.spacing(5),
      width: '100%',
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    sectionTitleIcon: {
      color: theme.palette.text.secondary,
    },
    arrowUpIcon: {
      transform: 'rotate(0)',
      transition: 'all ease 0.3s',
    },
    rotate: {
      transform: 'rotate(-180deg)',
    },
    adornment: {
      paddingLeft: theme.spacing(1),
      color: theme.palette.text.secondary,
    },
    inputContainer: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    resendSectionContainer: {
      marginTop: theme.spacing(4),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    alertCentered: {
      alignItems: 'center',
    },
    alert: {
      display: 'flex',
      marginTop: theme.spacing(1),
    },
    radioButtonContainer: {
      display: 'flex',
      paddingTop: theme.spacing(2),
      gap: theme.spacing(3),
    },
    datePickerContainer: {
      display: 'flex',
      flexDirection: 'column',
      paddingTop: theme.spacing(2),
    },
    datePickerSection: {
      display: 'flex',
      paddingTop: theme.spacing(1),
      gap: theme.spacing(2),
      alignItems: 'center',
    },
    timePickerIcon: {
      color: theme.palette.grey[400],
    },
    timePicker: {
      display: 'flex',
      width: '45%',
    },
  });

export default compose(
  withTranslation(['communication', 'common']),
  withStyles(styles),
)(CommunicationDrawer);
