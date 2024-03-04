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

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import Config from '../../config';

import { WithHandlerType, MaterialStyleType } from '../../utils/types';
import type { CampaignExportStartEndDates } from '#libs/communication/types';

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

import { RootState } from '../../reducers';
import CampaignList from '#libs/communication/components/CampaignList.component';
import { fetchResolvedGenericTags as fetchResolvedGenericTagsAction } from '#libs/notification-rule/actions';
import { getResolvedGenericTags } from '#libs/notification-rule/selectors';
import CampaignsExportSection from '#libs/communication/components/CampaignsExportSection.component';
import CampaignsExportLimitDialog from '#libs/communication/components/CampaignsExportLimitDialog.component';

type OwnProps = {
  id: number;
};

type OwnAndConnectedProps = OwnProps & ConnectedProps<typeof connector>;

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

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

  changeOpenManualCampaignSection = () => {
    this.props.setOpenManualCampaignSection(
      !this.props?.openManualCampaignSection,
    );
  };

  render() {
    const {
      t,
      classes,
      openManualCampaignSection,
      openAutomatedCampaignSection,
      openCampaignsExportSection,
      openExportLimitDialog,
    } = this.props;

    return (
      <div className={classes.container}>
        {(Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
          this.props.companyId === 498) && (
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
        )}

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
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    campaignList: getCampaignBySmartlist(state),
    automatedCampaignList: withAutomatedCampaign(
      getAutomatedCampaignBySmartlist,
    )(state),
    campaignState: state.communication.campaign.bySmartlist,
    automatedCampaignState: state.communication.automatedCampaign.bySmartlist,
    loading: state.communication.campaign.bySmartlist.loading,
    resolvedGenericTags: getResolvedGenericTags(state),
    csvExportLink: getCsvExportAllCampaignsLink(state),
    csvExportDate: getCsvExportAllCampaignsDate(state),
    csvRecipientCount: getCsvExportAllCampaignsRecipientCount(state),
    csvIsXlsxExportable: getCsvExportAllCampaignsIsXlsxExportable(state),
    csvExportLoading: getCsvExportAllCampaignsIsLoading(state),
  }),
  {
    fetchCampaignSmartlist,
    fetchCampaignSmartlistAutomated,
    fetchRecipientsNumberAllCampaignsIncludedAction,
    fetchSmartListAutomatedCampaign,
    push,
    fetchResolvedGenericTags: fetchResolvedGenericTagsAction,

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
};

const withStateHandlersInit = {
  openManualCampaignSection: true,
  openAutomatedCampaignSection: true,
  openCampaignsExportSection: true,
  openExportLimitDialog: false,
};

const withStateHandlersSetter = {
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
