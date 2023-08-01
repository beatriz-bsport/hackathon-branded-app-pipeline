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
import Snackbar from '@material-ui/core/Snackbar';
import Slide, { SlideProps } from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';
import { KeyboardArrowDown, Send } from '@material-ui/icons';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { COMMUNICATION_KIND_EMAIL } from '@bsport/common/lib/master-data/communication-kind';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import CommunicationHeader from './CommunicationHeader.component';
import CommunicationFilterContainer from './Filter/CommunicationFilterContainer.component';
import CommunicationMessageListContainer from './MessageList/CommunicationMessageListContainer.component';
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
  REFRESH_THREAD_TIMEOUT,
} from '../constants';

type NullableTimeout = ReturnType<typeof setTimeout> | null;

export type Props = WithCommunicationDataProps &
  WithTranslation &
  WithMobileDialog &
  WithStyles;

type State = {
  messagePage: number;
  filters: number[];
  filterDateStart: number;
  filterDateEnd: number;
  showMessageWritter: boolean;
  communicationKindBeingWritten: number;
  displaySnackbar: boolean;
  scrollToBottomFlag: boolean;
  timeoutId: NullableTimeout;
};

export class CommunicationDrawer extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      messagePage: 1,
      filters: [],
      filterDateStart: null,
      filterDateEnd: null,
      showMessageWritter: false,
      communicationKindBeingWritten:
        props.communicationKindToWrite ?? WRITE_EMAIL,
      displaySnackbar: false,
      scrollToBottomFlag: false,
      timeoutId: null,
    };
  }

  componentDidMount(): void {
    this.props.fetchPaginatedAvailableRecipientMemberList(1);
    this.fetchMessageListAndScheduleRefresh();
    this.props.fetchResolvedGenericTags();
    this.props.fetchTagList();
    this.props.flagAllUnreadCommunicationsAsRead();
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.contextObjectId !== this.props.contextObjectId) {
      this.fetchMessageList();
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

  componentWillUnmount(): void {
    if (this.state.timeoutId) {
      // unschedule refresh
      clearTimeout(this.state.timeoutId);
    }
  }

  fetchMessageList = () => {
    this.props.fetchPageMessageList(
      this.state.messagePage,
      this.state.filters,
      this.state.filterDateStart,
      this.state.filterDateEnd,
    );
  };

  fetchMoreMessages = () => {
    if (this.props.messageListHasNextPage) {
      this.setState(
        (previousState: State) => ({
          messagePage: previousState.messagePage + 1,
        }),
        this.fetchMessageList,
      );
    }
  };

  fetchMessageListAndScheduleRefresh = () => {
    this.fetchMessageList();
    this.scheduleRefreshMessageList();
  };

  refreshMessageList = () => {
    // This will fetch the last three communications (to speed up things)
    // With respect to the active filters
    this.props.fetchPageMessageList(
      1,
      this.state.filters,
      this.state.filterDateStart,
      this.state.filterDateEnd,
      true,
    );
    this.scheduleRefreshMessageList(true);
  };

  scheduleRefreshMessageList = (forceRefresh?: boolean) => {
    if (!this.state.timeoutId || forceRefresh) {
      // schedule refresh of the message list
      const timeoutId = setTimeout(
        this.refreshMessageList,
        REFRESH_THREAD_TIMEOUT * 1000,
      );
      this.setState({ timeoutId });
    }
  };

  handleFilterChange = (
    filters: number[],
    dateStart: number,
    dateEnd: number,
  ) => {
    // the function will reset the message list so we cancel the current automatic refresh
    clearTimeout(this.state.timeoutId);
    this.setState(
      {
        messagePage: 1,
        filters,
        filterDateStart: dateStart,
        filterDateEnd: dateEnd,
        timeoutId: null,
      },
      this.fetchMessageListAndScheduleRefresh, // and we schedule a new refresh
    );
  };

  onCloseSnackbar = () => {
    this.setState({ displaySnackbar: false });
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
        this.setState({ displaySnackbar: true });
      } else {
        // By changing the following value, we force the message list to scroll to bottom
        this.setState((prevState: State) => ({
          scrollToBottomFlag: !prevState.scrollToBottomFlag,
        }));
      }
      return filterOutNewCommunication;
    };
    this.props.sendCommunication(data, memberSelectedCategories, {
      ...options,
      storeInCallback,
    });
  };

  SlideTransition = (props: SlideProps) => (
    <Slide {...props} direction="left" />
  );

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
      // --- Message List ---
      fetchPageInformationRecipientList,
      informationRecipientList,
      informationRecipientListCount,
      loadingInformationRecipientList,
      loadingMessageList,
      messageList,
      // --- SendMessage ---
      emailTemplateDetailList,
      emailTemplateSummaryList,
      fetchEmailDetail,
      loadingRecipientsModalMemberList,
      loadingEmailTemplateDetailList,
      loadingEmailTemplateSummaryList,
      recipientsModalMemberList,
      resolvedGenericTags,
      theme,
      tagCategories,
    } = this.props;

    // --- for message list component ---
    const consentWarning =
      contextMember &&
      getConsentWarning(
        contextMember,
        this.state.communicationKindBeingWritten,
        t,
      );
    const showMailProviderWarningContent: boolean =
      this.state.showMessageWritter &&
      this.state.communicationKindBeingWritten === COMMUNICATION_KIND_EMAIL &&
      !theme.is_two_way_email_activated;
    return (
      <GenericResponsiveDrawer
        flexContent
        withoutHeaderContainer
        withoutPadding
        mobileMinWidth="350px"
        onClose={onDrawerClose}
        open={openDrawer}
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
        <div className={classes.messageListContainer}>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={5000}
            className={classes.snackbar}
            onClose={this.onCloseSnackbar}
            open={this.state.displaySnackbar}
            TransitionComponent={this.SlideTransition}
          >
            <Alert className={classes.snackbarContent} severity="info">
              {t('messageList.filterOutCommunicationSent')}
            </Alert>
          </Snackbar>
          <CommunicationMessageListContainer
            allMemberCategoryList={this.props.allMemberCategoryList}
            consentWarning={consentWarning}
            contextMember={contextMember}
            currentPage={this.state.messagePage}
            fetchMoreCommunicationMessages={this.fetchMoreMessages}
            fetchRecipientPaginatedList={fetchPageInformationRecipientList}
            fullScreen={fullScreen}
            hasActiveFilters={
              !!this.state.filterDateEnd ||
              !!this.state.filterDateStart ||
              !!this.state.filters.length
            }
            loadingCommunicationMessageDataList={loadingMessageList}
            loadingRecipientList={loadingInformationRecipientList}
            messageList={messageList}
            onCloseSnackbar={this.onCloseSnackbar}
            openSnackbar={this.state.displaySnackbar}
            paginationSize={PAGINATION_SIZE_RECIPIENTS}
            recipientList={informationRecipientList}
            recipientListCount={informationRecipientListCount}
            resolvedGenericTags={resolvedGenericTags}
            scrollToBottomFlag={this.state.scrollToBottomFlag}
            showMailProviderWarningContent={showMailProviderWarningContent}
          />
        </div>
        {contextIdentifier !== CONTEXT_NOTIFICATION && (
          <div
            className={classNames(classes.sendMessageContainer, {
              [classes.sendMessageContainerWithIntercom]:
                !!theme && !theme.hide_intercom,
            })}
          >
            {this.state.showMessageWritter ? (
              <ButtonBase
                disableRipple
                disableTouchRipple
                onClick={this.onShowMessageWriter}
              >
                <KeyboardArrowDown className={classes.buttonIconClose} />
              </ButtonBase>
            ) : (
              <div className={classes.buttonMessageWriterContainer}>
                <ButtonBase
                  disableRipple
                  disableTouchRipple
                  className={classes.buttonMessageWriter}
                  onClick={this.onShowMessageWriter}
                >
                  <Send fontSize="small" />
                  <Typography
                    className={classes.buttonText}
                    variant="subtitle1"
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
                loadingTemplateDetailList={loadingEmailTemplateDetailList}
                loadingTemplateSummaryList={loadingEmailTemplateSummaryList}
                pageSize={PAGINATION_SIZE_RECIPIENTS}
                paginatedMemberList={recipientsModalMemberList}
                resetPaginatedAvailableRecipientMemberList={
                  this.props.resetPaginatedAvailableRecipientMemberList
                }
                resolvedGenericTags={resolvedGenericTags}
                sendCommunication={this.sendCommunication}
                setCommunicationKind={this.setCommunicationKindBeingWritten}
                tagCategories={tagCategories}
              />
            </Collapse>
          </div>
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
  sendMessageContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  sendMessageContainerWithIntercom: {
    [theme.breakpoints.down('md')]: {
      // generic responsive drawer full screen
      paddingBottom: theme.spacing(11),
    },
  },
  snackbar: {
    position: 'absolute',
    top: theme.spacing(1),
    width: 'fit-content',
  },
  snackbarContent: {
    boxShadow: '1px 2px 15px lightblue',
  },
  messageListContainer: {
    position: 'relative',
    display: 'flex',
    flex: 1,
  },
});

// For storybook
export const CommunicationDrawerWithStyles = compose<any, DrawerProps>(
  withTranslation(['communication']),
  withStyles(styles),
)(CommunicationDrawer);

export default compose<any, DrawerProps>(
  withTranslation(['communication']),
  withMobileDialog(),
  withStyles(styles),
  withCommunicationData,
)(CommunicationDrawer);
