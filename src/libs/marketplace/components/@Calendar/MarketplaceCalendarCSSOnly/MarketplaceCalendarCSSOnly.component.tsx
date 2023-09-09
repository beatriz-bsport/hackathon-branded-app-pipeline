// @ts-nocheck
import React, { useRef, useMemo } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import moment from 'moment-timezone';

import CircularProgress from '@material-ui/core/CircularProgress';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import { pure } from 'recompose';
import MarketplaceWeekTimetableV2 from '../MarketplaceWeekTimeTableCSSOnly/MarketplaceWeekTimeTableCSSOnly.component';
import MarketplaceFilterComponent from '../../@RessourceFilter/MarketplaceFilterCSSOnly/MarketplaceFilterCSSOnly.component';
import type {
  Establishment,
  EstablishmentGroup,
} from '../../../../establishment/types';
import './MarketplaceCalendarCSSOnly.css';
import { Level } from '#libs/level/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Offer } from '#libs/offer/types';
import { Theme } from '#libs/theme/types';
import MarketplaceDatePicker from '#libs/marketplace/components/@Date/MarketplaceDatePicker';
import { formatAsTime } from '../../../../../utils/datetime';
import { Coach } from '#libs/associated-coach/types';

const LoadingIndicator = () => (
  <div className="bs-calendar--loading">
    <CircularProgress />
  </div>
);

type Props = {
  onSelectDate: () => void;
  selectedDate: any;
  offers: Array<Offer>;
  genderCount: Object;
  group: Object;
  loading: boolean;
  onClickOffer: () => void;
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivities: { [key: number]: MetaActivity };
  setFilters: (any) => void;
  filters: any;
  forceDayDisplayOnly: boolean;
  compactMode: boolean;
  onClickBook: (offer: Offer) => void;
  onClickBookOption: (offer: Offer) => void;
  showOfferFilling: boolean;
  hideCoach: boolean;
  activityLoading: boolean;
  coachLoading: boolean;
  establishmentLoading: boolean;
  showOfferGender?: boolean;
  establishmentGroupList: Array<EstablishmentGroup>;
  showMultiLocalization: boolean;
  nextAvailableOffer: Offer;
  goToFirstAvailableSession: () => void;
  getLevel: { [id: number]: Level };
  bookedOffers?: number[];
  t: TFunction;
  activeCustomLevels: Level[];
  theme: Theme;
  variant?: 'activityName' | 'coach' | 'time';
  groupSessionByPeriod: boolean;
  events: Array<Event>;
  onSearch: (searchText: string) => void;
  onClearInput: () => void;
  searchedOffers: Offer[];
};

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
    compactMode = null,
    nextAvailableOffer,
    groupSessionByPeriod,
    onSearch,
    onClearInput,
    searchedOffers,
  } = props;

  const weekOffers = useMemo(
    () =>
      offers.filter((offer) =>
        moment(offer.date_start).isSame(selectedDate, 'week'),
      ),
    [offers, selectedDate],
  );
  const refContainer = useRef(null);

  const showDayParts =
    groupSessionByPeriod == null || groupSessionByPeriod === true;

  const noOfferDisplayed = !loading && weekOffers.length === 0;
  // compact calendar
  const isCompact =
    (compactMode !== null && compactMode === true) ||
    (compactMode === null &&
      (refContainer?.current?.clientWidth ?? 1200) < 1250);

  // large calendar
  const isLarge =
    (compactMode != null && compactMode === false) ||
    (compactMode == null &&
      !((refContainer?.current?.clientWidth ?? 1240) < 1250));

  const renderNoOffer = () => {
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
              {!moment(nextAvailableOffer.date_start).isBefore(
                moment(selectedDate),
              )
                ? props.t('privateService:slotSearcher.nextOffer', {
                    date: moment(nextAvailableOffer.date_start).format('L'),
                    hour: formatAsTime(nextAvailableOffer.date_start),
                  })
                : props.t('privateService:slotSearcher.previousOffer', {
                    date: moment(nextAvailableOffer.date_start).format('L'),
                    hour: formatAsTime(nextAvailableOffer.date_start),
                  })}
            </div>
          </button>
        )}
      </div>
    );
  };

  return (
    <div ref={refContainer} className="bs-calendar">
      {!forceDayDisplayOnly && (
        <div className="bs-calendar__datePicker">
          <MarketplaceDatePicker
            dateSelected={selectedDate}
            events={props.events}
            offerFilters={filters}
            onSelect={onSelectDate}
          />
        </div>
      )}
      {!forceDayDisplayOnly && (
        <MarketplaceFilterComponent
          coaches={coaches}
          customLevels={props.activeCustomLevels}
          establishmentGroupList={props.establishmentGroupList}
          establishments={props.establishments}
          filters={filters}
          hideCoach={props.hideCoach}
          metaActivities={metaActivities}
          offers={offers}
          onClearInput={onClearInput}
          onSearch={onSearch}
          setFilters={setFilters}
          showMultiLocalization={props.showMultiLocalization}
          variant="activity"
        />
      )}
      {loading && <LoadingIndicator />}
      {!loading && (
        <>
          <MarketplaceWeekTimetableV2
            activityLoading={props.activityLoading}
            bookedOffers={props.bookedOffers}
            coaches={props.coaches}
            coachLoading={props.coachLoading}
            date={selectedDate}
            establishmentLoading={props.establishmentLoading}
            establishments={props.establishments}
            forceDayDisplayOnly={forceDayDisplayOnly}
            genderCount={props.genderCount}
            getLevel={props.getLevel}
            group={props.group}
            hideCoach={props.hideCoach}
            isCompact={isCompact}
            isLarge={isLarge}
            metaActivities={metaActivities}
            offers={offers}
            onClickBook={props.onClickBook}
            onClickBookOption={props.onClickBookOption}
            onClickOffer={props.onClickOffer}
            onSelectDate={props.onSelectDate}
            searchedOffers={searchedOffers}
            showDayParts={showDayParts}
            showOfferFilling={props.showOfferFilling}
            showOfferGender={props.showOfferGender}
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
