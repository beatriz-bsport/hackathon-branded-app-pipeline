// @ts-nocheck
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import moment from 'moment-timezone';
import chroma from 'chroma-js';
import { useTranslation, Trans } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withHandlers } from 'recompose';

import { Alert } from '@material-ui/lab';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Pagination from '@material-ui/lab/Pagination';
import { WithHandlerType } from '../../../utils/types';
import DateRangeSelector from '#components/date/DateRangeSelector.component';

import ActivitiesToReplaceTable from '#libs/replacement-request/components/replacement-request-table/ActivitiesToReplaceTable.component';
import ReplacementRequestReasonDialog from '#libs/replacement-request/components/dialogs/ReplacementRequestReasonDialog.component';

import {
  ReplacementDisplays,
  PAGE_SIZE,
} from '#libs/replacement-request/constants';
import { RootState } from '../../../reducers';
import {
  withMetaActivity,
  withCoach,
  withEstablishment as offerWithEstablishment,
  getOfferCalendarStateData,
  getOfferHasPendingReplacementRequest,
  getOfferHasRefusedReplacementRequest,
} from '#libs/offer/selectors';
import { withCustomLevel } from '#libs/level/selectors';
import {
  getMyAssociatedCoachProfile,
  getCoachLateReplacementRequestStatus,
} from '#libs/associated-coach/selectors';
import {
  withEstablishment as groupWithEstablishment,
  getAssociatedEstablishmentGroup,
} from '#libs/establishment/selectors';
import {
  fetchAllOffersPaginated as fetchAllOffersPaginatedAction,
  listOffersWithPendingReplacementRequestIds as listOffersWithPendingReplacementRequestIdsAction,
  listOffersWithRefusedReplacementRequestIds as listOffersWithRefusedReplacementRequestIdsAction,
} from '#libs/offer/actions';
import {
  fetchEstablishments as fetchEstablishmentsAction,
  fetchAllEstablishmentGroup as fetchAllEstablishmentGroupAction,
} from '#libs/establishment/actions';
import { fetchActivitiesCompany as fetchActivitiesCompanyAction } from '#libs/meta-activity/actions';
import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { createReplacementRequestBulk as createReplacementRequestBulkAction } from '#libs/replacement-request/actions';
import { retrieveAssociatedCoachLateReplacementRequestStatus as retrieveAssociatedCoachLateReplacementRequestStatusAction } from '#libs/associated-coach/actions';
import {
  CoachLateReplacementRequestStatus,
  Coach,
} from '#libs/associated-coach/types';
import { OptionCallback } from '../../../state/types';
import { ReplacementRequestAPIData } from '#libs/replacement-request/types';
import { isReplacementRequestToBeCreatedLate } from '#libs/replacement-request/utils';
import { OfferMinimal } from '#libs/offer/types';
import { Level } from '#libs/level/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';

type ConnectProps = ConnectedProps<typeof connector>;
type Props = ConnectProps & WithHandlerType<typeof handlers>;

export const CoachReplacementCalendar: React.FC<Props> = (props: Props) => {
  const {
    fetchLevelList,
    fetchActivitiesCompany,
    fetchAllEstablishmentGroup,
    fetchEstablishments,
    fetchMyAvailableOffers,
    companyId,
    offerCount,
    offerPage,
    createReplacementRequests,
    offerListLoading,
    establishmentGroupLoading,
    metaActivityLoading,
    establishmentLoading,
    fetchLateReplacementRequestStatus,
    lateReplacementRequestStatus,
    lateReplacementRequestStatusLoading,
    loadingOfferHasPendingReplacementRequest,
    companyTheme,
  } = props;
  const classes = useStyles();

  const { t } = useTranslation('replacement');

  const [interactiveNbLateRequestsLeft, setInteractiveNbLateRequestsLeft] =
    useState(null);

  const [periodFilter, setPeriodFilter] = useState({
    min_date: moment().format('YYYY-MM-DD'),
    max_date: moment().add(1, 'month').format('YYYY-MM-DD'),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [nbLateRequestsToBeCreated, setNbLateRequestsToBeCreated] = useState(0);
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);

  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogOpen = () => setDialogOpen(true);

  const fetchLateReplacementRequestStatusHandler = useCallback(
    () =>
      fetchLateReplacementRequestStatus({
        onSuccess: (replacementStatus) => {
          if (replacementStatus.is_late_replacement_request_limited) {
            setInteractiveNbLateRequestsLeft(
              replacementStatus.max_late_requests_per_limitation_period -
                replacementStatus.nb_late_requests_in_current_limitation_period,
            );
          }
        },
      }),
    [fetchLateReplacementRequestStatus],
  );

  const handleSubmit = useCallback(
    (reason: string, options?: OptionCallback<ReplacementRequestAPIData[]>) =>
      createReplacementRequests(selectedOffers, reason, {
        onSuccess: (replacementRequestList) => {
          fetchLateReplacementRequestStatusHandler();
          options?.onSuccess?.(replacementRequestList);
        },
        onError: options?.onError,
      }),
    [
      createReplacementRequests,
      selectedOffers,
      fetchLateReplacementRequestStatusHandler,
    ],
  );

  const handleCloseAfterSuccess = useCallback(() => {
    fetchMyAvailableOffers(offerPage, periodFilter);
    setDialogOpen(false);
    setSelectedOffers([]);
    setNbLateRequestsToBeCreated(0);
  }, [fetchMyAvailableOffers, offerPage, periodFilter, setDialogOpen]);

  const totalPages = useMemo(
    () => Math.ceil(offerCount / PAGE_SIZE),
    [offerCount],
  );

  const handlePeriodChange = useCallback(
    (_values) =>
      setPeriodFilter({
        min_date: _values.dateStart.format('YYYY-MM-DD'),
        max_date: _values.dateEnd.format('YYYY-MM-DD'),
      }),
    [setPeriodFilter],
  );

  const isLoading = useMemo(
    () =>
      offerListLoading ||
      establishmentGroupLoading ||
      metaActivityLoading ||
      establishmentLoading ||
      loadingOfferHasPendingReplacementRequest ||
      !companyTheme?.timezone_name,
    [
      offerListLoading,
      establishmentGroupLoading,
      metaActivityLoading,
      establishmentLoading,
      loadingOfferHasPendingReplacementRequest,
      companyTheme,
    ],
  );

  const handleCheckboxAction = (
    offer: OfferMinimal<Coach, Establishment, MetaActivity, Level>,
  ) => {
    const isLateRequest = isReplacementRequestToBeCreatedLate(
      offer,
      lateReplacementRequestStatus?.days_before_offer_replacement_request_is_late,
    );
    if (selectedOffers.includes(offer.id)) {
      setSelectedOffers(selectedOffers.filter((id) => id !== offer.id));

      if (isLateRequest) {
        lateReplacementRequestStatus?.is_late_replacement_request_limited &&
          setInteractiveNbLateRequestsLeft(interactiveNbLateRequestsLeft + 1);
        setNbLateRequestsToBeCreated(nbLateRequestsToBeCreated - 1);
      }
    } else {
      const _selectedOffers = [...selectedOffers];
      _selectedOffers.push(offer.id);
      setSelectedOffers(_selectedOffers);
      if (isLateRequest) {
        lateReplacementRequestStatus?.is_late_replacement_request_limited &&
          setInteractiveNbLateRequestsLeft(interactiveNbLateRequestsLeft - 1);
        setNbLateRequestsToBeCreated(nbLateRequestsToBeCreated + 1);
      }
    }
  };

  useEffect(() => {
    fetchLevelList({ company: companyId });
    fetchActivitiesCompany(companyId);
    fetchAllEstablishmentGroup(companyId);
    fetchEstablishments({
      company: companyId,
      disabled: false,
    });
    fetchLateReplacementRequestStatusHandler();
  }, [
    fetchLevelList,
    fetchActivitiesCompany,
    fetchAllEstablishmentGroup,
    fetchEstablishments,
    companyId,
    fetchLateReplacementRequestStatusHandler,
  ]);

  useEffect(
    () => fetchMyAvailableOffers(1, periodFilter),
    [fetchMyAvailableOffers, periodFilter],
  );

  const onChangePage = useCallback(
    (page: number) => fetchMyAvailableOffers(page, periodFilter),
    [fetchMyAvailableOffers, periodFilter],
  );

  return (
    <>
      <div className={classes.descriptionContainer}>
        <InfoOutlinedIcon className={classes.infoIcon} />
        <Typography className={classes.description} variant="body2">
          {t('calendar.description')}
        </Typography>
      </div>
      <div className={classes.dateRangeContainer}>
        <div className={classes.dateRangeSelector}>
          <DateRangeSelector
            futureOnly
            date_end={moment(periodFilter.max_date).unix()}
            date_start={moment(periodFilter.min_date).unix()}
            onSubmit={handlePeriodChange}
            timePeriod="next_month"
          />
        </div>

        {!lateReplacementRequestStatusLoading &&
          lateReplacementRequestStatus && (
            <Alert classes={{ root: classes.alertOverride }} severity="info">
              {lateReplacementRequestStatus.is_late_replacement_request_limited ? (
                <Trans
                  i18nKey="calendar.helperTextLimited"
                  t={t}
                  values={{
                    requestsLeft: interactiveNbLateRequestsLeft,
                    requestsMax:
                      lateReplacementRequestStatus.max_late_requests_per_limitation_period,
                    dateEnd: moment(
                      lateReplacementRequestStatus.current_limitation_period_end,
                    ).format('L'),
                    count:
                      lateReplacementRequestStatus.days_before_offer_replacement_request_is_late,
                  }}
                />
              ) : (
                t('calendar.helperTextNotLimited', {
                  count:
                    lateReplacementRequestStatus.days_before_offer_replacement_request_is_late,
                })
              )}
            </Alert>
          )}
      </div>
      <Paper className={classes.paperContainer} elevation={0}>
        <TableContainer>
          <ActivitiesToReplaceTable
            coach={props.coach}
            daysBeforeOfferReplacementRequestIsLate={
              lateReplacementRequestStatus?.days_before_offer_replacement_request_is_late
            }
            enableMultiLocalization={
              props.companyTheme.enable_multi_localization
            }
            establishmentGroups={props.establishmentGroupList}
            getHasPendingReplacementRequest={
              props.getHasPendingReplacementRequest
            }
            getHasRefusedReplacementRequest={
              props.getHasRefusedReplacementRequest
            }
            handleCheckboxAction={handleCheckboxAction}
            isLoading={isLoading}
            nbLateRequestsLeft={interactiveNbLateRequestsLeft}
            offers={props.offerList}
            replacementDisplay={
              ReplacementDisplays.REPLACEMENT_DISPLAY_CALENDAR
            }
            selectedOffers={selectedOffers}
            setNbLateRequestsLeft={setInteractiveNbLateRequestsLeft}
            timezoneName={companyTheme.timezone_name}
          />
        </TableContainer>
        {offerCount > 0 && (
          <Pagination
            className={classes.pagination}
            count={totalPages}
            onChange={(ev, value) => onChangePage(value)}
            page={offerPage}
          />
        )}
      </Paper>
      <div className={classes.buttonContainer}>
        <Button
          color="primary"
          disabled={selectedOffers.length === 0}
          onClick={handleDialogOpen}
          variant="contained"
        >
          {t('askForReplacement.title')}
        </Button>
      </div>
      {dialogOpen && (
        <ReplacementRequestReasonDialog
          atLeastOneLateRequest={nbLateRequestsToBeCreated > 0}
          lateReplacementRequestStatus={lateReplacementRequestStatus}
          nbLateRequestsLeft={interactiveNbLateRequestsLeft}
          nbSelectedOffers={selectedOffers.length}
          onClose={handleDialogClose}
          onCloseAfterSuccess={handleCloseAfterSuccess}
          onSubmit={handleSubmit}
          open={dialogOpen}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  dateRangeSelector: {
    marginRight: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
      marginBottom: theme.spacing(2),
    },
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  descriptionContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      padding: `0 ${theme.spacing(4)}px`,
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(3),
    },
  },
  alertOverride: {
    alignItems: 'center',
  },
  description: {
    color: chroma(theme.palette.info.dark).darken(1.5).hex(),
  },
  infoIcon: {
    color: theme.palette.info.main,
    marginRight: theme.spacing(1),
  },
  paperContainer: {
    margin: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1),
      padding: `${theme.spacing(2)}px 0`,
    },
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'fixed',
    bottom: 0,
    right: 0,
    zIndex: 10,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(2),
    width: '100%',
    borderTop: `1px solid ${theme.palette.grey[100]}`,
    backgroundColor: 'white',
  },
  dateRangeContainer: {
    marginLeft: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
}));

const connector = connect(
  (state: RootState) => ({
    companyTheme: state.theme.theme,
    companyId: state.theme.theme.company,
    offerList: withMetaActivity(
      offerWithEstablishment(
        withCustomLevel(withCoach(getOfferCalendarStateData)),
      ),
    )(state),
    getHasPendingReplacementRequest:
      getOfferHasPendingReplacementRequest(state),
    getHasRefusedReplacementRequest:
      getOfferHasRefusedReplacementRequest(state),
    count: state.offer.paginatedCalendar.count,
    page: state.offer.paginatedCalendar.page,

    coach: getMyAssociatedCoachProfile(state),
    establishmentGroupList: groupWithEstablishment(
      getAssociatedEstablishmentGroup,
    )(state),
    offerCount: state.offer.paginatedCalendar.count,
    offerPage: state.offer.paginatedCalendar.page,

    offerListLoading: state.offer.loading,
    establishmentGroupLoading: state.establishment.establishmentGroup.loading,
    metaActivityLoading: state.metaActivity.loading,
    establishmentLoading: state.establishment.loading,
    lateReplacementRequestStatus: getCoachLateReplacementRequestStatus(state),
    lateReplacementRequestStatusLoading:
      state.coach.lateReplacementRequestStatus.loading,
    loadingOfferHasPendingReplacementRequest:
      state.offer.hasPendingReplacementRequest.loading,
  }),
  {
    fetchAllOffersPaginated: fetchAllOffersPaginatedAction,
    fetchAllEstablishmentGroup: fetchAllEstablishmentGroupAction,
    fetchEstablishments: fetchEstablishmentsAction,
    fetchActivitiesCompany: fetchActivitiesCompanyAction,
    fetchLevelList: fetchLevelListAction,
    createReplacementRequestBulk: createReplacementRequestBulkAction,
    retrieveAssociatedCoachLateReplacementRequestStatus:
      retrieveAssociatedCoachLateReplacementRequestStatusAction,
    listOffersWithPendingReplacementRequestIds:
      listOffersWithPendingReplacementRequestIdsAction,
    listOffersWithRefusedReplacementRequestIds:
      listOffersWithRefusedReplacementRequestIdsAction,
  },
);

const handlers = {
  fetchMyAvailableOffers:
    ({
      fetchAllOffersPaginated,
      companyId,
      coach,
      listOffersWithPendingReplacementRequestIds,
      listOffersWithRefusedReplacementRequestIds,
    }: ConnectProps) =>
    (page: number, params: any) => {
      fetchAllOffersPaginated(
        {
          company: companyId,
          coach: coach?.id,
          ...params,
          available: true,
          page_size: 10,
          page,
        },
        {
          onSuccess: (offerList) => {
            const offerIds = offerList.map((o) => o.id);
            listOffersWithPendingReplacementRequestIds(offerIds, false);
            listOffersWithRefusedReplacementRequestIds(offerIds);
          },
        },
      );
    },
  fetchLateReplacementRequestStatus:
    ({
      coach,
      retrieveAssociatedCoachLateReplacementRequestStatus,
      companyId,
    }: ConnectProps) =>
    (options?: OptionCallback<CoachLateReplacementRequestStatus>) => {
      retrieveAssociatedCoachLateReplacementRequestStatus(
        coach.id,
        { company: companyId },
        options,
      );
    },
  createReplacementRequests:
    ({ createReplacementRequestBulk, coach, companyId }: ConnectProps) =>
    (
      offerIds: number[],
      reason: string,
      options?: OptionCallback<ReplacementRequestAPIData[]>,
    ) => {
      const payload = offerIds.map((offerId) => ({
        offer: offerId,
        company: companyId,
        coach: coach.id,
        reason,
      }));
      createReplacementRequestBulk(payload, options);
    },
};

export default compose(
  connector,
  withHandlers(handlers),
)(CoachReplacementCalendar);
