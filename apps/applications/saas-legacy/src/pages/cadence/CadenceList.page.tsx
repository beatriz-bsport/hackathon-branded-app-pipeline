import React from 'react';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import { push as pushRouter } from 'connected-react-router';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withStateHandlers, withHandlers } from 'recompose';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import type { Theme, WithStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import LinearProgress from '@material-ui/core/LinearProgress';

import withTitle from '#src/hocs/with-title.hoc';
import { openIntercomHelp } from '#src/intercom';

import {
  fetchCadenceList as fetchCadenceListAction,
  createCadence as createCadenceAction,
  updateCadence as updateCadenceAction,
  archiveCadence as archiveCadenceAction,
  restoreCadence as restoreCadenceAction,
  fetchGlobalMetrics as fetchGlobalMetricsAction,
  fetchPresentMembersData as fetchPresentMembersDataAction,
  fetchMembersHistoric as fetchMembersHistoricAction,
  fetchCadenceStepList as fetchCadenceStepListAction,
  searchCadencePresentMembersData as searchCadencePresentMembersDataAction,
  searchCadenceMembersHistoric as searchCadenceMembersHistoricAction,
} from '#src/libs/sequential_marketing/actions';
import { fetchMemberBulkById as fetchMemberBulkByIdAction } from '#src/libs/member/actions';

import {
  getEnabledCadencesList,
  getArchivedCadencesList,
  getCadenceLoading,
  getCadenceGlobalMetrics,
  getCadenceMembersHistoric,
  getCadenceMembersPresent,
  getCadenceStep,
  getCadenceGlobalMetricsLoading,
  getCadenceMembersHistoricLoading,
  getCadenceMembersPresentLoading,
} from '#src/libs/sequential_marketing/selectors';
import { getMemberListData } from '#src/libs/member/selectors';

import CadenceCreateAndUpdateForm from '#src/libs/sequential_marketing/components/form/CadenceCreateAndUpdateForm.component';
import CadenceList from '#src/libs/sequential_marketing/components/CadenceList.component';
import CadenceFreeTrialBanner from '#src/libs/sequential_marketing/components/banners/CadenceFreeTrialBanner.component';
import CadenceManagerFab from '#src/libs/sequential_marketing/components/CadenceManagerFab.components';
import CadenceMetrics from '#src/libs/sequential_marketing/components/metrics/CadenceMetrics.component';
import CadenceUpgradeTrialDialog from '#src/libs/sequential_marketing/components/dialogs/CadenceUpgradeTrialDialog.component';
import CadenceUtilityDialog, {
  DialogVariant,
} from '#src/libs/sequential_marketing/components/dialogs/DialogUtility';
import { DIALOG_CLOSE_DELAY_MS } from '#src/libs/sequential_marketing/constants';

import {
  UPSELL_IDENTIFIER_CADENCE,
  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
} from '#src/libs/platform-billing/upsell-identifiers';
import {
  getTrialRemainingDays,
  hasFreeTrial,
  hasUpsell,
} from '#src/libs/platform-billing/utils';
import UpsellBlocker from '#src/libs/platform-billing/components/UpsellBlocker.component';

import type {
  Cadence,
  CadenceGlobalMetricsParams,
  CadenceMembersInData,
  CadencePaginatedMetricsParams,
  MetricsPaginatedResponse,
} from '#src/libs/sequential_marketing/types';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import type { RootState } from '../../reducers';
import type { WithHandlerType } from '../../utils/types';
import type { OptionCallback } from '../../state/types';

const CADENCE_PAGE_SIZE = 500;

type StateHandlerType = typeof StateHandlersInit &
  WithHandlerType<typeof StateHandlersSetter>;

type ConnectedPropsAndState = ConnectedProps<typeof connector> &
  StateHandlerType;

type Props = ConnectedPropsAndState &
  WithHandlerType<typeof mapWithHandlers> &
  WithStyles<typeof styles> &
  StateHandlerType &
  WithTranslation;

const {
  trackFormAdd,
  trackFormSubmitIntent,
  trackFormSuccess,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Audience,
);

export class CadenceListPage extends React.Component<Props> {
  componentDidMount(): void {
    this.props.fetchCadenceList();
  }

  componentDidUpdate(prevProps: Props): void {
    if (
      prevProps.cadenceList &&
      this.props.cadenceList &&
      prevProps.cadenceList !== this.props.cadenceList &&
      !this.props.selectedCadence
    ) {
      this.props.cadenceList?.[0]?.id
        ? this.handleSelectCadence(this.props.cadenceList[0])
        : this.props.setSelectedCadence(null);
    }
  }

  handleFetchCadenceMetrics = (cadenceId: number) => {
    this.props.fetchGlobalMetrics(cadenceId, {
      date_start: this.props.startDateFilter,
      date_end: this.props.endDateFilter,
    });
    this.props.fetchPresentMembersData(cadenceId);
    this.props.fetchMembersHistoric(cadenceId);
  };

  handleFetchPresentMembersSpecificPage = (cadenceId: number, page: number) => {
    this.props.fetchPresentMembersData(cadenceId, { page });
  };

  handleFetchMembersHistoricSpecificPage = (
    cadenceId: number,
    page: number,
  ) => {
    this.props.fetchMembersHistoric(cadenceId, { page });
  };

  handleSearchPresentMembersSpecificPage = (
    cadenceId: number,
    text: string,
    page: number,
  ) => {
    text &&
      this.props.searchCadencePresentMembersData(cadenceId, { page, text });
  };

  handleSearchMembersHistoricSpecificPage = (
    cadenceId: number,
    text: string,
    page: number,
  ) => {
    text && this.props.searchCadenceMembersHistoric(cadenceId, { page, text });
  };

  handleSelectCadence = (cadence: Cadence) => {
    this.props.setSelectedCadence(cadence);
    this.props.fetchCadenceStepListAction({ id__in: cadence.steps });
    this.handleFetchCadenceMetrics(cadence?.id);
  };

  handleOpenCreationForm = () => {
    trackFormAdd();
    this.props.setOpenCreationForm(true);
  };

  handleCloseCreationForm = () => {
    this.props.setOpenCreationForm(false);
    // Using a timeout here to avoid resetting the form information before its closing
    setTimeout(this.handleResetCadenceToEdit, DIALOG_CLOSE_DELAY_MS);
  };

  handleCloseCreationFormAndGoToCadencePage = (id: number) => {
    this.props.setOpenCreationForm(false);
    this.handleResetCadenceToEdit();
    if (id) {
      this.props.goToCadencePage(id);
    }
  };

  handleResetCadenceToEdit = () => {
    trackFormCancel(null, { info: "User cancel audience's editing" });
    this.props.setCadenceToEdit(null);
  };

  handleSetCadenceToArchive = (cadence: Cadence) => {
    trackFormAdd(cadence.id, {
      info: 'User wants to put this audience to archive',
    });
    this.props.setCadenceToArchive(cadence);
  };

  handleResetCadenceToArchive = () => this.props.setCadenceToArchive(null);

  handleSetCadenceToEdit = (cadence: Cadence) => {
    trackFormAdd(cadence.id, { info: 'User wants to edit this audience' });
    this.props.setCadenceToEdit(cadence);
    this.props.setOpenCreationForm(true);
  };

  handleUpsertCadence = (
    data: { id?: number; name: string; is_multiple_visit_allowed?: boolean },
    options?: OptionCallback,
  ) => {
    if (!data?.id) {
      trackFormSubmitIntent(null, { info: 'User wants to create an Audience' });
      return this.props.createCadence(data, {
        onSuccess: (cadenceId: number) => {
          options?.onSuccess?.();
          trackFormSuccess(cadenceId, { info: 'Audience has been created' });
          this.handleCloseCreationFormAndGoToCadencePage(cadenceId);
        },
        onError: () => {
          options?.onError?.();
        },
      });
    }
    trackFormSubmitIntent(data.id, {
      info: 'User wants to update this audience',
    });
    return this.props.updateCadence(
      data.id,
      {
        name: data.name,
        is_multiple_visit_allowed: data.is_multiple_visit_allowed,
      },
      {
        onSuccess: (cadence) => {
          options?.onSuccess?.();
          // Updating the value of cadenceToEdit to avoid displaying previous
          // cadence value in the update form before its closing
          trackFormSuccess(cadence.id, {
            info: 'User updated this audience',
          });
          this.props.setCadenceToEdit(cadence);
          this.handleCloseCreationForm();
        },
        onError: () => {
          options?.onError?.();
        },
      },
    );
  };

  handleGoToCadencePage = (cadence: Cadence) =>
    cadence?.id && this.props.goToCadencePage(cadence.id);

  handleUpdateFilterDates = (
    startDateFilter: string,
    endDateFilter: string,
  ) => {
    this.props.setFilterDates(startDateFilter, endDateFilter);
    if (this.props.selectedCadence?.id) {
      this.props.fetchGlobalMetrics(this.props.selectedCadence?.id, {
        date_start: startDateFilter,
        date_end: endDateFilter,
      });
    }
  };

  knowMoreOnUpsells = () => this.props.push('/settings/platform-billing/');

  handleOpenIntercomHelp = () => openIntercomHelp('audienceGuide');

  openUpgradeTrialDialog = () => {
    this.props.setIsUpgradeTrialDialogOpen(true);
  };

  handleCloseUpgradeTrialDialog = () => {
    this.props.setIsUpgradeTrialDialogOpen(false);
  };

  hasNotificationUpsell = hasUpsell(
    this.props.featureList,
    UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
  );

  isInFreeTrial = hasFreeTrial(
    this.props.featureList,
    UPSELL_IDENTIFIER_CADENCE,
  );

  trialRemainingDays = getTrialRemainingDays(
    this.props.featureList,
    UPSELL_IDENTIFIER_CADENCE,
  );

  render() {
    const {
      t,
      classes,
      cadenceToArchive,
      cadenceArchivedList,
      cadenceLoading,
      cadenceList,
    } = this.props;

    if (
      !cadenceLoading &&
      (!cadenceList || cadenceList?.length === 0) &&
      (!cadenceArchivedList || cadenceArchivedList?.length === 0)
    ) {
      return (
        <div className={classes.layoutContainer}>
          {this.isInFreeTrial && this.trialRemainingDays && (
            <CadenceFreeTrialBanner
              daysRemaining={this.trialRemainingDays}
              onUpgradeClick={this.openUpgradeTrialDialog}
            />
          )}
          <div className={classes.pageContainer}>
            <UpsellBlocker upsellIdentifier={UPSELL_IDENTIFIER_CADENCE} />
            <div className={classes.centerVertical}>
              <Alert
                classes={{
                  root: classes.alert,
                  outlinedInfo: classes.outlinedInfo,
                  icon: classes.alertIcon,
                }}
                className={classes.alert}
                icon={<ErrorOutlineIcon className={classes.rotate} />}
                severity="info"
                variant="outlined"
              >
                {t('audience.form.emptyAudienceHelper')}
              </Alert>
              <div className={classes.emptyPageButtonsContainer}>
                <Button
                  className={classes.emptyPageButton}
                  color="primary"
                  onClick={this.handleOpenIntercomHelp}
                  variant="outlined"
                >
                  <HelpOutlineIcon className={classes.buttonIcon} />
                  {t('audience.form.openIntercomHelp')}
                </Button>
                <Button
                  className={classes.emptyPageButton}
                  color="primary"
                  onClick={this.handleOpenCreationForm}
                  variant="contained"
                >
                  <AddIcon className={classes.buttonIcon} />
                  {t('audience.form.addAWorkflow')}
                </Button>
              </div>
            </div>
            <CadenceCreateAndUpdateForm
              displayParametersSection
              loading={cadenceLoading}
              onCancel={this.handleCloseCreationForm}
              onSubmit={this.handleUpsertCadence}
              open={this.props.openCreationForm}
            />
            <CadenceUpgradeTrialDialog
              closeDialog={this.handleCloseUpgradeTrialDialog}
              isOpen={this.props.isUpgradeTrialDialogOpen}
            />
          </div>
        </div>
      );
    }

    return (
      <div className={classes.layoutContainer}>
        {cadenceLoading && <LinearProgress />}
        {this.isInFreeTrial && this.trialRemainingDays && (
          <CadenceFreeTrialBanner
            daysRemaining={this.trialRemainingDays}
            onUpgradeClick={this.openUpgradeTrialDialog}
          />
        )}
        <div className={classes.pageContainer}>
          <UpsellBlocker upsellIdentifier={UPSELL_IDENTIFIER_CADENCE} />
          <div className={classes.pageColumn}>
            <Alert
              classes={{
                root: classes.alert,
              }}
              className={classes.alertHelper}
              severity="info"
              variant="outlined"
            >
              {t('audience.audienceIndexHelper')}
            </Alert>
            <CadenceList
              cadenceLoading={cadenceLoading}
              cadences={cadenceList}
              onClickItem={this.handleSelectCadence}
              onDelete={this.handleSetCadenceToArchive}
              onEdit={this.handleSetCadenceToEdit}
              onOpen={this.handleGoToCadencePage}
              selectedId={this.props.selectedCadence?.id}
              updateCadencePriorityIndex={this.props.updateCadencePriorityIndex}
            />
            <div className={classes.paddingTop}>
              {cadenceArchivedList && cadenceArchivedList.length !== 0 && (
                <CadenceList
                  archivedVersion
                  cadenceLoading={cadenceLoading}
                  cadences={cadenceArchivedList}
                  onRestore={this.props.restoreCadence}
                />
              )}
            </div>
          </div>
          <div className={clsx(classes.pageColumn, classes.hideOnSmallScreen)}>
            <CadenceMetrics
              cadence={this.props.selectedCadence}
              changeMembersHistoricPage={
                this.handleFetchMembersHistoricSpecificPage
              }
              changePresentMembersPage={
                this.handleFetchPresentMembersSpecificPage
              }
              endDate={this.props.endDateFilter}
              getCadenceStep={this.props.getStep}
              getGlobalMetrics={this.props.getGlobalMetrics}
              getMembersHistoric={this.props.getMembersHistoric}
              getMembersPresent={this.props.getMembersPresent}
              globalMetricsLoading={this.props.globalMetricsLoading}
              goTagsPage={this.props.goTagsPage}
              hasNotificationUpsell={this.hasNotificationUpsell}
              knowMoreOnNotifications={this.knowMoreOnUpsells}
              membersById={this.props.membersById}
              membersHistoricLoading={this.props.membersHistoricLoading}
              membersPresentLoading={this.props.membersPresentLoading}
              onOpen={this.handleGoToCadencePage}
              searchMembersHistoric={
                this.handleSearchMembersHistoricSpecificPage
              }
              searchPresentMembers={this.handleSearchPresentMembersSpecificPage}
              startDate={this.props.startDateFilter}
              updateFilterDates={this.handleUpdateFilterDates}
            />
          </div>
        </div>
        <CadenceCreateAndUpdateForm
          displayParametersSection
          initial={this.props.cadenceToEdit}
          loading={cadenceLoading}
          onCancel={this.handleCloseCreationForm}
          onSubmit={this.handleUpsertCadence}
          open={this.props.openCreationForm}
        />
        <CadenceUtilityDialog
          cadence={cadenceToArchive}
          onCancel={this.handleResetCadenceToArchive}
          onConfirm={this.props.archiveCadence}
          open={!!cadenceToArchive}
          variant={DialogVariant.ARCHIVE_WORKFLOW}
        />
        <CadenceUpgradeTrialDialog
          closeDialog={this.handleCloseUpgradeTrialDialog}
          isOpen={this.props.isUpgradeTrialDialogOpen}
        />
        <CadenceManagerFab onAdd={this.handleOpenCreationForm} />
      </div>
    );
  }
}

type StateHandlerInit = {
  openCreationForm: boolean;
  cadenceToEdit: Cadence | null;
  selectedCadence: Cadence | null;
  cadenceToArchive: Cadence | null;
  startDateFilter: string;
  endDateFilter: string;
  isUpgradeTrialDialogOpen: boolean;
};

const StateHandlersInit: StateHandlerInit = {
  openCreationForm: false,
  cadenceToEdit: null,
  selectedCadence: null,
  cadenceToArchive: null,
  startDateFilter: DateTime.now().minus({ month: 1 }).toISODate(),
  endDateFilter: DateTime.now().toISODate(),
  isUpgradeTrialDialogOpen: false,
};

const StateHandlersSetter = {
  setOpenCreationForm: () => (openCreationForm: boolean) => {
    return { openCreationForm };
  },

  setCadenceToEdit: () => (cadenceToEdit: Cadence | null) => {
    return { cadenceToEdit };
  },

  setSelectedCadence: () => (selectedCadence: Cadence | null) => {
    return { selectedCadence };
  },

  setCadenceToArchive: () => (cadenceToArchive: Cadence | null) => {
    return { cadenceToArchive };
  },

  setFilterDates: () => (startDateFilter: string, endDateFilter: string) => {
    return { startDateFilter, endDateFilter };
  },

  setIsUpgradeTrialDialogOpen: () => (isUpgradeTrialDialogOpen: boolean) => {
    return { isUpgradeTrialDialogOpen };
  },
};

const mapWithHandlers = {
  goToCadencePage: (props: ConnectedPropsAndState) => (id: number) =>
    props.push(`/audience/${id}`),

  goTagsPage: (props: ConnectedPropsAndState) => () =>
    props.push(`/marketing/tags`),

  fetchCadenceList: (props: ConnectedPropsAndState) => () => {
    props.fetchCadenceListAction({ page_size: CADENCE_PAGE_SIZE });
  },

  createCadence:
    (props: ConnectedPropsAndState) =>
    (
      data: { name: string; is_multiple_visit_allowed?: boolean },
      options?: OptionCallback<number>,
    ) => {
      props.createCadenceAction(data, {
        onSuccess: (cadence) => {
          options?.onSuccess?.(cadence?.id);
        },
        onError: () => {
          options?.onError?.();
        },
      });
    },

  updateCadence:
    (props: ConnectedPropsAndState) =>
    (
      id: number,
      data: { name: string; is_multiple_visit_allowed?: boolean },
      options?: OptionCallback<Cadence>,
    ) => {
      props.updateCadenceAction(id, data, {
        onSuccess: (cadence) => {
          options?.onSuccess?.(cadence);
        },
        onError: () => {
          options?.onError?.();
        },
      });
    },

  updateCadencePriorityIndex:
    (props: ConnectedPropsAndState) =>
    (
      id: number,
      data: { priority_index: number },
      options?: OptionCallback,
    ) => {
      props.updateCadenceAction(id, data, {
        onSuccess: () => {
          props.fetchCadenceListAction({ page_size: CADENCE_PAGE_SIZE });
          options?.onSuccess?.();
        },
        onError: () => {
          options?.onError?.();
        },
      });
    },

  archiveCadence: (props: ConnectedPropsAndState) => () => {
    if (props.cadenceToArchive) {
      trackFormSubmitIntent(props.cadenceToArchive?.id);
      props.archiveCadenceAction(props.cadenceToArchive?.id, {
        onSuccess: () => {
          trackFormSuccess(props.cadenceToArchive?.id);
          props.fetchCadenceListAction({ page_size: CADENCE_PAGE_SIZE });
        },
        onError: () =>
          props.fetchCadenceListAction({ page_size: CADENCE_PAGE_SIZE }),
      });
      props.setCadenceToArchive(null);
    }
  },

  restoreCadence: (props: ConnectedPropsAndState) => (id: number) =>
    props.restoreCadenceAction(id),

  fetchGlobalMetrics:
    (props: ConnectedPropsAndState) =>
    (cadenceId: number, date_filter?: CadenceGlobalMetricsParams) =>
      props.fetchGlobalMetricsAction(cadenceId, {
        date_start: date_filter.date_start,
        date_end: DateTime.fromISO(date_filter.date_end)
          .plus({ day: 1 })
          .toISODate(),
      }),

  fetchPresentMembersData:
    (props: ConnectedPropsAndState) =>
    (
      cadenceId: number,
      params?: CadencePaginatedMetricsParams,
      options?: OptionCallback<MetricsPaginatedResponse<CadenceMembersInData>>,
    ) => {
      if (cadenceId) {
        props.fetchPresentMembersDataAction(cadenceId, params, {
          ...options,
          onSuccess: (paginatedMembersData) => {
            props.fetchMemberBulkById(
              paginatedMembersData?.results?.map(
                (member) => member.member_id,
              ) ?? [],
            );
          },
        });
      }
    },

  searchCadencePresentMembersData:
    (props: ConnectedPropsAndState) =>
    (
      cadenceId: number,
      params?: CadencePaginatedMetricsParams & { text: string },
      options?: OptionCallback<MetricsPaginatedResponse<CadenceMembersInData>>,
    ) => {
      if (cadenceId) {
        props.searchCadencePresentMembersDataAction(cadenceId, params, {
          ...options,
          onSuccess: (paginatedMembersData) => {
            props.fetchMemberBulkById(
              paginatedMembersData?.results?.map(
                (member) => member.member_id,
              ) ?? [],
            );
          },
        });
      }
    },

  fetchMembersHistoric:
    (props: ConnectedPropsAndState) =>
    (
      cadenceId: number,
      params?: CadencePaginatedMetricsParams,
      options?: OptionCallback<MetricsPaginatedResponse<CadenceMembersInData>>,
    ) => {
      if (cadenceId) {
        props.fetchMembersHistoricAction(cadenceId, params, {
          ...options,
          onSuccess: (paginatedMembersData) => {
            props.fetchMemberBulkById(
              paginatedMembersData?.results?.map(
                (member) => member.member_id,
              ) ?? [],
            );
          },
        });
      }
    },

  searchCadenceMembersHistoric:
    (props: ConnectedPropsAndState) =>
    (
      cadenceId: number,
      params?: CadencePaginatedMetricsParams & { text: string },
      options?: OptionCallback<MetricsPaginatedResponse<CadenceMembersInData>>,
    ) => {
      if (cadenceId) {
        props.searchCadenceMembersHistoricAction(cadenceId, params, {
          ...options,
          onSuccess: (paginatedMembersData) => {
            props.fetchMemberBulkById(
              paginatedMembersData?.results?.map(
                (member) => member.member_id,
              ) ?? [],
            );
          },
        });
      }
    },
};

const connector = connect(
  (state: RootState) => ({
    cadenceLoading: getCadenceLoading(state),
    cadenceList: getEnabledCadencesList(state),
    cadenceArchivedList: getArchivedCadencesList(state),
    globalMetricsLoading: getCadenceGlobalMetricsLoading(state),
    membersHistoricLoading: getCadenceMembersHistoricLoading(state),
    membersPresentLoading: getCadenceMembersPresentLoading(state),
    membersById: getMemberListData(state),
    featureList: state.company.feature.data,
    getGlobalMetrics: (cadenceId: number) =>
      getCadenceGlobalMetrics(state, cadenceId),
    getMembersHistoric: (cadenceId: number) =>
      getCadenceMembersHistoric(state, cadenceId),
    getMembersPresent: (cadenceId: number) =>
      getCadenceMembersPresent(state, cadenceId),
    getStep: (stepId: number) => getCadenceStep(state, stepId),
  }),
  {
    push: pushRouter,
    fetchCadenceListAction,
    createCadenceAction,
    updateCadenceAction,
    archiveCadenceAction,
    restoreCadenceAction,
    // METRICS
    fetchGlobalMetricsAction,
    fetchPresentMembersDataAction,
    fetchMembersHistoricAction,
    searchCadencePresentMembersDataAction,
    searchCadenceMembersHistoricAction,
    fetchCadenceStepListAction,
    fetchMemberBulkById: fetchMemberBulkByIdAction,
  },
);

const styles = (theme: Theme) =>
  createStyles({
    layoutContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
    },
    pageContainer: {
      display: 'flex',
      gap: theme.spacing(2),
      width: '100%',
      height: '-webkit-fill-available',
      position: 'relative',
      overflow: 'hidden',
      justifyContent: 'center',
      paddingBottom: theme.spacing(1),
      paddingTop: theme.spacing(2),
      [theme.breakpoints.up('md')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
    },
    pageColumn: {
      paddingTop: theme.spacing(2),
      flex: 1,
      [theme.breakpoints.up('lg')]: {
        maxWidth: '50%',
      },
      boxSizing: 'border-box',
      overflowY: 'auto',
      '-ms-overflow-style': 'none' /* for Internet Explorer, Edge */,
      scrollbarWidth: 'none' /* for Firefox */,
      '&::-webkit-scrollbar': {
        display: 'none' /* for Chrome, Safari, and Opera */,
      },
    },
    hideOnSmallScreen: {
      [theme.breakpoints.down('md')]: {
        display: 'none',
      },
    },
    alert: {
      alignItems: 'center',
    },
    outlinedInfo: {
      color: 'black',
      borderColor: 'transparent',
    },
    alertIcon: {
      color: 'black',
    },
    centerVertical: {
      paddingTop: theme.spacing(11),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing(4),
      width: '50%',
    },
    rotate: {
      transform: 'rotate(180deg)',
      color: 'black',
    },
    emptyPageButtonsContainer: {
      display: 'flex',
      gap: theme.spacing(2),
    },
    emptyPageButton: {
      minWidth: theme.spacing(23),
    },
    buttonIcon: {
      marginRight: theme.spacing(1),
      width: theme.spacing(2.5),
      height: theme.spacing(2.5),
    },
    paddingTop: {
      paddingTop: theme.spacing(3),
    },
    alertHelper: {
      marginBottom: theme.spacing(2),
    },
  });

export default compose(
  withStyles(styles),
  withTranslation('marketing'),
  withTitle(({ t }) => t('titles:marketing.audience')),
  connector,
  withStateHandlers(StateHandlersInit, StateHandlersSetter),
  withHandlers(mapWithHandlers),
)(CadenceListPage);
