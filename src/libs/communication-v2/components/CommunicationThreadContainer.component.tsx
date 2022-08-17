import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withStyles, Theme, WithStyles } from '@material-ui/core';
import CommunicationInformationModal from './CommunicationInformationModal.component';
import CommunicationThreadScrollableView from './CommunicationThreadScrollableView.component';
import InfoGenericBox from '#components/box/InfoGenericBox.component';

import { getOfferRecipientsFilters } from '../utils';
import { ThreadCommunication, RecipientWithMember } from '../types';
import HTMLPreviewDialog from '#components/html/HTMLPreviewDialog.component';

type OwnProps = {
  consentWarning?: string;
  displayFiltersInModal?: boolean;
  threadCommunicationList: Array<ThreadCommunication>;
  fetchPageInformation: (
    communicationId: number,
    page: number,
    filters: number[],
  ) => void;
  fetchMoreThreadCommunications: () => void;
  fullScreen: boolean;
  isSingleRecipientThread: boolean;
  loadingThreadDataList: boolean;
  loadingRecipientsList: boolean;
  paginationSize: number;
  recipientsList: RecipientWithMember[];
};

type Props = OwnProps & WithTranslation & WithStyles;

type State = {
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
    this.props.fetchPageInformation(
      threadCommunication.communication.id,
      1,
      [],
    );
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

  render() {
    const {
      classes,
      t,
      consentWarning,
      displayFiltersInModal,
      threadCommunicationList,
      fetchMoreThreadCommunications,
      fetchPageInformation,
      fullScreen,
      isSingleRecipientThread,
      loadingThreadDataList,
      loadingRecipientsList,
      paginationSize,
      recipientsList,
    } = this.props;

    const modalFilterOptions = getOfferRecipientsFilters(
      displayFiltersInModal,
      t,
    );
    let modalContextTitle = '';
    let modalContextInformation = '';
    if (isSingleRecipientThread) {
      modalContextTitle = this.state.selectedCommunication?.channel || '';
      modalContextInformation =
        this.state.selectedCommunication?.communication.data.subject || '';
    }
    return (
      <div className={classes.threadContainer}>
        {consentWarning && (
          <div className={classes.consentContainer}>
            <InfoGenericBox
              content={consentWarning}
              variant="contained"
              variantIcon="outlined"
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
          isSingleRecipientThread={isSingleRecipientThread}
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
            contextInformation={modalContextInformation}
            contextTitle={modalContextTitle}
            dateCreated={
              this.state.selectedCommunication?.communication.date_created
            }
            fetchPage={(page: number, filters: number[]) =>
              fetchPageInformation(
                this.state.selectedCommunication?.communication.id,
                page,
                filters,
              )
            }
            fullScreen={fullScreen}
            handleCloseDialog={this.closeInformationModal}
            kind={this.state.selectedCommunication?.communication.kind}
            loadingRecipientList={loadingRecipientsList}
            recipientList={recipientsList}
            recipientsCount={
              this.state.selectedCommunication?.communication.total_recipients
            }
            open={this.state.openInformationModal}
            paginationSize={paginationSize}
            filterOptions={modalFilterOptions}
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
