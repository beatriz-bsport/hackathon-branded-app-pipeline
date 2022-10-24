// @flow
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import Radio from '@material-ui/core/Radio';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';

import ReceiversCollapseItem from './ReceiversCollapseItem.component';
import SelectTemplate from './SelectTemplate.component';
import WriteEmail from './WriteEmail.component';
import WriteSMS from './WriteSMS.component';
import WriteNotification from './WriteNotification.component';
import { MAX_LENGTH_PUSH_TITLE, MAX_LENGTH_PUSH_CONTENT } from '../constant';

import type { MemberMailData } from '../types';
import Config from '../../../config';
import type { Member } from '#libs/member/types';

const WRITE_EMAIL = 0;
const SELECT_EMAIL = 1;
const SEND_SMS = 2;
const SEND_PUSH_NOTIFICATION = 3;

type Props = {
  receiversNotEditable: boolean,
  onCancel: () => void,
  send: (data: MemberMailData) => void,
  classes: Object,
  t: TFunction,
  getEmails: () => void,
  getEmailDetail: (id: number) => void,
  emailListLoading: boolean,
  emails: Array<any>,
  emailDetailLoading: boolean,
  emailDetails: Array<any>,
  open: boolean,
  mailDefaultTitle: ?string,
  mailDefaultTitle: string,
  hideTemplateMail: boolean,
  hideWrittenMail: boolean,
  actionType: number,
  showEmailConsentWarning?: boolean,
  showSmsConsentWarning?: boolean,

  // members list
  membersToDisplay: Array<Member>,
  fetchPreviousPage: (page: number, page_size: number) => void,
  fetchNextPage: (page: number, page_size: number) => void,
  initMembers: () => void,
  page: number,
  page_size: number,
  membersByPageLoading: boolean,
  membersAllLoading: boolean,

  countWithPhone: number | null,
  countWithEmail: number | null,
  countTotal: number | null,
  resolvedGenericTags: ResolvedGenericTags,
};

type State = {
  openRefreshDialog: boolean,
  unCheckedMembers: {
    phone: Array<number>,
    email: Array<number>,
    notification: Array<number>,
  },
  mailTitle: string | null,
  mailContent: string,
  actionType: number,
  selectedTemplate: null,
  smsContent: string,
  notificationTitle: string,
  notificationContent: string,
  page_size: number,
};
const MEMBER_PAGE_SIZE = 5;

export class CommunicationDrawer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openRefreshDialog: false,
      unCheckedMembers: { phone: [], email: [], notification: [] },
      mailTitle: props.mailDefaultTitle || null,
      mailContent: '',
      actionType: props.actionType ? props.actionType : SELECT_EMAIL,
      selectedTemplate: null,
      smsContent: '',
      notificationTitle: '',
      notificationContent: '',
      page_size: props.page_size || MEMBER_PAGE_SIZE,
    };
  }

  componentDidMount() {
    this.props.getEmails();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.initMembers &&
      this.props.open === true &&
      prevProps.open === false
    ) {
      this.props.initMembers(1, this.state.page_size);
    }
    if (prevProps.mailDefaultTitle !== this.props.mailDefaultTitle) {
      // eslint-disable-next-line
      this.setState({
        mailContent: '',
        mailTitle: this.props.mailDefaultTitle,
      });
    }
  }

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
          {(featureList) => (
            <FormControlLabel
              classes={{ label: classes.center }}
              control={
                <Radio
                  checked={this.state.actionType === SEND_SMS}
                  disabled={
                    (Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
                      (this.props.countWithPhone -
                        this.state.unCheckedMembers.phone?.length ||
                        0)) ||
                    !featureList.upsell ||
                    !featureList.upsell.find(
                      (f) => f.readable_identifier === 'sms',
                    )
                  }
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
          {(featureList) => (
            <FormControlLabel
              classes={{ label: classes.center }}
              control={
                <Radio
                  checked={this.state.actionType === SEND_PUSH_NOTIFICATION}
                  disabled={
                    Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
                    (!featureList.upsell ||
                      !featureList.upsell.find(
                        (f) => f.readable_identifier === 'push_notification',
                      ))
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
    });
  };

  openMemberPage = (event: SyntheticEvent<any>, id: number) => {
    event.preventDefault();
    const url = `/member/edit/${id}`;
    const win = window.open(url);
    win.focus();
    this.setState({ openRefreshDialog: true });
  };

  checkValidity = () => {
    switch (this.state.actionType) {
      case WRITE_EMAIL:
        return (
          this.state.mailContent === '' ||
          this.state.mailTitle === '' ||
          !(
            this.props.countWithEmail >
            (this.state.unCheckedMembers.email?.length || 0)
          )
        );
      case SEND_SMS:
        return (
          this.state.smsContent === '' ||
          !(
            this.props.countWithPhone >
            (this.state.unCheckedMembers.phone?.length || 0)
          )
        );
      case SELECT_EMAIL:
        return (
          !this.state.selectedTemplate ||
          this.state.mailTitle === '' ||
          !(
            this.props.countWithEmail >
            (this.state.unCheckedMembers.email?.length || 0)
          )
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
        this.props.send({
          member_blacklist: this.state.unCheckedMembers.email,
          subject: this.state.mailTitle,
          body: this.state.mailContent,
        });
        break;
      case SEND_SMS:
        this.props.send({
          member_blacklist: this.state.unCheckedMembers.phone,
          sms: this.state.smsContent,
        });
        break;
      case SELECT_EMAIL:
        this.props.send({
          member_blacklist: this.state.unCheckedMembers.email,
          email_template: this.state.selectedTemplate,
          subject: this.state.mailTitle,
        });
        break;
      case SEND_PUSH_NOTIFICATION:
        this.props.send({
          member_blacklist: this.state.unCheckedMembers.notification,
          notification_title: this.state.notificationTitle,
          notification_content: this.state.notificationContent,
        });
        break;
      default:
        break;
    }
    this.onClose();
    this.props.onCancel();
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
    } = this.props;

    return (
      <GenericResponsiveDrawer
        title={t('mail.dialogTitle')}
        open={open}
        onClose={() => {
          this.onClose();
          onCancel();
        }}
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
                      variant="outlined"
                      type="submit"
                      color="primary"
                      onClick={() => document.location.reload(true)}
                    >
                      {t('common.refresh')}
                    </Button>
                  </DialogActions>
                </DialogContent>
              </GenericResponsiveDialog>
              {this.renderCommunicationTypeChoice()}
              {this.renderConsentWarning()}
              <ReceiversCollapseItem
                members={membersToDisplay}
                membersCount={this.props.countTotal}
                page_size={this.state.page_size}
                page={page}
                fetchPreviousPage={() =>
                  fetchPreviousPage(page, this.state.page_size)
                }
                fetchNextPage={() => fetchNextPage(page, this.state.page_size)}
                uncheckedMembers={this.getUncheckedMember()}
                keyword={this.state.actionType === SEND_SMS ? 'phone' : 'email'}
                receiversNotEditable={receiversNotEditable}
                handleToggle={this.handleToggle}
                openMemberPage={this.openMemberPage}
                loading={membersAllLoading}
                membersByPageLoading={membersByPageLoading}
              />
              {this.state.actionType === SELECT_EMAIL && !hideTemplateMail && (
                <SelectTemplate
                  title={this.state.mailTitle}
                  selectedMail={this.state.selectedTemplate}
                  onChangeTitle={(text) => this.setState({ mailTitle: text })}
                  onChangeTemplate={(id) => {
                    this.setState({
                      selectedTemplate: id,
                      mailTitle: id
                        ? emails.find((email) => email.id === id).subject
                        : '',
                    });
                  }}
                  onCancel={onCancel}
                  getEmails={getEmails}
                  getEmailDetail={getEmailDetail}
                  emailListLoading={emailListLoading}
                  emails={emails.filter(
                    (email) => !email.is_default_bsport_template,
                  )}
                  emailDetailLoading={emailDetailLoading}
                  emailDetails={emailDetails}
                  mailDefaultTitle={mailDefaultTitle}
                  resolvedGenericTags={resolvedGenericTags}
                />
              )}
              {this.state.actionType === WRITE_EMAIL && !hideWrittenMail && (
                <WriteEmail
                  mailContent={this.state.mailContent}
                  title={this.state.mailTitle}
                  onChangeContent={(text) =>
                    this.setState({ mailContent: text })
                  }
                  onChangeTitle={(text) => this.setState({ mailTitle: text })}
                />
              )}
              {this.state.actionType === SEND_SMS && (
                <WriteSMS
                  smsContent={this.state.smsContent}
                  countReceivers={
                    this.props.countWithPhone -
                      this.state.unCheckedMembers.phone?.length || 0
                  }
                  onChangeContent={(text) =>
                    this.setState({ smsContent: text })
                  }
                />
              )}
              {this.state.actionType === SEND_PUSH_NOTIFICATION && (
                <WriteNotification
                  notificationTitle={this.state.notificationTitle}
                  onNotificationTitleChange={(text) => {
                    this.setState({ notificationTitle: text });
                  }}
                  notificationContent={this.state.notificationContent}
                  onNotificationContentChange={(text) => {
                    this.setState({ notificationContent: text });
                  }}
                />
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
                  variant="outlined"
                  disabled={this.checkValidity()}
                  type="submit"
                  color="primary"
                >
                  {t('common.submit')}
                </Button>
              </DialogActions>
            </form>
          </div>
        </>
      </GenericResponsiveDrawer>
    );
  }
}

const styles = (theme) => ({
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
  center: {
    textAlign: 'center',
  },
});

export default compose(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationDrawer);
