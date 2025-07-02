import React from 'react';
import { DateTime, Settings } from 'luxon';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';

import Button from '@material-ui/core/Button';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';

import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Alert from '@material-ui/lab/Alert';
import ButtonBase from '@material-ui/core/ButtonBase';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import Collapse from '@material-ui/core/Collapse';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Radio from '@material-ui/core/Radio';
import RepeatIcon from '@material-ui/icons/Repeat';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker,
} from 'material-ui-pickers';
import {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
} from '@bsport/common/lib/master-data/communication-kind.js';
import { LocalizedLuxonUtils } from '#src/i18n/utils/luxon-picker-utils';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';

// @ts-expect-error
import FeatureListProvider from '#src/libs/company/hocs/feature-list-provider.hoc';
import CommunicationSMSCostReminderModal from '#src/libs/communication-v2/CommunicationSMSCostReminderModal.component';
import {
  MAX_LENGTH_PUSH_TITLE,
  MAX_LENGTH_PUSH_CONTENT,
} from '#src/libs/communication/constants';
import {
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  UPSELL_IDENTIFIER_SMS,
} from '#src/libs/platform-billing/upsell-identifiers';
import { isAmPmTimeFormat } from '#src/utils/datetime';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import CustomMuiThemeWrapper from '#src/components/wrappers/CustomMuiThemeWrapper.component';

import type { MemberMailData } from '#src/libs/communication/types';
import type { Member } from '#src/libs/member/types';
import type { FeatureList } from '#src/libs/company/types';
import type { DateFilterEnum } from '#src/libs/datatype-filtering/types';
import type {
  CommunicationScheduled,
  CommunicationScheduledCreate,
} from '#src/libs/communication-v2/types';

import type {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#src/libs/email-editor/types';
import type { OptionCallback } from '../../../state/types';
import WriteNotification from './WriteNotification.component';
// @ts-expect-error
import WriteSMS from './WriteSMS.component';
// @ts-expect-error
import WriteEmail from './WriteEmail.component';
// @ts-expect-error
import SelectTemplate from './SelectTemplate.component';
// @ts-expect-error
import ReceiversCollapseItem from './ReceiversCollapseItem.component';

import AlertSmsProviderSmsNotVerified from '#src/libs/communication-v2/components/AlertSmsProviderNotVerified.component';
import Config from '../../../config';
import { checkOutsideLockedWindowFromTime } from '#src/utils/communicationScheduledHelper';
import { openNewBackOfficeWindow } from '#src/utils/windows';
import { getCommunicationSMSProviderVerificationState } from '../../communication-v2/selectors';

import type { RootState } from '#src/reducers';
const WRITE_EMAIL = 0;
const SELECT_EMAIL = 1;
const SEND_SMS = 2;
const SEND_PUSH_NOTIFICATION = 3;

const MEMBER_PAGE_SIZE = 5;

const COMPANY_ALLOWED_TO_SEND_SMARTLIST_COMMUNICATION_WITH_DB_ERROR = [
  1149, 1150, 1148, 1151, 1147, 1146, 1860, 1557, 1861, 1152, 1145, 1144, 1143,
  1155, 1142, 1141, 1153, 1399, 1140, 1139, 1138, 1136, 1134, 1154, 1135,
];

type OwnProps = {
  actionType?: number;
  closeDrawerForTooLateUpdate?: () => void;
  communicationScheduledToEdit?: CommunicationScheduled;
  companyId?: number;
  countTotal: number | null;
  countWithEmail: number | null;
  countWithPhone: number | null;
  deleteScheduledMessage?: (data: CommunicationScheduled) => void;
  editScheduledMessage?: (
    data: CommunicationScheduled,
    options?: OptionCallback<CommunicationScheduled>,
  ) => void;
  emailDetailLoading: boolean;
  emailDetails: {
    [templateId: number]: EmailTemplateDetail;
  };
  emailListLoading: boolean;
  emails: EmailTemplateSummary[];
  fetchNextPage?: (page: number, page_size: number) => void;
  fetchPreviousPage?: (page: number, page_size: number) => void;
  getEmailDetail: (id: number) => void;
  getEmails: () => void;
  hideAutoResend?: boolean;
  hideMemberList?: boolean;
  hideTemplateMail?: boolean;
  hideWrittenMail?: boolean;
  hoursToSend?: { min: number; max: number };
  mailDefaultTitle?: string;
  membersAllLoading: boolean;
  membersByPageLoading: boolean;
  membersToDisplay: Member[];
  memberToDisplayError?: Error | null;
  onCancel: () => void;
  open: boolean;
  page_size?: number;
  page: number;
  receiversNotEditable?: boolean;
  resolvedGenericTags: ResolvedGenericTags;
  schedule?: (data: Omit<CommunicationScheduledCreate, 'smartlist'>) => void;
  send?: (data: Partial<MemberMailData>) => void;
  sendNow?: (data: CommunicationScheduled) => void;
  showEmailConsentWarning?: boolean;
  showSmsConsentWarning?: boolean;
  timezone: string;
};

type Props = OwnProps &
  WithTranslation &
  WithStyles &
  ConnectedProps<typeof connector>;

type State = {
  actionType: number;
  communicationScheduledDate: DateTime | null;
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
  selectedTemplate: number | null;
  smsContent: string;
  unCheckedMembers: {
    phone: number[];
    email: number[];
    notification: number[];
  };
};

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

class CommunicationDrawer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      actionType: props.actionType ? props.actionType : SELECT_EMAIL,
      communicationScheduledDate: null,
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

  componentDidMount() {
    this.props.getEmails();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.open === true && prevProps.open === false) {
      this.setState({
        communicationScheduledDate: null,
      });
    }
    if (prevProps.mailDefaultTitle !== this.props.mailDefaultTitle) {
      this.setState({
        mailContent: '',
        mailTitle: this.props.mailDefaultTitle,
      });
    }
    if (
      !!this.props.communicationScheduledToEdit &&
      this.props.communicationScheduledToEdit !==
        prevProps.communicationScheduledToEdit
    ) {
      this.updateStateIfCommunicationEdition();
    }
    if (
      !!this.props.communicationScheduledToEdit &&
      !this.checkIsMessageSchedulable()
    ) {
      this.props.closeDrawerForTooLateUpdate?.();
    }
  }

  getInputChangeHandler =
    (
      inputName: 'resendCount' | 'resendDelay',
      minValue: number,
      maxValue: number,
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let sanitizedValue = parseInt(event?.target?.value ?? '0') || 0;
      sanitizedValue = Math.max(minValue, sanitizedValue);
      sanitizedValue = Math.min(maxValue, sanitizedValue);

      this.setState((prevState) => ({
        ...prevState,
        [inputName]: sanitizedValue,
      }));
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

  formatScheduledDate() {
    const dateToFormat =
      this.state.communicationScheduledDate ?? DateTime.now();
    return `${dateToFormat
      .setZone(this.props.timezone)
      .toISODate()}T${dateToFormat
      .setZone(this.props.timezone)
      .toFormat('HH:mm')}`;
  }

  handleSmsSendingOnClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();

    const communicationScheduledDateFormatted = this.formatScheduledDate();

    if (this.state.isCommunicationScheduled) {
      if (this.props.communicationScheduledToEdit) {
        this.props.editScheduledMessage({
          ...this.props.communicationScheduledToEdit,
          text: this.state.smsContent,
          title: '',
          email_design: null,
          communication_kind: COMMUNICATION_KIND_SMS,
          datetime_scheduled: communicationScheduledDateFormatted,
        });
      } else {
        this.props.schedule({
          text: this.state.smsContent,
          communication_kind: COMMUNICATION_KIND_SMS,
          datetime_scheduled: communicationScheduledDateFormatted,
        });
      }
    } else if (this.props.communicationScheduledToEdit) {
      this.props.editScheduledMessage(
        {
          ...this.props.communicationScheduledToEdit,
          text: this.state.smsContent,
          title: '',
          email_design: null,
          communication_kind: COMMUNICATION_KIND_SMS,
          datetime_scheduled: communicationScheduledDateFormatted,
        },
        {
          onSuccess: (communicationScheduled) =>
            this.props.sendNow(communicationScheduled),
        },
      );
    } else {
      this.props.send({
        member_blacklist: this.state.unCheckedMembers.email,
        sms: this.state.smsContent,
      });
    }
    this.handleCloseDrawer();
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

  handleCloseDrawer = () => {
    this.onClose();
    this.props.onCancel();
  };

  openMemberPage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
  ) => {
    event?.preventDefault();
    const url = `/member/edit/${id}`;
    openNewBackOfficeWindow(url);
    this.setState({ openRefreshDialog: true });
  };

  checkIsMessageSchedulable = () => {
    const communicationScheduledTime = this.state.communicationScheduledDate;
    if (!communicationScheduledTime) return true;

    return checkOutsideLockedWindowFromTime(communicationScheduledTime);
  };

  checkIsMessageScheduledDuringDaytime = () => {
    if (!this.state.communicationScheduledDate) return true;

    const communicationScheduledHour =
      this.state.communicationScheduledDate.hour;

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

  onSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const communicationScheduledDateFormatted = this.formatScheduledDate();

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
              datetime_scheduled: communicationScheduledDateFormatted,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            });
          } else {
            this.props.schedule({
              title: this.state.mailTitle,
              text: this.state.mailContent,
              communication_kind: COMMUNICATION_KIND_EMAIL,
              datetime_scheduled: communicationScheduledDateFormatted,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            });
          }
        } else if (this.props.communicationScheduledToEdit) {
          this.props.editScheduledMessage(
            {
              ...this.props.communicationScheduledToEdit,
              email_design: null,
              title: this.state.mailTitle,
              text: this.state.mailContent,
              communication_kind: COMMUNICATION_KIND_EMAIL,
              datetime_scheduled: communicationScheduledDateFormatted,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            },
            {
              onSuccess: (communicationScheduled) =>
                this.props.sendNow(communicationScheduled),
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
        this.handleCloseDrawer();
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
              datetime_scheduled: communicationScheduledDateFormatted,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            });
          } else {
            this.props.schedule({
              title: this.state.mailTitle,
              email_design: this.state.selectedTemplate,
              communication_kind: COMMUNICATION_KIND_EMAIL,
              datetime_scheduled: communicationScheduledDateFormatted,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            });
          }
        } else if (this.props.communicationScheduledToEdit) {
          this.props.editScheduledMessage(
            {
              ...this.props.communicationScheduledToEdit,
              title: this.state.mailTitle,
              email_design: this.state.selectedTemplate,
              text: '',
              communication_kind: COMMUNICATION_KIND_EMAIL,
              datetime_scheduled: communicationScheduledDateFormatted,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            },
            {
              onSuccess: (communicationScheduled) =>
                this.props.sendNow(communicationScheduled),
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
        this.handleCloseDrawer();
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
              datetime_scheduled: communicationScheduledDateFormatted,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            });
          } else {
            this.props.schedule({
              title: this.state.notificationTitle,
              text: this.state.notificationContent,
              communication_kind: COMMUNICATION_KIND_PUSH_NOTIFICATION,
              datetime_scheduled: communicationScheduledDateFormatted,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            });
          }
        } else if (this.props.communicationScheduledToEdit) {
          this.props.editScheduledMessage(
            {
              ...this.props.communicationScheduledToEdit,
              title: this.state.notificationTitle,
              text: this.state.notificationContent,
              email_design: null,
              communication_kind: COMMUNICATION_KIND_PUSH_NOTIFICATION,
              datetime_scheduled: communicationScheduledDateFormatted,
              email_resend_count: this.state.resendCount,
              email_resend_delay: this.state.resendDelay,
            },
            {
              onSuccess: (communicationScheduled) =>
                this.props.sendNow(communicationScheduled),
            },
          );
        } else {
          this.props.send({
            member_blacklist: this.state.unCheckedMembers.notification,
            notification_title: this.state.notificationTitle,
            notification_content: this.state.notificationContent,
          });
        }
        this.handleCloseDrawer();
        break;
      default:
        this.handleCloseDrawer();
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

  updateCommunicationScheduledDate = (value: DateTime) => {
    this.setState({
      communicationScheduledDate: value,
    });
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
        communicationScheduledDate: DateTime.fromISO(
          this.props.communicationScheduledToEdit.datetime_scheduled,
        ),
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

  getSubmitLabel = () => {
    if (this.state.isCommunicationScheduled) {
      if (this.props.communicationScheduledToEdit) {
        return this.props.t('scheduled.saveEdition');
      }
      return this.props.t('scheduled.schedule');
    }
    if (this.props.communicationScheduledToEdit) {
      return this.props.t('scheduled.sendImmediately');
    }
    return this.props.t('common.submit');
  };

  getCancelLabel = () => {
    if (this.props.communicationScheduledToEdit) {
      return this.props.t('scheduled.cancelEdition');
    }
    return this.props.t('common.cancel');
  };

  handleDeleteCommunicationScheduled = () => {
    this.props.deleteScheduledMessage?.(
      this.props.communicationScheduledToEdit,
    );
  };

  render() {
    const {
      classes,
      emailDetailLoading,
      emailDetails,
      emailListLoading,
      emails,
      fetchNextPage,
      fetchPreviousPage,
      getEmailDetail,
      getEmails,
      hideAutoResend,
      hideMemberList,
      hideTemplateMail,
      hideWrittenMail,
      mailDefaultTitle,
      membersAllLoading,
      membersByPageLoading,
      membersToDisplay,
      onCancel,
      open,
      page,
      receiversNotEditable,
      resolvedGenericTags,
      t,
    } = this.props;

    return (
      <>
        <GenericResponsiveDrawer
          onClose={this.handleCloseDrawer}
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
                        onClick={() => document.location.reload()}
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
                      onChangeTemplate={(id: number) => {
                        this.setState({
                          selectedTemplate: id,
                          mailTitle: id
                            ? emails.find((email) => email.id === id).subject
                            : '',
                        });
                      }}
                      onChangeTitle={(text: string) =>
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
                    onChangeContent={(text: string) =>
                      this.setState({ mailContent: text })
                    }
                    onChangeTitle={(text: string) =>
                      this.setState({ mailTitle: text })
                    }
                    title={this.state.mailTitle}
                  />
                )}
                {this.state.actionType === SEND_SMS && (
                  <>
                    {!this.props.communicationSMSProviderVerificationState
                      .isVerified && <AlertSmsProviderSmsNotVerified />}

                    <WriteSMS
                      countReceivers={
                        this.props.countWithPhone -
                          this.state.unCheckedMembers.phone?.length || 0
                      }
                      onChangeContent={(text: string) =>
                        this.setState({ smsContent: text })
                      }
                      smsContent={this.state.smsContent}
                    />
                  </>
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
                        labelPlacement="end"
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
                        labelPlacement="end"
                      />
                    </div>
                    {this.state.isCommunicationScheduled && (
                      <>
                        <div className={classes.datePickerContainer}>
                          <Typography variant="body1">
                            {t('scheduled.when')}
                          </Typography>
                          <div className={classes.datePickerSection}>
                            <MuiPickersUtilsProvider
                              locale={Settings.defaultLocale}
                              utils={LocalizedLuxonUtils}
                            >
                              <DatePicker
                                required
                                adornmentPosition="start"
                                className={classes.dateAndTimePickers}
                                format="D"
                                helperText={null}
                                id="offer-form-date-start-input"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <IconButton
                                        className={classes.inputIconAdornment}
                                      >
                                        <CalendarTodayIcon />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                                onChange={this.updateCommunicationScheduledDate}
                                placeholder={t('scheduled.chooseDate')}
                                size="small"
                                value={this.state.communicationScheduledDate}
                                variant="outlined"
                              />
                              <Typography variant="body1">
                                {t('scheduled.at')}
                              </Typography>
                              <TimePicker
                                required
                                adornmentPosition="start"
                                ampm={isAmPmTimeFormat()}
                                className={classes.dateAndTimePickers}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <AccessTimeIcon
                                        className={classes.timePickerIcon}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                                onChange={this.updateCommunicationScheduledDate}
                                placeholder={t('scheduled.chooseTime')}
                                size="small"
                                TextFieldComponent={(
                                  props: React.ComponentProps<typeof TextField>,
                                ) => (
                                  <CustomMuiThemeWrapper
                                    primary={
                                      !this.checkIsMessageScheduledDuringDaytime() &&
                                      'warning'
                                    }
                                  >
                                    <TextField
                                      {...props}
                                      error={!this.checkIsMessageSchedulable()}
                                      focused={
                                        !this.checkIsMessageScheduledDuringDaytime() ||
                                        !this.checkIsMessageSchedulable()
                                      }
                                      variant="outlined"
                                    />
                                  </CustomMuiThemeWrapper>
                                )}
                                value={this.state.communicationScheduledDate}
                                variant="outlined"
                              />
                            </MuiPickersUtilsProvider>
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
                        {!this.checkIsMessageScheduledDuringDaytime() && (
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
                  <Divider className={classes.divider} />
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
                      <Divider className={classes.divider} />
                    </div>
                  )}
                {!!this.props.memberToDisplayError &&
                  !this.props.membersByPageLoading && (
                    <Alert className={classes.alertCentered} severity="warning">
                      {t('resendSection.membersWontLoad')}
                    </Alert>
                  )}
                <div className={classes.dialogActions}>
                  {!!this.props.communicationScheduledToEdit &&
                  !!this.props.deleteScheduledMessage ? (
                    <CustomMuiThemeWrapper primary="error">
                      <Button
                        color="primary"
                        onClick={this.handleDeleteCommunicationScheduled}
                        startIcon={<DeleteIcon />}
                      >
                        {t('scheduled.deleteMessage')}
                      </Button>
                    </CustomMuiThemeWrapper>
                  ) : (
                    <div /> // This empty div must be kept here for enabling flex-end alignment of dialog actions when there's no deletion button
                  )}
                  <DialogActions>
                    <Button color="secondary" onClick={this.handleCloseDrawer}>
                      {this.getCancelLabel()}
                    </Button>
                    <Button
                      color="primary"
                      disabled={
                        (this.state.isCommunicationScheduled &&
                          !(
                            this.state.communicationScheduledDate &&
                            this.checkIsMessageSchedulable()
                          )) ||
                        this.checkErrors() ||
                        (this.state.actionType == SEND_SMS &&
                          !this.props.communicationSMSProviderVerificationState
                            .isVerified)
                      }
                      type="submit"
                      variant="outlined"
                    >
                      {this.getSubmitLabel()}
                    </Button>
                  </DialogActions>
                </div>
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

const connector = connect(
  (state: RootState) => ({
    communicationSMSProviderVerificationState:
      getCommunicationSMSProviderVerificationState(state),
  }),
  null,
);
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
    adornment: {
      paddingLeft: theme.spacing(1),
      color: theme.palette.text.secondary,
    },
    inputContainer: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    resendSectionContainer: {
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
    dateAndTimePickers: {
      display: 'flex',
      width: '49%',
    },
    dialogActions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing(4),
    },
    divider: {
      display: 'flex',
      width: `calc(100% + ${2 * theme.spacing(5)}px)`,
      marginLeft: `-${theme.spacing(5)}px`,
      marginTop: theme.spacing(5),
      backgroundColor: theme.palette.grey[300],
    },
  });

export default compose<Props, OwnProps>(
  withTranslation(['communication', 'common']),
  withStyles(styles),
  React.memo,
  connector,
)(CommunicationDrawer);
