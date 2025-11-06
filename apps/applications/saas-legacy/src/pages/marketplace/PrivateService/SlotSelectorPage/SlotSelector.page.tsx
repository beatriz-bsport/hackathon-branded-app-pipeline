import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

// HOCs
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';

// API calls
import { findAvailableEstablishment } from '#src/libs/private-service/api';

// Actions
import {
  checkPrivateServiceTagEligibility as checkPrivateServiceTagEligibilityAction,
  fetchPrivateService as fetchPrivateServiceAction,
  fetchPrivateSlotBulk as fetchPrivateSlotBulkAction,
  fetchAvailableSlotsByResource as fetchAvailableSlotsByResourceAction,
  searchFirstAvailableSlots as searchFirstAvailableSlotsAction,
} from '#src/libs/private-service/actions';
import {
  goBack as goBackAction,
  push as pushAction,
} from 'connected-react-router';
import { fetchAssociatedEstablishmentBulk as fetchAssociatedEstablishmentBulkAction } from '#src/libs/establishment/actions';
import { fetchAssociatedCoachBulk as fetchAssociatedCoachBulkAction } from '#src/libs/associated-coach/actions';

// Selectors
import { getTheme } from '#src/libs/theme/selectors';

import {
  getPrivateServiceTagEligible,
  getPrivateServiceTagEligibleLoading,
  getPrivateServiceWithDetails,
} from '#src/libs/private-service/selectors/private-service';

// Hooks
import {
  useCoachSelection,
  useEstablishmentSelection,
  usePrivateSlotSelection,
} from '#src/pages/marketplace/PrivateService/SlotSelectorPage/hooks';

// Components
import PrivateSlotSelector from '../PrivateServiceDetailPage/PrivateSlotSelector.component';
import CoachSelector from '#src/libs/associated-coach/components/coach-selector/CoachSelector.component';
import EstablishmentSelector from '#src/libs/establishment/components/EstablishmentSelector.component';
import SlotCalendarReworked from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/SlotCalendarReworked';
import SessionSelectorReworked from '#src/pages/marketplace/PrivateService/SlotSelectorPage/components/SessionSelectorReworked';
import PrivateServiceDetailSummary from '../PrivateServiceDetailPage/PrivateServiceDetailSummary.component';
import PrivateServiceIneligibleBannerComponent from '#src/libs/private-service/components/service/PrivateServiceIneligibleBanner.component';
import PrivateServiceDetailCard from '#src/libs/marketplace/components/@PrivateService/PrivateServiceDetailCard';
import SlotSelectorContextProvider, {
  SlotSelectorContext,
} from '#src/pages/marketplace/PrivateService/SlotSelectorPage/context/SlotSelector.context';

// Types
import type { RootState } from '#src/reducers';
import type { MarketplacePrivateServiceSessionData } from '#src/libs/marketplace/types';
import type {
  PrivateService,
  PrivateSlot,
} from '#src/libs/private-service/types';

// Constants
import { RESOURCE_ATTRIBUTION_AUTO } from '@bsport/common/lib/master-data/resource-attribution-methods.js';
import SlotSelectorStoreContextProvider from './context/SlotSelectorStore.context';
import {
  getNextDateAvailableSlot,
  getSlotsByDate,
  getSlotsByDateLoading,
} from '#src/libs/private-service/selectors/availability-slot';
import { useTranslation } from 'react-i18next';
import { analyticsClientB2C } from '#src/components/analytics/mixpanel';
import {
  trackAppointmentSlotViewedEvent,
  trackAppointmentViewedEvent,
} from '#src/events/booking/trackers';

type PropsFromWidget = {
  companyId: string;
  hideDetailSummary?: boolean;
  onSessionSelect?: (
    data: MarketplacePrivateServiceSessionData,
    slot: PrivateSlot,
  ) => void;
  serviceId: string;
  store?: any;
};

type Props = PropsFromWidget & ConnectedProps<typeof connector>;

type PageProps = Omit<
  Props,
  | 'availableSlotsLoading'
  | 'nextAvailableSlotLoading'
  | 'availabilitySlotByDate'
  | 'nextDateAvailableSlot'
>;

const SlotSelectorPage: React.FC<PageProps> = ({
  checkPrivateServiceTagEligibility,
  companyId,
  eligibleByTags,
  eligibleByTagsLoading,
  fetchAssociatedCoachBulk,
  fetchAssociatedEstablishmentBulk,
  fetchAvailableSlotsByResource,
  fetchPrivateService,
  fetchPrivateSlotBulk,
  goBack,
  isLoading,
  privateService,
  push,
  searchFirstAvailableSlots,
  serviceId,
  theme,
  hideDetailSummary,
  onSessionSelect,
}) => {
  const { t } = useTranslation('privateService');
  const {
    selectedDayTimeInterval,
    selectedPrivateSlot,
    selectedCoachesIds,
    selectedEstablishmentsIds,
    selectedDate,
    calendarDateRange,
    getCalendarDateRange,
    setCalendarDateRange,
    setActiveEstablishment,
  } = useContext(SlotSelectorContext);

  // Coaches
  const { showCoachSelector, onSelectCoaches, coaches } = useCoachSelection();

  // Establishments
  const {
    showEstablishmentSelector,
    onSelectEstablishment,
    availableEstablishments,
    establishments,
  } = useEstablishmentSelection();

  // Private slots
  const { onSelectPrivateSlot, selectedPrivateSlotDuration } =
    usePrivateSlotSelection();

  const [isFetchSuccessful, setIsFetchSuccessful] = useState(false);

  /**
   * The callback function used to get the available slots by resource.
   * The data is organized by date and stored in redux under
   * privateService.availabilitySlot.slotsByDate.byDate
   * It can be accessed thanks to the selector getSlotsByDate
   */
  const getAvailableSlotsByResource = useCallback(() => {
    fetchAvailableSlotsByResource(
      privateService.id,
      selectedPrivateSlot.id,
      selectedCoachesIds,
      calendarDateRange,
      selectedEstablishmentsIds,
    );
  }, [
    fetchAvailableSlotsByResource,
    privateService,
    selectedPrivateSlot,
    calendarDateRange,
    selectedCoachesIds,
    selectedEstablishmentsIds,
  ]);

  /**
   * The callback function used to get the first available slot.
   * It returns a date as a string.
   * The data is stored in redux under
   * privateService.availabilitySlot.next.date
   * It can be accessed thanks to the selector getNextDateAvailableSlot
   */
  const getFirstAvailableSlots = useCallback(() => {
    searchFirstAvailableSlots(
      privateService.id,
      selectedPrivateSlot.id,
      selectedCoachesIds,
      selectedEstablishmentsIds,
    );
  }, [
    searchFirstAvailableSlots,
    privateService,
    selectedPrivateSlot,
    selectedCoachesIds,
    selectedEstablishmentsIds,
  ]);

  const showSessions =
    !theme?.hide_sessions_with_tags_when_not_eligible || eligibleByTags;

  const isSelectionDisabled = useMemo(
    () => isLoading || !isFetchSuccessful,
    [isLoading, isFetchSuccessful],
  );

  const classes = useStyles();

  /**
   * The callback function used when the user selects an available slot
   * for its appointment. Once he does so, he's redirected to the
   * appointment checkout page where he'll be able to select a pass
   * to book the appointment.
   *
   * NB: onSessionSelect is passed through props in the widget as
   * we want another behavior the page is called from the widget context.
   *
   * NB: establishment_attribution is set in the BO, in the privateService form.
   */
  const onSelectSession = useCallback(
    (
        sessionDateStart: string,
        establishmentId?: number,
        associatedCoachId?: number,
      ): (() => Promise<void>) =>
      async () => {
        if (!privateService) return null;

        const data = {
          date: sessionDateStart,
          establishment: establishmentId,
          associated_coach: associatedCoachId,
        };
        if (
          privateService.establishment_attribution ===
            RESOURCE_ATTRIBUTION_AUTO &&
          !!selectedPrivateSlot
        ) {
          const establishment_found = await findAvailableEstablishment(
            selectedPrivateSlot.id,
            {
              associated_coach: associatedCoachId,
              date_start: sessionDateStart,
            },
          );

          if (establishment_found?.data?.establishment) {
            data.establishment = establishment_found.data.establishment;
          }
        }
        if (onSessionSelect) {
          onSessionSelect(data, selectedPrivateSlot);
          return;
        }
        push(
          `/customer/payment/private-service/${
            privateService?.id
          }/private-slot/${
            selectedPrivateSlot?.id
          }/?membership=${companyId}&data=${encodeURIComponent(
            JSON.stringify(data),
          )}`,
        );
      },
    [companyId, onSessionSelect, privateService, push, selectedPrivateSlot],
  );

  // EFFECTS

  /*
   * You can consider this useEffect as a componentDidMount for class
   * components.
   * It fetchs the private service and the related resources we'll
   * need in the page.
   */
  useEffect(() => {
    fetchPrivateService(parseInt(serviceId), {
      onSuccess: (fetchedPrivateService: PrivateService) => {
        Promise.all([
          fetchedPrivateService.slots?.length &&
            fetchPrivateSlotBulk(fetchedPrivateService.slots),
          fetchedPrivateService.coaches?.length &&
            fetchAssociatedCoachBulk(fetchedPrivateService.coaches),
          fetchedPrivateService.establishments?.length &&
            fetchAssociatedEstablishmentBulk(
              fetchedPrivateService.establishments,
            ),
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
    if (privateService && selectedPrivateSlot) {
      getAvailableSlotsByResource();
      getFirstAvailableSlots();
    }
  }, [
    privateService,
    selectedPrivateSlot,
    getAvailableSlotsByResource,
    getFirstAvailableSlots,
  ]);

  useEffect(() => {
    checkPrivateServiceTagEligibility(parseInt(serviceId), null);
  }, [checkPrivateServiceTagEligibility, serviceId]);

  useEffect(() => {
    const newCalendarDateRange = getCalendarDateRange(selectedDate);
    setCalendarDateRange(newCalendarDateRange);
  }, [getCalendarDateRange, selectedDate, setCalendarDateRange]);

  /**
   * This useEffect automatically resets activeEstablishment
   * to the first establishment in availableEstablishments whenever
   * selectedDayTimeInterval or availableEstablishments changes.
   * This ensures that the active establishment is in sync with
   * any changes in availability intervals.
   */
  useEffect(() => {
    if (
      selectedDayTimeInterval &&
      availableEstablishments &&
      showEstablishmentSelector
    ) {
      setActiveEstablishment(availableEstablishments[0]);
    }
  }, [
    selectedDayTimeInterval,
    availableEstablishments,
    showEstablishmentSelector,
    setActiveEstablishment,
  ]);

  // Automatically select the single available slot if only one slot is defined in the service
  useEffect(() => {
    if ((privateService?.slots ?? []).length === 1) {
      onSelectPrivateSlot(privateService.slots[0]);
    }
  }, [privateService, onSelectPrivateSlot]);

  useEffect(() => {
    if (showSessions && isFetchSuccessful && !!privateService) {
      analyticsClientB2C.track(
        trackAppointmentViewedEvent({
          activity_id: privateService.id,
          activity_name: privateService.name,
        }),
      );
      if (!!privateService?.slots?.length) {
        analyticsClientB2C.track(
          trackAppointmentSlotViewedEvent({
            activity_id: privateService.id,
            activity_name: privateService.name,
          }),
        );
      }
    }
  }, [isFetchSuccessful]);

  return (
    <div className={classes.pageContainer}>
      <div className={classes.container}>
        {showSessions && isFetchSuccessful && (
          <div className={classes.container2}>
            <div className={classes.displayOnMobile}>
              <PrivateServiceDetailCard
                privateServiceCover={privateService?.cover_main}
                privateServiceDescription={privateService?.description}
                privateServiceName={privateService?.name}
              />
            </div>
            {!!privateService?.slots?.length && (
              <PrivateSlotSelector
                isDisabled={isSelectionDisabled}
                onSelect={onSelectPrivateSlot}
                privateService={privateService}
                privateSlot={selectedPrivateSlot}
              />
            )}
            <div>
              <div className={classes.selectorsContainer}>
                {showCoachSelector && (
                  <CoachSelector
                    isClearable
                    coachDisplay={theme?.coach_display}
                    coaches={coaches}
                    isDisabled={isSelectionDisabled || !selectedPrivateSlot}
                    isLoading={isLoading}
                    placeholder={t('selector.coachPlaceholder')}
                    selectedCoaches={selectedCoachesIds}
                    selectOption={onSelectCoaches}
                    selectorClass={classes.selector}
                  />
                )}
                {showEstablishmentSelector && (
                  <EstablishmentSelector
                    disabled={isSelectionDisabled || !selectedPrivateSlot}
                    establishments={establishments}
                    placeholder={t('selector.establishmentPlaceholder')}
                    selectedEstablishments={selectedEstablishmentsIds}
                    selectOption={onSelectEstablishment}
                    selectorClass={classes.selector}
                  />
                )}
              </div>
              {privateService && <SlotCalendarReworked />}
            </div>
            {selectedDayTimeInterval && (
              <div>
                <SessionSelectorReworked
                  coachDisplay={theme?.coach_display}
                  coaches={coaches}
                  duration={selectedPrivateSlotDuration}
                  onSessionSelect={onSelectSession}
                />
              </div>
            )}
            {!eligibleByTagsLoading && !showSessions && (
              <PrivateServiceIneligibleBannerComponent
                goToAppointments={goBack}
              />
            )}
          </div>
        )}
      </div>
      {!hideDetailSummary && (
        <PrivateServiceDetailSummary privateService={privateService} />
      )}
    </div>
  );
};

export const SlotSelectorPageWithContext: React.FC<Props> = ({
  checkPrivateServiceTagEligibility,
  companyId,
  eligibleByTags,
  eligibleByTagsLoading,
  fetchAssociatedCoachBulk,
  fetchAssociatedEstablishmentBulk,
  fetchAvailableSlotsByResource,
  fetchPrivateService,
  fetchPrivateSlotBulk,
  goBack,
  isLoading,
  privateService,
  push,
  searchFirstAvailableSlots,
  serviceId,
  theme,
  hideDetailSummary,
  onSessionSelect,
  availableSlotsLoading,
  nextAvailableSlotLoading,
  availabilitySlotByDate,
  nextDateAvailableSlot,
}) => {
  return (
    <SlotSelectorStoreContextProvider
      availabilitySlotByDate={availabilitySlotByDate}
      availableSlotsLoading={availableSlotsLoading}
      nextAvailableSlotLoading={nextAvailableSlotLoading}
      nextDateAvailableSlot={nextDateAvailableSlot}
      privateService={privateService}
    >
      <SlotSelectorContextProvider serviceId={serviceId}>
        <SlotSelectorPage
          checkPrivateServiceTagEligibility={checkPrivateServiceTagEligibility}
          companyId={companyId}
          eligibleByTags={eligibleByTags}
          eligibleByTagsLoading={eligibleByTagsLoading}
          fetchAssociatedCoachBulk={fetchAssociatedCoachBulk}
          fetchAssociatedEstablishmentBulk={fetchAssociatedEstablishmentBulk}
          fetchAvailableSlotsByResource={fetchAvailableSlotsByResource}
          fetchPrivateService={fetchPrivateService}
          fetchPrivateSlotBulk={fetchPrivateSlotBulk}
          goBack={goBack}
          hideDetailSummary={hideDetailSummary}
          isLoading={isLoading}
          onSessionSelect={onSessionSelect}
          privateService={privateService}
          push={push}
          searchFirstAvailableSlots={searchFirstAvailableSlots}
          serviceId={serviceId}
          theme={theme}
        />
      </SlotSelectorContextProvider>
    </SlotSelectorStoreContextProvider>
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
    gap: theme.spacing(2),
  },
  selectorsContainer: {
    display: 'flex',
    width: '50%',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    gap: theme.spacing(2),
    padding: theme.spacing(1),
  },
  selector: {
    width: '100%',
  },
  displayOnMobile: {
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
}));

const mapStateToProps = (
  state: RootState,
  { serviceId }: { serviceId: string },
) => ({
  eligibleByTags: getPrivateServiceTagEligible(state, serviceId),
  eligibleByTagsLoading: getPrivateServiceTagEligibleLoading(state),
  isLoading:
    state.privateService.privateSlot.loading ||
    state.coach.loading ||
    state.establishment.bulkRetrieve.loading,
  privateService: getPrivateServiceWithDetails(state, serviceId),
  theme: getTheme(state),
  availableSlotsLoading: getSlotsByDateLoading(state),
  nextAvailableSlotLoading: state.privateService.availabilitySlot.next.loading,
  availabilitySlotByDate: getSlotsByDate(state),
  nextDateAvailableSlot: getNextDateAvailableSlot(state),
});

const mapDispatchToProps = {
  checkPrivateServiceTagEligibility: checkPrivateServiceTagEligibilityAction,
  fetchAssociatedCoachBulk: fetchAssociatedCoachBulkAction,
  fetchAssociatedEstablishmentBulk: fetchAssociatedEstablishmentBulkAction,
  fetchAvailableSlotsByResource: fetchAvailableSlotsByResourceAction,
  fetchPrivateService: fetchPrivateServiceAction,
  fetchPrivateSlotBulk: fetchPrivateSlotBulkAction,
  goBack: goBackAction,
  push: pushAction,
  searchFirstAvailableSlots: searchFirstAvailableSlotsAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export { connector as SlotSelectorDataProvider };

export default compose<PropsFromWidget, Props>(
  React.memo,
  marketplaceCssHoc(),
  routerParamsToProps({
    companyId: 'companyId:string',
    serviceId: 'serviceId:string',
  }),
  connector,
)(SlotSelectorPageWithContext);
