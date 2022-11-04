import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import {
  Typography,
  withMobileDialog,
  withStyles,
  Theme,
  WithStyles,
  WithMobileDialog,
} from '@material-ui/core';
import { KeyboardArrowDown, Send } from '@material-ui/icons';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import isEqual from 'lodash/isEqual';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import CommunicationHeader from './CommunicationHeader.component';
import CommunicationFilterContainer from './Filter/CommunicationFilterContainer.component';
import CommunicationThreadContainer from './Thread/CommunicationThreadContainer.component';
import CommunicationSendMessageContainer from './MessageSender/CommunicationSendMessageContainer.component';
import withCommunicationData, {
  WithCommunicationDataProps,
} from '../communication-drawer-hoc';

import {
  getConsentWarning,
  needToFilterOutReceivedCommunicationSentWithActiveFilters,
} from '../utils';

import { DrawerProps, Communication, MessageData } from '../types';
import { OptionCallback } from '../../../state/types';

import {
  CONTEXT_NOTIFICATION,
  CONTEXT_MEMBER,
  PAGINATION_SIZE_RECIPIENTS,
  WRITE_EMAIL,
} from '../constants';

export type Props = WithCommunicationDataProps &
  WithTranslation &
  WithMobileDialog &
  WithStyles;

type State = {
  threadPage: number;
  filters: number[];
  filterDateStart: number;
  filterDateEnd: number;
  showMessageWritter: boolean;
  communicationKindBeingWritten: number;
  displayThreadSnacbar: boolean;
  scrollThreadToBottom: boolean;
};

export class CommunicationDrawer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      threadPage: 1,
      filters: [],
      filterDateStart: null,
      filterDateEnd: null,
      showMessageWritter: false,
      communicationKindBeingWritten:
        props.communicationKindToWrite ?? WRITE_EMAIL,
      displayThreadSnacbar: false,
      scrollThreadToBottom: false,
    };
  }

  componentDidMount(): void {
    this.props.fetchPaginatedAvailableRecipientMemberList(1);
    this.fetchThreadCommunicationList();
    this.props.fetchResolvedGenericTags();
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.contextObjectId !== this.props.contextObjectId) {
      this.fetchThreadCommunicationList();
      this.props.fetchPaginatedAvailableRecipientMemberList(1);
    }
    if (
      !isEqual(
        prevProps.propToListenToReloadRecipients,
        this.props.propToListenToReloadRecipients,
      )
    ) {
      this.props.fetchPaginatedAvailableRecipientMemberList(1);
    }
  }

  fetchThreadCommunicationList = () => {
    this.props.fetchPageThreadCommunicationList(
      this.state.threadPage,
      this.state.filters,
      this.state.filterDateStart,
      this.state.filterDateEnd,
    );
  };

  fetchMoreThreadCommunications = () => {
    if (this.props.threadCommunicationListHasNextPage) {
      this.setState(
        (previousState: State) => ({
          threadPage: previousState.threadPage + 1,
        }),
        this.fetchThreadCommunicationList,
      );
    }
  };

  handleFilterChange = (
    filters: number[],
    dateStart: number,
    dateEnd: number,
  ) => {
    this.setState(
      {
        threadPage: 1,
        filters,
        filterDateStart: dateStart,
        filterDateEnd: dateEnd,
      },
      this.fetchThreadCommunicationList,
    );
  };

  onCloseThreadSnackbar = () => {
    this.setState({ displayThreadSnacbar: false });
  };

  onShowMessageWriter = () => {
    this.setState((prevState: State) => ({
      showMessageWritter: !prevState.showMessageWritter,
    }));
  };

  setCommunicationKindBeingWritten = (kind: number, callback?: () => void) => {
    this.setState({ communicationKindBeingWritten: kind }, callback);
  };

  sendCommunication = (
    data: MessageData,
    memberSelectedCategories: number[],
    options: OptionCallback<void>,
  ) => {
    const storeInCallback = (communicationResponse: Communication) => {
      const filters = {
        numberFilters: this.state.filters,
        dateStartFilter: this.state.filterDateStart,
        dateEndFilter: this.state.filterDateEnd,
      };
      const filterOutNewCommunication =
        needToFilterOutReceivedCommunicationSentWithActiveFilters(
          communicationResponse,
          filters,
        );
      if (filterOutNewCommunication) {
        this.setState({ displayThreadSnacbar: true });
      } else {
        // By changing the following value, we force the thread to scroll to bottom
        this.setState((prevState: State) => ({
          scrollThreadToBottom: !prevState.scrollThreadToBottom,
        }));
      }
      return filterOutNewCommunication;
    };
    this.props.sendCommunication(data, memberSelectedCategories, {
      ...options,
      storeInCallback,
    });
  };

  render() {
    const {
      // GLOBAL
      classes,
      t,
      fullScreen,
      contextIdentifier,
      contextMember,
      contextTitle,
      openDrawer,
      onDrawerClose,
      // --- Thread ---
      fetchPageInformationRecipientList,
      informationRecipientList,
      informationRecipientListCount,
      loadingInformationRecipientList,
      loadingThreadCommunicationList,
      threadCommunicationList,
      // --- SendMessage ---
      emailTemplateDetailList,
      emailTemplateSummaryList,
      fetchEmailDetail,
      loadingRecipientsModalMemberList,
      loadingEmailTemplateDetailList,
      loadingEmailTemplateSummaryList,
      recipientsModalMemberList,
      resolvedGenericTags,
    } = this.props;

    // --- for thread component ---
    const consentWarning =
      contextMember &&
      getConsentWarning(
        contextMember,
        this.state.communicationKindBeingWritten,
        t,
      );
    return (
      <GenericResponsiveDrawer
        open={openDrawer}
        withoutPadding
        withoutHeaderContainer
        flexContent
        mobileMinWidth="350px"
        onClose={this.props.onDrawerClose}
      >
        <CommunicationHeader
          contextAvatar={contextMember?.photo}
          contextTitle={contextMember?.name || contextTitle}
          onDrawerClose={onDrawerClose}
        />
        <CommunicationFilterContainer
          contextIdentifier={contextIdentifier}
          handleFilters={this.handleFilterChange}
        />
        <CommunicationThreadContainer
          allMemberCategoryList={this.props.allMemberCategoryList}
          consentWarning={consentWarning}
          currentPage={this.state.threadPage}
          fetchRecipientPaginatedList={fetchPageInformationRecipientList}
          fetchMoreThreadCommunications={this.fetchMoreThreadCommunications}
          fullScreen={fullScreen}
          contextMember={contextMember}
          loadingThreadDataList={loadingThreadCommunicationList}
          loadingRecipientList={loadingInformationRecipientList}
          onCloseSnackbar={this.onCloseThreadSnackbar}
          openSnackbar={this.state.displayThreadSnacbar}
          paginationSize={PAGINATION_SIZE_RECIPIENTS}
          recipientList={informationRecipientList}
          recipientListCount={informationRecipientListCount}
          threadCommunicationList={threadCommunicationList}
          resolvedGenericTags={resolvedGenericTags}
          scrollToBottom={this.state.scrollThreadToBottom}
        />
        {contextIdentifier !== CONTEXT_NOTIFICATION && (
          <>
            {this.state.showMessageWritter ? (
              <ButtonBase
                onClick={this.onShowMessageWriter}
                disableRipple
                disableTouchRipple
              >
                <KeyboardArrowDown className={classes.buttonIconClose} />
              </ButtonBase>
            ) : (
              <div className={classes.buttonMessageWriterContainer}>
                <ButtonBase
                  onClick={this.onShowMessageWriter}
                  disableRipple
                  disableTouchRipple
                  className={classes.buttonMessageWriter}
                >
                  <Send fontSize="small" />
                  <Typography
                    variant="subtitle1"
                    className={classes.buttonText}
                  >
                    {t('sendMessage.writeCommunication')}
                  </Typography>
                </ButtonBase>
              </div>
            )}
            <Collapse in={this.state.showMessageWritter} timeout={500}>
              <CommunicationSendMessageContainer
                allMemberCategoryList={this.props.allMemberCategoryList}
                communicationKind={this.state.communicationKindBeingWritten}
                contextIdentifier={contextIdentifier}
                contextObjectId={this.props.contextObjectId}
                countAvailableRecipientsTotal={
                  this.props.countAvailableRecipientsTotal
                }
                countAvailableRecipientsWithEmail={
                  this.props.countAvailableRecipientsWithEmail
                }
                countAvailableRecipientsWithPhone={
                  this.props.countAvailableRecipientsWithPhone
                }
                directMember={
                  contextIdentifier === CONTEXT_MEMBER && contextMember
                }
                emailTemplateDetailList={emailTemplateDetailList}
                emailTemplateSummaryList={emailTemplateSummaryList}
                fetchEmailSummaryList={this.props.fetchEmailSummaryList}
                fetchPaginatedAvailableRecipientMemberList={
                  this.props.fetchPaginatedAvailableRecipientMemberList
                }
                fullScreen={fullScreen}
                getEmailDetail={fetchEmailDetail}
                loadingPaginatedMemberList={loadingRecipientsModalMemberList}
                loadingTemplateSummaryList={loadingEmailTemplateSummaryList}
                loadingTemplateDetailList={loadingEmailTemplateDetailList}
                paginatedMemberList={recipientsModalMemberList}
                pageSize={PAGINATION_SIZE_RECIPIENTS}
                sendCommunication={this.sendCommunication}
                setCommunicationKind={this.setCommunicationKindBeingWritten}
                resolvedGenericTags={resolvedGenericTags}
              />
            </Collapse>
          </>
        )}
      </GenericResponsiveDrawer>
    );
  }
}

const styles: any = (theme: Theme) => ({
  buttonMessageWriter: {
    width: '100%',
    justifyContent: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.spacing(3),
    borderColor: theme.palette.divider,
    borderWidth: '1px',
    borderStyle: 'solid',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  buttonMessageWriterContainer: {
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(0.5),
    },
    color: theme.palette.grey[600],
  },
  buttonText: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  buttonIconClose: {
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(-1.5),
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: theme.spacing(1.5),
    color: theme.palette.background.default,
    backgroundColor: theme.palette.secondary.main,
  },
});

export default compose<any, DrawerProps>(
  withTranslation(['communication']),
  withMobileDialog(),
  withStyles(styles),
  withCommunicationData,
)(CommunicationDrawer);
