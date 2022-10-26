import React from 'react';
import isEqual from 'lodash/isEqual';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';

import { Theme, withStyles, Paper, WithStyles } from '@material-ui/core';

import { OptionCallback } from '../../../../state/types';
import CommunicationRecipientsModal from './ModalRecipient/CommunicationRecipientsModal.component';
import CommunicationTemplateModal from './ModalTemplate/CommunicationTemplateModal.component';
import CommunicationWriteEmail from './Writers/CommunicationWriteEmail.component';
import CommunicationWriteNotification from './Writers/CommunicationWriteNotification.component';
import CommunicationWriteSMS from './Writers/CommunicationWriteSMS.component';
import BottomBarIcons from './CommunicationSendMessageBottomBarIcons.component';
import HTMLPreviewDialog from '#components/html/HTMLPreviewDialog.component';

import { Member, MemberMinimal } from '#libs/member/types';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#libs/email-editor/types';

import { getAvailableTagsFromContext } from '#libs/communication-v2/utils';
import {
  MAX_LENGTH_PUSH_CONTENT,
  MAX_LENGTH_PUSH_TITLE,
  TEXTFIELD_MAIL_CONTENT,
  TEXTFIELD_MAIL_TITLE,
  TEXTFIELD_NOTIFICATION_CONTENT,
  TEXTFIELD_NOTIFICATION_TITLE,
  TEXTFIELD_SMS_CONTENT,
  WRITE_EMAIL,
  WRITE_SMS,
  WRITE_PUSH_NOTIFICATION,
  CAN_SEND_MESSAGE,
  CAN_NOT_SEND_BECAUSE_MISSING_RECIPIENTS,
  CAN_NOT_SEND_BECAUSE_MISSING_CONTENT,
  CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_A_PHONE_NUMBER,
  CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_AN_EMAIL,
  MAX_DISPLAY,
} from '#libs/communication-v2/constants';
import {
  MessageData,
  FilteringMemberIdsByGenericCategories,
} from '#libs/communication-v2/types';
import { fetchMemberList as fetchMemberListAPI } from '#libs/member/api';

type OwnProps = {
  availableMemberToSendCommunicationIdList: number[];
  availableMemberWithoutEmailToSendCommunicationIdList: number[];
  availableMemberWithoutPhoneToSendCommunicationIdList: number[];
  allMemberCategoryList?: FilteringMemberIdsByGenericCategories;
  communicationKind: number;
  contextIdentifier: number;
  directMember?: Member;
  emailTemplateDetailList: Record<number, EmailTemplateDetail>;
  emailTemplateSummaryList: Array<EmailTemplateSummary>;
  fetchAvailableRecipientMemberIdLists: () => void;
  fetchEmailSummaryList: () => void;
  fetchPaginatedMemberList: (params: any, memberIds: number[]) => void;
  fullScreen: boolean;
  getEmailDetail: (templateId: number) => void;
  loadingMemberList: boolean;
  loadingTemplateSummaryList: boolean;
  loadingTemplateDetailList: boolean;
  memberList: Member[];
  pageSize: number;
  sendCommunication: (data: any, options?: OptionCallback<void>) => void;
  setCommunicationKind: (kind: number, callback?: () => void) => void;
  updateThreadList: (kind: number) => void;
  resolvedGenericTags: ResolvedGenericTags;
};

export type Props = OwnProps & WithTranslation & WithStyles;

type State = {
  availableMemberIds: number[];
  checkedMemberCategoryFilter: number[];
  focusTextField: number;
  mailTitle: string;
  mailContent: string;
  mailTemplateSelected: number;
  notificationContent: string;
  notificationTitle: string;
  openRecipientSelector: boolean;
  openTemplateSelector: boolean;
  openTemplateVisualizer: boolean;
  selectedMembers: number[];
  selectedMemberDetailList: MemberMinimal[];
  selectedMemberDetailListLoading: boolean;
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
      mailTemplateSelected: null,
      mailTitle: '',
      mailContent: '',
      smsContent: '',
      notificationTitle: '',
      notificationContent: '',
      focusTextField: null,
      openTemplateSelector: false,
      openTemplateVisualizer: false,
      openRecipientSelector: false,
      validity: null,
      availableMemberIds: props.availableMemberToSendCommunicationIdList,
      checkedMemberCategoryFilter:
        props.allMemberCategoryList?.categories?.map(
          (category) => category.categoryIdentifier,
        ) || [],
      selectedMemberDetailList: [],
      selectedMemberDetailListLoading: false,
    };
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (
      !isEqual(
        this.props.availableMemberToSendCommunicationIdList,
        prevProps.availableMemberToSendCommunicationIdList,
      )
    ) {
      this.setState({
        availableMemberIds: this.props.availableMemberToSendCommunicationIdList,
      });
    }
  }

  checkValidity = () => {
    if (!this.props.directMember && this.state.selectedMembers.length === 0) {
      this.setState({ validity: CAN_NOT_SEND_BECAUSE_MISSING_RECIPIENTS });
    } else if (
      !!this.props.directMember &&
      !this.props.directMember.email &&
      this.props.communicationKind === WRITE_EMAIL
    ) {
      this.setState({
        validity: CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_AN_EMAIL,
      });
    } else if (
      !!this.props.directMember &&
      !this.props.directMember.phone_number &&
      this.props.communicationKind === WRITE_SMS
    ) {
      this.setState({
        validity: CAN_NOT_SEND_BECAUSE_DIRECT_MEMBER_HAS_NOT_A_PHONE_NUMBER,
      });
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
    const params = {
      id__in: this.state.selectedMembers.slice(
        0,
        Math.min(this.state.selectedMembers.length, MAX_DISPLAY),
      ),
      page: 1,
      page_size: MAX_DISPLAY,
    };
    if (params.id__in.length === 0) {
      this.setState({ selectedMemberDetailList: [] });
    } else {
      this.setState({ selectedMemberDetailListLoading: true }, () =>
        fetchMemberListAPI(params).then((response) => {
          this.setState({
            selectedMemberDetailListLoading: false,
            selectedMemberDetailList: response.data.results || [],
          });
        }),
      );
    }
  };

  handleCheckMemberCategoryFilter = (nextList: number[]) => {
    this.setState({ checkedMemberCategoryFilter: nextList });
  };

  onBaliseItemClick = (selectedItem: string) => {
    const tagLength = selectedItem?.length + 2; // 2 for the brackets
    if (this.props.communicationKind === WRITE_EMAIL) {
      if (this.state.focusTextField === TEXTFIELD_MAIL_TITLE) {
        this.setState((prevState: State) => ({
          mailTitle: `${prevState.mailTitle}{${selectedItem}}`,
        }));
      } else if (this.state.focusTextField === TEXTFIELD_MAIL_CONTENT) {
        this.setState((prevState: State) => ({
          mailContent: `${prevState.mailContent}{${selectedItem}}`,
        }));
      }
    } else if (
      this.props.communicationKind === WRITE_SMS &&
      this.state.focusTextField === TEXTFIELD_SMS_CONTENT
    ) {
      this.setState((prevState: State) => ({
        smsContent: `${prevState.smsContent}{${selectedItem}}`,
      }));
    } else if (this.props.communicationKind === WRITE_PUSH_NOTIFICATION) {
      if (
        this.state.focusTextField === TEXTFIELD_NOTIFICATION_TITLE &&
        this.state.notificationTitle?.length + tagLength <=
          MAX_LENGTH_PUSH_TITLE
      ) {
        this.setState((prevState: State) => ({
          notificationTitle: `${prevState.notificationTitle}{${selectedItem}}`,
        }));
      } else if (
        this.state.focusTextField === TEXTFIELD_NOTIFICATION_CONTENT &&
        this.state.notificationContent?.length + tagLength <=
          MAX_LENGTH_PUSH_CONTENT
      ) {
        this.setState((prevState: State) => ({
          notificationContent: `${prevState.notificationContent}{${selectedItem}}`,
        }));
      }
    }
  };

  onCloseHTMLPreviewDialog = () =>
    this.setState({ openTemplateVisualizer: false });

  sendMessageWithFlushEditAndRefreshCallback = (data: MessageData) => {
    const onSuccess = () => {
      this.setState({
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
        openTemplateVisualizer: false,
        validity: null,
        availableMemberIds: this.props.availableMemberToSendCommunicationIdList,
        checkedMemberCategoryFilter: [],
        selectedMemberDetailList: [],
        selectedMemberDetailListLoading: false,
      });
      this.props.updateThreadList(this.props.communicationKind);
    };
    this.props.sendCommunication(data, { onSuccess });
  };

  sendMessage = () => {
    const members = this.props.directMember
      ? [this.props.directMember.id]
      : this.state.selectedMembers;
    switch (this.props.communicationKind) {
      case WRITE_EMAIL:
        if (this.state.mailTemplateSelected) {
          this.sendMessageWithFlushEditAndRefreshCallback({
            subject: this.state.mailTitle,
            members,
            email_template: this.state.mailTemplateSelected,
          });
        } else {
          this.sendMessageWithFlushEditAndRefreshCallback({
            subject: this.state.mailTitle,
            members,
            body: this.state.mailContent,
          });
        }
        break;
      case WRITE_SMS:
        this.sendMessageWithFlushEditAndRefreshCallback({
          members,
          sms: this.state.smsContent,
        });
        break;
      case WRITE_PUSH_NOTIFICATION:
        this.sendMessageWithFlushEditAndRefreshCallback({
          members,
          notification_title: this.state.notificationTitle,
          notification_content: this.state.notificationContent,
        });
        break;
      default:
        break;
    }
  };

  setAllIds = (idsList: number[], callback: () => void) =>
    this.setState({ availableMemberIds: idsList }, callback);

  setUncheckedMembers = (uncheckedIds: number[]) => {
    this.setState({ uncheckedMembers: uncheckedIds });

    if (!this.state.availableMemberIds) {
      this.setState({
        selectedMembers: [],
      });
    } else {
      let selectedMembersIds: number[];
      switch (this.props.communicationKind) {
        case WRITE_SMS:
          // First, get members with phone number, then return those checked
          selectedMembersIds = this.state.availableMemberIds
            .filter(
              (memberId) =>
                !this.props.availableMemberWithoutPhoneToSendCommunicationIdList?.includes(
                  memberId,
                ),
            )
            .filter((memberId) => !uncheckedIds.includes(memberId));
          break;
        case WRITE_EMAIL:
          selectedMembersIds = this.state.availableMemberIds
            .filter(
              (memberId) =>
                !this.props.availableMemberWithoutEmailToSendCommunicationIdList?.includes(
                  memberId,
                ),
            )
            .filter((memberId) => !uncheckedIds.includes(memberId));
          break;
        case WRITE_PUSH_NOTIFICATION:
          selectedMembersIds = this.state.availableMemberIds.filter(
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
    const onSeeTemplate = () => this.setState({ openTemplateVisualizer: true });
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
        refreshTemplateData={this.props.getEmailDetail}
        resolvedGenericTags={this.props.resolvedGenericTags}
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
    const tags = getAvailableTagsFromContext(this.props.contextIdentifier);
    return (
      <BottomBarIcons
        actionType={this.props.communicationKind}
        allSelectedMembers={this.state.selectedMembers}
        directMember={this.props.directMember}
        fullScreen={this.props.fullScreen}
        handleSelectTemplate={onSelectTemplate}
        handleSelectRecipients={onSelectRecipients}
        memberList={this.state.selectedMemberDetailList}
        memberListLoading={this.state.selectedMemberDetailListLoading}
        onBaliseItemClick={this.onBaliseItemClick}
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
        fetchEmailSummaryList={this.props.fetchEmailSummaryList}
        fullScreen={this.props.fullScreen}
        getEmailDetail={this.props.getEmailDetail}
        open={this.state.openTemplateSelector}
        selectedTemplate={this.state.mailTemplateSelected}
        selectedTitle={this.state.mailTitle}
        setTemplate={setTemplate}
        setTitle={setTitle}
        resolvedGenericTags={this.props.resolvedGenericTags}
      />
    );
  };

  renderRecipientSelector = () => {
    const handleCloseDialog = () =>
      this.setState({ openRecipientSelector: false });
    return (
      <CommunicationRecipientsModal
        availableMemberIdList={this.state.availableMemberIds}
        availableMemberWithoutEmailIdList={this.props.availableMemberWithoutEmailToSendCommunicationIdList.filter(
          (id: number) => this.state.availableMemberIds.includes(id),
        )}
        availableMemberWithoutPhoneIdList={this.props.availableMemberWithoutPhoneToSendCommunicationIdList.filter(
          (id: number) => this.state.availableMemberIds.includes(id),
        )}
        allMemberCategoryList={this.props.allMemberCategoryList}
        checkedMemberCategoriesFilters={this.state.checkedMemberCategoryFilter}
        fetchAvailableRecipientMemberIdLists={
          this.props.fetchAvailableRecipientMemberIdLists
        }
        fetchPaginatedMemberList={this.props.fetchPaginatedMemberList}
        fullScreen={this.props.fullScreen}
        handleCloseDialog={handleCloseDialog}
        kind={this.props.communicationKind}
        loadingMemberList={this.props.loadingMemberList}
        memberList={this.props.memberList}
        open={this.state.openRecipientSelector}
        pageSize={this.props.pageSize}
        setAvailableMemberIdList={this.setAllIds}
        setCheckedMemberCategoriesFilters={this.handleCheckMemberCategoryFilter}
        setUncheckedMembers={this.setUncheckedMembers}
        uncheckedMembers={this.state.uncheckedMembers}
      />
    );
  };

  render() {
    const html =
      !this.props.loadingTemplateDetailList &&
      this.props.emailTemplateDetailList?.[this.state.mailTemplateSelected]
        ?.html;
    return (
      <Paper className={this.props.classes.mainContainer}>
        {this.props.communicationKind === WRITE_EMAIL &&
          this.renderWriteEmail()}
        {this.props.communicationKind === WRITE_SMS && this.renderWriteSms()}
        {this.props.communicationKind === WRITE_PUSH_NOTIFICATION &&
          this.renderWriteNotification()}
        {this.renderRecipientSelector()}
        {this.state.openTemplateSelector &&
          this.props.communicationKind === WRITE_EMAIL &&
          this.renderEmailTemplateSelector()}
        {this.state.openTemplateVisualizer &&
          this.props.communicationKind === WRITE_EMAIL &&
          !!html && (
            <HTMLPreviewDialog
              open={this.state.openTemplateVisualizer}
              onClose={this.onCloseHTMLPreviewDialog}
              html={html}
              title={this.state.mailTitle}
              resolvedGenericTags={this.props.resolvedGenericTags}
            />
          )}
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
    borderTopWidth: 1,
    borderTopColor: theme.palette.divider,
    borderTopStyle: 'solid',
    borderRadius: 0,
  },
});

export default compose<any, OwnProps>(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationSendMessageContainer);
