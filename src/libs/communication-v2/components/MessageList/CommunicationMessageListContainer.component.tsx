import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withStyles, Theme, WithStyles } from '@material-ui/core';
import CommunicationInformationModal from './ModalInformation/CommunicationInformationModal.component';
import CommunicationMessageScrollableView from './CommunicationMessageScrollableView.component';
import InfoGenericBox from '#components/box/InfoGenericBox.component';
import type {
  CommunicationMessage,
  Communication,
  Recipient,
  FilteringMemberIdsByGenericCategories,
} from '#libs/communication-v2/types';
import type { Member } from '#libs/member/types';
import HTMLPreviewDialog from '#components/html/HTMLPreviewDialog.component';
import type { ResolvedGenericTags } from '#libs/email-editor/types';

type OwnProps = {
  allMemberCategoryList?: FilteringMemberIdsByGenericCategories;
  consentWarning?: string;
  contextMember?: Member;
  currentPage: number;
  messageList: CommunicationMessage[];
  fetchRecipientPaginatedList: (
    communication: Communication,
    page: number,
    memberSelectedCategories: number[],
  ) => void;
  fetchMoreCommunicationMessages: () => void;
  fullScreen?: boolean;
  hasActiveFilters: boolean;
  loadingCommunicationMessageDataList: boolean;
  loadingRecipientList: boolean;
  onCloseSnackbar: () => void;
  openSnackbar: boolean;
  paginationSize: number;
  recipientList: Recipient<Member>[];
  recipientListCount: number;
  resolvedGenericTags: ResolvedGenericTags;
  scrollToBottomFlag: boolean;
  showMailProviderWarningContent: boolean;
};

type Props = OwnProps & WithTranslation & WithStyles;

type State = {
  forceRerenderAfterMount: boolean;
  openEmailView: boolean;
  openInformationModal: boolean;
  selectedCommunication: CommunicationMessage;
  selectedMailBody: string;
  selectedMailTitle: string;
};

class CommunicationMessageListContainer extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      forceRerenderAfterMount: false,
      openEmailView: false,
      openInformationModal: false,
      selectedCommunication: null,
      selectedMailBody: null,
      selectedMailTitle: null,
    };
  }

  closeEmailView = () => this.setState({ openEmailView: false });

  closeInformationModal = () => this.setState({ openInformationModal: false });

  showCommunicationInformation = (message: CommunicationMessage) => {
    this.setState({
      selectedCommunication: message,
      openInformationModal: true,
    });
  };

  showEmailTemplate = (title: string, html: string) => {
    this.setState({
      selectedMailTitle: title,
      selectedMailBody: html,
      openEmailView: true,
    });
  };

  componentDidMount() {
    if (!this.state.forceRerenderAfterMount) {
      this.setState({ forceRerenderAfterMount: true });
    }
  }

  render() {
    const {
      classes,
      t,
      consentWarning,
      contextMember,
      messageList,
      fetchMoreCommunicationMessages,
      fetchRecipientPaginatedList,
      fullScreen,
      hasActiveFilters,
      loadingCommunicationMessageDataList,
      loadingRecipientList,
      paginationSize,
      recipientList,
      recipientListCount,
      showMailProviderWarningContent,
      currentPage,
      resolvedGenericTags,
      scrollToBottomFlag,
    } = this.props;
    let modalContextTitle = '';
    let modalContextInformation = '';
    if (contextMember) {
      modalContextTitle = this.state.selectedCommunication?.channel
        ? t(`filter.choicesLabels.${this.state.selectedCommunication.channel}`)
        : '';
      modalContextInformation =
        this.state.selectedCommunication?.communication.data?.subject || '';
    }

    return (
      <div className={classes.messageContainer}>
        {consentWarning && (
          <div className={classes.consentContainer}>
            <InfoGenericBox
              content={consentWarning}
              variant="contained"
              variantIcon="outlined"
              alignItems="flex-start"
              type="error"
              withCollapse
            />
          </div>
        )}
        {showMailProviderWarningContent && (
          <div className={classes.consentContainer}>
            <InfoGenericBox
              content={t('mail.warningProvider')}
              variant="contained"
              variantIcon="outlined"
              alignItems="flex-start"
              type="warning"
              withCollapse
            />
          </div>
        )}
        <CommunicationMessageScrollableView
          messageList={messageList}
          fetchOnEndScroll={fetchMoreCommunicationMessages}
          loadingCommunicationMessageDataList={
            loadingCommunicationMessageDataList
          }
          showCommunicationInformation={this.showCommunicationInformation}
          showEmailTemplate={this.showEmailTemplate}
          oneToOneMessageMember={contextMember}
          currentPage={currentPage}
          resolvedGenericTags={resolvedGenericTags}
          scrollToBottomFlag={scrollToBottomFlag}
          hasActiveFilters={hasActiveFilters}
        />
        {this.state.openEmailView && (
          <HTMLPreviewDialog
            open={this.state.openEmailView}
            onClose={this.closeEmailView}
            html={this.state.selectedMailBody}
            title={this.state.selectedMailTitle}
            resolvedGenericTags={this.props.resolvedGenericTags}
          />
        )}
        {this.state.openInformationModal && (
          <CommunicationInformationModal
            allMemberCategoryList={this.props.allMemberCategoryList}
            contextInformation={modalContextInformation}
            contextMember={contextMember}
            contextTitle={modalContextTitle}
            fetchRecipientPaginatedList={fetchRecipientPaginatedList}
            fullScreen={fullScreen}
            handleCloseDialog={this.closeInformationModal}
            loadingRecipientList={loadingRecipientList}
            open={this.state.openInformationModal}
            paginationSize={paginationSize}
            recipientList={recipientList}
            recipientListCount={recipientListCount}
            selectedCommunication={this.state.selectedCommunication}
          />
        )}
      </div>
    );
  }
}

const styles: any = (theme: Theme) => ({
  consentContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  messageContainer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
});

export default compose<any, OwnProps>(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationMessageListContainer);
