import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';

import { Theme, withStyles, Paper, WithStyles } from '@material-ui/core';

import { OptionCallback } from '../../../state/types';
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

type OwnProps = {
  allIds: number[];
  allIdsWithoutPhone: number[];
  allIdsWithoutEmail: number[];
  canFilterRecipients?: boolean;
  communicationKind: number;
  directMember?: Member;
  emailTemplateDetailList: Array<EmailTemplateDetail>;
  emailTemplateSummaryList: Array<EmailTemplateSummary>;
  fetchRecipientsPage: (page: number, filters: number[]) => void;
  fetchSelectedMemberList: (memberIds: number[]) => void;
  fullScreen: boolean;
  getEmailDetail: (templateId: number) => void;
  loadingMemberList: boolean;
  loadingTemplateSummaryList: boolean;
  loadingTemplateDetailList: boolean;
  memberList: Member[];
  pageSize: number;
  selectedMemberList: Member[];
  sendCommunication: (data: any, options?: OptionCallback<void>) => void;
  setCommunicationKind: (kind: number, callback?: () => void) => void;
};

export type Props = OwnProps & WithTranslation & WithStyles;

type State = {
  focusTextField: number;
  mailTitle: string;
  mailContent: string;
  mailTemplateSelected: number;
  notificationContent: string;
  notificationTitle: string;
  openRecipientSelector: boolean;
  openTemplateSelector: boolean;
  recipientFilterList: number[];
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
      uncheckedMembers: [],
      selectedMembers: [],
      recipientFilterList: [],
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
      switch (this.props.communicationKind) {
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
    this.props.fetchSelectedMemberList(
      this.state.selectedMembers.slice(0, MAX_DISPLAY),
    );
  };

  onBaliseItemClick = (selectedItem: string) => {
    if (this.props.communicationKind === WRITE_EMAIL) {
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
      this.props.communicationKind === WRITE_SMS &&
      this.state.focusTextField === TEXTFIELD_SMS_CONTENT
    ) {
      this.setState((prevState: State) => ({
        smsContent: `${prevState.smsContent}{${selectedItem}} `,
      }));
    } else if (this.props.communicationKind === WRITE_PUSH_NOTIFICATION) {
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

  sendMessageWithFlushEditCallback = (data: any) => {
    const onSuccess = () =>
      this.setState({
        uncheckedMembers: [],
        selectedMembers: [],
        recipientFilterList: [],
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
      });
    this.props.sendCommunication(data, { onSuccess });
  };

  sendMessage = () => {
    const members = this.props.directMember
      ? [this.props.directMember.id]
      : this.state.selectedMembers;
    switch (this.props.communicationKind) {
      case WRITE_EMAIL:
        if (this.state.mailTemplateSelected) {
          this.sendMessageWithFlushEditCallback({
            subject: this.state.mailTitle,
            members,
            email_template: this.state.mailTemplateSelected,
          });
        } else {
          this.sendMessageWithFlushEditCallback({
            subject: this.state.mailTitle,
            members,
            body: this.state.mailContent,
          });
        }
        break;
      case WRITE_SMS:
        this.sendMessageWithFlushEditCallback({
          members,
          sms: this.state.smsContent,
        });
        break;
      case WRITE_PUSH_NOTIFICATION:
        this.sendMessageWithFlushEditCallback({
          members,
          notification_title: this.state.notificationTitle,
          notification_content: this.state.notificationContent,
        });
        break;
      default:
        break;
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
      switch (this.props.communicationKind) {
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
        emailTemplateDetails={this.props.emailTemplateDetailList}
        emailTemplateSelected={this.state.mailTemplateSelected}
        emailTitle={this.state.mailTitle}
        handleChangeContent={handleChangeContent}
        handleChangeTitle={handleChangeTitle}
        isMobileSize={this.props.fullScreen}
        loadingTemplateDetails={this.props.loadingTemplateDetailList}
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
        isMobileSize={this.props.fullScreen}
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
        isMobileSize={this.props.fullScreen}
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
    const setActionType = (kind: number) => {
      this.props.setCommunicationKind(kind, this.checkValidity);
    };
    const tags = {
      User: ['firstname', 'lastname', 'unsubscribe_link'],
    };
    return (
      <BottomBarIcons
        actionType={this.props.communicationKind}
        allSelectedMembers={this.state.selectedMembers}
        directMember={this.props.directMember}
        fullScreen={this.props.fullScreen}
        handleSelectTemplate={onSelectTemplate}
        handleSelectRecipients={onSelectRecipients}
        memberList={this.props.memberList}
        onBaliseItemClick={this.onBaliseItemClick}
        selectedMemberList={this.props.selectedMemberList}
        sendMessage={this.sendMessage}
        setActionType={setActionType}
        tags={tags}
        validity={this.state.validity}
      />
    );
  };

  renderEmailTemplateSelector = () => {
    const onClose = () => this.setState({ openTemplateSelector: false });
    const setTitle = (title: string) => this.setState({ mailTitle: title });
    const setTemplate = (templateId: number) =>
      this.setState({ mailTemplateSelected: templateId }, this.checkValidity);

    return (
      <CommunicationTemplateModal
        closeDialog={onClose}
        emailDetailListLoading={this.props.loadingTemplateDetailList}
        emailDetailList={this.props.emailTemplateDetailList}
        emailSummaryListLoading={this.props.loadingTemplateSummaryList}
        emailSummaryList={this.props.emailTemplateSummaryList}
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
    const setRecipientFilterList = this.props.canFilterRecipients
      ? (filterList: number[], callback: () => void) =>
          this.setState({ recipientFilterList: filterList }, callback)
      : undefined;
    return (
      <CommunicationRecipientsModal
        allIds={this.props.allIds}
        allIdsWithoutEmail={this.props.allIdsWithoutEmail}
        allIdsWithoutPhone={this.props.allIdsWithoutPhone}
        fetchPage={this.props.fetchRecipientsPage}
        fullScreen={this.props.fullScreen}
        handleCloseDialog={handleCloseDialog}
        kind={this.props.communicationKind}
        loadingMemberList={this.props.loadingMemberList}
        memberList={this.props.memberList}
        open={this.state.openRecipientSelector}
        pageSize={this.props.pageSize}
        selectedFilters={this.state.recipientFilterList}
        setSelectedFilters={setRecipientFilterList}
        setUncheckedMembers={this.setUncheckedMembers}
        uncheckedMembers={this.state.uncheckedMembers}
      />
    );
  };

  render() {
    return (
      <Paper className={this.props.classes.mainContainer}>
        {this.props.communicationKind === WRITE_EMAIL &&
          this.renderWriteEmail()}
        {this.props.communicationKind === WRITE_SMS && this.renderWriteSms()}
        {this.props.communicationKind === WRITE_PUSH_NOTIFICATION &&
          this.renderWriteNotification()}
        {this.state.openRecipientSelector && this.renderRecipientSelector()}
        {this.state.openTemplateSelector &&
          this.props.communicationKind === WRITE_EMAIL &&
          this.renderEmailTemplateSelector()}
      </Paper>
    );
  }
}

const styles: any = (theme: Theme) => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationSendMessageContainer);
