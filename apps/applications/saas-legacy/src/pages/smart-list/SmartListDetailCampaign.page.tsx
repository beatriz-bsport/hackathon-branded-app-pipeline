import React from 'react';
import Immutable from 'seamless-immutable';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';

import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme } from '@material-ui/core/styles';

import CampaignList from '#src/libs/communication/components/CampaignList.component';
import CampaignsExportLimitDialog from '#src/libs/communication/components/CampaignsExportLimitDialog.component';
import CampaignsExportSection from '#src/libs/communication/components/CampaignsExportSection.component';
import GenericDeleteDialog from '#src/components/genericDialog/GenericDeleteDialog.component';
import GenericMuiDialog from '#src/components/genericDialog/GenericMuiDIalog';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import {
  getCampaignBySmartlist,
  getAutomatedCampaignBySmartlist,
  withAutomatedCampaign,
  getCsvExportAllCampaignsLink,
  getCsvExportAllCampaignsDate,
  getCsvExportAllCampaignsIsLoading,
  getCsvExportAllCampaignsRecipientCount,
  getCsvExportAllCampaignsIsXlsxExportable,
} from '#src/libs/communication/selectors';
import {
  fetchCampaignSmartlist,
  fetchCampaignSmartlistAutomated,
  fetchRecipientsNumberAllCampaignsIncluded as fetchRecipientsNumberAllCampaignsIncludedAction,
  exportSmartlistCampaignsBackgroundTask as exportSmartlistCampaignsBackgroundTaskAction,
  fetchLatestCampaignExportLink as fetchLatestCampaignExportLinkAction,
} from '#src/libs/communication/actions';
import { fetchSmartListAutomatedCampaign } from '#src/libs/smart-list/actions';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#src/libs/notification-rule/actions';
import { CommunicationScheduledList } from '#src/libs/smart-list/components/communication_scheduled/CommunicationScheduledList.component';
import {
  getCommunicationScheduledForSmartlist,
  getCommunicationScheduledBySmartlistLoading,
  getCommunicationScheduledBySmartlistPage,
  getCommunicationScheduledBySmartlistTotal,
} from '#src/libs/communication-v2/selectors';
import {
  fetchCommunicationScheduledListForSmartlist as fetchCommunicationScheduledListForSmartlistAction,
  deleteCommunicationScheduled as deleteCommunicationScheduledAction,
} from '#src/libs/communication-v2/actions';
import { getPaginatedMembers } from '#src/libs/member/selectors';
import { CONTEXT_SMARTLIST } from '#src/libs/communication-v2/constants';

import type { CampaignExportStartEndDates } from '#src/libs/communication/types';
import type { CommunicationScheduled } from '#src/libs/communication-v2/types';
import type { WithHandlerType, MaterialStyleType } from '#src/utils/types';
import type { RootState } from '../../reducers';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { CommunicationDrawer } from '#src/libs/communication-v2/components/CommunicationDrawer.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

import { checkIsScheduledMessageEditable } from '#src/utils/communicationScheduledHelper';
import { getResolvedGenericTags } from '#src/libs/notification-rule/selectors';

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
  openEditCommunication: boolean;
  communicationScheduledSelected: CommunicationScheduled | null;
  isDeleteCommunicationScheduledDialogOpen: boolean;
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

  openTooLateToUpdateCommunicationScheduledDialog = () =>
    this.props.setIsTooLateToUpdateCommunicationScheduledDialogOpen(true);

  closeTooLateToUpdateCommunicationScheduledDialog = () =>
    this.props.setIsTooLateToUpdateCommunicationScheduledDialogOpen(false);

  openDeleteCommunicationScheduledDialog = () =>
    this.props.setIsDeleteCommunicationScheduledDialogOpen(true);

  closeDeleteCommunicationScheduledDialog = () =>
    this.props.setIsDeleteCommunicationScheduledDialogOpen(false);

  openCommunicationScheduledDeletionDrawer = (
    communicationScheduled: CommunicationScheduled,
  ) => {
    if (checkIsScheduledMessageEditable(communicationScheduled)) {
      this.props.setCommunicationScheduledSelected(communicationScheduled);
      this.openDeleteCommunicationScheduledDialog();
    } else {
      this.openTooLateToUpdateCommunicationScheduledDialog();
    }
  };

  deleteCommunicationScheduled = () => {
    if (this.props.communicationScheduledSelected) {
      if (
        checkIsScheduledMessageEditable(
          this.props.communicationScheduledSelected,
        )
      ) {
        this.props.deleteCommunicationScheduled(
          this.props.communicationScheduledSelected.id,
          {
            onSuccess: () =>
              this.props.fetchCommunicationScheduledListForSmartlist({
                smartlistId: this.props.id,
              }),
          },
        );
      } else {
        this.openTooLateToUpdateCommunicationScheduledDialog();
      }
    }
    this.closeDeleteCommunicationScheduledDialog();
    this.props.setOpenEditCommunication(false);
    this.props.setCommunicationScheduledSelected(null);
  };

  openCommunicationScheduledEditionDrawer = (
    communicationScheduled: CommunicationScheduled,
  ) => {
    if (checkIsScheduledMessageEditable(communicationScheduled)) {
      this.props.setCommunicationScheduledSelected(communicationScheduled);
      this.props.setOpenEditCommunication(true);
    } else {
      this.openTooLateToUpdateCommunicationScheduledDialog();
    }
  };

  closeCommunicationScheduledEditionDrawer = () => {
    this.props.setOpenEditCommunication(false);
    this.props.setCommunicationScheduledSelected(null);
  };

  getCampaignList = () =>
    Immutable(
      Array.isArray(this.props.automatedCampaignList)
        ? this.props.automatedCampaignList
            .filter((_campaign) => !!_campaign)
            .map((campaign) => [campaign, null])
        : [[this.props.automatedCampaignList, null]],
    );

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
          {(hasPermission: boolean) =>
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
            deleteCommunication={this.openCommunicationScheduledDeletionDrawer}
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
            campaignList={this.getCampaignList()}
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
        {!!this.props.openEditCommunication && (
          <ObjectLevelPermissionWrapper
            forcedBehavior="hidden"
            requiredPermission="member.allowed_actions.communication"
          >
            <CommunicationDrawer
              communicationIdentifier={CONTEXT_SMARTLIST}
              communicationObjectId={this.props.id}
              communicationTitle={
                this.props.communicationScheduledSelected?.title || ''
              }
              fullScreen={false}
              onDrawerClose={this.closeCommunicationScheduledEditionDrawer}
              openDrawer={this.props.openEditCommunication}
              smartlistOptions={{
                scheduledCommunicationDraft:
                  this.props.communicationScheduledSelected,
              }}
            />
          </ObjectLevelPermissionWrapper>
        )}
        {this.props.isDeleteCommunicationScheduledDialogOpen && (
          <GenericDeleteDialog
            cancelLabel={t('scheduled.deleteDialog.close')}
            content={t('scheduled.deleteDialog.content')}
            delayBeforeActivation={0}
            onCancel={this.closeDeleteCommunicationScheduledDialog}
            onValidate={this.deleteCommunicationScheduled}
            open={this.props.isDeleteCommunicationScheduledDialogOpen}
            title={t('scheduled.deleteDialog.title')}
            validateLabel={t('scheduled.deleteDialog.submit')}
          />
        )}
        {this.props.isTooLateToUpdateCommunicationScheduledDialogOpen && (
          <GenericMuiDialog
            cancelText={t('scheduled.tooLateToUpdateDialog.close')}
            content={t('scheduled.tooLateToUpdateDialog.content')}
            onCancel={this.closeTooLateToUpdateCommunicationScheduledDialog}
            open={this.props.isTooLateToUpdateCommunicationScheduledDialogOpen}
            title={t('scheduled.tooLateToUpdateDialog.title')}
          />
        )}
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
    resolvedGenericTags: getResolvedGenericTags(state),
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
    communicationScheduledList: getCommunicationScheduledForSmartlist(
      state,
      id,
    ),
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
  }),
  {
    fetchCampaignSmartlist,
    fetchCampaignSmartlistAutomated,
    fetchRecipientsNumberAllCampaignsIncludedAction,
    fetchSmartListAutomatedCampaign,
    push,

    fetchResolvedGenericTags: fetchResolvedGenericTagsAction,
    // SCHEDULED
    fetchCommunicationScheduledListForSmartlist:
      fetchCommunicationScheduledListForSmartlistAction,
    deleteCommunicationScheduled: deleteCommunicationScheduledAction,
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
          onSuccess: (isExportable: boolean) => {
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
};

const withStateHandlersInit: State = {
  openCommunicationScheduledSection: true,
  openManualCampaignSection: true,
  openAutomatedCampaignSection: true,
  openCampaignsExportSection: true,
  openExportLimitDialog: false,
  openEditCommunication: false,
  communicationScheduledSelected: null,
  isDeleteCommunicationScheduledDialogOpen: false,
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
  setOpenEditCommunication: () => (openEditCommunication: boolean) => {
    return { openEditCommunication };
  },
  setCommunicationScheduledSelected:
    () => (communicationScheduledSelected: CommunicationScheduled | null) => {
      return { communicationScheduledSelected };
    },
  setIsTooLateToUpdateCommunicationScheduledDialogOpen:
    () => (isTooLateToUpdateCommunicationScheduledDialogOpen: boolean) => {
      return {
        isTooLateToUpdateCommunicationScheduledDialogOpen,
      };
    },
  setIsDeleteCommunicationScheduledDialogOpen:
    () => (isDeleteCommunicationScheduledDialogOpen: boolean) => {
      return {
        isDeleteCommunicationScheduledDialogOpen,
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
  withStyles(styles),
  withTranslation('communication'),
  connector,
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withHandlers(mapWithHandlers),
)(SmartListCampaign);
