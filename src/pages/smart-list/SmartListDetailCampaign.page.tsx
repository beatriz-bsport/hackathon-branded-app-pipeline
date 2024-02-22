// @ts-nocheck
import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';

import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';

import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { WithTranslation, withTranslation } from 'react-i18next';
import { withStyles, Theme } from '@material-ui/core/styles';

// @ts-expect-error
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import Config from '../../config';

import { WithHandlerType, MaterialStyleType } from '#utils/types';
import type { CampaignExportStartEndDates } from '#libs/communication/types';
import type { OptionCallback } from '../../state/types';

import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import {
  getCampaignBySmartlist,
  getAutomatedCampaignBySmartlist,
  withAutomatedCampaign,
  getCsvExportAllCampaignsLink,
  getCsvExportAllCampaignsDate,
  getCsvExportAllCampaignsIsLoading,
  getCsvExportAllCampaignsRecipientCount,
  getCsvExportAllCampaignsIsXlsxExportable,
} from '#libs/communication/selectors';

import {
  fetchCampaignSmartlist,
  fetchCampaignSmartlistAutomated,
  fetchRecipientsNumberAllCampaignsIncluded as fetchRecipientsNumberAllCampaignsIncludedAction,
  exportSmartlistCampaignsBackgroundTask as exportSmartlistCampaignsBackgroundTaskAction,
  fetchLatestCampaignExportLink as fetchLatestCampaignExportLinkAction,
} from '#libs/communication/actions';
import { fetchSmartListAutomatedCampaign } from '#libs/smart-list/actions';

import type { RootState } from '../../reducers';
import GenericMuiDialog from '#components/genericDialog/GenericMuiDIalog';
import CampaignList from '#libs/communication/components/CampaignList.component';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#libs/notification-rule/actions';
import { getResolvedGenericTags } from '#libs/notification-rule/selectors';
import { CommunicationScheduledList } from '#libs/smart-list/components/communication_scheduled/CommunicationScheduledList.component';
import {
  getCommunicationScheduledForSmartlist,
  getCommunicationScheduledBySmartlistLoading,
  getCommunicationScheduledBySmartlistPage,
  getCommunicationScheduledBySmartlistTotal,
} from '#libs/communication-v2/selectors';
import {
  fetchCommunicationScheduledListForSmartlist as fetchCommunicationScheduledListForSmartlistAction,
  deleteCommunicationScheduled as deleteCommunicationScheduledAction,
  updateCommunicationScheduled as updateCommunicationScheduledAction,
  sendNowCommunicationScheduled as sendNowCommunicationScheduledAction,
} from '#libs/communication-v2/actions';
// @ts-expect-error
import CommunicationDrawerDEPRECATED from '#libs/communication/components/CommunicationDrawer.component';
import {
  getAllEmailTemplatesSummaries,
  getEmailTemplatesDetail,
} from '#libs/email-editor/selectors';
import { getPaginatedMembers } from '#libs/member/selectors';
import {
  emailTemplateDetail,
  emailTemplatesSummaries,
} from '#libs/email-editor/actions';
import type { CommunicationScheduled } from '#libs/communication-v2/types';
import CampaignsExportSection from '#libs/communication/components/CampaignsExportSection.component';
import CampaignsExportLimitDialog from '#libs/communication/components/CampaignsExportLimitDialog.component';

type OwnProps = {
  id: number;
};

type OwnAndConnectedProps = OwnProps & ConnectedProps<typeof connector>;

type State = {
  openCommunicationScheduledSection: boolean;
  openManualCampaignSection: boolean;
  openAutomatedCampaignSection: boolean;
  openCampaignsExportSection: boolean;
  openExportLimitDialog: boolean;
  openEditEmail: boolean;
  communicationScheduledToEdit?: CommunicationScheduled;
  isTooLateToUpdateCommunicationScheduledDialogOpen: boolean;
};

type StateHandlerType = State & WithHandlerType<typeof withStateHandlersSetter>;

type ConnectedPropsAndState = OwnAndConnectedProps & StateHandlerType;

type Props = OwnProps &
  OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  StateHandlerType &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
export class SmartListCampaign extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchCampaignSmartlist(1);
    this.props.fetchCampaignSmartlistAutomated(1);
    this.props.fetchSmartListAutomatedCampaign({ page_size: 100 });
    this.props.fetchResolvedGenericTags();
    this.props.fetchCommunicationScheduledListForSmartlist({
      smartlistId: this.props.id,
    });
  }

  fetchRecipientsNumber = ({
    start_date,
    end_date,
  }: CampaignExportStartEndDates) => {
    this.props.fetchRecipientsNumberAllCampaignsIncluded({
      start_date,
      end_date,
    });
  };

  handleCloseDialog = () => {
    this.props.setOpenExportLimitDialog(!this.props?.openExportLimitDialog);
  };

  handleGenerateAnyway = () => {
    // We don't want to send any undefined data
    if (this.props?.id && this.props?.csvExportDate) {
      this.props.exportSmartlistCampaignsBackgroundTaskAction(
        { smartlistId: this.props?.id, dates: this.props?.csvExportDate },
        {
          onSuccess: () =>
            this.props.fetchLatestCampaignExportLinkAction(this.props?.id),
        },
      );
    }
  };

  handleSetOpenCampaignsExportSection = () => {
    this.props.setOpenCampaignsExportSection(
      !this.props?.openCampaignsExportSection,
    );
  };

  handleSetOpenAutomatedCampaignSection = () => {
    this.props.setOpenAutomatedCampaignSection(
      !this.props?.openAutomatedCampaignSection,
    );
  };

  handleSetOpenCommunicationScheduledSection = () => {
    this.props.setOpenCommunicationScheduledSection(
      !this.props?.openCommunicationScheduledSection,
    );
  };

  changeOpenManualCampaignSection = () => {
    this.props.setOpenManualCampaignSection(
      !this.props?.openManualCampaignSection,
    );
  };

  changeCommunicationScheduledPage = (page: number) =>
    this.props.fetchCommunicationScheduledListForSmartlist({
      smartlistId: this.props.id,
      page,
    });

  getHideAutoResend = () =>
    Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
    this.props.companyId !== 498;

  checkIsMessageSchedulable = (
    communicationScheduled: CommunicationScheduled,
  ) =>
    new Date(communicationScheduled.datetime_scheduled) >
    new Date(Date.now() + 5 * 60 * 1000);

  openTooLateToUpdateCommunicationScheduledDialog = () =>
    this.props.setIsTooLateToUpdateCommunicationScheduledDialogOpen(true);

  closeTooLateToUpdateCommunicationScheduledDialog = () =>
    this.props.setIsTooLateToUpdateCommunicationScheduledDialogOpen(false);

  deleteCommunicationScheduled = (
    communicationScheduled: CommunicationScheduled,
  ) => {
    if (this.checkIsMessageSchedulable(communicationScheduled)) {
      this.props.deleteCommunicationScheduled(communicationScheduled.id, {
        onSuccess: () =>
          this.props.fetchCommunicationScheduledListForSmartlist({
            smartlistId: this.props.id,
          }),
      });
    } else {
      this.openTooLateToUpdateCommunicationScheduledDialog();
    }
  };

  openCommunicationScheduledEditionDrawer = (
    communicationScheduled: CommunicationScheduled,
  ) => {
    if (this.checkIsMessageSchedulable(communicationScheduled)) {
      this.props.setCommunicationScheduledToEdit(communicationScheduled);
      this.props.setOpenEditEmail(true);
    } else {
      this.openTooLateToUpdateCommunicationScheduledDialog();
    }
  };

  render() {
    const {
      t,
      classes,
      openManualCampaignSection,
      openAutomatedCampaignSection,
      openCommunicationScheduledSection,
      openCampaignsExportSection,
      openExportLimitDialog,
    } = this.props;

    return (
      <div className={classes.container}>
        <ObjectLevelPermissionProviderComponent requiredPermission="export.allowed_actions.smartlist_general_report">
          {(hasPermission) =>
            hasPermission && (
              <>
                <CampaignsExportLimitDialog
                  exportAllCampaignsBackground={this.handleGenerateAnyway}
                  handleClose={this.handleCloseDialog}
                  open={openExportLimitDialog}
                  recipientsCount={this.props?.csvRecipientCount}
                />

                <ButtonBase
                  className={classes.flexHeader}
                  onClick={this.handleSetOpenCampaignsExportSection}
                >
                  <Typography
                    color={
                      openCampaignsExportSection ? 'inherit' : 'textSecondary'
                    }
                    variant="h5"
                  >
                    {t('campaign.exportCampaigns.title')}
                  </Typography>
                  {openCampaignsExportSection ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ButtonBase>
                <Divider className={classes.divider} />
                <Collapse in={openCampaignsExportSection}>
                  <CampaignsExportSection
                    csvExportDate={this.props?.csvExportDate}
                    csvExportLink={this.props?.csvExportLink}
                    csvExportLoading={this.props?.csvExportLoading}
                    fetchRecipientsNumber={this.fetchRecipientsNumber}
                  />
                </Collapse>
              </>
            )
          }
        </ObjectLevelPermissionProviderComponent>

        <ButtonBase
          className={classes.flexHeader}
          onClick={this.handleSetOpenCommunicationScheduledSection}
        >
          <Typography
            color={
              openCommunicationScheduledSection ? 'inherit' : 'textSecondary'
            }
            variant="h5"
          >
            {t('campaign.scheduledTitle')}
          </Typography>

          {openCommunicationScheduledSection ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </ButtonBase>
        <Divider className={classes.divider} />
        <Collapse
          className={classes.scheduledCollapseSection}
          in={openCommunicationScheduledSection}
        >
          <CommunicationScheduledList
            changePage={this.changeCommunicationScheduledPage}
            communicationScheduledList={this.props.communicationScheduledList}
            currentPage={this.props.communicationScheduledPage}
            deleteCommunication={this.deleteCommunicationScheduled}
            editCommunication={this.openCommunicationScheduledEditionDrawer}
            loading={this.props.communicationScheduledLoading}
            total={this.props.communicationScheduledTotal}
          />
        </Collapse>

        <ButtonBase
          className={classes.flexHeader}
          onClick={this.handleSetOpenCommunicationScheduledSection}
        >
          <Typography
            color={
              openCommunicationScheduledSection ? 'inherit' : 'textSecondary'
            }
            variant="h5"
          >
            {t('campaign.scheduledTitle')}
          </Typography>

          {openCommunicationScheduledSection ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </ButtonBase>
        <Divider className={classes.divider} />
        <Collapse
          className={classes.scheduledCollapseSection}
          in={openCommunicationScheduledSection}
        >
          <CommunicationScheduledList
            changePage={this.changeCommunicationScheduledPage}
            communicationScheduledList={this.props.communicationScheduledList}
            currentPage={this.props.communicationScheduledPage}
            deleteCommunication={this.deleteCommunicationScheduled}
            editCommunication={this.openCommunicationScheduledEditionDrawer}
            loading={this.props.communicationScheduledLoading}
            total={this.props.communicationScheduledTotal}
          />
        </Collapse>

        <ButtonBase
          className={classes.flexHeader}
          onClick={this.handleSetOpenAutomatedCampaignSection}
        >
          <Typography
            color={openAutomatedCampaignSection ? 'inherit' : 'textSecondary'}
            variant="h5"
          >
            {t('campaign.automatedTitle')}
          </Typography>

          {openAutomatedCampaignSection ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </ButtonBase>
        <Divider className={classes.divider} />
        <Collapse in={openAutomatedCampaignSection}>
          <CampaignList
            campaignList={this.props?.automatedCampaignList.map((campaign) => [
              campaign,
              null,
            ])}
            fetchMore={
              this.props?.automatedCampaignState.next_page
                ? () =>
                    this.props.fetchCampaignSmartlistAutomated(
                      this.props?.automatedCampaignState.next_page,
                    )
                : null
            }
            loading={this.props?.loading}
            onClickReport={this.props.goToCampaignReport}
            resolvedGenericTags={this.props?.resolvedGenericTags}
          />
        </Collapse>
        <ButtonBase
          className={classes.flexHeader}
          onClick={this.changeOpenManualCampaignSection}
        >
          <div className={classes.title}>
            <Typography
              color={openManualCampaignSection ? 'inherit' : 'textSecondary'}
              variant="h5"
            >
              {t('campaign.manualTitle')}
            </Typography>
          </div>

          {openManualCampaignSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ButtonBase>
        <Divider className={classes.divider} />
        <Collapse in={openManualCampaignSection}>
          <CampaignList
            campaignList={this.props?.campaignList.map((campaign) => [
              campaign,
              null,
            ])}
            fetchMore={
              this.props?.campaignState.next_page
                ? () =>
                    this.props.fetchCampaignSmartlist(
                      this.props?.campaignState.next_page,
                    )
                : null
            }
            loading={this.props?.loading}
            onClickReport={this.props.goToCampaignReport}
            resolvedGenericTags={this.props?.resolvedGenericTags}
          />
        </Collapse>
        <CommunicationDrawerDEPRECATED
          hideMemberList
          communicationScheduledToEdit={this.props.communicationScheduledToEdit}
          companyId={this.props.companyId}
          countTotal={this.props.members.countTotal}
          countWithEmail={this.props.members.countWithEmail}
          countWithPhone={this.props.members.countWithPhone}
          editScheduledMessage={this.props.editCommunicationScheduled}
          emailDetailLoading={this.props.emailDetailLoading}
          emailDetails={this.props.email_templates_details}
          emailListLoading={this.props.emailListLoading}
          emails={this.props.email_templates_list}
          getEmailDetail={this.props.fetchEmailTemplateDetail}
          getEmails={this.props.fetchEmailTemplatesSummaries}
          hideAutoResend={this.getHideAutoResend()}
          hoursToSend={{
            min: this.props.earliestHourToSendCommunications,
            max: this.props.latestHourToSendCommunications,
          }}
          membersAllLoading={this.props.members.loading}
          membersByPageLoading={this.props.members.loading}
          membersToDisplay={this.props.members.displayItems}
          memberToDisplayError={this.props.members.error}
          onCancel={() => {
            this.props.setOpenEditEmail(false);
            this.props.setCommunicationScheduledToEdit(null);
          }}
          onClose={() => this.props.setOpenEditEmail(false)}
          open={this.props.openEditEmail}
          page={this.props.members.page}
          resolvedGenericTags={this.props.resolvedGenericTags}
          sendNow={this.props.sendCommunicationScheduled}
          timezone={this.props.timezone}
        />
        <GenericMuiDialog
          cancelText={t('scheduled.tooLateToUpdateDialog.close')}
          content={t('scheduled.tooLateToUpdateDialog.content')}
          onCancel={this.closeTooLateToUpdateCommunicationScheduledDialog}
          open={this.props.isTooLateToUpdateCommunicationScheduledDialogOpen}
          title={t('scheduled.tooLateToUpdateDialog.title')}
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState, { id }: { id: number }) => ({
    campaignList: getCampaignBySmartlist(state),
    automatedCampaignList: withAutomatedCampaign(
      getAutomatedCampaignBySmartlist,
    )(state),
    campaignState: state.communication.campaign.bySmartlist,
    automatedCampaignState: state.communication.automatedCampaign.bySmartlist,
    loading: state.communication.campaign.bySmartlist.loading,
    companyId: state.theme.theme.company,
    // EXPORT
    csvExportLink: getCsvExportAllCampaignsLink(state),
    csvExportDate: getCsvExportAllCampaignsDate(state),
    csvRecipientCount: getCsvExportAllCampaignsRecipientCount(state),
    csvIsXlsxExportable: getCsvExportAllCampaignsIsXlsxExportable(state),
    csvExportLoading: getCsvExportAllCampaignsIsLoading(state),
    // SCHEDULED
    communicationScheduledLoading:
      getCommunicationScheduledBySmartlistLoading(state),
    communicationScheduledTotal: getCommunicationScheduledBySmartlistTotal(
      state,
      id,
    ),
    communicationScheduledPage: getCommunicationScheduledBySmartlistPage(
      state,
      id,
    ),
    timezone: state.theme.theme.timezone_name,
    earliestHourToSendCommunications:
      state.theme.theme.earliest_hour_to_send_communications,
    latestHourToSendCommunications:
      state.theme.theme.latest_hour_to_send_communications,
    communicationScheduledList: getCommunicationScheduledForSmartlist(
      state,
      id,
    ),
    // EMAIL
    email_templates_list: getAllEmailTemplatesSummaries(state),
    email_templates_details: getEmailTemplatesDetail(state),
    emailListLoading: state.emailTemplate.loading,
    emailDetailLoading: state.emailTemplate.detail.loading,
    // MEMBERS
    members: {
      displayItems: getPaginatedMembers(state),
      page: state.member.communication.page,
      allIds: state.member.communication.allIds,
      countTotal: state.member.communication.countTotal,
      countWithPhone: state.member.communication.countWithPhone,
      countWithEmail: state.member.communication.countWithEmail,
      loading: state.member.communication.loading,
      error: state.member.communication.error,
    },
    // TAGS
    resolvedGenericTags: getResolvedGenericTags(state),
  }),
  {
    fetchCampaignSmartlist,
    fetchCampaignSmartlistAutomated,
    fetchRecipientsNumberAllCampaignsIncludedAction,
    fetchSmartListAutomatedCampaign,
    push,
    // EMAIL
    fetchEmailTemplatesSummaries: () => emailTemplatesSummaries(),
    fetchEmailTemplateDetail: (id: number) => emailTemplateDetail(id),
    fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
    // SCHEDULED
    fetchCommunicationScheduledListForSmartlist:
      fetchCommunicationScheduledListForSmartlistAction,
    deleteCommunicationScheduled: deleteCommunicationScheduledAction,
    updateCommunicationScheduled: updateCommunicationScheduledAction,
    sendNowCommunicationScheduled: sendNowCommunicationScheduledAction,
    // EXPORT
    exportSmartlistCampaignsBackgroundTaskAction,
    fetchLatestCampaignExportLinkAction,
  },
);

const mapWithHandlers = {
  fetchCampaignSmartlist: (props: OwnAndConnectedProps) => (page: number) => {
    props.fetchCampaignSmartlist(props.id, page);
  },
  fetchCampaignSmartlistAutomated:
    (props: OwnAndConnectedProps) => (page: number) => {
      props.fetchCampaignSmartlistAutomated(props.id, page);
    },
  goToCampaignReport:
    (props: OwnAndConnectedProps) => (campaign_uuid: string) => {
      props.push(`/smart-list/${props.id}/campaign/${campaign_uuid}/`);
    },
  fetchRecipientsNumberAllCampaignsIncluded:
    (props: ConnectedPropsAndState) =>
    ({ start_date, end_date }: CampaignExportStartEndDates) => {
      props.fetchRecipientsNumberAllCampaignsIncludedAction(
        {
          smartlistId: props.id,
          dates: {
            start_date,
            end_date,
          },
        },
        {
          onSuccess: (isExportable) => {
            if (isExportable) {
              props.exportSmartlistCampaignsBackgroundTaskAction(
                {
                  smartlistId: props.id,
                  dates: {
                    start_date,
                    end_date,
                  },
                },
                {
                  onBackgroundSuccess: () =>
                    props.fetchLatestCampaignExportLinkAction(props.id),
                },
              );
            } else {
              props.setOpenExportLimitDialog(true);
            }
          },
        },
      );
    },
  editCommunicationScheduled:
    (props: OwnAndConnectedProps) =>
    (data: CommunicationScheduled, options?: OptionCallback) => {
      props.updateCommunicationScheduled(data.id, data, {
        ...options,
        onSuccess: () => {
          props.fetchCommunicationScheduledListForSmartlist({
            smartlistId: props.id,
          });
          options?.onSuccess?.();
        },
      });
    },
  sendCommunicationScheduled: (props: OwnAndConnectedProps) => (id: number) =>
    props.sendNowCommunicationScheduled(id, {
      onSuccess: () =>
        props.fetchCommunicationScheduledListForSmartlist({
          smartlistId: props.id,
        }),
    }),
};

const withStateHandlersInit: State = {
  openCommunicationScheduledSection: true,
  openManualCampaignSection: true,
  openAutomatedCampaignSection: true,
  openCampaignsExportSection: true,
  openExportLimitDialog: false,
  openEditEmail: false,
  communicationScheduledToEdit: null,
  isTooLateToUpdateCommunicationScheduledDialogOpen: false,
};

const withStateHandlersSetter = {
  setOpenCommunicationScheduledSection:
    () => (openCommunicationScheduledSection: boolean) => {
      return { openCommunicationScheduledSection };
    },
  setOpenCampaignsExportSection:
    () => (openCampaignsExportSection: boolean) => {
      return { openCampaignsExportSection };
    },
  setOpenManualCampaignSection: () => (openManualCampaignSection: boolean) => {
    return { openManualCampaignSection };
  },
  setOpenAutomatedCampaignSection:
    () => (openAutomatedCampaignSection: boolean) => {
      return { openAutomatedCampaignSection };
    },
  setOpenExportLimitDialog: () => (openExportLimitDialog: boolean) => {
    return { openExportLimitDialog };
  },
  setOpenEditEmail: () => (openEditEmail: boolean) => {
    return { openEditEmail };
  },
  setCommunicationScheduledToEdit:
    () => (communicationScheduledToEdit: CommunicationScheduled) => {
      return { communicationScheduledToEdit };
    },
  setIsTooLateToUpdateCommunicationScheduledDialogOpen:
    () => (isTooLateToUpdateCommunicationScheduledDialogOpen: boolean) => {
      return {
        isTooLateToUpdateCommunicationScheduledDialogOpen,
      };
    },
};

const styles = (theme: Theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  flexHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  scheduledCollapseSection: {
    paddingTop: theme.spacing(1),
  },
});

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  // @ts-ignore
  withStyles(styles),
  withTranslation('communication'),
  connector,
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapWithHandlers),
)(SmartListCampaign);
