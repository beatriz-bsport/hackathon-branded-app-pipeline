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

import type { MemberMailData } from '../types';

const WRITE_EMAIL = 0;
const SELECT_EMAIL = 1;
const SEND_SMS = 2;

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

export class SendMailToMembers extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openRefreshDialog: false,
      unCheckedMembers: [],
      mailTitle: props.mailDefaultTitle || null,
      mailContent: '',
      // eslint-disable-next-line
      actionType: props.actionType ? props.actionType : SELECT_EMAIL,
      selectedTemplate: null,
      smsContent: '',
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
        {this.props.hideWrittenMail ? null : (
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
        {this.props.hideTemplateMail ? null : (
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
      </div>
    );
  };

  onClose = () => {
    this.setState({
      unCheckedMembers: [],
      mailTitle: this.props.mailDefaultTitle || null,
      mailContent: '',
      // eslint-disable-next-line
      actionType: this.props.actionType ? this.props.actionType : SELECT_EMAIL,
      selectedTemplate: null,
      smsContent: '',
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
    if (this.state.actionType === WRITE_EMAIL) {
      return (
        this.state.mailContent === '' ||
        this.state.mailTitle === '' ||
        this.props.allIdsWithEmail.filter(
          (item) => !this.state.unCheckedMembers.includes(item),
        ).length === 0
      );
    }
    if (this.state.actionType === SELECT_EMAIL) {
      return (
        !this.state.selectedTemplate ||
        this.state.mailTitle === '' ||
        this.props.allIdsWithEmail.filter(
          (item) => !this.state.unCheckedMembers.includes(item),
        ).length === 0
      );
    }
    if (this.state.actionType === SEND_SMS) {
      return (
        this.state.smsContent === '' ||
        this.props.allIdsWithPhone.filter(
          (item) => !this.state.unCheckedMembers.includes(item),
        ).length === 0
      );
    }
    return false;
  };

  render() {
    const { t, send, onCancel, classes, fullScreen, open } = this.props;
    return (
      <Dialog fullScreen={fullScreen} open={open}>
        <div className={classes.title}>
          <DialogTitle>{t('mail.dialogTitle')}</DialogTitle>
        </div>
        <DialogContent>
          <div className={classes.sendMailDialogBox}>
            <form
              className={classes.formContent}
              onSubmit={(ev) => {
                ev.preventDefault();
                if (this.state.actionType === WRITE_EMAIL) {
                  send({
                    members: this.props.allIdsWithEmail.filter(
                      (item) => !this.state.unCheckedMembers.includes(item),
                    ),
                    subject: this.state.mailTitle,
                    body: this.state.mailContent,
                  });
                } else if (this.state.actionType === SEND_SMS) {
                  send({
                    members: this.props.allIdsWithPhone.filter(
                      (item) => !this.state.unCheckedMembers.includes(item),
                    ),
                    sms: this.state.smsContent,
                  });
                } else {
                  send({
                    members: this.props.allIdsWithEmail.filter(
                      (item) => !this.state.unCheckedMembers.includes(item),
                    ),
                    email_template: this.state.selectedTemplate,
                    subject: this.state.mailTitle,
                  });
                }
                this.onClose();
                onCancel();
              }}
            >
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
                members={this.props.membersToDisplay}
                membersCount={this.props.allIds.length}
                page_size={this.state.page_size}
                page={this.props.page}
                fetchPreviousPage={() =>
                  this.props.fetchPreviousPage(
                    this.props.page,
                    this.state.page_size,
                  )
                }
                fetchNextPage={() =>
                  this.props.fetchNextPage(
                    this.props.page,
                    this.state.page_size,
                  )
                }
                checkedMembers={
                  this.state.actionType === SEND_SMS
                    ? this.props.allIdsWithPhone.filter(
                        (item) => !this.state.unCheckedMembers.includes(item),
                      )
                    : this.props.allIdsWithEmail.filter(
                        (item) => !this.state.unCheckedMembers.includes(item),
                      )
                }
                keyword={this.state.actionType === SEND_SMS ? 'phone' : 'email'}
                receiversNotEditable={this.props.receiversNotEditable}
                handleToggle={this.handleToggle}
                openMemberPage={this.openMemberPage}
                loading={this.props.membersAllLoading}
                membersByPageLoading={this.props.membersByPageLoading}
              />
              {this.state.actionType === SELECT_EMAIL &&
              !this.props.hideTemplateMail ? (
                <SelectTemplate
                  title={this.state.mailTitle}
                  selectedMail={this.state.selectedTemplate}
                  onChangeTitle={(text) => this.setState({ mailTitle: text })}
                  onChangeTemplate={(id) => {
                    this.setState({
                      selectedTemplate: id,
                    });
                    if (id) {
                      this.setState({
                        mailTitle: this.props.emails.find(
                          (email) => email.id === id,
                        ).subject,
                      });
                    } else {
                      this.setState({
                        mailTitle: '',
                      });
                    }
                  }}
                  onCancel={onCancel}
                  getEmails={this.props.getEmails}
                  getEmailDetail={this.props.getEmailDetail}
                  emailListLoading={this.props.emailListLoading}
                  emails={this.props.emails}
                  emailDetailLoading={this.props.emailDetailLoading}
                  emailDetails={this.props.emailDetails}
                  mailDefaultTitle={this.props.mailDefaultTitle}
                />
              ) : null}
              {this.state.actionType === WRITE_EMAIL &&
              !this.props.hideWrittenMail ? (
                <WriteEmail
                  mailContent={this.state.mailContent}
                  title={this.state.mailTitle}
                  onChangeContent={(text) =>
                    this.setState({ mailContent: text })
                  }
                  onChangeTitle={(text) => this.setState({ mailTitle: text })}
                />
              ) : null}
              {this.state.actionType === SEND_SMS ? (
                <WriteSMS
                  smsContent={this.state.smsContent}
                  countReceivers={
                    this.props.allIdsWithPhone.filter(
                      (item) => !this.state.unCheckedMembers.includes(item),
                    ).length
                  }
                  onChangeContent={(text) =>
                    this.setState({ smsContent: text })
                  }
                />
              ) : null}
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
)(SendMailToMembers);
