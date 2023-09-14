import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';

import { Theme, withStyles, Paper, WithStyles } from '@material-ui/core';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox';
import { OptionCallback } from '../../../../state/types';
import CommunicationRecipientsModal from './ModalRecipient/CommunicationRecipientsModal.component';
import CommunicationTemplateModal from './ModalTemplate/CommunicationTemplateModal.component';
import CommunicationWriteEmail from './Writers/CommunicationWriteEmail.component';
import CommunicationWriteNotification from './Writers/CommunicationWriteNotification.component';
import CommunicationWriteSMS from './Writers/CommunicationWriteSMS.component';
import BottomBarIcons from './CommunicationSendMessageBottomBarIcons.component';
import HTMLPreviewDialog from '#components/html/HTMLPreviewDialog.component';
import AutoResendConfigDialog from '#libs/communication-v2/components/AutoResendConfigDialog';

import { Member, MemberMinimal } from '#libs/member/types';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
  ResolvedGenericTags,
} from '#libs/email-editor/types';

import {
  getAvailableTagsFromContext,
  getAvailableTagsFromThread,
  getFormatedQueryParamsFromContext,
  getFormatedQueryParamsFromThread,
} from '#libs/communication-v2/utils';
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
} from '#libs/communication-v2/constants';
import {
  MessageData,
  FilteringMemberIdsByGenericCategories,
} from '#libs/communication-v2/types';
import { fetchFirstSelectedRecipientsForChatAllKinds as fetchFirstSelectedRecipientsForChatAllKindsAPI } from '#libs/communication-v2/api';

type OwnProps = {
  allMemberCategoryList?: FilteringMemberIdsByGenericCategories;
  communicationKind: number;
  contextIdentifier?: number;
  contextObjectId?: number;
  relatedObjectKind?: ChatThreadKinds;
  relatedObjectId?: number;
  countAvailableRecipientsTotal: number;
  countAvailableRecipientsWithEmail: number;
  countAvailableRecipientsWithPhone: number;
  directMember?: Member;
  emailTemplateDetailList: Record<number, EmailTemplateDetail>;
  emailTemplateSummaryList: Array<EmailTemplateSummary>;
  fetchEmailSummaryList: () => void;
  fetchPaginatedAvailableRecipientMemberList: (
    page: number,
    memberSelectedCategories?: number[],
  ) => void;
  fullScreen?: boolean;
  getEmailDetail: (templateId: number) => void;
  loadingPaginatedMemberList: boolean;
  loadingTemplateSummaryList: boolean;
  loadingTemplateDetailList: boolean;
  paginatedMemberList: Member[];
  pageSize: number;
  sendCommunication: (
    data: MessageData,
    memberSelectedCategories: number[],
    options?: OptionCallback<void>,
  ) => void;
  setCommunicationKind: (kind: number, callback?: () => void) => void;
  resetPaginatedAvailableRecipientMemberList: (options: OptionCallback) => void;
  resolvedGenericTags: ResolvedGenericTags;
  tagCategories: { [tag_name: string]: string[] };
  hideAutoResend?: boolean;
};

export type Props = OwnProps & WithTranslation & WithStyles;

type State = {
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
  selectedMemberDetailListAllKinds: {
    email: MemberMinimal[];
    phone: MemberMinimal[];
    notification: MemberMinimal[];
  };
  selectedMemberDetailListLoading: boolean;
  smsContent: string;
  uncheckedMembers: {
    email: number[];
    phone: number[];
    notification: number[];
  };
  validity: number;
  autoResendConfigDialogOpen: boolean;
  resendCount: number;
  resendDelay: number;
};

export class CommunicationSendMessageContainer extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      uncheckedMembers: {
        email: [],
        phone: [],
        notification: [],
      },
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
      checkedMemberCategoryFilter: [],
      selectedMemberDetailListAllKinds: {
        email: [],
        phone: [],
        notification: [],
      },
      selectedMemberDetailListLoading: false,
      autoResendConfigDialogOpen: false,
      resendCount: 0,
      resendDelay: 0,
    };
  }

  componentDidMount() {
    this.getSelectedMembersDetailsAllKinds();
  }

  openResendConfigDialog = () =>
    this.setState({ autoResendConfigDialogOpen: true });

  closeResendConfigDialog = () =>
    this.setState({ autoResendConfigDialogOpen: false });

  setResendConfig = (data: { resendCount: number; resendDelay: number }) =>
    this.setState(data, this.closeResendConfigDialog);

  checkValidity = () => {
    const countSelectedRecipients = this.getSelectedRecipientsCount();
    if (!this.props.directMember && countSelectedRecipients === 0) {
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

  fetchPaginatedAvailableRecipientMemberList = (page: number) => {
    this.props.fetchPaginatedAvailableRecipientMemberList(
      page,
      this.state.checkedMemberCategoryFilter || [],
    );
  };

  getRecipientBlacklist = (): Array<number> => {
    switch (this.props.communicationKind) {
      case WRITE_EMAIL:
        return this.state.uncheckedMembers.email;
      case WRITE_SMS:
        return this.state.uncheckedMembers.phone;
      case WRITE_PUSH_NOTIFICATION:
        return this.state.uncheckedMembers.notification;
      default:
        return [];
    }
  };

  getSelectedMembersDetailsAllKinds = () => {
    this.checkValidity();

    const {
      relatedObjectKind,
      relatedObjectId,
      contextIdentifier,
      contextObjectId,
    } = this.props;

    let contextParams = {};
    if (relatedObjectKind && relatedObjectId) {
      contextParams = getFormatedQueryParamsFromThread(
        relatedObjectKind,
        relatedObjectId,
        this.state.checkedMemberCategoryFilter,
      );
    } else if (contextIdentifier && contextObjectId) {
      contextParams = getFormatedQueryParamsFromContext(
        contextIdentifier,
        contextObjectId,
        this.state.checkedMemberCategoryFilter,
      );
    }
    const params = {
      ...contextParams,
      blacklist_email: this.state.uncheckedMembers.email,
      blacklist_phone: this.state.uncheckedMembers.phone,
      blacklist_notification: this.state.uncheckedMembers.notification,
    };
    this.setState({ selectedMemberDetailListLoading: true }, () =>
      fetchFirstSelectedRecipientsForChatAllKindsAPI(params)
        .then((response) => {
          this.setState({
            selectedMemberDetailListLoading: false,
            selectedMemberDetailListAllKinds: {
              email: response.data.email || [],
              phone: response.data.phone || [],
              notification: response.data.notification || [],
            },
          });
        })
        .catch((error) => {
          this.setState({
            selectedMemberDetailListLoading: false,
          });
          console.error(error);
        }),
    );
  };

  getSelectedRecipientsCount = () => {
    switch (this.props.communicationKind) {
      case WRITE_EMAIL:
        return (
          this.props.countAvailableRecipientsWithEmail -
          this.state.uncheckedMembers.email.length
        );
      case WRITE_SMS:
        return (
          this.props.countAvailableRecipientsWithPhone -
          this.state.uncheckedMembers.phone.length
        );
      case WRITE_PUSH_NOTIFICATION:
        return (
          this.props.countAvailableRecipientsTotal -
          this.state.uncheckedMembers.notification.length
        );
      default:
        return 0;
    }
  };

  handleCheckMemberCategoryFilter = (
    nextList: number[],
    refreshCountRecipients: () => void,
  ) => {
    this.setState(
      { checkedMemberCategoryFilter: nextList },
      refreshCountRecipients,
    );
  };

  handleCloseRecipientModal = () =>
    this.setState({ openRecipientSelector: false });

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

  flushEditAndRefreshCallback = () => {
    this.setState(
      {
        uncheckedMembers: {
          email: [],
          phone: [],
          notification: [],
        },
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
        checkedMemberCategoryFilter: [],
      },
      this.getSelectedMembersDetailsAllKinds,
    );
  };

  flushEditAndRefreshCallbackWithReset = () => {
    // We reset to an initial state with no selected category and no selected members
    this.props.resetPaginatedAvailableRecipientMemberList({
      onSuccess: this.flushEditAndRefreshCallback,
    });
  };

  sendMessageWithFlushEditAndRefreshCallback = (data: MessageData) => {
    this.props.sendCommunication(data, this.state.checkedMemberCategoryFilter, {
      onSuccess: this.props.allMemberCategoryList
        ? this.flushEditAndRefreshCallbackWithReset
        : this.flushEditAndRefreshCallback,
    });
  };

  sendMessage = () => {
    let content;
    let autoResendConfiguration = {
      resend_delay: 0,
      resend_count: 0,
    };
    switch (this.props.communicationKind) {
      case WRITE_EMAIL:
        if (this.state.mailTemplateSelected) {
          content = {
            subject: this.state.mailTitle,
            email_template: this.state.mailTemplateSelected,
          };
        } else {
          content = {
            subject: this.state.mailTitle,
            body: this.state.mailContent,
          };
        }
        autoResendConfiguration = {
          resend_count: this.state.resendCount,
          resend_delay: this.state.resendDelay,
        };
        break;
      case WRITE_SMS:
        content = {
          sms: this.state.smsContent,
        };
        break;
      case WRITE_PUSH_NOTIFICATION:
        content = {
          notification_title: this.state.notificationTitle,
          notification_content: this.state.notificationContent,
        };
        break;
      default:
        console.error(
          'this.props.communicationKind matches no one of expected kinds.',
        );
        return;
    }
    this.sendMessageWithFlushEditAndRefreshCallback({
      ...content,
      ...autoResendConfiguration,
      member_blacklist: this.getRecipientBlacklist(),
    });
  };

  setUncheckedMembers = (uncheckedIds: {
    email: number[];
    phone: number[];
    notification: number[];
  }) => {
    this.setState(
      { uncheckedMembers: uncheckedIds },
      this.getSelectedMembersDetailsAllKinds,
    );
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

    const tags = this.props.relatedObjectKind
      ? getAvailableTagsFromThread(this.props.tagCategories)
      : getAvailableTagsFromContext(
          this.props.contextIdentifier,
          this.props.tagCategories,
        );

    let selectedMemberDetailList: MemberMinimal[] = [];

    switch (this.props.communicationKind) {
      case WRITE_EMAIL:
        selectedMemberDetailList =
          this.state.selectedMemberDetailListAllKinds.email;
        break;
      case WRITE_SMS:
        selectedMemberDetailList =
          this.state.selectedMemberDetailListAllKinds.phone;
        break;
      case WRITE_PUSH_NOTIFICATION:
        selectedMemberDetailList =
          this.state.selectedMemberDetailListAllKinds.notification;
        break;
      default:
        break;
    }

    return (
      <BottomBarIcons
        actionType={this.props.communicationKind}
        contextIdentifier={this.props.contextIdentifier}
        directMember={this.props.directMember}
        fullScreen={this.props.fullScreen}
        handleSelectRecipients={onSelectRecipients}
        handleSelectTemplate={onSelectTemplate}
        memberList={selectedMemberDetailList}
        memberListLoading={this.state.selectedMemberDetailListLoading}
        onBaliseItemClick={this.onBaliseItemClick}
        openResendConfigDialog={
          !this.props.hideAutoResend && this.openResendConfigDialog
        }
        selectedRecipientsCount={this.getSelectedRecipientsCount()}
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
        emailDetailList={this.props.emailTemplateDetailList}
        emailDetailListLoading={this.props.loadingTemplateDetailList}
        emailSummaryList={this.props.emailTemplateSummaryList}
        emailSummaryListLoading={this.props.loadingTemplateSummaryList}
        fetchEmailSummaryList={this.props.fetchEmailSummaryList}
        fullScreen={this.props.fullScreen}
        getEmailDetail={this.props.getEmailDetail}
        open={this.state.openTemplateSelector}
        resolvedGenericTags={this.props.resolvedGenericTags}
        selectedTemplate={this.state.mailTemplateSelected}
        selectedTitle={this.state.mailTitle}
        setTemplate={setTemplate}
        setTitle={setTitle}
      />
    );
  };

  renderRecipientSelector = () => {
    return (
      <CommunicationRecipientsModal
        allMemberCategoryList={this.props.allMemberCategoryList}
        checkedMemberCategoriesFilters={this.state.checkedMemberCategoryFilter}
        countAvailableRecipientsTotal={this.props.countAvailableRecipientsTotal}
        countAvailableRecipientsWithEmail={
          this.props.countAvailableRecipientsWithEmail
        }
        countAvailableRecipientsWithPhone={
          this.props.countAvailableRecipientsWithPhone
        }
        fetchPaginatedAvailableRecipientMemberList={
          this.fetchPaginatedAvailableRecipientMemberList
        }
        fullScreen={this.props.fullScreen}
        handleCloseDialog={this.handleCloseRecipientModal}
        kind={this.props.communicationKind}
        loadingPaginatedMemberList={this.props.loadingPaginatedMemberList}
        open={this.state.openRecipientSelector}
        pageSize={this.props.pageSize}
        paginatedMemberList={this.props.paginatedMemberList}
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
      <>
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
                html={html}
                onClose={this.onCloseHTMLPreviewDialog}
                open={this.state.openTemplateVisualizer}
                resolvedGenericTags={this.props.resolvedGenericTags}
                title={this.state.mailTitle}
              />
            )}
        </Paper>

        <AutoResendConfigDialog
          handleClose={this.closeResendConfigDialog}
          handleSubmit={this.setResendConfig}
          initial={{
            resendCount: this.state.resendCount,
            resendDelay: this.state.resendDelay,
          }}
          open={this.state.autoResendConfigDialogOpen}
        />
      </>
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
