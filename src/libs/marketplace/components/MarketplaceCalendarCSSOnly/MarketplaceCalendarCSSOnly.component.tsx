// @ts-nocheck
import React, { useRef, useMemo } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import moment from 'moment-timezone';

import CircularProgress from '@material-ui/core/CircularProgress';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import { pure } from 'recompose';
import MarketplaceWeekTimetableV2 from '../MarketplaceWeekTimeTableCSSOnly/MarketplaceWeekTimeTableCSSOnly.component';
import MarketplaceFilterComponent from '../MarketplaceFilterCSSOnly/MarketplaceFilterCSSOnly.component';
import type {
  Establishment,
  EstablishmentGroup,
} from '../../../establishment/types';
import './MarketplaceCalendarCSSOnly.css';
import { Level } from '#libs/level/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Offer } from '#libs/offer/types';
import { Theme } from '#libs/theme/types';
import MarketplaceDatePicker from '../MarketplaceDatePicker';
import { MarketplaceCommonFilter } from '#libs/marketplace/types';
import { formatAsTime } from '../../../../utils/datetime';
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
  companyId: number;
  fetchAllOffers: (props: {
    company: number;
    min_date: string;
    max_date: string;
    filters?: Array<MarketplaceCommonFilter>;
  }) => void;
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
              {props.t('slotSearcher.emptyState')}
            </div>
          </div>
        )}
        {nextAvailableOffer && (
          <button
            type="button"
            onClick={props.goToFirstAvailableSession}
            className="bs-calendar--no-offer--yes-next"
          >
            <EventAvailableIcon className="bs-calendar--no-offer--yes-next__icon" />
            <div className="bs-calendar--no-offer--yes-next__text">
              {!moment(nextAvailableOffer.date_start).isBefore(
                moment(selectedDate),
              )
                ? props.t('slotSearcher.nextOffer', {
                    date: moment(nextAvailableOffer.date_start).format('L'),
                    hour: formatAsTime(nextAvailableOffer.date_start),
                  })
                : props.t('slotSearcher.previousOffer', {
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
    <div className="bs-calendar" ref={refContainer}>
      {!forceDayDisplayOnly && (
        <div className="bs-calendar__datePicker">
          <MarketplaceDatePicker
            dateSelected={selectedDate}
            companyId={props.companyId}
            onSelect={onSelectDate}
            offerFilters={filters}
            fetchAllOffers={props.fetchAllOffers}
            events={props.events}
          />
        </div>
      )}
      {!forceDayDisplayOnly && (
        <MarketplaceFilterComponent
          coaches={coaches}
          establishments={props.establishments}
          hideCoach={props.hideCoach}
          metaActivities={metaActivities}
          filters={filters}
          setFilters={setFilters}
          variant="activity"
          establishmentGroupList={props.establishmentGroupList}
          showMultiLocalization={props.showMultiLocalization}
          customLevels={props.activeCustomLevels}
        />
      )}
      {loading && <LoadingIndicator />}
      {!loading && (
        <>
          <MarketplaceWeekTimetableV2
            offers={offers}
            establishments={props.establishments}
            genderCount={props.genderCount}
            group={props.group}
            metaActivities={metaActivities}
            coaches={props.coaches}
            showOfferFilling={props.showOfferFilling}
            showOfferGender={props.showOfferGender}
            hideCoach={props.hideCoach}
            date={selectedDate}
            onClickOffer={props.onClickOffer}
            onClickBook={props.onClickBook}
            onClickBookOption={props.onClickBookOption}
            coachLoading={props.coachLoading}
            establishmentLoading={props.establishmentLoading}
            activityLoading={props.activityLoading}
            bookedOffers={props.bookedOffers}
            getLevel={props.getLevel}
            onSelectDate={props.onSelectDate}
            isCompact={isCompact}
            isLarge={isLarge}
            theme={props.theme}
            showDayParts={showDayParts}
            variant={props.variant}
            forceDayDisplayOnly={forceDayDisplayOnly}
          />
          {noOfferDisplayed && renderNoOffer()}
        </>
      )}
    </div>
  );
};

export default withTranslation('privateService')(pure(MarketplaceCalendar));
