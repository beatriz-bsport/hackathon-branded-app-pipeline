import React, { useCallback } from 'react';
import InfoIcon from '@material-ui/icons/Info';
import GroupIcon from '@material-ui/icons/Group';
import clsx from 'clsx';
import { DateTime } from 'luxon';

import Skeleton from '@material-ui/lab/Skeleton';
import RoomIcon from '@material-ui/icons/Room';

import { useTranslation } from 'react-i18next';
import MaleIcon from '#src/components/icons/MaleIcon.component';
import FemaleIcon from '#src/components/icons/FemaleIcon.component';

import { OfferREST } from '#src/libs/offer/types';
import { Coach } from '#src/libs/associated-coach/types';
import { CompanyTheme } from '#src/libs/theme/types';
import { Establishment } from '#src/libs/establishment/types';

import { useOfferHours } from '#src/libs/marketplace/hooks';

import MarketplaceBookButton from '#src/libs/marketplace/components/@Booking/MarketplaceBookButton';
import { MetaActivity } from '#src/libs/meta-activity/types';
import MarketPlaceLevel from '#src/libs/marketplace/components/@Offer/MarketplaceLevelCSSOnly';
import MarketplaceBroadcast from '#src/libs/marketplace/components/@Broadcast/MarketplaceBroadcastCSSOnly';
import type { MarketplaceCalendarVariant } from '#src/libs/marketplace/types';
import {
  AVAILABLE_BOOKING_ELEMENTS_IDS,
  MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER,
  OFFER_HOURS_SEPARATOR,
} from '#src/libs/marketplace/constants';
import { Level } from '#src/libs/level/types';

import MarketplaceCoachInfos from '#src/libs/marketplace/components/@Coach/MarketplaceCoachInfos';
import MarketplaceEstablishmentTitle from '#src/libs/marketplace/components/@Establishment/MarketplaceEstablishmentTitle';

import PopOver from '#src/components/Popover';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { generateUniqueOfferIdentifier } from '#src/libs/marketplace/components/@Offer/utils';
import { formatAsDateWithWeekday, getUserZone } from '#src/utils/datetime';
import MarketplaceOfferStatusChip from '../MarketplaceOfferStatusChip';

import './MarketplaceOfferListItemCSSOnly.css';
import OfferPriceTag from '#src/components/css-only/OfferPriceTag';
import analyticsUtils from '#src/components/analytics/analytics';

export const DISABLE_BOOKING_ELEMENTS_IDS = [
  'book-button--disabled',
  'book-button__inner--disabled',
  'book-button__inner__text--disabled',
];

export type Props = {
  showOfferFilling: boolean;
  offer: OfferREST;
  genderCount: Object;
  metaActivity: MetaActivity;
  variant?: MarketplaceCalendarVariant;
  theme: CompanyTheme;
  hideCoach: boolean;
  loading: boolean;
  onClick: (id: number) => void;
  onBook: (id: number) => void;
  establishment: Establishment;
  coach: Coach;
  withoutCTA: boolean;
  isRegistered?: boolean;
  showOfferGender: boolean;
  getLevel: { [id: number]: Level };
  isBookingDisabled: boolean;
  isWorkshop?: boolean;
  showDate?: boolean;
  withoutBookButton?: boolean;
  position: ('first' | 'last')[];
  isOfferPassed: boolean;
  isCardModeDisplay?: boolean;
};

type OfferDateAndHoursProps = {
  offerHours: {
    startTime: string;
    endTimeOrDuration: string;
  };
  date: string;
  showDate: boolean;
};

const OfferDateAndHours: React.FC<OfferDateAndHoursProps> = ({
  offerHours,
  date,
  showDate,
}) => (
  <div className="bs-offer-list-item__content__time__offer-hours">
    {showDate && (
      <div
        className="bs-offer-list-item__content__time__offer-hours__date"
        id="bs-offer-list-item-date"
      >
        {date}
      </div>
    )}
    <div
      className="bs-offer-list-item__content__time__offer-hours__start-time"
      id="bs-offer-list-item-start-time"
    >
      {offerHours.startTime}
    </div>
    {offerHours.endTimeOrDuration && (
      <div
        className="bs-offer-list-item__content__time__offer-hours__time-separator"
        id="bs-offer-list-item-time-separator"
      >
        {OFFER_HOURS_SEPARATOR}
      </div>
    )}
    {offerHours.endTimeOrDuration && (
      <div
        className="bs-offer-list-item__content__time__offer-hours__end-time-duration"
        id="bs-offer-list-item-end-time-duration"
      >
        {offerHours.endTimeOrDuration}
      </div>
    )}
  </div>
);

const MarketplaceOfferListItem: React.FC<Props> = ({
  offer,
  theme,
  loading,
  showOfferFilling,
  hideCoach,
  onClick,
  // onBookOption,
  onBook,
  coach,
  genderCount,
  establishment,
  metaActivity,
  withoutCTA = false,
  isRegistered = false,
  getLevel,
  showOfferGender,
  variant = 'activityName',
  isBookingDisabled,
  isWorkshop,
  showDate,
  position = [],
  withoutBookButton,
  isOfferPassed,
  isCardModeDisplay,
}) => {
  const { t } = useTranslation(['datetime', 'translation']);
  const isMobile = !isCardModeDisplay;

  const isVariantTimeHighlighted = variant === 'time';
  const isVariantCoachHighlighted = variant === 'coach';

  const offerHours = useOfferHours(offer, establishment, metaActivity, theme);

  const isListItemDisabled =
    (theme?.hide_book_button && isOfferPassed) ||
    (!theme?.hide_book_button && isBookingDisabled);

  const handleClickOnHiddenBookButton = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (
        event.currentTarget.classList.contains(
          MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER,
        )
      ) {
        event.stopPropagation();
        onClick(offer?.id);
      } else {
        handleBook();
        // TODO : fix handleBookOption, we have two handlers that were basically doing the same thing.
        // BUT handleBookOption was expecting an id and company id to work. Since forevever, we passed an offer, but
        // handleBookOption was never called: we were doing : offer.is_full ? handleBookOption() : handleBook();
        // where offer.is_full doesn't exist anymore (now offer.full) and therefore was always calling handleBook
        // original code : offer.full ? handleBookOption() : handleBook();
      }
    },
    // @ts-expect-error
    [onClick, offer?.id, handleBook],
  );

  const handleBook = useCallback(() => {
    (onBook || onClick)(offer.id);
  }, [onBook, onClick, offer.id]);

  // const handleBookOption = useCallback(() => {
  //   onBookOption(offer.id);
  // }, [onBookOption, offer.id]);

  const handleClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isBookingDisabled) return;
      event.stopPropagation();
      const savedEvent = event;

      if (theme?.hide_book_button) {
        handleClickOnHiddenBookButton(savedEvent);
      } else if (
        AVAILABLE_BOOKING_ELEMENTS_IDS.includes(savedEvent.target?.id)
      ) {
        analyticsUtils.onGoToWorkshopBooking(offer);
        handleBook();
        // offer?.full ? handleBookOption() : handleBook();
      } else if (!isWorkshop) {
        analyticsUtils.onGoToWorkshopBooking(offer);
        onClick(offer?.id);
      }
    },
    [
      isBookingDisabled,
      theme?.hide_book_button,
      handleClickOnHiddenBookButton,
      offer,
      handleBook,
      isWorkshop,
      onClick,
    ],
  );

  const cardListItemId = React.useMemo(
    () => generateUniqueOfferIdentifier(offer, 'bs-offer-list-item'),
    [offer],
  );

  if (loading) {
    return (
      <Skeleton
        animation="pulse"
        height={156}
        id="bs-offer__list-item--loading"
        width="100%"
      />
    );
  }

  const isSessionNameClickable =
    theme?.hide_book_button &&
    !isBookingDisabled &&
    !(isVariantTimeHighlighted || isVariantCoachHighlighted);

  const isPopoverOnSessionName =
    theme?.hide_book_button &&
    isOfferPassed &&
    !(isVariantTimeHighlighted || isVariantCoachHighlighted);

  const isSessionTimeClickable =
    theme?.hide_book_button &&
    !isBookingDisabled &&
    isVariantTimeHighlighted &&
    !isWorkshop;

  const isPopoverOnSessionTime =
    theme?.hide_book_button && isOfferPassed && isVariantTimeHighlighted;

  const isSessionCoachClickable =
    theme?.hide_book_button && !isBookingDisabled && isVariantCoachHighlighted;

  const isPopoverOnSessionCoach =
    theme?.hide_book_button && isOfferPassed && isVariantCoachHighlighted;

  const date = (() => {
    const timezoneName = metaActivity?.is_broadcast
      ? getUserZone()
      : establishment?.tzname || theme.timezone_name || 'Europe/Paris';

    const dateStart = offer?.date_start
      ? DateTime.fromISO(offer.date_start).setZone(timezoneName)
      : null;
    return formatAsDateWithWeekday(dateStart, theme, 'DDD');
  })();

  return (
    <button
      className={clsx('bs-offer-list-item', {
        'bs-offer-list-item--mobile': isMobile,
        'bs-offer-list-item--first': position.includes('first'),
        'bs-offer-list-item--last': position.includes('last'),
        'bs-offer-list-item--disabled': isListItemDisabled,
        'bs-offer-list-item--isWorkshop': isWorkshop,
        'bs-offer-list-item--isNotWorkshop': !isWorkshop,
        'bs-offer-list-item--isWorkShop-with-hidden-button':
          isWorkshop && theme?.hide_book_button,
      })}
      disabled={isBookingDisabled}
      id={cardListItemId}
      // @ts-expect-error
      onClick={handleClick}
      style={{
        borderLeftWidth:
          theme?.show_activity_color && metaActivity?.color ? 5 : 2,
        borderLeftColor:
          theme?.show_activity_color && metaActivity?.color
            ? metaActivity?.color
            : getComputedStyle(document.documentElement).getPropertyValue(
                '--border-color',
              ),
      }}
      type="button"
    >
      <div className="bs-offer-list-item__content">
        <div className="bs-offer-list-item__content__offer">
          <div className="bs-offer-list-item__content__offer__left">
            {!isWorkshop && (
              <>
                {isSessionNameClickable ? (
                  <button
                    className={clsx(MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER, {
                      'bs-offer-list-item__content__offer__left__title':
                        'bs-offer-list-item__content__offer__left__title',
                      'bs-offer-list-item__button__title':
                        'bs-offer-list-item__button__title',
                    })}
                    disabled={isBookingDisabled}
                    // @ts-expect-error
                    onClick={handleClick}
                    type="button"
                  >
                    {offer?.name_override || metaActivity?.name}
                  </button>
                ) : (
                  <div
                    className={clsx(
                      'bs-offer-list-item__content__offer__left__title',
                      {
                        'bs-offer-list-item__content__offer__left__title--time-highlighted':
                          isVariantTimeHighlighted,
                        'bs-offer-list-item__content__offer__left__title--coach-highlighted':
                          isVariantCoachHighlighted,
                      },
                    )}
                  >
                    <PopOver
                      title={
                        isPopoverOnSessionName &&
                        t(
                          'translation:marketplace.bookButton.popOverTitle.isPast',
                        )
                      }
                    >
                      {offer?.name_override || metaActivity?.name}
                    </PopOver>
                  </div>
                )}
              </>
            )}
            {isSessionTimeClickable ? (
              <button
                className={clsx(MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER, {
                  'bs-offer-list-item__button__title':
                    'bs-offer-list-item__button__title',
                  'bs-offer-list-item__content__offer__left__time--time-highlighted':
                    'bs-offer-list-item__content__offer__left__time--time-highlighted',
                  'bs-offer-list-item__content__offer__left__time--without-date':
                    !showDate,
                  'bs-offer-list-item__content__offer__left__time': showDate,
                })}
                disabled={isBookingDisabled}
                // @ts-expect-error
                onClick={handleClick}
                type="button"
              >
                <OfferDateAndHours
                  date={date}
                  offerHours={offerHours}
                  showDate={showDate}
                />
              </button>
            ) : (
              <div
                className={clsx({
                  'bs-offer-list-item__content__offer__left__time--time-highlighted':
                    isVariantTimeHighlighted,
                  'bs-offer-list-item__content__offer__left__time--coach-highlighted':
                    isVariantCoachHighlighted,
                  'bs-offer-list-item__content__offer__left__time--without-date':
                    !showDate,
                  'bs-offer-list-item__content__offer__left__time': showDate,
                })}
              >
                <PopOver
                  title={
                    isPopoverOnSessionTime &&
                    t('translation:marketplace.bookButton.popOverTitle.isPast')
                  }
                >
                  <OfferDateAndHours
                    date={date}
                    offerHours={offerHours}
                    showDate={showDate}
                  />
                </PopOver>
              </div>
            )}
            {isMobile && (
              <div
                className={clsx(
                  'bs-offer-list-item__content__offer__left__extra',
                  {
                    'bs-offer-list-item__content__offer__left__extra--not-displayed':
                      !showOfferFilling && !showOfferGender,
                  },
                )}
              >
                {showOfferFilling && (
                  <div className="bs-offer-list-item__content__offer__right__top__group">
                    <GroupIcon className="bs-offer-list-item__content__offer__right__top__group__icon" />
                    {/* @ts-expect-error */}
                    <div>{`${offer?.tot_slots}/${offer?.effectif}`} </div>
                  </div>
                )}
                {showOfferGender && (
                  <div className="bs-offer-list-item__content__offer__right__top__gender">
                    <div className="bs-offer-list-item__content__offer__right__top__gender__sex">
                      <MaleIcon isMobile />
                      {/* @ts-expect-error */}
                      <div>{genderCount?.nb_booked_male || 0}</div>
                    </div>
                    <div className="bs-offer-list-item__content__offer__right__top__gender__sex">
                      <FemaleIcon isMobile />
                      {/* @ts-expect-error */}
                      <div>{genderCount?.nb_booked_female || 0}</div>
                    </div>
                    {/* @ts-expect-error */}
                    <div>+ {genderCount?.nb_booked_other || 0}</div>
                  </div>
                )}
              </div>
            )}
            <div className="bs-offer-list-item__content__offer__left__establishment">
              <MarketplaceEstablishmentTitle
                classes={{
                  'bs-offer-list-item__content__offer__left__establishment__name':
                    'bs-offer-list-item__content__offer__left__establishment__name',
                  'bs-offer-list-item__content__offer__left__establishment__name--coach-highlighted':
                    isVariantCoachHighlighted &&
                    'bs-offer-list-item__content__offer__left__establishment__name--coach-highlighted',
                }}
                establishment={establishment}
                icon={
                  <RoomIcon className="bs-offer-list-item__content__offer__left__icon" />
                }
                theme={theme}
              />
            </div>
            <>
              {isSessionCoachClickable ? (
                <button
                  className={clsx('bs-card-offer__button__title', {
                    'bs-offer-list-item__content__offer__left__coach':
                      'bs-offer-list-item__content__offer__left__coach',
                    'bs-offer-list-item__content__offer__left__coach--coach-highlighted':
                      'bs-offer-list-item__content__offer__left__coach--coach-highlighted',
                  })}
                  disabled={isBookingDisabled}
                  // @ts-expect-error
                  onClick={handleClick}
                  type="button"
                >
                  <MarketplaceCoachInfos
                    classes={{
                      // @ts-expect-error
                      [MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER]: [
                        MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER,
                      ],
                      'bs-offer-list-item__content__offer__left__coach':
                        'bs-offer-list-item__content__offer__left__coach',
                      // @ts-expect-error
                      'bs-offer-list-item__content__offer__left__coach--coach-highlighted':
                        isVariantCoachHighlighted,
                    }}
                    coach={coach}
                    hideCoach={hideCoach}
                    // @ts-expect-error
                    offer={offer}
                    theme={theme}
                  />
                </button>
              ) : (
                <div
                  className={clsx(
                    'bs-offer-list-item__content__offer__left__coach',
                    {
                      'bs-offer-list-item__content__offer__left__coach--coach-highlighted':
                        isVariantCoachHighlighted,
                    },
                  )}
                >
                  <PopOver
                    title={
                      isPopoverOnSessionCoach &&
                      t(
                        'translation:marketplace.bookButton.popOverTitle.isPast',
                      )
                    }
                  >
                    <MarketplaceCoachInfos
                      classes={{
                        'bs-offer-list-item__content__offer__left__coach':
                          'bs-offer-list-item__content__offer__left__coach',
                        // @ts-expect-error
                        'bs-offer-list-item__content__offer__left__coach--coach-highlighted':
                          isVariantCoachHighlighted,
                      }}
                      coach={coach}
                      hideCoach={hideCoach}
                      // @ts-expect-error
                      offer={offer}
                      theme={theme}
                    />
                  </PopOver>
                </div>
              )}
            </>
          </div>
          <div className="bs-offer-list-item__content__offer__right">
            <div className="bs-offer-list-item__content__offer__right__top">
              <div className="bs-offer-list-item__content__offer__right__top__left">
                {!isMobile && (
                  <div className="bs-offer-list-item__content__offer__right__top__left">
                    {showOfferFilling && (
                      <div className="bs-offer-list-item__content__offer__right__top__group">
                        <GroupIcon className="bs-offer-list-item__content__offer__right__top__group__icon" />
                        {/* @ts-expect-error */}
                        <div>{`${offer?.tot_slots}/${offer?.effectif}`} </div>
                      </div>
                    )}
                    {showOfferGender && (
                      <div className="bs-offer-list-item__content__offer__right__top__gender">
                        {/* @ts-expect-error */}
                        <MaleIcon />
                        {/* @ts-expect-error */}
                        <div>{genderCount?.nb_booked_male || 0}</div>
                        {/* @ts-expect-error */}
                        <FemaleIcon />
                        {/* @ts-expect-error */}
                        <div>{genderCount?.nb_booked_female || 0}</div>
                        {/* @ts-expect-error */}
                        <div>+ {genderCount?.nb_booked_other || 0}</div>
                      </div>
                    )}
                  </div>
                )}
                {metaActivity && metaActivity.is_broadcast && (
                  <MarketplaceBroadcast />
                )}
                {offer.custom_level && (
                  <MarketPlaceLevel
                    className="bs-offer-list-item__content__offer__right__top__level"
                    customLevel={getLevel[offer.custom_level]}
                    hideLevel={!theme.show_level}
                  />
                )}
                <OfferPriceTag
                  credits={offer?.credit_price}
                  isCreditDisplayEnabled={theme?.display_credit_price_for_offer}
                  isFreeLabelEnabled={theme?.show_free_session_label}
                />
              </div>
              {!isWorkshop && !isMobile && (
                <InfoIcon
                  className={clsx({
                    'bs-offer-list-item__content__offer__right__top__icon--not-disabled':
                      !isBookingDisabled,
                    'bs-offer-list-item__content__offer__right__top__icon--disabled':
                      isBookingDisabled,
                  })}
                />
              )}
            </div>
            <div>
              {!withoutCTA && !withoutBookButton && (
                // @ts-expect-error
                <MarketplaceBookButton
                  className="bs-offer-list-item__content__offer__right__bottom"
                  isHidden={theme?.hide_book_button}
                  isRegistered={isRegistered}
                  metaActivity={metaActivity}
                  offer={offer}
                />
              )}

              <MarketplaceOfferStatusChip
                showLabel
                companyTheme={theme}
                isRegistered={isRegistered}
                metaActivity={metaActivity}
                offer={offer}
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export const MarketplaceOfferListItemForStorybook = marketplaceCssHoc()(
  MarketplaceOfferListItem,
);

export default React.memo(MarketplaceOfferListItem);
