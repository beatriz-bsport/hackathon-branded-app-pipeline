// @ts-nocheck
// @flow

import React, { PureComponent } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTranslation, TFunction } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import flattenDeep from 'lodash/flattenDeep';
import moment from 'moment-timezone';
import memoize from 'memoize-one';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {
  DATE_FORMAT,
  formatAsDateWithWeekday,
  formatWeekDay,
} from '../../../../../utils/datetime';
import { Moment } from '../../../../../i18n';
import MarketPlaceCardOfferV2 from '#marketplacecomponents/@Offer/MarketplaceCardOfferCSSOnly';
import './MarketplaceWeekTimeTableCSSOnly.css';
import MarketPlaceOfferListItemComponent from '#marketplacecomponents/@Offer/MarketplaceOfferListItemCSSOnly';
import { Offer_FULL, Offer } from '#libs/offer/types';
import { Level } from '#libs/level/types';
import { Theme } from '#libs/theme/types';
import {
  isOfferInThePast,
  firstOfferInGroupLocksBookingBecauseInPast,
} from '../../../utils';
import { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { Coach } from '#libs/associated-coach/types';

const SPLIT_AFTERNOON = 12;
const SPLIT_EVENNING = 17;
const DAY_PARTS = ['morning', 'afternoon', 'evening'];
export type Props = {
  loading: boolean;
  onClickOffer: () => void;
  onClickBook: (offer: Offer_FULL) => void;
  onClickBookOption: (offer: Offer_FULL) => void;
  getLevel: { [id: number]: Level };
  date: string;
  t: TFunction;
  showOfferFilling: boolean;
  hideCoach: boolean;
  activityLoading: boolean;
  coachLoading: boolean;
  establishmentLoading: boolean;
  offers: Array<Offer>;
  establishments: Array<Establishment>;
  genderCount: Object;
  group: Object;
  metaActivities: Array<MetaActivity>;
  coaches: Array<Coach>;
  showOfferGender?: boolean;
  bookedOffers?: number[];
  onSelectDate: (date: string) => void;
  isCompact: boolean;
  isLarge: boolean;
  theme: Theme;
  variant?: 'activityName' | 'coach' | 'time';
  showDayParts: boolean;
  forceDayDisplayOnly: boolean;
  searchedOffers: Offer[] | null;
};

type State = {
  panelsStatus: Array<boolean>;
};

const getWeekOffers = (selectedDate: string, offers: Array<Offer>) => {
  const date_start = Moment(selectedDate, DATE_FORMAT).clone().startOf('week');
  const weekdays = Moment.weekdays(true);
  // split offers par week days
  return weekdays.map((_: any, i) => {
    const currentDate = Moment(date_start).add(i, 'days');
    return offers.filter(
      (o) =>
        currentDate.weekday() === i &&
        Moment(o.date_start).isSame(currentDate, 'day'),
    );
  });
};

export class MarketplaceWeekTimetable extends PureComponent<Props, State> {
  state = {
    panelsStatus: [true, true, true],
    changeStatus: false,
  };

  handlePanelCollapse = (i: number) => () => {
    const { panelsStatus } = this.state;
    panelsStatus[i] = !panelsStatus[i];
    this.setState((prevState) => ({
      panelsStatus,
      changeStatus: !prevState.changeStatus,
    }));
  };

  handleBook = (offer: Offer) => () => {
    this.props.onClickBook(offer);
  };

  handleBookOption = (offer: Offer) => () => {
    this.props.onClickBookOption(offer);
  };

  getEstablishment = memoize(
    (establishments: Array<Establishment>, establishmentId: number) =>
      establishments
        ? establishments.find((est) => est.id === establishmentId)
        : undefined,
  );

  getCoach = memoize((coaches: Array<Coach>, coachId: number) =>
    coaches ? coaches.find((c) => c.id === coachId) : undefined,
  );

  /**
   * function that split offers into day periods [morning, afternoon, evening]
   */

  getOffersByPeriod = memoize((date: string, offers: Array<Offer>) => {
    const morning: Array<Array<Offer>> = [];
    const afternoon: Array<Array<Offer>> = [];
    const evening: Array<Array<Offer>> = [];
    const weekOffers = getWeekOffers(date, offers);
    (weekOffers || []).map((dayOffers: Array<Offer>, i) => {
      morning[i] = dayOffers.filter(
        (offer: Offer) =>
          Moment(offer.date_start).format('HH') < SPLIT_AFTERNOON,
      );

      afternoon[i] = dayOffers.filter((offer: Offer) => {
        const offerStarHour = Moment(offer.date_start).format('HH');
        return (
          offerStarHour >= SPLIT_AFTERNOON && offerStarHour < SPLIT_EVENNING
        );
      });
      evening[i] = dayOffers.filter(
        (offer: Offer) =>
          Moment(offer.date_start).format('HH') >= SPLIT_EVENNING,
      );
      return true;
    });
    return [morning, afternoon, evening];
  });

  getOffersByDay = memoize((date: string, offers: Array<Offer>) => {
    const day_offers = offers.filter((offer) => {
      return moment(offer.date_start).isSame(date, 'day');
    });
    return day_offers;
  });

  /**
   * function that split each period offers by row
   */
  periodByRow = memoize((period: any) => {
    const rows = [];

    const maxLength = Math.max(...period.map((os) => os.length));
    for (let i = 0; i < maxLength; i += 1) {
      // eslint-disable-next-line no-loop-func
      rows[i] = period.map((os) => os[i]);
    }
    return rows;
  });

  /**
   * function that render offers by period
   */
  renderPeriodOffersCardVersion = (period: any[], i: number) => {
    const { t } = this.props;
    const { panelsStatus } = this.state;
    const offersRows = this.periodByRow(period);

    return flattenDeep(period).length ? (
      <React.Fragment key={DAY_PARTS[i]}>
        <div className="bs-week__cardMode__period">
          <IconButton
            className="bs-week__cardMode__period__button"
            onClick={this.handlePanelCollapse(i)}
          >
            {panelsStatus[i] ? <ExpandLess /> : <ExpandMore />}
            <p className="bs-week__cardMode__dayPart">
              {t(`translation:dayParts.${DAY_PARTS[i]}`)}
            </p>
          </IconButton>
        </div>

        <Collapse
          unmountOnExit
          className="bs-week__cardMode__sessionsGroup"
          in={panelsStatus[i]}
          timeout="auto"
        >
          <div className="bs-week__cardMode__sessionsGroup__inner">
            {this.renderOffersRows(offersRows)}
          </div>
        </Collapse>
      </React.Fragment>
    ) : null;
  };

  renderOffersRows = (offersRows: Array<Array<Offer>>) => {
    return (
      <>
        {offersRows.map((row, idx) => (
          <React.Fragment key={`row-${row?.[0]?.id ?? idx}`}>
            {row.map((o: Offer, index) => {
              const groupData = this.props.group?.[o?.group];
              if (o === undefined) {
                return (
                  <div
                    key={`u_${index}`}
                    className="bs-week__cardMode__offerRow__item"
                  />
                );
              }
              return (
                <div className="bs-week__cardMode__offerRow__offer-wrapper">
                  <MarketPlaceCardOfferV2
                    key={o.id}
                    activityLoading={this.props.activityLoading}
                    coach={o.coach_override || o.coach}
                    coaches={this.props.coaches}
                    establishmentLoading={this.props.establishmentLoading}
                    establishments={this.props.establishments}
                    genderCount={this.props.genderCount}
                    getLevel={this.props.getLevel}
                    group={groupData}
                    hideCoach={this.props.hideCoach}
                    isBookingDisabled={
                      !o.available ||
                      isOfferInThePast(o) ||
                      firstOfferInGroupLocksBookingBecauseInPast(o, groupData)
                    }
                    isOfferPassed={
                      isOfferInThePast(o) ||
                      firstOfferInGroupLocksBookingBecauseInPast(o, groupData)
                    }
                    isRegistered={this.props.bookedOffers?.includes(o?.id)}
                    metaActivities={this.props.metaActivities}
                    offer={o}
                    onClickBook={this.props.onClickBook}
                    onClickBookOption={this.props.onClickBookOption}
                    onClickOffer={this.props.onClickOffer}
                    showOfferFilling={this.props.showOfferFilling}
                    showOfferGender={this.props.showOfferGender}
                    theme={this.props.theme}
                    variant={this.props.variant}
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </>
    );
  };

  renderOffersCardVersion = (periodOffers: Array<Array<Array<Offer>>>) => {
    const weekOffers = getWeekOffers(this.props.date, this.props.offers);
    const offersRows = this.periodByRow(weekOffers);

    return (
      <>
        {!this.props.showDayParts
          ? this.renderOffersRows(offersRows)
          : periodOffers.map((period, i) =>
              this.renderPeriodOffersCardVersion(period, i),
            )}
      </>
    );
  };

  renderDayOffersListVersion = (main_date: string, offers: Array<Offer>) => {
    const { t } = this.props;
    const day_offers = this.getOffersByDay(main_date, offers);
    const mainDateFormated = formatAsDateWithWeekday(
      main_date,
      this.props.theme,
      t,
      'DD MMMM',
    );

    return (
      <div className="bs-week__listMode__content__day">
        <div className="bs-week__listMode__content__day__date">
          {mainDateFormated}
        </div>

        <div className="bs-week__listMode__content__day__offers">
          {day_offers.map((offer: Offer, index: number) => {
            const establishments = this.props.establishments;
            const coaches = this.props.coaches;
            const position = [];
            if (index === 0) {
              position.push('first');
            }
            if (index === day_offers.length - 1) {
              position.push('last');
            }
            const genderData = this.props.genderCount[offer.id];
            const groupData = this.props.group[offer.group];

            const establishment = this.getEstablishment(
              establishments,
              offer.establishment,
            );

            const metaActivity = this.props.metaActivities
              ? this.props.metaActivities[offer.meta_activity]
              : undefined;

            const offerCoachId = offer.coach_override
              ? offer.coach_override
              : offer.coach;

            const coachData = this.getCoach(coaches, offerCoachId);

            const additionalCoachesData = offer.additional_coaches.map(
              (coachId) => this.getCoach(coaches, coachId),
            );

            return (
              <MarketPlaceOfferListItemComponent
                key={`list-item-${offer.id}`}
                additionalCoaches={additionalCoachesData}
                coach={coachData}
                establishment={establishment}
                genderCount={genderData}
                getLevel={this.props.getLevel}
                group={groupData}
                hideCoach={this.props.hideCoach}
                isBookingDisabled={!offer.available || isOfferInThePast(offer)}
                isOfferPassed={
                  isOfferInThePast(offer) ||
                  firstOfferInGroupLocksBookingBecauseInPast(offer, groupData)
                }
                isRegistered={this.props.bookedOffers?.includes(offer?.id)}
                metaActivity={metaActivity}
                offer={offer}
                onBook={this.handleBook(offer)}
                onBookOption={this.handleBookOption(offer)}
                onClick={this.props.onClickOffer}
                position={position}
                showOfferFilling={this.props.showOfferFilling}
                showOfferGender={this.props.showOfferGender}
                theme={this.props.theme}
                variant={this.props.variant}
              />
            );
          })}
        </div>
      </div>
    );
  };

  renderNextDaysOffersListVersion = (
    main_date: string,
    offers: Array<Offer>,
  ) => {
    const next_days = [this.props.forceDayDisplayOnly ? moment() : main_date];
    let next_day = moment(main_date).add(1, 'days');
    while (
      moment(next_day).isSame(moment(main_date), 'week') &&
      !this.props.forceDayDisplayOnly
    ) {
      next_days.push(next_day.format('YYYY-MM-DD'));
      next_day = moment(next_day).add(1, 'days');
    }

    return (
      <div className="bs-week__listMode__content">
        {next_days
          .filter((day) => this.getOffersByDay(day, offers).length > 0)
          .map((day) => (
            <React.Fragment key={`day-${day}`}>
              {this.renderDayOffersListVersion(day, offers)}
            </React.Fragment>
          ))}
      </div>
    );
  };

  render() {
    const { loading, date } = this.props;

    if (this.props.searchedOffers && !this.props.searchedOffers.length) {
      return (
        <div className="bs-week__search__noResult">
          {this.props.t('search:noResult')}
        </div>
      );
    }

    const offers = this.props.searchedOffers
      ? this.props.searchedOffers
      : this.props.offers;

    const weekDays = Moment.weekdaysShort(true);
    const periodOffers = this.getOffersByPeriod(date, offers);
    const start_date = moment(date, DATE_FORMAT).clone().startOf('week');
    const main_date = moment(date).clone();
    const isCardModeDisplay = !(this.props.isCompact && !this.props.isLarge);
    const bs_week = classNames({
      'bs-week-card': isCardModeDisplay,
      'bs-week-list': !isCardModeDisplay,
    });

    if (loading) {
      return <CircularProgress />;
    }

    return (
      <div className={bs_week}>
        {!this.props.forceDayDisplayOnly && (
          <>
            {weekDays.map((_: any, i: number) => {
              const currentDate = start_date.clone().add(i, 'days');
              const isSelectedDate =
                currentDate.isSame(main_date, 'day') && !isCardModeDisplay;
              const isToday = currentDate.isSame(moment(), 'day');
              return (
                <button
                  key={`weekDay-${i}`}
                  className={classNames({
                    'bs-week__header__date--is-disabled': isCardModeDisplay,
                    'bs-week__header__date--is-abled': !isCardModeDisplay,
                  })}
                  disabled={isCardModeDisplay}
                  onClick={() =>
                    this.props.onSelectDate(currentDate.format('YYYY-MM-DD'))
                  }
                  type="button"
                >
                  <div
                    className={classNames({
                      'bs-week__header__date__weekDay': true,
                      'bs-week__header__date__weekDay--is-today': isToday,
                      'bs-week__header__date__weekDay--is-selected':
                        isSelectedDate || (isToday && isCardModeDisplay),
                    })}
                  >
                    {window.innerWidth < 500
                      ? currentDate.format('dd')
                      : formatWeekDay(
                          currentDate.format('dddd'),
                          this.props.theme,
                        )}
                  </div>
                  <div
                    className={classNames('bs-week__header__date__monthDay', {
                      'bs-week__header__date__monthDay--is-today':
                        isToday && !isSelectedDate,
                      'bs-week__header__date__monthDay--is-selected':
                        isSelectedDate,
                    })}
                  >
                    {`${currentDate.format('DD')}`}
                  </div>
                  {!isCardModeDisplay && (
                    <div className="bs-week__header__date__dots">
                      {this.getOffersByDay(
                        currentDate.format('YYYY-MM-DD'),
                        offers,
                      )
                        .slice(0, 3)
                        .map((offer: Offer, j: number) => (
                          <div key={`dots-${j}_${offer.id}`}> • </div>
                        ))}
                    </div>
                  )}
                </button>
              );
            })}
          </>
        )}
        {!isCardModeDisplay || this.props.forceDayDisplayOnly
          ? this.renderNextDaysOffersListVersion(
              main_date.format('YYYY-MM-DD'),
              offers,
            )
          : this.renderOffersCardVersion(periodOffers)}
      </div>
    );
  }
}

export default withTranslation()(MarketplaceWeekTimetable);
