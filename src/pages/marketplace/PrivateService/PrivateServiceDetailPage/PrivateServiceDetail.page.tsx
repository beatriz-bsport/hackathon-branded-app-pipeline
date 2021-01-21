import React, { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
// @ts-ignore
import { RESOURCE_ATTRIBUTION_CONSUMER } from '@bsport/common/lib/master-data/resource-attribution-methods';
import moment from 'moment-timezone';
import { push } from 'connected-react-router';

import { compose } from 'recompose';
import {
  fetchMarketplacePrivateSlots,
  fetchPrivateService,
  searchAvailableSlots as searchAvailableSlotsAction,
} from '../../../../libs/private-service/actions';
import {
  getPrivateService,
  getPrivateServiceById,
} from '../../../../libs/private-service/selectors/private-service';
import { fetchAssociatedEstablishmentBulk } from '../../../../libs/establishment/actions';
import { fetchAssociatedCoachBulk } from '../../../../libs/associated-coach/actions';

import { getSearchedSlots } from '../../../../libs/private-service/selectors/availability-slot';
import PrivateSlotSelector from './PrivateSlotSelector';
import CoachSelector from './CoachSelector';
import EstablishmentSelector from './EstablishmentSelector';
import SlotCalendar from './SlotCalendar/SlotCalendar';
import SessionSelector from './SessionSelector/SessionSelector';
import { PrivateSlot } from '../../../../libs/private-service/types';
import { ArrayElement } from '../../../../utils/types';
import { groupSessionsByDayMoment } from '../../../../libs/private-service/utils';
import { RootState } from '../../../../reducers';
import { Coach } from '../../../../libs/associated-coach/types';
import { Establishment } from '../../../../libs/establishment/types';
import PrivateServiceDetailSummary from './PrivateServiceDetailSummary';
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
    nbOfDayToShow = 2;
    if (isSM && !isXS) {
      nbOfDayToShow = 3;
    }
    if (isMD) {
      nbOfDayToShow = 7;
    }

    setNumberOfDayToShow(nbOfDayToShow);
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
  store: any;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

export const PrivateServiceDetailPage: React.FC<Props> = (props) => {
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
  const [
    selectedSessionMoment,
    setSelectedSessionMoment,
  ] = useState<SessionMoment>(null);

  const numberOfDayToShow = useNumberOfDayToShow();

  const { companyId, serviceId } = props;

  /** EFFECTS */
  useEffect(() => {
    props.fetchMarketplacePrivateSlots(parseInt(companyId));
    props.fetchPrivateService(parseInt(serviceId));
  }, []);

  useEffect(() => {
    if (props._privateService) {
      props.fetchAssociatedEstablishmentBulk(
        props._privateService.establishments,
      );
      props.fetchAssociatedCoachBulk(props._privateService.coaches);
    }
  }, [props._privateService]);

  useEffect(() => {
    if (props.privateService && selectedSlot) {
      searchAvailableSlots();
    }
  }, [
    selectedSlot,
    selectedDate,
    selectedCoaches,
    selectedEstablishments,
    numberOfDayToShow,
  ]);

  useEffect(() => {
    setSelectedSessionMoment(null);
  }, [numberOfDayToShow]);

  const searchAvailableSlots = useCallback(() => {
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

    props.searchAvailableSlotsAction(
      props.privateService.id,
      selectedSlot.id,
      coaches,
      dates,
      establishments,
    );
  }, [
    selectedSlot,
    selectedDate,
    selectedEstablishments,
    selectedCoaches,
    props.privateService,
    numberOfDayToShow,
  ]);

  const onPrivateSlotSelect = useCallback(
    (slot: PrivateSlot) => {
      setSelectedSlot(slot);
      // @ts-ignore
      setSelectedCoaches([...props.privateService.coaches]);
      // @ts-ignore
      setSelectedEstablishments([...props.privateService.establishments]);
      setSelectedSessionMoment(null);
    },
    [props.privateService],
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

  const onSessionSelect = useCallback(
    (date: string, establishment: number, associated_coach: number) => {
      const data = { date, establishment, associated_coach };

      if (props.onSessionSelect) {
        // override by the widget
        props.onSessionSelect(data, selectedSlot);
        return;
      }

      props.push(
        `/customer/payment/private-service/${
          props.privateService?.id
        }/private-slot/${
          selectedSlot?.id
        }/?membership=${companyId}&data=${encodeURIComponent(
          JSON.stringify(data),
        )}`,
      );
    },
    [props.privateService, selectedSlot, companyId],
  );

  const classes = useStyles();

  const showCoachSelector = !!(
    props.privateService?.coaches.length &&
    props.privateService?.coach_attribution === RESOURCE_ATTRIBUTION_CONSUMER
  );

  const showEstablishmentSelector = !!(
    props.privateService &&
    props.privateService.establishments.length &&
    !props.privateService.is_home_service &&
    props.privateService.establishment_attribution ===
      RESOURCE_ATTRIBUTION_CONSUMER
  );

  const multipleCoach =
    showCoachSelector && props.privateService?.coaches.length > 1;
  const multipleEstablishment =
    showEstablishmentSelector &&
    props.privateService?.establishments.length > 1;

  return (
    <div className={classes.pageContainer}>
      <div className={classes.container}>
        <div className={classes.container2}>
          {!!props.privateService?.slots?.length && (
            <PrivateSlotSelector
              privateService={props.privateService}
              privateSlot={selectedSlot}
              onSelect={onPrivateSlotSelect}
            />
          )}

          {showCoachSelector && (
            <CoachSelector
              privateService={props.privateService}
              privateSlot={selectedSlot}
              selectedCoaches={selectedCoaches}
              onSelect={onCoachSelect}
            />
          )}

          {showEstablishmentSelector && (
            <EstablishmentSelector
              privateService={props.privateService}
              privateSlot={selectedSlot}
              selectedEstablishments={selectedEstablishments}
              onSelect={onEstablishmentSelect}
            />
          )}

          {props.privateService && (
            <SlotCalendar
              availabilitySlotByDate={props.availabilitySlotByDate}
              timezoneName={props.theme.timezone_name}
              selectedDate={selectedDate}
              privateService={props.privateService}
              privateSlot={selectedSlot}
              numberOfDayToShow={numberOfDayToShow}
              availableSlotsLoading={props.availableSlotsLoading}
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
                showEstablishment={multipleEstablishment}
                coaches={
                  selectedCoaches?.length
                    ? selectedCoaches
                    : props.privateService.coaches
                }
                establishments={
                  selectedEstablishments?.length
                    ? selectedEstablishments
                    : props.privateService.establishments
                }
                durationMinutes={selectedSlot.duration_minutes}
                timezoneName={props.theme.timezone_name}
                availabilitySlot={props.availabilitySlot}
                onSessionSelect={onSessionSelect}
                bookingIntervalMinutes={selectedSlot.booking_interval_minutes}
                duration={selectedSlot.duration_minutes}
              />
            </div>
          )}
        </div>
      </div>

      {!props.hideDetailSummary && (
        <PrivateServiceDetailSummary privateService={props.privateService} />
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
  privateService: getPrivateServiceById(state, ownProps.serviceId),
  availabilitySlotByDate: getSearchedSlots(state),
  availabilitySlot: state.privateService.availabilitySlot.searched.items,
  availableSlotsLoading: state.privateService.availabilitySlot.searched.loading,
  theme: state.theme.theme,
});

const mapDispatchToProps = {
  fetchMarketplacePrivateSlots,
  fetchPrivateService,
  fetchAssociatedEstablishmentBulk,
  fetchAssociatedCoachBulk,
  searchAvailableSlotsAction,
  push,
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
