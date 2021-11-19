import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useMediaQuery, useTheme } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
// @ts-ignore
import { RESOURCE_ATTRIBUTION_CONSUMER } from '@bsport/common/lib/master-data/resource-attribution-methods';
import moment from 'moment-timezone';
import { push as pushAction } from 'connected-react-router';

import { compose } from 'recompose';
import {
  fetchMarketplacePrivateSlots as fetchMarketplacePrivateSlotsAction,
  fetchPrivateService as fetchPrivateServiceAction,
  searchAvailableSlots as searchAvailableSlotsAction,
} from '../../../../libs/private-service/actions';
import {
  getPrivateService,
  withAssociatedCoach,
  withSlots,
  withAssociatedEstablishment,
} from '../../../../libs/private-service/selectors/private-service';
import { fetchAssociatedEstablishmentBulk as fetchAssociatedEstablishmentBulkAction } from '../../../../libs/establishment/actions';
import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '../../../../libs/associated-coach/actions';

import { getSearchedSlots } from '../../../../libs/private-service/selectors/availability-slot';
import PrivateSlotSelector from './PrivateSlotSelector.component';
import CoachSelector from './CoachSelector.component';
import EstablishmentSelector from './EstablishmentSelector.component';
import SlotCalendar from './SlotCalendar/SlotCalendar.component';
import SessionSelector from './SessionSelector/SessionSelector.component';
import { PrivateSlot } from '../../../../libs/private-service/types';
import { ArrayElement } from '../../../../utils/types';
import { groupSessionsByDayMoment } from '../../../../libs/private-service/utils';
import { RootState } from '../../../../reducers';
import { Coach } from '../../../../libs/associated-coach/types';
import { Establishment } from '../../../../libs/establishment/types';
import PrivateServiceDetailSummary from './PrivateServiceDetailSummary.component';
// @ts-ignore
import routerParamsToProps from '../../../../hocs/router-params-to-props.hoc';

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

type OwnProps = typeof mapParamsToProps & {
  /** onSessionSelect is override by the widget */
  onSessionSelect?: (
    data: {
      date: string;
      establishment: number;
      associated_coach: number;
    },
    slot: PrivateSlot,
  ) => void;
  hideDetailSummary?: boolean;
  /** store is override by the widget */
  // store: any;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

export const PrivateServiceDetailPage: React.FC<Props> = (props) => {
  const {
    onSessionSelect,
    hideDetailSummary,
    fetchMarketplacePrivateSlots,
    fetchPrivateService,
    fetchAssociatedEstablishmentBulk,
    fetchAssociatedCoachBulk,
    searchAvailableSlots,
    push,
    _privateService,
    privateService,
    availabilitySlotByDate,
    availabilitySlot,
    availableSlotsLoading,
    theme,
    companyId,
    serviceId,
  } = props;
  const sessionSelectorRefs = useRef();

  /** STATE */
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [selectedSlot, setSelectedSlot] = useState<PrivateSlot>(null);
  const [selectedCoaches, setSelectedCoaches] = useState<Coach[]>([]);
  const [selectedEstablishments, setSelectedEstablishments] = useState<
    Establishment[]
  >([]);
  const [selectedSessionMoment, setSelectedSessionMoment] =
    useState<SessionMoment>(null);

  const numberOfDayToShow = useNumberOfDayToShow();

  /** EFFECTS */
  useEffect(() => {
    fetchMarketplacePrivateSlots(parseInt(companyId));
    fetchPrivateService(parseInt(serviceId));
  }, [fetchMarketplacePrivateSlots, fetchPrivateService, companyId, serviceId]);

  useEffect(() => {
    if (_privateService) {
      fetchAssociatedEstablishmentBulk(_privateService.establishments);
      fetchAssociatedCoachBulk(_privateService.coaches);
    }
  }, [
    _privateService,
    fetchAssociatedEstablishmentBulk,
    fetchAssociatedCoachBulk,
  ]);

  useEffect(() => {
    if (privateService && selectedSlot) {
      const dates = [];

      for (let i = 0; i < numberOfDayToShow; i += 1) {
        dates.push(moment(selectedDate).add(i, 'days').format('YYYY-MM-DD'));
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

  const onPrivateSlotSelect = useCallback(
    (slot: PrivateSlot) => {
      setSelectedSlot(slot);
      // @ts-ignore
      setSelectedCoaches([...privateService.coaches]);
      // @ts-ignore
      setSelectedEstablishments([...privateService.establishments]);
      setSelectedSessionMoment(null);
    },
    [privateService],
  );

  const toggleFromArray = (array: any, item: any) => {
    const _array = [...array];
    const index = _array.findIndex((it) => it.id === item.id);
    index === -1 ? _array.push(item) : _array.splice(index, 1);
    return _array;
  };

  const onCoachSelect = useCallback(
    (coach: Coach) => {
      const _selectedCoaches = toggleFromArray(selectedCoaches, coach);
      setSelectedCoaches(_selectedCoaches);
      setSelectedSessionMoment(null);
    },
    [selectedCoaches],
  );

  const onEstablishmentSelect = useCallback(
    (establishment: Establishment) => {
      const _selectedEstablishments = toggleFromArray(
        selectedEstablishments,
        establishment,
      );
      setSelectedEstablishments(_selectedEstablishments);
      setSelectedSessionMoment(null);
    },
    [selectedEstablishments],
  );

  const onSessionMomentSelect = useCallback((sessionMoment: SessionMoment) => {
    setSelectedSessionMoment(sessionMoment);

    setTimeout(() => {
      if (sessionSelectorRefs && sessionSelectorRefs.current) {
        // @ts-ignore
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
    (date: string, establishment: number, associated_coach: number) => {
      const data = { date, establishment, associated_coach };

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
        <div className={classes.container2}>
          {!!privateService?.slots?.length && (
            <PrivateSlotSelector
              privateService={privateService}
              privateSlot={selectedSlot}
              onSelect={onPrivateSlotSelect}
            />
          )}

          {showCoachSelector && (
            <CoachSelector
              privateService={privateService}
              privateSlot={selectedSlot}
              selectedCoaches={selectedCoaches}
              onSelect={onCoachSelect}
            />
          )}

          {showEstablishmentSelector && (
            <EstablishmentSelector
              privateService={privateService}
              privateSlot={selectedSlot}
              selectedEstablishments={selectedEstablishments}
              onSelect={onEstablishmentSelect}
            />
          )}

          {privateService && (
            <SlotCalendar
              availabilitySlotByDate={availabilitySlotByDate}
              timezoneName={theme.timezone_name}
              selectedDate={selectedDate}
              privateService={privateService}
              privateSlot={selectedSlot}
              numberOfDayToShow={numberOfDayToShow}
              availableSlotsLoading={availableSlotsLoading}
              onSessionMomentSelect={onSessionMomentSelect}
              selectedSessionMoment={selectedSessionMoment}
              onDateChange={onDateChange}
            />
          )}

          {selectedSessionMoment && (
            <div ref={sessionSelectorRefs}>
              <SessionSelector
                sessionMoment={selectedSessionMoment}
                showCoach={multipleCoach}
                choseCoach={
                  privateService.coach_attribution ===
                  RESOURCE_ATTRIBUTION_CONSUMER
                }
                showEstablishment={multipleEstablishment}
                coaches={
                  selectedCoaches?.length
                    ? selectedCoaches
                    : privateService.coaches
                }
                establishments={
                  selectedEstablishments?.length
                    ? selectedEstablishments
                    : privateService.establishments
                }
                durationMinutes={selectedSlot.duration_minutes}
                timezoneName={theme.timezone_name}
                availabilitySlot={availabilitySlot}
                onSessionSelect={handleSessionSelect}
                bookingIntervalMinutes={selectedSlot.booking_interval_minutes}
                duration={selectedSlot.duration_minutes}
              />
            </div>
          )}
        </div>
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
  _privateService: getPrivateService(state, ownProps.serviceId),
  privateService: withAssociatedCoach(
    withSlots(withAssociatedEstablishment(getPrivateService)),
  )(state, ownProps.serviceId),
  availabilitySlotByDate: getSearchedSlots(state),
  availabilitySlot: state.privateService.availabilitySlot.searched.items,
  availableSlotsLoading: state.privateService.availabilitySlot.searched.loading,
  theme: state.theme.theme,
});

const mapDispatchToProps = {
  fetchMarketplacePrivateSlots: fetchMarketplacePrivateSlotsAction,
  fetchPrivateService: fetchPrivateServiceAction,
  fetchAssociatedEstablishmentBulk: fetchAssociatedEstablishmentBulkAction,
  fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
  searchAvailableSlots: searchAvailableSlotsAction,
  push: pushAction,
};

export const PrivateServiceDetailDataProvider = compose<any, OwnProps>(
  connect(mapStateToProps, mapDispatchToProps),
);

const mapParamsToProps = {
  companyId: 'companyId',
  serviceId: 'serviceId',
};

export default compose(
  routerParamsToProps(mapParamsToProps),
  PrivateServiceDetailDataProvider,
)(PrivateServiceDetailPage);
