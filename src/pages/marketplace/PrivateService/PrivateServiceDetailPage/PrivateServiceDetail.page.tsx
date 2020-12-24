import React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {Typography, Paper, makeStyles, useMediaQuery, useTheme} from '@material-ui/core';
import { RESOURCE_ATTRIBUTION_CONSUMER } from '@bsport/common/lib/master-data/resource-attribution-methods';
import moment from 'moment-timezone';

import { push } from 'connected-react-router';

import {
  fetchMarketplacePrivateSlots,
  fetchPrivateService,
  searchAvailableSlots as searchAvailableSlotsAction,
  //@ts-ignore
} from '../../../../libs/private-service/actions';
import TypographyMultiline from '../../../../components/TypographyMultiline.component';
import {
  getPrivateService,
  getPrivateServiceById,
  //@ts-ignore
} from '../../../../libs/private-service/selectors/private-service.ts';
import { fetchAssociatedEstablishmentBulk } from '../../../../libs/establishment/actions.ts';
import { fetchAssociatedCoachBulk } from '../../../../libs/associated-coach/actions.ts';

import {
  getSearchedSlots,
  //@ts-ignore
} from '../../../../libs/private-service/selectors/availability-slot.ts';
import PrivateSlotSelector from './PrivateSlotSelector.tsx';
import CoachSelector from './CoachSelector.tsx';
import EstablishmentSelector from './EstablishmentSelector.tsx';
import SlotCalendar from './SlotCalendar/SlotCalendar.tsx';
import SessionSelector from './SessionSelector/SessionSelector.tsx';
import {
  PrivateCoach,
  PrivateEstablishment,
  PrivateService,
  PrivateSlot,
} from '../../../../libs/private-service/types';
import { ArrayElement } from '../../../../utils/types';
import { groupSessionsByDayMoment } from '../../../../libs/private-service/utils';
import { RootState } from '../../../../reducers';

type SessionMoment = ArrayElement<ReturnType<typeof groupSessionsByDayMoment>>;

const useNumberOfDayToShow = () => {
  const materialTheme = useTheme();
  const isXS = useMediaQuery(materialTheme.breakpoints.down('xs'));
  const isSM = useMediaQuery(materialTheme.breakpoints.down('sm'));
  const isMD = useMediaQuery(materialTheme.breakpoints.up('md'));

  let nbOfDayToShow = 2;

  if(isSM && !isXS) {
    nbOfDayToShow = 3;
  }
  if(isMD) {
    nbOfDayToShow = 7;
  }

  const [numberOfDayToShow, setNumberOfDayToShow] = useState(nbOfDayToShow)

  useEffect(() => {
    let nbOfDayToShow = 2;
    if(isSM && !isXS) {
      nbOfDayToShow = 3;
    }
    if(isMD) {
      nbOfDayToShow = 7;
    }

    setNumberOfDayToShow(nbOfDayToShow);
  }, [isMD, isSM, isXS])

  return numberOfDayToShow;
}

const PrivateServiceDetailPage: React.FC = () => {
  const sessionSelectorRefs = useRef();

  /** STATE **/
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'),);
  const [selectedSlot, setSelectedSlot] = useState<PrivateSlot>(null);
  const [selectedCoaches, setSelectedCoaches] = useState<PrivateCoach[]>([]);
  const [selectedEstablishments, setSelectedEstablishments] = useState<PrivateEstablishment[]>([]);
  const [selectedSessionMoment, setSelectedSessionMoment,] = useState<SessionMoment>(null);

  const numberOfDayToShow = useNumberOfDayToShow();

  /** PARAMS **/
  const { companyId, serviceId } = useParams();

  /** STORE  **/
  const _privateService = useSelector((s: RootState) =>
    getPrivateService(s, serviceId),
  );
  const privateService: PrivateService = useSelector((s: RootState) =>
    getPrivateServiceById(s, serviceId),
  );

  const availabilitySlotByDate: any = useSelector(getSearchedSlots);
  const availabilitySlot = useSelector((s: RootState) => s.privateService.availabilitySlot.searched.items)
  const availableSlotsLoading = useSelector(
    (s: RootState) => s.privateService.availabilitySlot.searched.loading,
  );
  const theme = useSelector((s: RootState) => s.theme.theme);
  const dispatch = useDispatch();


  /** EFFECTS **/
  useEffect(() => {
    dispatch(fetchMarketplacePrivateSlots(companyId));
    dispatch(fetchPrivateService(serviceId));
  }, []);

  useEffect(() => {
    if (_privateService) {
      dispatch(fetchAssociatedEstablishmentBulk(_privateService.establishments,));
      dispatch(fetchAssociatedCoachBulk(_privateService.coaches));
    }
  }, [_privateService])

  useEffect(() => {
    privateService && selectedSlot && searchAvailableSlots();
  }, [selectedSlot, selectedDate, selectedCoaches, selectedEstablishments, numberOfDayToShow]);

  useEffect(() => {
    setSelectedSessionMoment(null);
  }, [numberOfDayToShow])

  const searchAvailableSlots = useCallback(() => {
    const dates = [];

    for (let i = 0; i < numberOfDayToShow; i++) {
      dates.push(
        moment(selectedDate)
          .add(i, 'days')
          .format('YYYY-MM-DD'),
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

    dispatch(searchAvailableSlotsAction(
      privateService.id,
      selectedSlot.id,
      coaches,
      dates,
      establishments,
    ));
  }, [selectedSlot, selectedDate, selectedEstablishments, selectedCoaches, privateService, numberOfDayToShow]);


  const onPrivateSlotSelect = useCallback(
    (slot: PrivateSlot) => {
      setSelectedSlot(slot);
      //@ts-ignore
      setSelectedCoaches([...privateService.coaches]);
      //@ts-ignore
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

  const onCoachSelect = useCallback((coach: PrivateCoach) => {
    const _selectedCoaches = toggleFromArray(selectedCoaches, coach);
    setSelectedCoaches(_selectedCoaches);
    setSelectedSessionMoment(null);
  }, [selectedCoaches]);

  const onEstablishmentSelect = useCallback((establishment: PrivateEstablishment) => {
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
        //@ts-ignore
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
    (date: string, establishment: string, associated_coach: string) => {
      const data = { date, establishment, associated_coach };
      dispatch(
        push(
          `/customer/payment/private-service/${
            privateService?.id
          }/private-slot/${
            selectedSlot?.id
          }/?membership=${companyId}&data=${encodeURIComponent(
            JSON.stringify(data),
          )}`,
        ),
      );
    },
    [privateService, selectedSlot, companyId],
  );


  const classes = useStyles();

  const showCoachSelector = !!(
    privateService?.coaches.length &&
    privateService?.coach_attribution ===
      RESOURCE_ATTRIBUTION_CONSUMER
  );

  const showEstablishmentSelector = !!(
    privateService &&
    privateService.establishments.length &&
    !privateService.is_home_service &&
    privateService.establishment_attribution ===
      RESOURCE_ATTRIBUTION_CONSUMER
  );

  const multipleCoach = showCoachSelector && privateService?.coaches.length > 1;
  const multipleEstablishment = showEstablishmentSelector && privateService?.establishments.length > 1;

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
                showEstablishment={multipleEstablishment}
                coaches={selectedCoaches?.length ? selectedCoaches : (privateService.coaches as PrivateCoach[])}
                establishments={
                  selectedEstablishments?.length ?
                      selectedEstablishments :
                      (privateService.establishments as PrivateEstablishment[])
                }
                durationMinutes={selectedSlot.duration_minutes}
                timezoneName={theme.timezone_name}
                availabilitySlot={availabilitySlot}
                onSessionSelect={onSessionSelect}
                bookingIntervalMinutes={privateService.booking_interval_minutes}
                duration={selectedSlot.duration_minutes}
              />
            </div>
          )}
        </div>
      </div>

      <Paper className={classes.serviceDescriptionContainer}>
        {privateService && (
          <img
            alt={privateService.name}
            src={privateService.cover_main}
            className={classes.privateServiceImage}
          />
        )}

        <div className={classes.serviceDescriptionContent}>
          {privateService && (
            <>
              <Typography variant={'h6'}>
                {privateService.name}
              </Typography>

              <TypographyMultiline
                className={classes.serviceDescription}
                variant={'subtitle2'}
                color={'textSecondary'}
              >
                {privateService.description}
              </TypographyMultiline>
            </>
          )}
        </div>
      </Paper>
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
  serviceDescriptionContainer: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
    width: 400,
    [theme.breakpoints.up('xl')]: {
      width: 600,
    },
    height: '100%',
    minHeight: '100vh',
  },
  serviceDescription: {
    marginTop: theme.spacing(2),
  },
  serviceDescriptionContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(4),
  },
  privateServiceImage: {
    width: '100%',
  },
}));

export default PrivateServiceDetailPage;
