import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withStyles, Theme, WithStyles } from '@material-ui/core';
import CommunicationInformationModal from './ModalInformation/CommunicationInformationModal.component';
import CommunicationThreadScrollableView from './CommunicationThreadScrollableView.component';
import InfoGenericBox from '#components/box/InfoGenericBox.component';
import {
  ThreadCommunication,
  Recipient,
  FilteringMemberIdsByGenericCategories,
} from '#libs/communication-v2/types';
import { Member } from '#libs/member/types';
import HTMLPreviewDialog from '#components/html/HTMLPreviewDialog.component';

type OwnProps = {
  allMemberCategoryList?: FilteringMemberIdsByGenericCategories;
  consentWarning?: string;
  contextMember?: Member;
  currentPage: number;
  threadCommunicationList: Array<ThreadCommunication>;
  fetchRecipientPaginatedList: (
    communicationId: number,
    memberIdPaginatedList: number[],
  ) => void;
  fetchMoreThreadCommunications: () => void;
  fullScreen: boolean;
  loadingThreadDataList: boolean;
  loadingRecipientList: boolean;
  paginationSize: number;
  recipientList: Recipient<Member>[];
};

type Props = OwnProps & WithTranslation & WithStyles;

type State = {
  forceRerenderAfterMount: boolean;
  openEmailView: boolean;
  openInformationModal: boolean;
  selectedCommunication: ThreadCommunication;
  selectedMailBody: string;
  selectedMailTitle: string;
};

class CommunicationThreadContainer extends React.Component<Props, State> {
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

  showCommunicationInformation = (threadCommunication: ThreadCommunication) => {
    this.setState({
      selectedCommunication: threadCommunication,
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
      threadCommunicationList,
      fetchMoreThreadCommunications,
      fetchRecipientPaginatedList,
      fullScreen,
      loadingThreadDataList,
      loadingRecipientList,
      paginationSize,
      recipientList,
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
      <div className={classes.threadContainer}>
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
        <CommunicationThreadScrollableView
          threadCommunicationList={threadCommunicationList}
          fetchOnEndScroll={fetchMoreThreadCommunications}
          loadingThreadDataList={loadingThreadDataList}
          showCommunicationInformation={this.showCommunicationInformation}
          showEmailTemplate={this.showEmailTemplate}
          oneToOneThreadMember={contextMember}
          currentPage={this.props.currentPage}
        />
        {this.state.openEmailView && (
          <HTMLPreviewDialog
            open={this.state.openEmailView}
            onClose={this.closeEmailView}
            html={this.state.selectedMailBody}
            title={this.state.selectedMailTitle}
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
            selectedCommunication={this.state.selectedCommunication}
          />
        )}
      </div>
    );
  }
}

const styles: any = (theme: Theme) => ({
  consentContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },
  threadContainer: {
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
)(CommunicationThreadContainer);
