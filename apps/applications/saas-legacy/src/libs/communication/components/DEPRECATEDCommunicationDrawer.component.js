// @flow
import React, { Component } from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import { withTranslation, TFunction } from 'react-i18next';
import { compose } from 'recompose';

import { Alert } from '@material-ui/lab';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import Radio from '@material-ui/core/Radio';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import type { Member } from '#src/libs/member/types';
import {
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  UPSELL_IDENTIFIER_SMS,
} from '#src/libs/platform-billing/upsell-identifiers';
import { FeatureList } from '#src/libs/company/types';
import { hasUpsell } from '#src/libs/platform-billing/utils';
import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';

import DEPRECATEDReceiversCollapseItem from './DEPRECATEDReceiversCollapseItem.component';
import SelectTemplate from './SelectTemplate.component';
import WriteEmail from './WriteEmail.component';
import WriteSMS from './WriteSMS.component';
import WriteNotification from './WriteNotification.component';
import AlertSmsProviderSmsNotVerified from '../../communication-v2/components/AlertSmsProviderNotVerified.component';
import { MAX_LENGTH_PUSH_TITLE, MAX_LENGTH_PUSH_CONTENT } from '../constants';

import { getCommunicationSMSProviderVerificationState } from '../../communication-v2/selectors';
import type { MemberMailData } from '../types';
import Config from '../../../config';

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
  allIds: Array<number>,
  allIdsWithPhone: Array<number>,
  allIdsWithEmail: Array<number>,
  fetchPreviousPage: (page: number, page_size: number) => void,
  fetchNextPage: (page: number, page_size: number) => void,
  initMembers: () => void,
  page: number,
  page_size: number,
  membersByPageLoading: boolean,
  membersAllLoading: boolean,
  communicationSMSProviderVerificationState: {
    isVerified: boolean,
  } & ErrorAndLoading,
};

type State = {
  openRefreshDialog: boolean,
  unCheckedMembers: Array<number>,
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
      unCheckedMembers: [],
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
    if (this.props.initMembers && this.props.open && !prevProps.open) {
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

  handleToggle = (value: string) => () => {
    this.setState((prevState) => {
      const currentIndex = prevState.unCheckedMembers.indexOf(value);
      const newChecked = prevState.unCheckedMembers;
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      return { ...prevState, unCheckedMembers: newChecked };
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
                    unCheckedMembers: [],
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
                    unCheckedMembers: [],
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
                  disabled={
                    Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
                    (!this.props.allIdsWithPhone.filter(
                      (item) => !this.state.unCheckedMembers.includes(item),
                    ).length ||
                      !hasUpsell(featureList, UPSELL_IDENTIFIER_SMS))
                  }
                  onChange={() =>
                    this.setState({
                      actionType: SEND_SMS,
                      unCheckedMembers: [],
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
                      unCheckedMembers: [],
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
  renderProviderVerificationStatus = () => {
    const { t, classes, communicationSMSProviderVerificationState } =
      this.props;

    if (
      this.state.actionType !== SEND_SMS ||
      communicationSMSProviderVerificationState.loading
    ) {
      return null;
    }
    if (!communicationSMSProviderVerificationState.isVerified) {
      return <AlertSmsProviderSmsNotVerified />;
    }
    return null;
  };
  onClose = () => {
    this.setState({
      unCheckedMembers: [],
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
          this.props.allIdsWithEmail.filter(
            (item) => !this.state.unCheckedMembers.includes(item),
          ).length === 0
        );
      case SEND_SMS:
        return (
          this.state.smsContent === '' ||
          this.props.allIdsWithPhone.filter(
            (item) => !this.state.unCheckedMembers.includes(item),
          ).length === 0 ||
          this.props.communicationSMSProviderVerificationState.loading ||
          !this.props.communicationSMSProviderVerificationState.isVerified
        );
      case SELECT_EMAIL:
        return (
          !this.state.selectedTemplate ||
          this.state.mailTitle === '' ||
          this.props.allIdsWithEmail.filter(
            (item) => !this.state.unCheckedMembers.includes(item),
          ).length === 0
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
          members: this.props.allIdsWithEmail.filter(
            (item) => !this.state.unCheckedMembers.includes(item),
          ),
          subject: this.state.mailTitle,
          body: this.state.mailContent,
        });
        break;
      case SEND_SMS:
        this.props.send({
          members: this.props.allIdsWithPhone.filter(
            (item) => !this.state.unCheckedMembers.includes(item),
          ),
          sms: this.state.smsContent,
        });
        break;
      case SELECT_EMAIL:
        this.props.send({
          members: this.props.allIdsWithEmail.filter(
            (item) => !this.state.unCheckedMembers.includes(item),
          ),
          email_template: this.state.selectedTemplate,
          subject: this.state.mailTitle,
        });
        break;
      case SEND_PUSH_NOTIFICATION:
        this.props.send({
          members: this.props.allIds.filter(
            (item) => !this.state.unCheckedMembers.includes(item),
          ),
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

  getCheckedMember = () => {
    switch (this.state.actionType) {
      case SEND_SMS:
        return this.props.allIdsWithPhone.filter(
          (item) => !this.state.unCheckedMembers.includes(item),
        );
      case WRITE_EMAIL:
      case SELECT_EMAIL:
        return this.props.allIdsWithEmail.filter(
          (item) => !this.state.unCheckedMembers.includes(item),
        );
      case SEND_PUSH_NOTIFICATION:
        return this.props.allIds.filter(
          (item) => !this.state.unCheckedMembers.includes(item),
        );
      default:
        break;
    }
    return [];
  };

  render() {
    const {
      open,
      allIds,
      allIdsWithPhone,
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
    } = this.props;

    return (
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
              {this.renderProviderVerificationStatus()}
              <DEPRECATEDReceiversCollapseItem
                checkedMembers={this.getCheckedMember()}
                fetchNextPage={() => fetchNextPage(page, this.state.page_size)}
                fetchPreviousPage={() =>
                  fetchPreviousPage(page, this.state.page_size)
                }
                handleToggle={this.handleToggle}
                keyword={this.state.actionType === SEND_SMS ? 'phone' : 'email'}
                loading={membersAllLoading}
                members={membersToDisplay}
                membersByPageLoading={membersByPageLoading}
                membersCount={allIds.length}
                openMemberPage={this.openMemberPage}
                page={page}
                page_size={this.state.page_size}
                receiversNotEditable={receiversNotEditable}
              />
              {this.state.actionType === SELECT_EMAIL && !hideTemplateMail && (
                <SelectTemplate
                  emailDetailLoading={emailDetailLoading}
                  emailDetails={emailDetails}
                  emailListLoading={emailListLoading}
                  emails={emails}
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
                  onChangeTitle={(text) => this.setState({ mailTitle: text })}
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
                    allIdsWithPhone.filter(
                      (item) => !this.state.unCheckedMembers.includes(item),
                    ).length
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
                  disabled={this.checkValidity()}
                  type="submit"
                  variant="outlined"
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

const connector = connect(
  (state: RootState) => ({
    communicationSMSProviderVerificationState:
      getCommunicationSMSProviderVerificationState(state),
  }),
  null,
);

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
  textColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  smsMainMessage: {
    paddingBottom: theme.spacing(1),
    fontStyle: 'italic',
  },
});

export default compose(
  connector,
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationDrawer);
