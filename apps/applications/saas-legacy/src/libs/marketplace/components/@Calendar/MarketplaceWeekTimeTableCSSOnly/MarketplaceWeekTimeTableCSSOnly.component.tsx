import React, { PureComponent } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
// @ts-expect-error
import { withTranslation, TFunction, WithTranslation } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import flattenDeep from 'lodash/flattenDeep';
import { DateTime } from 'luxon';
import memoize from 'memoize-one';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {
  formatAsDateWithWeekday,
  formatWeekDay,
  getLocaleWeekdays,
} from '#src/utils/datetime';
import MarketPlaceCardOfferV2 from '#src/libs/marketplace/components/@Offer/MarketplaceCardOfferCSSOnly';
import MarketPlaceOfferListItemComponent from '#src/libs/marketplace/components/@Offer/MarketplaceOfferListItemCSSOnly';
import { OfferREST } from '#src/libs/offer/types';
import { Level } from '#src/libs/level/types';
import { Theme } from '#src/libs/theme/types';
import { generateUniqueOfferIdentifier } from '#src/libs/marketplace/components/@Offer/utils';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Establishment } from '#src/libs/establishment/types';
import { Coach } from '#src/libs/associated-coach/types';

import {
  isOfferInThePast,
  isOfferInGroupLockedByPreviousOfferInPast,
} from '#src/libs/marketplace/utils';
import './MarketplaceWeekTimeTableCSSOnly.css';
import { ImmutableObject } from 'seamless-immutable';

const SPLIT_AFTERNOON = 12;
const SPLIT_EVENNING = 17;
const DAY_PARTS = ['morning', 'afternoon', 'evening'];

export type Props = {
  loading?: boolean;
  onClickOffer: (id: number) => void;
  onClickBook: (offer: OfferREST) => void;
  getLevel: { [id: number]: Level };
  date: DateTime;
  t: TFunction;
  showOfferFilling: boolean;
  hideCoach: boolean;
  offersByDay: { [key: string]: Array<OfferREST> };
  establishments: ReadonlyArray<Establishment>;
  genderCount: Object;
  group: Object;
  metaActivities: ImmutableObject<{ [key: number]: MetaActivity }>;
  coaches: Array<Coach>;
  showOfferGender?: boolean;
  bookedOffers?: number[];
  onSelectDate: (date: string) => void;
  isCardModeDisplay: boolean;
  theme: Theme;
  variant?: 'activityName' | 'coach' | 'time';
  showDayParts: boolean;
  forceDayDisplayOnly: boolean;
  isSearching: boolean;
  startWeekOnDaySelected?: boolean;
} & WithTranslation;

type State = {
  panelsStatus: Array<boolean>;
};

export const getWeekOffers = (
  selectedDate: DateTime,
  offersByDay: { [key: string]: Array<OfferREST> },
  themeOptions?: { startWeekOnDaySelected?: boolean },
) => {
  const date_start = themeOptions?.startWeekOnDaySelected
    ? selectedDate
    : selectedDate.startOf('week', {
        useLocaleWeeks: true,
      });
  // split offers per week days
  return [...Array(7)].map((_: any, i) => {
    const currentDate = date_start.plus({ days: i });
    return offersByDay[currentDate.toISODate() ?? 'invalid'] ?? [];
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
      // @ts-expect-error
      changeStatus: !prevState.changeStatus,
    }));
  };

  handleBook = (offer: OfferREST) => () => {
    this.props.onClickBook(offer);
  };

  getEstablishment = memoize(
    (establishments: ReadonlyArray<Establishment>, establishmentId: number) =>
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
  getOffersByPeriod = memoize(
    (
      date: DateTime,
      offersByDay: { [key: string]: Array<OfferREST> },
      startWeekOnDaySelected: boolean,
    ) => {
      const morning: Array<Array<OfferREST>> = [];
      const afternoon: Array<Array<OfferREST>> = [];
      const evening: Array<Array<OfferREST>> = [];
      const weekOffers = getWeekOffers(date, offersByDay, {
        startWeekOnDaySelected,
      });
      (weekOffers ?? []).map((dayOffers: Array<OfferREST>, i) => {
        morning[i] = dayOffers.filter(
          (offer: OfferREST) =>
            DateTime.fromISO(offer.date_start).hour < SPLIT_AFTERNOON,
        );

        afternoon[i] = dayOffers.filter((offer: OfferREST) => {
          const offerStarHour = DateTime.fromISO(offer.date_start).hour;
          return (
            offerStarHour >= SPLIT_AFTERNOON && offerStarHour < SPLIT_EVENNING
          );
        });
        evening[i] = dayOffers.filter(
          (offer: OfferREST) =>
            DateTime.fromISO(offer.date_start).hour >= SPLIT_EVENNING,
        );
        return true;
      });
      return [morning, afternoon, evening];
    },
  );

  getOffersByDay = memoize(
    (date: DateTime, offersByDay: Record<string, Array<OfferREST>>) => {
      return offersByDay[date.toISODate() ?? 'invalid'] ?? [];
    },
  );

  /**
   * function that split each period offers by row
   */
  periodByRow = memoize((period: any) => {
    const rows = [];
    // @ts-expect-error
    const maxLength = Math.max(...period.map((os) => os.length));
    for (let i = 0; i < maxLength; i += 1) {
      // @ts-expect-error
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

  renderOffersRows = (offersRows: Array<Array<OfferREST>>) => {
    return (
      <>
        {offersRows.map((row, idx) => (
          <React.Fragment key={`row-${row?.[0]?.id ?? idx}`}>
            {row.map((o: OfferREST, index) => {
              // @ts-expect-error
              const groupData = this.props.group?.[o?.group];
              if (o === undefined) {
                return (
                  <div
                    key={`u_${index}`}
                    className="bs-week__cardMode__offerRow__item"
                  />
                );
              }
              const cardOfferId = generateUniqueOfferIdentifier(
                o,
                'bs-week__cardMode__offerRow__item',
              );

              return (
                <div
                  key={`offer-wrapper-${o.id}`}
                  className="bs-week__cardMode__offerRow__offer-wrapper"
                  id={cardOfferId}
                >
                  <MarketPlaceCardOfferV2
                    key={o.id}
                    coaches={this.props.coaches}
                    establishments={this.props.establishments}
                    genderCount={this.props.genderCount}
                    getLevel={this.props.getLevel}
                    group={groupData}
                    hideCoach={this.props.hideCoach}
                    isBookingDisabled={
                      !o.available ||
                      isOfferInThePast(o) ||
                      // @ts-expect-error
                      isOfferInGroupLockedByPreviousOfferInPast(o, groupData)
                    }
                    isOfferPassed={
                      isOfferInThePast(o) ||
                      // @ts-expect-error
                      isOfferInGroupLockedByPreviousOfferInPast(o, groupData)
                    }
                    isRegistered={this.props.bookedOffers?.includes(o?.id)}
                    metaActivities={this.props.metaActivities}
                    offer={o}
                    onClickBook={this.props.onClickBook}
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

  renderOffersCardVersion = (
    periodOffers: Array<Array<Array<OfferREST>>>,
    offersByDay: Record<string, Array<OfferREST>>,
  ) => {
    const weekOffers = getWeekOffers(this.props.date, offersByDay, {
      startWeekOnDaySelected: this.props.startWeekOnDaySelected,
    });
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

  renderDayOffersListVersion = (
    main_date: DateTime,
    offersByDay: Record<string, Array<OfferREST>>,
  ) => {
    const day_offers = this.getOffersByDay(main_date, offersByDay);
    const mainDateFormated = formatAsDateWithWeekday(
      main_date,
      this.props.theme,
      'dd MMMM',
    );

    const isToday = main_date.hasSame(DateTime.now(), 'day');

    return (
      <div className="bs-week__listMode__content__day">
        <div
          className={clsx('bs-week__listMode__content__day__date', {
            'bs-week__listMode__content__day__date--is-today': isToday,
          })}
        >
          {mainDateFormated}
        </div>

        <div className="bs-week__listMode__content__day__offers">
          {day_offers.map((offer: OfferREST, index: number) => {
            const establishments = this.props.establishments;
            const coaches = this.props.coaches;
            const position = [];
            if (index === 0) {
              position.push('first');
            }
            if (index === day_offers.length - 1) {
              position.push('last');
            }
            // @ts-expect-error
            const genderData = this.props.genderCount[offer.id];
            // @ts-expect-error
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

            return (
              <MarketPlaceOfferListItemComponent
                key={`list-item-${offer.id}`}
                coach={coachData}
                establishment={establishment}
                genderCount={genderData}
                getLevel={this.props.getLevel}
                group={groupData}
                hideCoach={this.props.hideCoach}
                isBookingDisabled={!offer.available || isOfferInThePast(offer)}
                isCardModeDisplay={this.props.isCardModeDisplay}
                isOfferPassed={
                  isOfferInThePast(offer) ||
                  // @ts-expect-error
                  isOfferInGroupLockedByPreviousOfferInPast(offer, groupData)
                }
                isRegistered={this.props.bookedOffers?.includes(offer?.id)}
                metaActivity={metaActivity}
                offer={offer}
                onBook={this.handleBook(offer)}
                onClick={this.props.onClickOffer}
                // @ts-expect-error
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

  render() {
    const { loading, date, isCardModeDisplay, offersByDay } = this.props;

    if (
      this.props.isSearching &&
      Object.values(offersByDay).flat().length === 0
    ) {
      return (
        <div className="bs-week__search__noResult">
          {this.props.t('search:noResult')}
        </div>
      );
    }

    const weekDays = getLocaleWeekdays('short');
    const periodOffers = this.getOffersByPeriod(
      date,
      offersByDay,
      !!this.props.startWeekOnDaySelected,
    );
    const start_date = this.props.startWeekOnDaySelected
      ? date
      : date.startOf('week', {
          useLocaleWeeks: true,
        });
    const main_date = date;
    const bs_week = clsx({
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
              const currentDate = start_date.plus({ days: i });
              const isSelectedDate =
                currentDate.day === main_date.day && !isCardModeDisplay;
              const isToday = currentDate.day === DateTime.now().day;
              return (
                <button
                  key={`weekDay-${i}`}
                  className={clsx({
                    'bs-week__header__date--is-disabled': isCardModeDisplay,
                    'bs-week__header__date--is-abled': !isCardModeDisplay,
                  })}
                  disabled={isCardModeDisplay}
                  onClick={() =>
                    this.props.onSelectDate(currentDate.toISODate())
                  }
                  type="button"
                >
                  <div
                    className={clsx({
                      'bs-week__header__date__weekDay': true,
                      'bs-week__header__date__weekDay--is-today': isToday,
                      'bs-week__header__date__weekDay--is-selected':
                        isSelectedDate || (isToday && isCardModeDisplay),
                    })}
                  >
                    {window.innerWidth < 500
                      ? currentDate.toFormat('ccc')
                      : formatWeekDay(
                          currentDate.toFormat('EEEE'),
                          this.props.theme,
                        )}
                  </div>
                  <div
                    className={clsx('bs-week__header__date__monthDay', {
                      'bs-week__header__date__monthDay--is-today': isToday,
                      'bs-week__header__date__monthDay--is-selected':
                        isSelectedDate || (isToday && isCardModeDisplay),
                    })}
                  >
                    {`${currentDate.toFormat('d')}`}
                  </div>
                  {!isCardModeDisplay && (
                    <div className="bs-week__header__date__dots">
                      {this.getOffersByDay(currentDate, offersByDay)
                        .slice(0, 3)
                        .map((offer: OfferREST, j: number) => (
                          <div key={`dots-${j}_${offer.id}`}> • </div>
                        ))}
                    </div>
                  )}
                </button>
              );
            })}
          </>
        )}
        {!isCardModeDisplay || this.props.forceDayDisplayOnly ? (
          <div className="bs-week__listMode__content">
            {this.renderDayOffersListVersion(main_date, offersByDay)}
          </div>
        ) : (
          this.renderOffersCardVersion(periodOffers, offersByDay)
        )}
      </div>
    );
  }
}

export default withTranslation()(MarketplaceWeekTimetable);
