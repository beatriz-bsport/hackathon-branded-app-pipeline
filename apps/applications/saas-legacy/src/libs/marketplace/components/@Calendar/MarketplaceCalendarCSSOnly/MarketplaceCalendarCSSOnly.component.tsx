import React, { useMemo } from 'react';
// @ts-expect-error
import { withTranslation, TFunction, WithTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import groupBy from 'lodash/groupBy';

import CircularProgress from '@material-ui/core/CircularProgress';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import { pure } from 'recompose';
import MarketplaceFilterComponent from '#src/libs/marketplace/components/@RessourceFilter/MarketplaceFilterCSSOnly/MarketplaceFilterCSSOnly.component';
import { Level } from '#src/libs/level/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Offer, OfferREST } from '#src/libs/offer/types';
import { Theme } from '#src/libs/theme/types';
import MarketplaceDatePicker from '#src/libs/marketplace/components/@Date/MarketplaceDatePicker';
import { Coach } from '#src/libs/associated-coach/types';
import type { LuxonDateTime } from '#src/types';
import type {
  Establishment,
  EstablishmentGroup,
} from '../../../../establishment/types';
import MarketplaceWeekTimetableV2, {
  getWeekOffers,
} from '../MarketplaceWeekTimeTableCSSOnly/MarketplaceWeekTimeTableCSSOnly.component';

import './MarketplaceCalendarCSSOnly.css';
import { MarketplaceFiltersSetter } from '#src/libs/marketplace/types';
import { ImmutableObject } from 'seamless-immutable';

const LoadingIndicator = () => (
  <div className="bs-calendar--loading">
    <CircularProgress />
  </div>
);

type Props = {
  onSelectDate: (date: string) => void;
  selectedDate: LuxonDateTime;
  offers: Array<OfferREST>;
  genderCount: Object;
  group: Object;
  loading: boolean;
  onClickOffer: (offerId: number) => void;
  coaches: Array<Coach>;
  establishments: ReadonlyArray<Establishment>;
  metaActivities: ImmutableObject<{ [key: number]: MetaActivity }>;
  setFilters: MarketplaceFiltersSetter;
  filters: any;
  forceDayDisplayOnly: boolean;
  onClickBook: (offer: OfferREST) => void;
  showOfferFilling: boolean;
  hideCoach: boolean;
  showOfferGender?: boolean;
  establishmentGroupList: Array<EstablishmentGroup>;
  showMultiLocalization: boolean;
  nextAvailableOffer?: Offer;
  goToFirstAvailableSession: () => void;
  getLevel: { [id: number]: Level };
  bookedOffers?: number[];
  t: TFunction;
  activeCustomLevels: Level[];
  theme: Theme;
  variant?: 'activityName' | 'coach' | 'time';
  groupSessionByPeriod: boolean;
  onSearch: (searchText: string) => void;
  onClearInput: () => void;
  isSearching: boolean;
  startWeekOnDaySelected?: boolean;
  isCardModeDisplay: boolean;
} & WithTranslation;

export const MarketplaceCalendar = (props: Props) => {
  const {
    onSelectDate,
    selectedDate,
    offers,
    coaches,
    metaActivities,
    loading,
    setFilters,
    filters,
    forceDayDisplayOnly,
    isCardModeDisplay,
    nextAvailableOffer,
    groupSessionByPeriod,
    onSearch,
    onClearInput,
    isSearching,
    startWeekOnDaySelected,
    theme,
  } = props;

  const offersByDay = useMemo(() => {
    return groupBy(offers, (offer) => {
      const date = DateTime.fromISO(offer.date_start);
      return date.toISODate() ?? 'invalid';
    });
  }, [offers]);

  const weekOffers = useMemo(() => {
    return getWeekOffers(selectedDate, offersByDay, {
      startWeekOnDaySelected,
    });
  }, [offersByDay, selectedDate, startWeekOnDaySelected]);

  const showDayParts =
    groupSessionByPeriod == null || groupSessionByPeriod === true;

  const noOfferDisplayed =
    !loading && !isSearching && (weekOffers?.flat() ?? []).length === 0;

  const renderNoOffer = () => {
    const offerDateStart = nextAvailableOffer?.date_start
      ? DateTime.fromISO(nextAvailableOffer?.date_start)
      : DateTime.now();
    const isOfferDateBeforeSelectedDate =
      offerDateStart.toSeconds() < selectedDate.toSeconds();

    return (
      <div className="bs-calendar--no-offer">
        {!nextAvailableOffer && (
          <div className="bs-calendar--no-offer--no-next">
            <EventBusyIcon className="bs-calendar--no-offer--no-next__icon" />
            <div className="bs-calendar--no-offer--no-next__text">
              {props.t('privateService:slotSearcher.emptyState')}
            </div>
          </div>
        )}
        {nextAvailableOffer && (
          <button
            className="bs-calendar--no-offer--yes-next"
            onClick={props.goToFirstAvailableSession}
            type="button"
          >
            <EventAvailableIcon className="bs-calendar--no-offer--yes-next__icon" />
            <div className="bs-calendar--no-offer--yes-next__text">
              {props.t(
                isOfferDateBeforeSelectedDate
                  ? 'privateService:slotSearcher.nextOffer'
                  : 'privateService:slotSearcher.previousOffer',
                {
                  date: (nextAvailableOffer?.date_start
                    ? DateTime.fromISO(nextAvailableOffer.date_start)
                    : DateTime.now()
                  ).toLocaleString(DateTime.DATE_SHORT),
                  hour: (nextAvailableOffer?.date_start
                    ? DateTime.fromISO(nextAvailableOffer.date_start)
                    : DateTime.now()
                  ).toLocaleString(DateTime.TIME_SIMPLE),
                },
              )}
            </div>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bs-calendar">
      {!forceDayDisplayOnly && (
        <div className="bs-calendar__datePicker">
          <MarketplaceDatePicker
            dateSelected={selectedDate}
            onSelect={onSelectDate}
            startWeekOnDaySelected={startWeekOnDaySelected}
          />
        </div>
      )}
      {!forceDayDisplayOnly && (
        <MarketplaceFilterComponent
          coachDisplay={theme?.coach_display}
          coaches={coaches}
          customLevels={props.activeCustomLevels}
          establishmentGroupList={props.establishmentGroupList}
          establishments={props.establishments}
          filters={filters}
          hideCoach={props.hideCoach}
          metaActivities={metaActivities}
          onClearInput={onClearInput}
          onSearch={onSearch}
          setFilters={setFilters}
          showMultiLocalization={props.showMultiLocalization}
          variant="activity"
        />
      )}
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <MarketplaceWeekTimetableV2
            bookedOffers={props.bookedOffers}
            coaches={props.coaches}
            date={selectedDate}
            establishments={props.establishments}
            forceDayDisplayOnly={forceDayDisplayOnly}
            genderCount={props.genderCount}
            getLevel={props.getLevel}
            group={props.group}
            hideCoach={props.hideCoach}
            isCardModeDisplay={isCardModeDisplay}
            isSearching={isSearching}
            metaActivities={metaActivities}
            offersByDay={offersByDay}
            onClickBook={props.onClickBook}
            onClickOffer={props.onClickOffer}
            onSelectDate={props.onSelectDate}
            showDayParts={showDayParts}
            showOfferFilling={props.showOfferFilling}
            showOfferGender={props.showOfferGender}
            startWeekOnDaySelected={startWeekOnDaySelected}
            theme={props.theme}
            variant={props.variant}
          />
          {noOfferDisplayed && renderNoOffer()}
        </>
      )}
    </div>
  );
};

export default withTranslation('privateService')(pure(MarketplaceCalendar));
