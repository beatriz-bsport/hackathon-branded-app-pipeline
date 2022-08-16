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
import { KeyboardArrowDown, KeyboardArrowUp, Send } from '@material-ui/icons';
import ButtonBase from '@material-ui/core/ButtonBase';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import { OptionCallback } from '../../../state/types';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import CommunicationHeader from './CommunicationHeader.component';
import CommunicationFilterContainer from './CommunicationFilterContainer.component';
import CommunicationThreadContainer from './CommunicationThreadContainer.component';
import CommunicationSendMessageContainer from './CommunicationSendMessageContainer.component';

import { getConsentWarning } from '../utils';

import { Member } from '#libs/member/types';
import {
  RecipientWithMember,
  MessageData,
  ThreadCommunication,
} from '../types';
import {
  EmailTemplateDetail,
  EmailTemplateSummary,
} from '#libs/email-editor/types';

import {
  CONTEXT_NOTIFICATION,
  CONTEXT_COMMUNICATION,
  CONTEXT_OFFER,
  CONTEXT_MEMBER,
  PAGINATION_SIZE,
  WRITE_EMAIL,
} from '../constants';

type DrawerProps = {
  onDrawerClose: () => void;
  openDrawer: boolean;
};

type ContextualProps = {
  contextIdentifier: number; // see in constants
  contextMember?: Member; // if we are on a member page
  contextTitle?: string; // notification/smarlist/session name
};

type ThreadProps = {
  // --- for Information Modal ---
  fetchPageInformationRecipientList: (
    communicationId: number,
    page: number,
    filters: number[],
  ) => void;
  loadingInformationRecipientList: boolean;
  informationRecipientList: RecipientWithMember[];
  // --- for Thread ---
  fetchPageThreadCommunicationList: (
    page: number,
    filters: number[],
    dateStart: number,
    dateEnd: number,
  ) => void;
  threadCommunicationListHasNextPage: boolean;
  loadingThreadCommunicationList: boolean;
  threadCommunicationList: ThreadCommunication[];
};

type SendMessageProps = {
  allMembersIds?: number[];
  allMembersIdsWithoutEmail?: number[];
  allMembersIdsWithoutPhone?: number[];
  communicationKindToWrite?: number;
  emailTemplateDetailList?: Array<EmailTemplateDetail>;
  emailTemplateSummaryList?: Array<EmailTemplateSummary>;
  fetchPageRecipientsModalMemberList: (page: number, filters: number[]) => void;
  fetchSelectedMembersDetails: (memberIds: number[]) => void;
  fetchEmailDetail: (templateId: number) => void;
  loadingRecipientsModalMemberList: boolean;
  loadingTemplateDetailList: boolean;
  loadingTemplateSummaryList: boolean;
  recipientsModalMemberList: Member[];
  selectedMemberList: Member[];
  sendCommunication?: (
    data: MessageData,
    options?: OptionCallback<void>,
  ) => void;
};

type OwnProps = DrawerProps & ContextualProps & ThreadProps & SendMessageProps;

export type Props = OwnProps & WithTranslation & WithMobileDialog & WithStyles;

type State = {
  threadPage: number;
  filters: number[];
  filterDateStart: number;
  filterDateEnd: number;
  showMessageWritter: boolean;
  communicationKindBeingWritten: number;
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
    };
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

  onShowMessageWriter = () => {
    this.setState((prevState: State) => ({
      showMessageWritter: !prevState.showMessageWritter,
    }));
  };

  setCommunicationKindBeingWritten = (kind: number, callback?: () => void) => {
    this.setState({ communicationKindBeingWritten: kind }, callback);
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
      loadingInformationRecipientList,
      loadingThreadCommunicationList,
      threadCommunicationList,
      // --- SendMessage ---
      allMembersIds,
      allMembersIdsWithoutEmail,
      allMembersIdsWithoutPhone,
      emailTemplateDetailList,
      emailTemplateSummaryList,
      fetchPageRecipientsModalMemberList,
      fetchEmailDetail,
      fetchSelectedMembersDetails,
      loadingRecipientsModalMemberList,
      loadingTemplateDetailList,
      loadingTemplateSummaryList,
      recipientsModalMemberList,
      selectedMemberList,
      sendCommunication,
    } = this.props;

    // --- for thread and sendMessage components ---
    const displayFiltersInModal = contextIdentifier === CONTEXT_OFFER;

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
        withSmallMinWidth
      >
        <CommunicationHeader
          contextIdentifier={contextIdentifier}
          contextMember={contextMember}
          contextTitle={contextTitle}
          onDrawerClose={onDrawerClose}
        />
        <CommunicationFilterContainer
          contextIdentifier={contextIdentifier}
          handleFilters={this.handleFilterChange}
        />
        <CommunicationThreadContainer
          consentWarning={consentWarning}
          displayFiltersInModal={displayFiltersInModal}
          threadCommunicationList={threadCommunicationList}
          fetchPageInformation={fetchPageInformationRecipientList}
          fetchMoreThreadCommunications={this.fetchMoreThreadCommunications}
          fullScreen={fullScreen}
          isSingleRecipientThread={
            contextIdentifier === CONTEXT_MEMBER && !!contextMember
          }
          loadingThreadDataList={loadingThreadCommunicationList}
          loadingRecipientsList={loadingInformationRecipientList}
          paginationSize={PAGINATION_SIZE}
          recipientsList={informationRecipientList}
        />
        {contextIdentifier !== CONTEXT_NOTIFICATION &&
          contextIdentifier !== CONTEXT_COMMUNICATION && (
            <>
              <Divider variant="fullWidth" className={classes.divider} />
              <ButtonBase
                onClick={this.onShowMessageWriter}
                disableRipple
                disableTouchRipple
              >
                {this.state.showMessageWritter ? (
                  <KeyboardArrowDown className={classes.buttonIconClose} />
                ) : (
                  <div className={classes.buttonMessageWriter}>
                    <div className={classes.buttonMessageLeft}>
                      <Send fontSize="small" />
                      <Typography
                        variant="subtitle1"
                        className={classes.buttonText}
                      >
                        {t('sendMessage.writeCommunication')}
                      </Typography>
                    </div>
                    <KeyboardArrowUp fontSize="medium" />
                  </div>
                )}
              </ButtonBase>
              <Collapse in={this.state.showMessageWritter} timeout={500}>
                <CommunicationSendMessageContainer
                  allIds={allMembersIds}
                  allIdsWithoutPhone={allMembersIdsWithoutPhone}
                  allIdsWithoutEmail={allMembersIdsWithoutEmail}
                  canFilterRecipients={displayFiltersInModal}
                  communicationKind={this.state.communicationKindBeingWritten}
                  directMember={
                    contextIdentifier === CONTEXT_MEMBER && contextMember
                  }
                  emailTemplateDetailList={emailTemplateDetailList}
                  emailTemplateSummaryList={emailTemplateSummaryList}
                  fetchRecipientsPage={fetchPageRecipientsModalMemberList}
                  fetchSelectedMemberList={fetchSelectedMembersDetails}
                  fullScreen={fullScreen}
                  getEmailDetail={fetchEmailDetail}
                  loadingMemberList={loadingRecipientsModalMemberList}
                  loadingTemplateSummaryList={loadingTemplateSummaryList}
                  loadingTemplateDetailList={loadingTemplateDetailList}
                  memberList={recipientsModalMemberList}
                  pageSize={PAGINATION_SIZE}
                  selectedMemberList={selectedMemberList}
                  sendCommunication={sendCommunication}
                  setCommunicationKind={this.setCommunicationKindBeingWritten}
                />
              </Collapse>
            </>
          )}
      </GenericResponsiveDrawer>
    );
  }
}

const styles: any = (theme: Theme) => ({
  buttonMessageLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonMessageWriter: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
    },
    color: theme.palette.grey[600],
  },
  buttonText: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    textTransform: 'uppercase',
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
  divider: {
    paddingBottom: 1,
  },
});

export default compose<any, OwnProps>(
  withTranslation(['communication']),
  withMobileDialog(),
  withStyles(styles),
)(CommunicationDrawer);
