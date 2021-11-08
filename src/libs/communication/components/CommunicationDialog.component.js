// @flow
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import FormControlLabel from '@material-ui/core/FormControlLabel';

import Radio from '@material-ui/core/Radio';

import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';

import ReceiversCollapseItem from './ReceiversCollapseItem.component';
import SelectTemplate from './SelectTemplate.component';
import WriteEmail from './WriteEmail.component';
import WriteSMS from './WriteSMS.component';
import WriteNotification, {
  MAX_LENGTH_PUSH_TITLE,
  MAX_LENGTH_PUSH_CONTENT,
} from './WriteNotification.component';

import type { MemberMailData } from '../types';

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
  fullScreen: boolean,
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

  // members list
  membersToDisplay: Array<Member>,
  allIds: Array<number>,
  allIdsWithPhone: Array<number>,
  allIdsWithEmail: Array<number>,
  fetchPreviousPage: (page_size: number) => void,
  fetchNextPage: (page_size: number) => void,
  initMembers: () => void,
  page: number,
  page_size: number,
  membersByPageLoading: boolean,
  membersAllLoading: boolean,
};

const MEMBER_PAGE_SIZE = 5;

export class CommunicationDialog extends Component<Props> {
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

  renderTypeEmailChoice = () => {
    return (
      <div className={this.props.classes.radioContainer}>
        {!this.props.hideWrittenMail && (
          <FormControlLabel
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
            label={this.props.t('mail.writeMail')}
            labelPlacement="bottom"
          />
        )}
        {!this.props.hideTemplateMail && (
          <FormControlLabel
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
            label={this.props.t('mail.selectTemplate')}
            labelPlacement="bottom"
          />
        )}
        <FeatureListProvider>
          {(featureList) => (
            <FormControlLabel
              control={
                <Radio
                  checked={this.state.actionType === SEND_SMS}
                  disabled={
                    !this.props.allIdsWithPhone.filter(
                      (item) => !this.state.unCheckedMembers.includes(item),
                    ).length ||
                    !featureList.upsell ||
                    !featureList.upsell.find(
                      (f) => f.readable_identifier === 'sms',
                    )
                  }
                  onChange={() =>
                    this.setState({
                      actionType: SEND_SMS,
                      unCheckedMembers: [],
                    })
                  }
                />
              }
              label={this.props.t('mail.sendSms')}
              labelPlacement="bottom"
            />
          )}
        </FeatureListProvider>
        <FeatureListProvider>
          {(featureList) => (
            <FormControlLabel
              control={
                <Radio
                  checked={this.state.actionType === SEND_PUSH_NOTIFICATION}
                  disabled={
                    !featureList.upsell ||
                    !featureList.upsell.find(
                      (f) => f.readable_identifier === 'push_notification',
                    )
                  }
                  onChange={() =>
                    this.setState({
                      actionType: SEND_PUSH_NOTIFICATION,
                      unCheckedMembers: [],
                    })
                  }
                />
              }
              label={this.props.t('mail.sendNotification')}
              labelPlacement="bottom"
            />
          )}
        </FeatureListProvider>
      </div>
    );
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

  openMemberPage = (event: SyntheticEvent<any>, id) => {
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
          ).length === 0
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
      fullScreen,
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
      classes,
    } = this.props;

    return (
      <Dialog fullScreen={fullScreen} open={open}>
        <div className={classes.title}>
          <DialogTitle>{t('mail.dialogTitle')}</DialogTitle>
        </div>
        <DialogContent>
          <div className={classes.sendMailDialogBox}>
            <form className={classes.formContent} onSubmit={this.onSubmit}>
              <Dialog open={this.state.openRefreshDialog}>
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
              </Dialog>
              {this.renderTypeEmailChoice()}
              <ReceiversCollapseItem
                members={membersToDisplay}
                membersCount={allIds.length}
                page_size={this.state.page_size}
                page={page}
                fetchPreviousPage={() =>
                  fetchPreviousPage(page, this.state.page_size)
                }
                fetchNextPage={() => fetchNextPage(page, this.state.page_size)}
                checkedMembers={this.getCheckedMember()}
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
                  emails={emails}
                  emailDetailLoading={emailDetailLoading}
                  emailDetails={emailDetails}
                  mailDefaultTitle={mailDefaultTitle}
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
                    allIdsWithPhone.filter(
                      (item) => !this.state.unCheckedMembers.includes(item),
                    ).length
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
        </DialogContent>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'center',
  },
  radioContainer: {
    marginBottom: theme.spacing(2),

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  inlineContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sendMailDialogBox: {
    display: 'flex',
    direction: 'column',
    alignItems: 'flex-start',
  },
  mailTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  formContent: {},
  IconMargin: {
    marginRight: theme.spacing(2),
  },
  addIcon: {
    marginLeft: theme.spacing(1),
  },
  editIcon: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '-20px',
  },
});

export default compose(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationDialog);
