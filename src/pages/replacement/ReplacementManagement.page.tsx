import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { compose, withHandlers } from 'recompose';
import chroma from 'chroma-js';
import uniq from 'lodash/uniq';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
// @ts-expect-error wierd imports
import Select, { GroupTypeBase, Styles } from 'react-select';
import classNames from 'classnames';

import { colors } from '@bsport/common/lib/colors';

import makeStyles from '@material-ui/core/styles/makeStyles';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';
import Pagination from '@material-ui/lab/Pagination';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { REPLACEMEMENT_REQUEST_LATE_ALERT_KIND } from '@bsport/common/lib/master-data/alerting_kind';

import { DateTime } from 'luxon';
import ReplacementRequestFilters from '#libs/replacement-request/components/ReplacementRequestFilters.component';
import ActivitiesToReplaceTable from '#libs/replacement-request/components/replacement-request-table/ActivitiesToReplaceTable.component';
import ReplacementRequestClosingDateExtensionDialog from '#libs/replacement-request/components/dialogs/ReplacementRequestClosingDateExtensionDialog.component';
import ReplacementRequestCoachAnswerDialog from '#libs/replacement-request/components/dialogs/ReplacementRequestCoachAnswerDialog.component';
import ReplacementRequestRefuseDialog from '#libs/replacement-request/components/dialogs/ReplacementRequestRefuseDialog.component';
import DateRangeSelector from '#components/date/DateRangeSelector.component';

import {
  ReplacementDisplays,
  PAGE_SIZE,
  ReplacementRequestStatus,
} from '#libs/replacement-request/constants';
import {
  getOfferCalendarStateData,
  withCoach,
  withEstablishment,
  withMetaActivity,
} from '#libs/offer/selectors';
import { withCustomLevel } from '#libs/level/selectors';
import { getActiveCoaches } from '#libs/associated-coach/selectors';
import { getEditableSCTs } from '#libs/category/selectors';
import {
  withEstablishment as groupWithEstablishment,
  getAssociatedEstablishmentGroup,
  getAvailableEstablishmentList,
} from '#libs/establishment/selectors';
import {
  getAllPendingReplacementRequests,
  withCompleteOffer,
  withCoachAnswers,
} from '#libs/replacement-request/selectors';
import { getEnabledMetaActivities } from '#libs/meta-activity/selectors';
import {
  fetchAllOffersPaginated as fetchAllOffersPaginatedAction,
  fetchOfferBulk as fetchOfferBulkAction,
} from '#libs/offer/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoachesListAction } from '#libs/associated-coach/actions';
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#libs/establishment/actions';
import { fetchActivitiesCompany as fetchActivitiesCompanyAction } from '#libs/meta-activity/actions';
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import {
  fetchAllReplacementRequests as fetchAllReplacementRequestsAction,
  postponeReplacementRequestClosingDate as postponeReplacementRequestClosingDateAction,
  refuseReplacementRequest as refuseReplacementRequestAction,
  fetchAllReplacementRequestCoachAnswers as fetchAllReplacementRequestCoachAnswersAction,
  approveReplacementRequestCoachAnswer as approveReplacementRequestCoachAnswerAction,
  hasRequestsLinkedToCancelledOffers as fetchHasRequestsLinkedToCancelledOffersAction,
} from '#libs/replacement-request/actions';
import { ReplacementRequest } from '#libs/replacement-request/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment, EstablishmentGroup } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Level } from '#libs/level/types';
import { fetch as fetchSpecificAlertKindAction } from '#libs/alerting/actions';
import { updateReplacementRequestLastSeen as updateReplacementRequestLastSeenAPI } from '#libs/replacement-request/api';

import {
  setReplacementRequestManagerFilter as setReplacementRequestManagerFilterAction,
  setReplacementRequestOfferHistoryFilter as setReplacementRequestOfferHistoryFilterAction,
} from '#libs/user-preference/actions';
import { WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers';

const FILTER_LATE = 5;
const FILTER_CLOSED = 6;

type ConnectProps = ConnectedProps<typeof connector>;
type Props = ConnectProps & WithHandlerType<typeof handlers>;

export const ReplacementManagement: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation('replacement');

  const {
    setReplacementRequestManagerFilter,
    replacementRequestManagerFilter,
    setReplacementRequestOfferHistoryFilter,
    replacementRequestOfferHistoryFilter,
    refuseReplacementRequest,
    approveReplacementRequestCoachAnswer,
    replacementRequestLoading,
    coachLoading,
    metaActivityLoading,
    establishmentGroupLoading,
    establishmentLoading,
    offerBulkLoading,
    replacementRequestCount,
    replacementRequestPage,
    replacementRequestOfferHistoryCount,
    replacementRequestOfferHistoryPage,
    fetchReplacementRequests,
    fetchAllDataForFilters,
    fetchReplacementRequestOfferHistory,
    metaActivityList,
    SCTList,
    updateReplacementRequestLastSeen,
    companyTheme,
    updatingReplacementRequestLoading,
    fetchHasRequestsLinkedToCancelledOffers,
    hasRequestsLinkedToCancelledOffers,
    hasRequestsLinkedToCancelledOffersLoading,
  } = props;

  const [extensionDialogOpen, setExtensionDialogOpen] = useState(false);
  const [answersDialogOpen, setAnswersDialogOpen] = useState(false);
  const [refuseDialogOpen, setRefuseDialogOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [replacementRequestSelected, setReplacementRequestSelected] =
    useState<
      ReplacementRequest<
        Coach,
        Establishment,
        MetaActivity,
        number,
        number,
        number,
        Level
      >
    >(null);

  const replacementRequestsTotalPages = useMemo(
    () => Math.ceil(replacementRequestCount / PAGE_SIZE),
    [replacementRequestCount],
  );

  const replacementOfferHistoryTotalPages = useMemo(
    () => Math.ceil(replacementRequestOfferHistoryCount / PAGE_SIZE),
    [replacementRequestOfferHistoryCount],
  );

  // Fetch selectors data when page mounts, and update last_seen db field
  useEffect(() => {
    fetchAllDataForFilters();
    updateReplacementRequestLastSeen();
  }, [fetchAllDataForFilters, updateReplacementRequestLastSeen]);

  // Refetch replacement requests page 1 everytime filters get updated
  useEffect(() => {
    fetchHasRequestsLinkedToCancelledOffers();
    fetchReplacementRequests(1);
  }, [
    fetchReplacementRequests,
    fetchHasRequestsLinkedToCancelledOffers,
    replacementRequestManagerFilter,
  ]);

  useEffect(() => {
    // fetch on toggle collapse and on filter change
    if (showHistory) fetchReplacementRequestOfferHistory(1);
  }, [
    fetchReplacementRequestOfferHistory,
    showHistory,
    replacementRequestOfferHistoryFilter,
  ]);

  const SCTOptions = useMemo(() => {
    const SCTIds = uniq(
      metaActivityList?.map((metaActivity) => metaActivity.SCT) || [],
    );
    return SCTIds.map(
      (SCTId) =>
        SCTList.find((sct) => sct.id === SCTId) ?? { name: '', id: SCTId },
    ).map((sct) => ({
      label: sct.name,
      value: sct.id,
    }));
  }, [metaActivityList, SCTList]);

  const hasRequestedLateOptions = useMemo(
    () => [
      { label: t('lateStatus.isLate'), value: true },
      { label: t('lateStatus.isNotLate'), value: false },
    ],
    [t],
  );

  const isRequestClosedOptions = useMemo(
    () => [
      { label: t('registrationsStatus.areClosed'), value: true },
      { label: t('registrationsStatus.areNotClosed'), value: false },
    ],
    [t],
  );

  const isLoading = useMemo(
    () =>
      coachLoading ||
      establishmentLoading ||
      establishmentGroupLoading ||
      metaActivityLoading ||
      replacementRequestLoading ||
      offerBulkLoading ||
      !companyTheme?.timezone_name,
    [
      coachLoading,
      establishmentLoading,
      establishmentGroupLoading,
      metaActivityLoading,
      replacementRequestLoading,
      offerBulkLoading,
      companyTheme,
    ],
  );

  const setFilter = useCallback(
    (
      newValues: Array<{ label: string; value: number | string }>,
      identifier: number,
    ) => {
      switch (identifier) {
        case FILTER_LATE:
          setReplacementRequestManagerFilter({
            ...replacementRequestManagerFilter,
            // @ts-expect-error
            has_requested_late: newValues ? newValues.value : null,
          });
          break;
        case FILTER_CLOSED:
          setReplacementRequestManagerFilter({
            ...replacementRequestManagerFilter,
            // @ts-expect-error
            closing_date_exceeded: newValues ? newValues.value : null,
          });
          break;
        default:
          break;
      }
    },
    [setReplacementRequestManagerFilter, replacementRequestManagerFilter],
  );

  const handleExtensionAction = (
    replacementRequest: ReplacementRequest<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >,
  ) => {
    setReplacementRequestSelected(replacementRequest);
    setExtensionDialogOpen(true);
  };

  const handleReplaceAction = (
    replacementRequest: ReplacementRequest<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >,
  ) => {
    setReplacementRequestSelected(replacementRequest);
    setAnswersDialogOpen(true);
  };

  const handleRefuseAction = (
    replacementRequest: ReplacementRequest<
      Coach,
      Establishment,
      MetaActivity,
      number,
      number,
      number,
      Level
    >,
  ) => {
    setReplacementRequestSelected(replacementRequest);
    setRefuseDialogOpen(true);
  };

  const handleCloseExtensionAction = () => setExtensionDialogOpen(false);
  const handleCloseAnswersAction = () => setAnswersDialogOpen(false);
  const handleCloseRefuseAction = () => setRefuseDialogOpen(false);

  return (
    <>
      <ReplacementRequestFilters
        coachList={props.coachList}
        coachLoading={props.coachLoading}
        enableMultiLocalization={companyTheme.enable_multi_localization}
        establishmentGroupList={props.establishmentGroupList}
        establishmentGroupLoading={props.establishmentGroupLoading}
        establishmentList={props.establishmentList}
        establishmentLoading={props.establishmentLoading}
        // @ts-expect-error
        metaActivityList={props.metaActivityList}
        metaActivityLoading={props.metaActivityLoading}
        replacementRequestManagerFilter={replacementRequestManagerFilter}
        SCTOptions={SCTOptions}
        setReplacementRequestManagerFilter={setReplacementRequestManagerFilter}
      />

      <Paper className={classes.paperContainer} elevation={0}>
        <Typography className={classes.buttonTitle} component="h2" variant="h5">
          {t('managerTableTitles.pendingRequests')}
        </Typography>
        <div className={classes.flexRow}>
          <div
            className={classNames(
              classes.innerFlexContainer,
              classes.flexStart,
              classes.flexColumnOnSmallscreen,
              classes.flex4,
              classes.disableMarginBottomOnSmallScreen,
            )}
          >
            <div
              className={classNames(
                classes.filtersPendingRequests,
                classes.filters,
              )}
            >
              <Select
                closeMenuOnSelect
                isClearable
                isMulti={false}
                onChange={(ev) => {
                  // @ts-expect-error
                  setFilter(ev, FILTER_LATE);
                }}
                options={hasRequestedLateOptions}
                placeholder={t('selects.lateStatus')}
                styles={selectStyles}
                value={hasRequestedLateOptions.find(
                  (opt) =>
                    opt.value ===
                    replacementRequestManagerFilter.has_requested_late,
                )}
              />
            </div>
            <div
              className={classNames(
                classes.filtersPendingRequests,
                classes.filters,
              )}
            >
              <Select
                closeMenuOnSelect
                isClearable
                isMulti={false}
                onChange={(ev) => {
                  // @ts-expect-error
                  setFilter(ev, FILTER_CLOSED);
                }}
                options={isRequestClosedOptions}
                placeholder={t('selects.closedStatus')}
                styles={selectStyles}
                value={isRequestClosedOptions.find(
                  (opt) =>
                    opt.value ===
                    replacementRequestManagerFilter.closing_date_exceeded,
                )}
              />
            </div>
            <div
              className={classNames(
                classes.filtersPendingRequests,
                classes.filters,
              )}
            >
              <DateRangeSelector
                futureOnly
                date_end={
                  replacementRequestManagerFilter.offer__date_start__lte
                    ? DateTime.fromISO(
                        replacementRequestManagerFilter.offer__date_start__lte,
                      ).toUnixInteger()
                    : null
                }
                date_start={
                  replacementRequestManagerFilter.offer__date_start__gte
                    ? DateTime.fromISO(
                        replacementRequestManagerFilter.offer__date_start__gte,
                      ).toUnixInteger()
                    : null
                }
                onSubmit={(_values) => {
                  setReplacementRequestManagerFilter({
                    ...replacementRequestManagerFilter,
                    offer__date_start__gte: _values.dateStart.toISODate(),
                    offer__date_start__lte: _values.dateEnd.toISODate(),
                    timePeriod: _values.timePeriod,
                  });
                }}
                // @ts-expect-error
                timePeriod={
                  replacementRequestManagerFilter.timePeriod || 'custom'
                }
              />
            </div>
          </div>
          <div
            className={classNames(
              classes.innerFlexContainer,
              classes.flexEnd,
              classes.flex1,
              classes.disableMarginTopOnSmallScreen,
            )}
          >
            {!hasRequestsLinkedToCancelledOffersLoading && (
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!replacementRequestManagerFilter.offer_available}
                      onChange={(_, checked) =>
                        setReplacementRequestManagerFilter({
                          ...replacementRequestManagerFilter,
                          offer_available: !checked,
                        })
                      }
                    />
                  }
                  label={t('selects.offerCancelled')}
                />
              </FormGroup>
            )}
          </div>
        </div>
        {hasRequestsLinkedToCancelledOffers &&
          !!replacementRequestManagerFilter.offer_available &&
          !hasRequestsLinkedToCancelledOffersLoading && (
            <Alert severity="warning">
              <AlertTitle>
                {t('requestsLinkedToCancelledOffers.title')}
              </AlertTitle>
              <div className={classes.alertContent}>
                <div className={classes.alertContentItem}>
                  <Trans
                    i18nKey="requestsLinkedToCancelledOffers.description"
                    t={t}
                    values={{
                      switchLabel: t('selects.offerCancelled'),
                    }}
                  />
                </div>
              </div>
            </Alert>
          )}
        {hasRequestsLinkedToCancelledOffers &&
          !replacementRequestManagerFilter.offer_available &&
          !hasRequestsLinkedToCancelledOffersLoading && (
            <Alert severity="info">
              <AlertTitle>
                {t('requestsLinkedToCancelledOffers.cancelledOffersModeTitle')}
              </AlertTitle>
              <div className={classes.alertContent}>
                <div className={classes.alertContentItem}>
                  <Trans
                    i18nKey="requestsLinkedToCancelledOffers.filterHelper"
                    t={t}
                    values={{
                      switchLabel: t('selects.offerCancelled'),
                    }}
                  />
                </div>
              </div>
            </Alert>
          )}
        <TableContainer>
          <ActivitiesToReplaceTable
            enableMultiLocalization={companyTheme.enable_multi_localization}
            establishmentGroups={props.establishmentGroupList}
            handleExtensionAction={handleExtensionAction}
            handleRefuseAction={handleRefuseAction}
            handleReplaceAction={handleReplaceAction}
            isLoading={isLoading}
            replacementDisplay={
              ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_ACTIONS
            }
            replacementRequestList={props.replacementRequestList}
            timezoneName={companyTheme.timezone_name}
          />
        </TableContainer>
        {replacementRequestCount > 0 && (
          <Pagination
            className={classes.pagination}
            count={replacementRequestsTotalPages}
            onChange={(ev, value) => fetchReplacementRequests(value)}
            // fetch requested page on page change
            page={replacementRequestPage}
          />
        )}
      </Paper>
      <Paper className={classes.paperContainer} elevation={0}>
        <ButtonBase
          className={classes.buttonTitle}
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? (
            <ExpandLessIcon className={classes.expandButton} />
          ) : (
            <ExpandMoreIcon className={classes.expandButton} />
          )}
          <Typography component="h2" variant="h5">
            {t('managerTableTitles.replacementHistory')}
          </Typography>
        </ButtonBase>
        <Collapse in={showHistory}>
          <div className={classes.filtersContainerHistory}>
            <div className={classes.filters}>
              <DateRangeSelector
                date_end={
                  replacementRequestOfferHistoryFilter.max_date
                    ? DateTime.fromISO(
                        replacementRequestOfferHistoryFilter.max_date,
                      ).toUnixInteger()
                    : DateTime.now().toUnixInteger()
                }
                date_start={
                  replacementRequestOfferHistoryFilter.min_date
                    ? DateTime.fromISO(
                        replacementRequestOfferHistoryFilter.min_date,
                      ).toUnixInteger()
                    : DateTime.now().minus({ week: 1 }).toUnixInteger()
                }
                onSubmit={(_values) => {
                  setReplacementRequestOfferHistoryFilter({
                    min_date: _values.dateStart.toISODate(),
                    max_date: _values.dateEnd.toISODate(),
                    timePeriod: _values.timePeriod,
                  });
                }}
                // @ts-expect-error
                timePeriod={
                  replacementRequestOfferHistoryFilter.timePeriod || 'custom'
                }
              />
            </div>
          </div>
          <TableContainer>
            <ActivitiesToReplaceTable
              enableMultiLocalization={companyTheme.enable_multi_localization}
              establishmentGroups={props.establishmentGroupList}
              isLoading={props.offerListLoading}
              offers={props.replacementRequestOfferHistoryList}
              replacementDisplay={
                ReplacementDisplays.REPLACEMENT_REQUEST_MANAGER_HISTORY
              }
              timezoneName={companyTheme.timezone_name}
            />
          </TableContainer>
          {replacementRequestOfferHistoryCount > 0 && (
            <Pagination
              className={classes.pagination}
              count={replacementOfferHistoryTotalPages}
              onChange={(ev, value) =>
                fetchReplacementRequestOfferHistory(value)
              }
              // fetch requested page on page change
              page={replacementRequestOfferHistoryPage}
            />
          )}
        </Collapse>
      </Paper>

      {extensionDialogOpen && (
        <ReplacementRequestClosingDateExtensionDialog
          loading={updatingReplacementRequestLoading}
          onClose={handleCloseExtensionAction}
          // @ts-expect-error
          onSubmit={props.postponeReplacementRequestClosingDate}
          // eslint-disable-next-line
          open={extensionDialogOpen}
          replacementRequest={replacementRequestSelected}
          timezoneName={props.companyTheme.timezone_name}
        />
      )}

      {answersDialogOpen && (
        <ReplacementRequestCoachAnswerDialog
          coaches={props.coachList}
          loading={updatingReplacementRequestLoading}
          onClose={handleCloseAnswersAction}
          onSubmit={approveReplacementRequestCoachAnswer}
          open={answersDialogOpen}
          replacementRequest={replacementRequestSelected}
        />
      )}

      {refuseDialogOpen && (
        <ReplacementRequestRefuseDialog
          loading={updatingReplacementRequestLoading}
          onClose={handleCloseRefuseAction}
          // @ts-expect-error
          onConfirm={refuseReplacementRequest}
          open={refuseDialogOpen}
          // @ts-expect-error
          replacementRequest={replacementRequestSelected}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  paperContainer: {
    margin: theme.spacing(3),
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(1),
      padding: `${theme.spacing(2)}px 0`,
    },
  },
  buttonTitle: {
    color: theme.palette.grey[500],
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(2),
    },
  },
  expandButton: {
    marginRight: theme.spacing(1),
  },
  filtersContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      display: 'grid',
      columnGap: theme.spacing(2),
      gridTemplateColumns: '1fr 1fr',
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  innerFlexContainer: {
    display: 'flex',
    alignItems: 'center',
    flex: 10,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  flexColumnOnSmallscreen: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  flex4: {
    flexGrow: 4,
  },
  flex1: {
    flexGrow: 1,
  },
  disableMarginBottomOnSmallScreen: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: 0,
    },
  },
  disableMarginTopOnSmallScreen: {
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
    },
  },
  filterTitle: {
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / 3',
    },
  },
  filters: {
    display: 'table',
    width: '30%',
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      justifySelf: 'stretch',
      width: 'unset',
      marginBottom: theme.spacing(1),
    },
  },
  filtersContainerHistory: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  filtersPendingRequests: {
    [theme.breakpoints.down('sm')]: {
      flex: 'unset',
      width: '70%',
    },
  },
  alertContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  alertContentItem: {
    '&::before': {
      content: '"\u2022"',
      paddingRight: theme.spacing(1),
    },
  },
}));

const selectStyles: Partial<
  Styles<
    {
      value: number;
      label: any;
    },
    boolean,
    GroupTypeBase<{
      value: number;
      label: any;
    }>
  >
> = {
  // @ts-expect-error
  control: (styles) => ({ ...styles, backgroundColor: 'white' }),
  // @ts-expect-error
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  // @ts-expect-error
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    const color = chroma(colors.secondary);
    /* eslint-disable */
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? colors.secondary
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : colors.secondary,
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor:
          !isDisabled &&
          (isSelected ? colors.secondary : color.alpha(0.3).css()),
      },
    };
    /* eslint-enable */
  },
  // @ts-expect-error
  multiValue: (styles) => {
    const color = chroma(colors.secondary);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  // @ts-expect-error
  multiValueLabel: (styles) => ({
    ...styles,
    color: colors.secondary,
  }),
  // @ts-expect-error
  multiValueRemove: (styles) => ({
    ...styles,
    color: colors.secondary,
    ':hover': {
      backgroundColor: colors.secondary,
      color: 'white',
    },
  }),
};

const connector = connect(
  (state: RootState) => ({
    companyTheme: state.theme.theme,
    companyId: state.theme.theme.company,
    replacementRequestOfferHistoryList: withEstablishment(
      withCustomLevel(withMetaActivity(withCoach(getOfferCalendarStateData))),
    )(state),
    replacementRequestList: withCoachAnswers(
      withCompleteOffer(getAllPendingReplacementRequests),
    )(state),
    loading: state.replacementRequest.loading,
    SCTList: getEditableSCTs(state),
    coachList: getActiveCoaches(state),
    metaActivityList: getEnabledMetaActivities(state),
    establishmentList: getAvailableEstablishmentList(state),
    establishmentGroupList: groupWithEstablishment(
      getAssociatedEstablishmentGroup,
    )(state),
    replacementRequestManagerFilter:
      state.userPreference.replacementRequestManagerFilter,
    replacementRequestOfferHistoryFilter:
      state.userPreference.replacementRequestOfferHistoryFilter,
    offerBulkLoading: state.offer.bulk.loading,
    offerListLoading: state.offer.loading,
    establishmentGroupLoading: state.establishment.establishmentGroup.loading,
    coachLoading: state.coach.loading,
    metaActivityLoading: state.metaActivity.loading,
    establishmentLoading: state.establishment.loading,
    replacementRequestLoading: state.replacementRequest.loading,
    updatingReplacementRequestLoading:
      state.replacementRequest.updateRequest.loading,
    replacementRequestCount: state.replacementRequest.count,
    replacementRequestPage: state.replacementRequest.page,
    replacementRequestOfferHistoryCount: state.offer.paginatedCalendar.count,
    replacementRequestOfferHistoryPage: state.offer.paginatedCalendar.page,
    hasRequestsLinkedToCancelledOffers:
      state.replacementRequest.hasRequestsLinkedToCancelledOffers.exists,
    hasRequestsLinkedToCancelledOffersLoading:
      state.replacementRequest.hasRequestsLinkedToCancelledOffers.loading,
  }),
  {
    fetchAllOffersPaginated: fetchAllOffersPaginatedAction,
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
    fetchEstablishments: fetchEstablishmentsAction,
    fetchActivitiesCompany: fetchActivitiesCompanyAction,
    fetchLevelList: fetchLevelListAction,
    fetchAllReplacementRequests: fetchAllReplacementRequestsAction,
    fetchAssociatedCoachesList: fetchAssociatedCoachesListAction,
    setReplacementRequestManagerFilter:
      setReplacementRequestManagerFilterAction,
    setReplacementRequestOfferHistoryFilter:
      setReplacementRequestOfferHistoryFilterAction,
    fetchOfferBulk: fetchOfferBulkAction,
    postponeReplacementRequestClosingDate:
      postponeReplacementRequestClosingDateAction,
    refuseReplacementRequest: refuseReplacementRequestAction,
    fetchAllReplacementRequestCoachAnswers:
      fetchAllReplacementRequestCoachAnswersAction,
    approveReplacementRequestCoachAnswer:
      approveReplacementRequestCoachAnswerAction,
    fetchSpecificAlertKind: fetchSpecificAlertKindAction,
    fetchHasRequestsLinkedToCancelledOffers:
      fetchHasRequestsLinkedToCancelledOffersAction,
  },
);

const handlers = {
  fetchReplacementRequests:
    ({
      fetchAllReplacementRequests,
      replacementRequestManagerFilter,
      fetchOfferBulk,
      fetchAllReplacementRequestCoachAnswers,
      companyId,
    }: ConnectProps) =>
    (page: number) => {
      const { offer_available } = replacementRequestManagerFilter;
      fetchAllReplacementRequests(
        {
          ...replacementRequestManagerFilter,
          status__in: [
            ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_NO_REPLACEMENT_PROPOSITIONS,
            ReplacementRequestStatus.REPLACEMENT_REQUEST_STATUS_WITH_REPLACEMENT_PROPOSITIONS,
          ],
          // For unavailable offer mode, the fetch must include past and future offers.
          ...(offer_available ? { offer_is_in_the_past: false } : {}),
          company: companyId,
          page,
          page_size: PAGE_SIZE,
        },
        {
          onSuccess: (replacementRequestList) => {
            const offerIds = replacementRequestList.map((rr) => rr.offer);
            const replacementRequestAnswersIds = uniq(
              replacementRequestList.reduce(
                (acc, request) => acc.concat(request.coach_answer),
                [],
              ),
            );
            if (offerIds.length > 0) fetchOfferBulk(offerIds);
            if (replacementRequestAnswersIds.length > 0)
              fetchAllReplacementRequestCoachAnswers({
                id__in: replacementRequestAnswersIds,
              });
          },
        },
      );
    },
  fetchAllDataForFilters: (connectProps: ConnectProps) => () => {
    Promise.all([
      [
        connectProps.fetchAssociatedCoachesList({
          company: connectProps.companyId,
        }),
        connectProps.fetchLevelList({
          company: connectProps.companyId,
        }),
        connectProps.fetchActivitiesCompany(connectProps.companyId),
        connectProps.fetchAllEstablishmentGroup(connectProps.companyId),
        connectProps.fetchEstablishments({
          company: connectProps.companyId,
          disabled: false,
        }),
      ],
    ]).then(() => {
      // Sanitize filter stored in user preference
      const { replacementRequestManagerFilter, companyTheme } = connectProps;
      const sanitizedCoachIds = [...connectProps.coachList]
        .filter((coach) =>
          replacementRequestManagerFilter.coach__in?.includes(coach.id),
        )
        .map((c) => c.id);
      const sanitizedEstablishmentIds = [...connectProps.establishmentList]
        .filter((establishment) =>
          replacementRequestManagerFilter.establishment__in?.includes(
            establishment.id,
          ),
        )
        .map((e) => e.id);
      const sanitizedEstablishmentGroupIds =
        companyTheme.enable_multi_localization
          ? [...connectProps.establishmentGroupList]
              .filter((establishmentGroup: EstablishmentGroup) =>
                replacementRequestManagerFilter.establishment_group__in?.includes(
                  establishmentGroup.id,
                ),
              )
              .map((eg) => eg.id)
          : [];
      const sanitizedMetaActivityIds = [...connectProps.metaActivityList]
        .filter((ma) =>
          replacementRequestManagerFilter.meta_activity__in?.includes(ma.id),
        )
        .map((ma) => ma.id);
      const sanitizedCategoryIds = [...connectProps.SCTList]
        .filter((category) =>
          replacementRequestManagerFilter.category__in?.includes(category.id),
        )
        .map((c) => c.id);

      // Check if filter actually needs to be updated to prevent useless api calls in useEffect
      const shouldUpdateFilter =
        (replacementRequestManagerFilter.coach__in || []).length !==
          sanitizedCoachIds.length ||
        (replacementRequestManagerFilter.establishment__in || []).length !==
          sanitizedEstablishmentIds.length ||
        (replacementRequestManagerFilter.establishment_group__in || [])
          .length !== sanitizedEstablishmentGroupIds.length ||
        (replacementRequestManagerFilter.meta_activity__in || []).length !==
          sanitizedMetaActivityIds.length ||
        (replacementRequestManagerFilter.category__in || []).length !==
          sanitizedCategoryIds.length;

      if (shouldUpdateFilter) {
        connectProps.setReplacementRequestManagerFilter({
          ...replacementRequestManagerFilter,
          coach__in: sanitizedCoachIds,
          establishment__in: sanitizedEstablishmentIds,
          establishment_group__in: sanitizedEstablishmentGroupIds,
          meta_activity__in: sanitizedMetaActivityIds,
          category__in: sanitizedCategoryIds,
        });
      }
    });
  },
  fetchReplacementRequestOfferHistory:
    ({
      fetchAllOffersPaginated,
      replacementRequestOfferHistoryFilter,
      replacementRequestManagerFilter,
      companyId,
    }: ConnectProps) =>
    (page: number) => {
      // Map replacement request filters to offer filters
      const {
        coach__in,
        meta_activity__in: meta_activity,
        establishment__in,
        establishment_group__in,
        category__in,
      } = replacementRequestManagerFilter;

      fetchAllOffersPaginated({
        ...replacementRequestOfferHistoryFilter,
        ...(coach__in ? { coach__in } : {}),
        ...(meta_activity ? { meta_activity } : {}),
        ...(establishment__in ? { establishment__in } : {}),
        ...(establishment_group__in ? { establishment_group__in } : {}),
        ...(category__in ? { category__in } : {}),
        coach_override__isnull: false,
        company: companyId,
        page_size: PAGE_SIZE,
        page,
      });
    },
  updateReplacementRequestLastSeen:
    ({ fetchSpecificAlertKind }: ConnectProps) =>
    () => {
      updateReplacementRequestLastSeenAPI({}).catch((error) =>
        console.error(error),
      );
      fetchSpecificAlertKind(
        REPLACEMEMENT_REQUEST_LATE_ALERT_KIND.alert_kind,
        1,
      );
    },
};

export default compose(
  connector,
  withHandlers(handlers),
)(ReplacementManagement);
