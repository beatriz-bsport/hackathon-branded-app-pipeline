import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withStyles, Theme, WithStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';
import CommunicationInformationModal from './ModalInformation/CommunicationInformationModal.component';
import CommunicationThreadScrollableView from './CommunicationThreadScrollableView.component';
import InfoGenericBox from '#components/box/InfoGenericBox.component';
import {
  ThreadCommunication,
  Communication,
  Recipient,
  FilteringMemberIdsByGenericCategories,
} from '#libs/communication-v2/types';
import { Member } from '#libs/member/types';
import HTMLPreviewDialog from '#components/html/HTMLPreviewDialog.component';
import { ResolvedGenericTags } from '#libs/email-editor/types';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

type OwnProps = {
  allMemberCategoryList?: FilteringMemberIdsByGenericCategories;
  consentWarning?: string;
  contextMember?: Member;
  currentPage: number;
  threadCommunicationList: Array<ThreadCommunication>;
  fetchRecipientPaginatedList: (
    communication: Communication,
    page: number,
    memberSelectedCategories: number[],
  ) => void;
  fetchMoreThreadCommunications: () => void;
  fullScreen: boolean;
  loadingThreadDataList: boolean;
  loadingRecipientList: boolean;
  onCloseSnackbar: () => void;
  openSnackbar: boolean;
  paginationSize: number;
  recipientList: Recipient<Member>[];
  recipientListCount: number;
  resolvedGenericTags: ResolvedGenericTags;
  scrollToBottom: boolean;
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
      recipientListCount,
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
        <Snackbar
          open={this.props.openSnackbar}
          onClose={this.props.onCloseSnackbar}
          autoHideDuration={5000}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          key={`snackbar-${Math.floor(Math.random() * 10000)}`}
          className={classes.snackbar}
        >
          <Alert severity="info">{t('filterOutCommunicationSent')}</Alert>
        </Snackbar>
        <CommunicationThreadScrollableView
          threadCommunicationList={threadCommunicationList}
          fetchOnEndScroll={fetchMoreThreadCommunications}
          loadingThreadDataList={loadingThreadDataList}
          showCommunicationInformation={this.showCommunicationInformation}
          showEmailTemplate={this.showEmailTemplate}
          oneToOneThreadMember={contextMember}
          currentPage={this.props.currentPage}
          resolvedGenericTags={this.props.resolvedGenericTags}
          scrollToBottom={this.props.scrollToBottom}
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
  snackbar: {
    position: 'absolute',
    top: 0,
    padding: theme.spacing(1),
    background: `radial-gradient(#fffa, #fff0)`,
    width: 'fit-content',
  },
  threadContainer: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'relative', // trick to have snackbar positioned relatively to the thread
  },
});

export default compose<any, OwnProps>(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationThreadContainer);
