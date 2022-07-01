import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';

import { Theme, withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import CommunicationRecipientsModal from './CommunicationRecipientsModal.component';
import CommunicationTemplateModal from './CommunicationTemplateModal.component';
import CommunicationWriteEmail from './CommunicationWriteEmail.component';
import CommunicationWriteNotification from './CommunicationWriteNotification.component';
import CommunicationWriteSMS from './CommunicationWriteSMS.component';
import BottomBarIcons from './CommunicationSendMessageBottomBarIcons.component';

import { Member } from '#libs/member/types';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '../../email-editor/types';

import {
  TEXTFIELD_MAIL_CONTENT,
  TEXTFIELD_MAIL_TITLE,
  TEXTFIELD_NOTIFICATION_CONTENT,
  TEXTFIELD_NOTIFICATION_TITLE,
  TEXTFIELD_SMS_CONTENT,
  WRITE_EMAIL,
  WRITE_SMS,
  WRITE_PUSH_NOTIFICATION,
  CAN_NOT_SEND_BECAUSE_MISSING_RECIPIENTS,
  CAN_NOT_SEND_BECAUSE_MISSING_CONTENT,
  CAN_SEND_MESSAGE,
} from '../constants';

const MAX_DISPLAY = 4;

export type Props = {
  actionType?: number;
  allIds: number[];
  allIdsWithoutPhone: number[];
  allIdsWithoutEmail: number[];
  classes: any;
  fullScreen: boolean;
  directMember?: Member;
  emailTemplateDetails: Array<EmailTemplateDetail>;
  emailTemplateSummaries: Array<EmailTemplateSummary>;
  fetchPage: (page: number) => void;
  getEmailDetail: (templateId: number) => void;
  getSelectedMembersDetails: (memberIds: number[]) => void;
  loadingMembersList: boolean;
  loadingTemplateSummaries: boolean;
  loadingTemplateDetails: boolean;
  membersList: Member[];
  pageSize: number;
  selectedMembersList: Member[];
  sendMessage: (data: any) => void;
  tags: Record<string, Array<string>>;
} & WithTranslation;

type State = {
  actionType: number;
  focusTextField: number;
  mailTitle: string;
  mailContent: string;
  mailTemplateSelected: number;
  notificationContent: string;
  notificationTitle: string;
  openRecipientSelector: boolean;
  openTemplateSelector: boolean;
  selectedMembers: number[];
  smsContent: string;
  uncheckedMembers: number[];
  validity: number;
};

export class CommunicationSendMessageContainer extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      actionType: props.actionType ?? WRITE_EMAIL,
      uncheckedMembers: [],
      selectedMembers: [],
      mailTemplateSelected: null,
      mailTitle: '',
      mailContent: '',
      smsContent: '',
      notificationTitle: '',
      notificationContent: '',
      focusTextField: null,
      openTemplateSelector: false,
      openRecipientSelector: false,
      validity: null,
    };
  }

  checkValidity = () => {
    if (!this.props.directMember && this.state.selectedMembers.length === 0) {
      this.setState({ validity: CAN_NOT_SEND_BECAUSE_MISSING_RECIPIENTS });
    } else {
      switch (this.state.actionType) {
        case WRITE_EMAIL:
          this.setState((prevState: State) => ({
            validity:
              (prevState.mailTitle === '' || prevState.mailContent === '') &&
              (prevState.mailTitle === '' ||
                prevState.mailTemplateSelected === null)
                ? CAN_NOT_SEND_BECAUSE_MISSING_CONTENT
                : CAN_SEND_MESSAGE,
          }));
          break;
        case WRITE_SMS:
          this.setState((prevState: State) => ({
            validity:
              prevState.smsContent === ''
                ? CAN_NOT_SEND_BECAUSE_MISSING_CONTENT
                : CAN_SEND_MESSAGE,
          }));
          break;
        case WRITE_PUSH_NOTIFICATION:
          this.setState((prevState: State) => ({
            validity:
              prevState.notificationTitle === '' ||
              prevState.notificationContent === ''
                ? CAN_NOT_SEND_BECAUSE_MISSING_CONTENT
                : CAN_SEND_MESSAGE,
          }));
          break;
        default:
          this.setState({ validity: CAN_SEND_MESSAGE });
          break;
      }
    }
  };

  getSelectedMembersDetails = () => {
    this.checkValidity();
    if (this.state.selectedMembers?.length > MAX_DISPLAY) {
      this.props.getSelectedMembersDetails(
        this.state.selectedMembers.slice(MAX_DISPLAY),
      );
    } else {
      this.props.getSelectedMembersDetails(this.state.selectedMembers);
    }
  };

  onBaliseItemClick = (selectedItem: string) => {
    if (this.state.actionType === WRITE_EMAIL) {
      if (this.state.focusTextField === TEXTFIELD_MAIL_TITLE) {
        this.setState((prevState: State) => ({
          mailTitle: `${prevState.mailTitle}{${selectedItem}} `,
        }));
      } else if (this.state.focusTextField === TEXTFIELD_MAIL_CONTENT) {
        this.setState((prevState: State) => ({
          mailContent: `${prevState.mailContent}{${selectedItem}} `,
        }));
      }
    } else if (
      this.state.actionType === WRITE_SMS &&
      this.state.focusTextField === TEXTFIELD_SMS_CONTENT
    ) {
      this.setState((prevState: State) => ({
        smsContent: `${prevState.smsContent}{${selectedItem}} `,
      }));
    } else if (this.state.actionType === WRITE_PUSH_NOTIFICATION) {
      if (this.state.focusTextField === TEXTFIELD_NOTIFICATION_TITLE) {
        this.setState((prevState: State) => ({
          notificationTitle: `${prevState.notificationTitle}{${selectedItem}} `,
        }));
      } else if (this.state.focusTextField === TEXTFIELD_NOTIFICATION_CONTENT) {
        this.setState((prevState: State) => ({
          notificationContent: `${prevState.notificationContent}{${selectedItem}} `,
        }));
      }
    }
  };

  sendMessage = () => {
    const members = this.state.selectedMembers;
    if (this.state.actionType === WRITE_EMAIL) {
      const data = {
        subject: this.state.mailTitle,
        members,
      };
      if (this.state.mailTemplateSelected) {
        this.props.sendMessage({
          ...data,
          email_template: this.state.mailTemplateSelected,
        });
      } else {
        this.props.sendMessage({
          ...data,
          body: this.state.mailContent,
        });
      }
    } else if (this.state.actionType === WRITE_SMS) {
      this.props.sendMessage({
        members,
        sms: this.state.smsContent,
      });
    } else if (this.state.actionType === WRITE_PUSH_NOTIFICATION) {
      this.props.sendMessage({
        members,
        notification_title: this.state.notificationTitle,
        notification_content: this.state.notificationContent,
      });
    }
  };

  setUncheckedMembers = (uncheckedIds: number[]) => {
    this.setState({ uncheckedMembers: uncheckedIds });

    if (!this.props.allIds) {
      this.setState({
        selectedMembers: [],
      });
    } else {
      let selectedMembersIds: number[];
      switch (this.state.actionType) {
        case WRITE_SMS:
          // First, get members with phone number, then return those checked
          selectedMembersIds = this.props.allIds
            .filter(
              (memberId) => !this.props.allIdsWithoutPhone?.includes(memberId),
            )
            .filter((memberId) => !uncheckedIds.includes(memberId));
          break;
        case WRITE_EMAIL:
          selectedMembersIds = this.props.allIds
            .filter(
              (memberId) => !this.props.allIdsWithoutEmail?.includes(memberId),
            )
            .filter((memberId) => !uncheckedIds.includes(memberId));
          break;
        case WRITE_PUSH_NOTIFICATION:
          selectedMembersIds = this.props.allIds.filter(
            (memberId) => !uncheckedIds.includes(memberId),
          );
          break;
        default:
          selectedMembersIds = [];
          break;
      }
      this.setState(
        {
          selectedMembers: selectedMembersIds,
        },
        this.getSelectedMembersDetails,
      );
    }
  };

  renderWriteEmail = () => {
    const onSeeTemplate = () => this.setState({ openTemplateSelector: true });
    const onEditTemplate = () => {
      const url = `/email-template/${this.state.mailTemplateSelected}/edit`;
      const win = window.open(url);
      win.focus();
    };
    const onRemoveTemplate = () =>
      this.setState({ mailTemplateSelected: null, mailTitle: '' });
    const handleChangeTitle = (event: React.ChangeEvent) => {
      const target = event.target as HTMLInputElement;
      this.setState({ mailTitle: target.value }, this.checkValidity);
    };
    const handleChangeContent = (event: React.ChangeEvent) => {
      const target = event.target as HTMLInputElement;
      this.setState({ mailContent: target.value }, this.checkValidity);
    };
    const onFocus = (identifier: number) =>
      this.setState({ focusTextField: identifier });
    return (
      <CommunicationWriteEmail
        emailContent={this.state.mailContent}
        emailTemplateDetails={this.props.emailTemplateDetails}
        emailTemplateSelected={this.state.mailTemplateSelected}
        emailTitle={this.state.mailTitle}
        handleChangeContent={handleChangeContent}
        handleChangeTitle={handleChangeTitle}
        loadingTemplateDetails={this.props.loadingTemplateDetails}
        onEditTemplate={onEditTemplate}
        onFocus={onFocus}
        onRemoveTemplate={onRemoveTemplate}
        onSeeTemplate={onSeeTemplate}
      >
        {this.renderBottomIcons()}
      </CommunicationWriteEmail>
    );
  };

  renderWriteSms = () => {
    const handleChangeContent = (event: React.ChangeEvent) => {
      const target = event.target as HTMLInputElement;
      this.setState({ smsContent: target.value }, this.checkValidity);
    };
    const onFocus = () =>
      this.setState({ focusTextField: TEXTFIELD_SMS_CONTENT });
    return (
      <CommunicationWriteSMS
        handleChangeContent={handleChangeContent}
        onFocus={onFocus}
        smsContent={this.state.smsContent}
      >
        {this.renderBottomIcons()}
      </CommunicationWriteSMS>
    );
  };

  renderWriteNotification = () => {
    const handleChangeTitle = (event: React.ChangeEvent) => {
      const target = event.target as HTMLInputElement;
      this.setState({ notificationTitle: target.value }, this.checkValidity);
    };
    const handleChangeContent = (event: React.ChangeEvent) => {
      const target = event.target as HTMLInputElement;
      this.setState({ notificationContent: target.value }, this.checkValidity);
    };
    const onFocus = (identifier: number) =>
      this.setState({ focusTextField: identifier });
    return (
      <CommunicationWriteNotification
        handleChangeContent={handleChangeContent}
        handleChangeTitle={handleChangeTitle}
        notificationContent={this.state.notificationContent}
        notificationTitle={this.state.notificationTitle}
        onFocus={onFocus}
      >
        {this.renderBottomIcons()}
      </CommunicationWriteNotification>
    );
  };

  renderBottomIcons = () => {
    const onSelectTemplate = () => {
      this.setState({ openTemplateSelector: true });
    };
    const onSelectRecipients = () =>
      this.setState({ openRecipientSelector: true });
    const setActionType = (action: number) => {
      this.setState(
        {
          actionType: action,
        },
        this.checkValidity,
      );
    };
    return (
      <BottomBarIcons
        actionType={this.state.actionType}
        allSelectedMembers={this.state.selectedMembers}
        directMember={this.props.directMember}
        fullScreen={this.props.fullScreen}
        handleSelectTemplate={onSelectTemplate}
        handleSelectRecipients={onSelectRecipients}
        membersList={this.props.membersList}
        onBaliseItemClick={this.onBaliseItemClick}
        selectedMembersList={this.props.selectedMembersList}
        sendMessage={this.sendMessage}
        setActionType={setActionType}
        tags={this.props.tags}
        validity={this.state.validity}
      />
    );
  };

  renderEmailTemplateSelector = () => {
    const onClose = () => this.setState({ openTemplateSelector: false });
    const setTitle = (title: string) => this.setState({ mailTitle: title });
    const setTemplate = (templateId: number) =>
      this.setState({ mailTemplateSelected: templateId });

    return (
      <CommunicationTemplateModal
        closeDialog={onClose}
        emailDetailLoading={this.props.loadingTemplateDetails}
        emailDetails={this.props.emailTemplateDetails}
        emailSummariesLoading={this.props.loadingTemplateSummaries}
        emailSummaries={this.props.emailTemplateSummaries}
        fullScreen={this.props.fullScreen}
        getEmailDetail={this.props.getEmailDetail}
        open={this.state.openTemplateSelector}
        selectedTemplate={this.state.mailTemplateSelected}
        selectedTitle={this.state.mailTitle}
        setTemplate={setTemplate}
        setTitle={setTitle}
      />
    );
  };

  renderRecipientSelector = () => {
    const handleCloseDialog = () =>
      this.setState({ openRecipientSelector: false });
    return (
      <CommunicationRecipientsModal
        allIds={this.props.allIds}
        allIdsWithoutEmail={this.props.allIdsWithoutEmail}
        allIdsWithoutPhone={this.props.allIdsWithoutPhone}
        fetchPage={this.props.fetchPage}
        fullScreen={this.props.fullScreen}
        handleCloseDialog={handleCloseDialog}
        kind={this.state.actionType}
        loadingMembersList={this.props.loadingMembersList}
        membersList={this.props.membersList}
        open={this.state.openRecipientSelector}
        pageSize={this.props.pageSize}
        setUncheckedMembers={this.setUncheckedMembers}
        uncheckedMembers={this.state.uncheckedMembers}
      />
    );
  };

  render() {
    return (
      <Paper className={this.props.classes.mainContainer}>
        {this.state.actionType === WRITE_EMAIL && this.renderWriteEmail()}
        {this.state.actionType === WRITE_SMS && this.renderWriteSms()}
        {this.state.actionType === WRITE_PUSH_NOTIFICATION &&
          this.renderWriteNotification()}
        {this.state.openRecipientSelector && this.renderRecipientSelector()}
        {this.state.openTemplateSelector &&
          this.state.actionType === WRITE_EMAIL &&
          this.renderEmailTemplateSelector()}
      </Paper>
    );
  }
}

const styles = (theme: Theme) => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationSendMessageContainer);
