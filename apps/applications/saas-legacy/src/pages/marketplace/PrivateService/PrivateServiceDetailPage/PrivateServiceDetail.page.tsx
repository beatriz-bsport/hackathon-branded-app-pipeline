import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DateTime } from 'luxon';
import { connect, ConnectedProps } from 'react-redux';
import { useMediaQuery, useTheme } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  RESOURCE_ATTRIBUTION_AUTO,
  RESOURCE_ATTRIBUTION_CONSUMER,
} from '@bsport/common/master-data/resource-attribution-methods.js';
import { goBack, push as pushAction } from 'connected-react-router';
import { compose } from 'recompose';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

import {
  checkPrivateServiceTagEligibility as checkPrivateServiceTagEligibilityAction,
  fetchPrivateService as fetchPrivateServiceAction,
  fetchPrivateSlotBulk as fetchPrivateSlotBulkAction,
  searchAvailableSlots as searchAvailableSlotsAction,
  searchFirstAvailableSlots as searchFirstAvailableSlotsAction,
} from '#src/libs/private-service/actions';
import { findAvailableEstablishment as findAvailableEstablishmentAPI } from '../../../../libs/private-service/api';
import {
  getPrivateService,
  getPrivateServiceTagEligible,
  getPrivateServiceTagEligibleLoading,
  withAssociatedCoach,
  withAssociatedEstablishment,
  withAvailablePrivateSlots,
} from '#src/libs/private-service/selectors/private-service';
import { fetchAssociatedEstablishmentBulk as fetchAssociatedEstablishmentBulkAction } from '#src/libs/establishment/actions';
import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '#src/libs/associated-coach/actions';

import {
  getNextDateAvailableSlot,
  getSearchedSlots,
} from '#src/libs/private-service/selectors/availability-slot';
import PrivateSlotSelector from './PrivateSlotSelector.component';
import CoachSelector from './CoachSelector.component';
import EstablishmentSelector from './EstablishmentSelector.component';
import SlotCalendar from './SlotCalendar/SlotCalendar.component';
import SessionSelector from './SessionSelector/SessionSelector.component';
import type {
  PrivateService,
  PrivateSlot,
} from '#src/libs/private-service/types';
import type { ArrayElement } from '#src/utils/types';
import { groupSessionsByDayMoment } from '#src/libs/private-service/utils';
import type { RootState } from '#src/reducers';
import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import PrivateServiceDetailSummary from './PrivateServiceDetailSummary.component';
import routerParamsToProps from '../../../../hocs/router-params-to-props.hoc';
import PrivateServiceIneligibleBanner from '#src/libs/private-service/components/service/PrivateServiceIneligibleBanner.component';
import type { MarketplacePrivateServiceSessionData } from '#src/libs/marketplace/types';

type SessionMoment = ArrayElement<ReturnType<typeof groupSessionsByDayMoment>>;

const useNumberOfDayToShow = () => {
  const materialTheme = useTheme();
  const isXS = useMediaQuery(materialTheme.breakpoints.down('xs'));
  const isSM = useMediaQuery(materialTheme.breakpoints.down('sm'));
  const isMD = useMediaQuery(materialTheme.breakpoints.up('md'));

  let nbOfDayToShow = 2;

  if (isSM && !isXS) {
    nbOfDayToShow = 3;
  }
  if (isMD) {
    nbOfDayToShow = 7;
  }

  const [numberOfDayToShow, setNumberOfDayToShow] = useState(nbOfDayToShow);

  useEffect(() => {
    let newNbOfDayToDisplay = 2;
    if (isSM && !isXS) {
      newNbOfDayToDisplay = 3;
    }
    if (isMD) {
      newNbOfDayToDisplay = 7;
    }

    setNumberOfDayToShow(newNbOfDayToDisplay);
  }, [isMD, isSM, isXS]);

  return numberOfDayToShow;
};

type OwnProps = {
  companyId: string;
  serviceId: string;
  /** onSessionSelect is override by the widget */
  onSessionSelect?: (
    data: MarketplacePrivateServiceSessionData,
    slot: PrivateSlot,
  ) => void;
  hideDetailSummary?: boolean;
  /** store is override by the widget */
  store?: any;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

export const PrivateServiceDetailPage: React.FC<Props> = (props) => {
  const {
    onSessionSelect,
    hideDetailSummary,
    fetchPrivateService,
    fetchPrivateSlotBulk,
    fetchAssociatedEstablishmentBulk,
    fetchAssociatedCoachBulk,
    searchAvailableSlots,
    searchFirstAvailableSlots,
    checkPrivateServiceTagEligibility,
    push,
    privateService,
    availabilitySlotByDate,
    nextDateAvailableSlot,
    nextAvailableSlotLoading,
    availabilitySlot,
    availableSlotsLoading,
    theme,
    companyId,
    serviceId,
    eligibleByTags,
    eligibleByTagsLoading,
    isLoading,
  } = props;
  const hideSessionsIneligibleByTags =
    theme.hide_sessions_with_tags_when_not_eligible;
  const showSessions = !hideSessionsIneligibleByTags || eligibleByTags;
  const sessionSelectorRefs = useRef();

  /** STATE */
  const [selectedDate, setSelectedDate] = useState<string>(
    DateTime.now().toISODate(),
  );
  const [selectedSlot, setSelectedSlot] = useState<PrivateSlot | null>(null);
  const [selectedCoaches, setSelectedCoaches] = useState<Coach[]>([]);
  const [selectedEstablishments, setSelectedEstablishments] = useState<
    Establishment[]
  >([]);
  const [selectedSessionMoment, setSelectedSessionMoment] =
    useState<SessionMoment | null>(null);
  const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);

  const numberOfDayToShow = useNumberOfDayToShow();

  /** EFFECTS */
  useEffect(() => {
    fetchPrivateService(parseInt(serviceId), {
      onSuccess: (ps: PrivateService) => {
        Promise.all([
          ps.slots?.length && fetchPrivateSlotBulk(ps.slots),
          ps.coaches?.length && fetchAssociatedCoachBulk(ps.coaches),
          ps.establishments?.length &&
            fetchAssociatedEstablishmentBulk(ps.establishments),
        ]).then(() => setIsFetchSuccessful(true));
      },
    });
  }, [
    serviceId,
    fetchPrivateService,
    fetchPrivateSlotBulk,
    fetchAssociatedCoachBulk,
    fetchAssociatedEstablishmentBulk,
  ]);

  useEffect(() => {
    if (privateService && selectedSlot) {
      const dates = [];

      for (let i = 0; i < numberOfDayToShow; i += 1) {
        dates.push(
          DateTime.fromISO(selectedDate).plus({ days: i }).toISODate(),
        );
      }

      let coaches: number[] = [];
      let establishments: number[] = [];

      if (selectedCoaches) {
        coaches = selectedCoaches.map((c) => c.id);
      }

      if (selectedEstablishments) {
        establishments = selectedEstablishments.map((e) => e.id);
      }

      searchAvailableSlots(
        privateService.id,
        selectedSlot.id,
        coaches,
        dates,
        establishments,
      );
    }
  }, [
    searchAvailableSlots,
    selectedSlot,
    selectedDate,
    selectedEstablishments,
    selectedCoaches,
    privateService,
    numberOfDayToShow,
  ]);

  useEffect(() => {
    setSelectedSessionMoment(null);
  }, [numberOfDayToShow]);

  useEffect(() => {
    if (privateService && selectedSlot) {
      searchFirstAvailableSlots(
        privateService.id,
        selectedSlot.id,
        selectedCoaches.map((c) => c.id),
        selectedEstablishments.map((e) => e.id),
      );
    }
  }, [
    privateService,
    selectedSlot,
    selectedEstablishments,
    selectedCoaches,
    searchFirstAvailableSlots,
  ]);

  const isSelectionDisabled = useMemo(
    () => isLoading || !isFetchSuccessful,
    [isLoading, isFetchSuccessful],
  );
  const onPrivateSlotSelect = useCallback((slot: PrivateSlot) => {
    setSelectedSlot(slot);
    setSelectedSessionMoment(null);
  }, []);

  // autoslect if only one slots available
  useEffect(() => {
    if ((privateService?.slots ?? []).length === 1) {
      onPrivateSlotSelect(privateService.slots[0]);
    }
  }, [privateService, onPrivateSlotSelect]);

  useEffect(() => {
    // @ts-expect-error
    checkPrivateServiceTagEligibility(serviceId, null);
  }, [checkPrivateServiceTagEligibility, serviceId]);

  const onCoachSelect = useCallback(
    (coach: Coach) => {
      const isCoachCurrentlySelected = selectedCoaches.some(
        (selectedCoach) => selectedCoach.id === coach.id,
      );

      const toggledCoaches = isCoachCurrentlySelected
        ? selectedCoaches.filter(
            (selectedCoach) => selectedCoach.id !== coach.id,
          )
        : [...selectedCoaches, coach];
      setSelectedCoaches(toggledCoaches);
      setSelectedSessionMoment(null);
    },
    [selectedCoaches],
  );

  const onEstablishmentSelect = useCallback(
    (establishment: Establishment) => {
      const isEstablishmentCurrentlySelected = selectedEstablishments.some(
        (selectedEstablishment) =>
          selectedEstablishment.id === establishment.id,
      );
      const toggledEstablishments = isEstablishmentCurrentlySelected
        ? selectedEstablishments.filter(
            (selectedEstablishment) =>
              selectedEstablishment.id !== establishment.id,
          )
        : [...selectedEstablishments, establishment];
      setSelectedEstablishments(toggledEstablishments);
      setSelectedSessionMoment(null);
    },
    [selectedEstablishments],
  );

  const onSessionMomentSelect = useCallback((sessionMoment: SessionMoment) => {
    setSelectedSessionMoment(sessionMoment);

    setTimeout(() => {
      if (sessionSelectorRefs && sessionSelectorRefs.current) {
        // @ts-expect-error
        sessionSelectorRefs.current.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 0);
  }, []);

  const onDateChange = useCallback((date: string) => {
    setSelectedDate(date);
    setSelectedSessionMoment(null);
  }, []);

  const handleSessionSelect = useCallback(
    async (date: string, establishment: number, associated_coach: number) => {
      const data = { date, establishment, associated_coach };

      if (
        RESOURCE_ATTRIBUTION_AUTO === privateService.establishment_attribution
      ) {
        const establishment_found = await findAvailableEstablishmentAPI(
          selectedSlot.id,
          {
            // @ts-expect-error
            coach: associated_coach,
            date_start: date,
          },
        );

        if (establishment_found?.data?.establishment) {
          data.establishment = establishment_found.data.establishment;
        }
      }

      if (onSessionSelect) {
        // override by the widget
        onSessionSelect(data, selectedSlot);
        return;
      }

      push(
        `/customer/payment/private-service/${privateService?.id}/private-slot/${
          selectedSlot?.id
        }/?membership=${companyId}&data=${encodeURIComponent(
          JSON.stringify(data),
        )}`,
      );
    },
    [privateService, selectedSlot, companyId, onSessionSelect, push],
  );

  const classes = useStyles();

  const showCoachSelector = !!(
    privateService?.coaches.length &&
    privateService?.coach_attribution === RESOURCE_ATTRIBUTION_CONSUMER
  );

  const showEstablishmentSelector = !!(
    privateService &&
    privateService.establishments.length &&
    !privateService.is_home_service &&
    privateService.establishment_attribution === RESOURCE_ATTRIBUTION_CONSUMER
  );

  const multipleCoach = showCoachSelector && privateService?.coaches.length > 1;
  const multipleEstablishment =
    showEstablishmentSelector && privateService?.establishments.length > 1;

  return (
    <div className={classes.pageContainer}>
      <div className={classes.container}>
        {showSessions && (
          <div className={classes.container2}>
            {!!privateService?.slots?.length && (
              <PrivateSlotSelector
                isDisabled={isSelectionDisabled}
                onSelect={onPrivateSlotSelect}
                privateService={privateService}
                privateSlot={selectedSlot}
              />
            )}

            {showCoachSelector && (
              <CoachSelector
                coachDisplay={theme?.coach_display}
                onSelect={onCoachSelect}
                privateService={privateService}
                privateSlot={selectedSlot}
                selectedCoaches={selectedCoaches}
              />
            )}

            {showEstablishmentSelector && (
              <EstablishmentSelector
                onSelect={onEstablishmentSelect}
                privateService={privateService}
                privateSlot={selectedSlot}
                selectedEstablishments={selectedEstablishments}
              />
            )}

            {privateService && (
              <SlotCalendar
                availabilitySlotByDate={availabilitySlotByDate}
                availableSlotsLoading={availableSlotsLoading}
                nextAvailableSlotLoading={nextAvailableSlotLoading}
                nextDateAvailableSlot={nextDateAvailableSlot}
                numberOfDayToShow={numberOfDayToShow}
                onDateChange={onDateChange}
                onSessionMomentSelect={onSessionMomentSelect}
                privateService={privateService}
                privateSlot={selectedSlot}
                selectedDate={selectedDate}
                selectedSessionMoment={selectedSessionMoment}
                timezoneName={theme.timezone_name}
              />
            )}

            {selectedSessionMoment && (
              <div ref={sessionSelectorRefs}>
                <SessionSelector
                  availabilitySlot={availabilitySlot}
                  bookingIntervalMinutes={selectedSlot.booking_interval_minutes}
                  // @ts-expect-error
                  choseCoach={
                    privateService.coach_attribution ===
                    RESOURCE_ATTRIBUTION_CONSUMER
                  }
                  coachDisplay={theme?.coach_display}
                  coaches={
                    selectedCoaches?.length
                      ? selectedCoaches
                      : privateService.coaches
                  }
                  duration={selectedSlot.duration_minutes}
                  durationMinutes={selectedSlot.duration_minutes}
                  establishments={
                    selectedEstablishments?.length
                      ? selectedEstablishments
                      : privateService.establishments
                  }
                  onSessionSelect={handleSessionSelect}
                  sessionMoment={selectedSessionMoment}
                  showCoach={multipleCoach}
                  showEstablishment={multipleEstablishment}
                  timezoneName={theme.timezone_name}
                />
              </div>
            )}
          </div>
        )}
        {!eligibleByTagsLoading && showSessions === false && (
          <PrivateServiceIneligibleBanner goToAppointments={props.goBack} />
        )}
      </div>

      {!hideDetailSummary && (
        <PrivateServiceDetailSummary privateService={privateService} />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    display: 'flex',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-end',
    },
  },
  container: {
    justifyContent: 'center',
    display: 'flex',
    flex: 1,
    width: '100%',
  },
  container2: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    maxWidth: 1200,
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  privateService: withAssociatedCoach(
    withAvailablePrivateSlots(withAssociatedEstablishment(getPrivateService)),
  )(state, ownProps.serviceId),
  availabilitySlotByDate: getSearchedSlots(state),
  nextDateAvailableSlot: getNextDateAvailableSlot(state),
  nextAvailableSlotLoading: state.privateService.availabilitySlot.next.loading,
  availabilitySlot: state.privateService.availabilitySlot.searched.items,
  availableSlotsLoading: state.privateService.availabilitySlot.searched.loading,
  theme: state.theme.theme,
  eligibleByTags: getPrivateServiceTagEligible(state, ownProps.serviceId),
  eligibleByTagsLoading: getPrivateServiceTagEligibleLoading(state),
  isLoading:
    state.privateService.privateSlot.loading ||
    state.coach.loading ||
    state.establishment.bulkRetrieve.loading,
});

const mapDispatchToProps = {
  fetchPrivateService: fetchPrivateServiceAction,
  fetchPrivateSlotBulk: fetchPrivateSlotBulkAction,
  fetchAssociatedEstablishmentBulk: fetchAssociatedEstablishmentBulkAction,
  fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
  searchAvailableSlots: searchAvailableSlotsAction,
  searchFirstAvailableSlots: searchFirstAvailableSlotsAction,
  push: pushAction,
  goBack,
  checkPrivateServiceTagEligibility: checkPrivateServiceTagEligibilityAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export const PrivateServiceDetailDataProvider = connector;

export default compose<Props, OwnProps>(
  marketplaceCssHoc(),
  routerParamsToProps({
    companyId: 'companyId:string',
    serviceId: 'serviceId:string',
  }),
  connector,
)(PrivateServiceDetailPage);
