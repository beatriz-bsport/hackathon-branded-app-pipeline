// @ts-nocheck
import React, { useCallback } from 'react';
import InfoIcon from '@material-ui/icons/Info';
import GroupIcon from '@material-ui/icons/Group';
import classNames from 'classnames';

import { useMediaQuery, useTheme } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import RoomIcon from '@material-ui/icons/Room';

import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { formatAsDateWithWeekday } from '../../../../utils/datetime';
import MaleIcon from '#components/icons/MaleIcon.component';
import FemaleIcon from '#components/icons/FemaleIcon.component';

import { Offer } from '#libs/offer/types';
import { Coach } from '#libs/associated-coach/types';
import { CompanyTheme } from '#libs/theme/types';
import { Establishment } from '#libs/establishment/types';

import { useOfferHours } from '#libs/marketplace/hooks';

import MarketplaceBookButton from '#libs/marketplace/components/MarketplaceBookButton';
import { MetaActivity } from '#libs/meta-activity/types';
import MarketPlaceLevel from '#libs/marketplace/components/MarketplaceLevelCSSOnly';
import MarketplaceBroadcast from '#libs/marketplace/components/MarketplaceBroadcastCSSOnly';
import MarketplaceCalendarVariant from '#libs/marketplace/types';
import {
  AVAILABLE_BOOKING_ELEMENTS_IDS,
  MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER,
} from '#libs/marketplace/constants';
import { Level } from '#libs/level/types';

import './MarketplaceOfferListItemCSSOnly.css';
import MarketplaceCoachInfos from '#libs/marketplace/components/MarketplaceCoachInfos';
import MarketplaceEstablishmentTitle from '#libs/marketplace/components/MarketplaceEstablishmentTitle';
import FreeOfferChip from '#csscomponents/FreeOfferChip';

import PopOver from '#components/Popover';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import MarketplaceOfferStatusChip from '../MarketplaceOfferStatusChip';

export const DISABLE_BOOKING_ELEMENTS_IDS = [
  'book-button--disabled',
  'book-button__inner--disabled',
  'book-button__inner__text--disabled',
];

export type Props = {
  showOfferFilling: boolean;
  offer: Offer;
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
  additionalCoaches?: Coach[];
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
};

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
  additionalCoaches,
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
}) => {
  const { t } = useTranslation(['datetime', 'translation']);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const isVariantTimeHighlighted = variant === 'time';
  const isVariantCoachHighlighted = variant === 'coach';

  const offerHours = useOfferHours(offer, establishment, metaActivity, theme);

  const isListItemDisabled =
    (theme?.hide_book_button && isOfferPassed) ||
    (!theme?.hide_book_button && isBookingDisabled);

  const handleClickOnHiddenBookButton = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (
        event.target.classList.contains(MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER)
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

      if (theme?.hide_book_button) {
        handleClickOnHiddenBookButton(event);
      } else if (AVAILABLE_BOOKING_ELEMENTS_IDS.includes(event?.target?.id)) {
        handleBook();
        // offer?.full ? handleBookOption() : handleBook();
      } else if (!isWorkshop) {
        onClick(offer?.id);
      }
    },
    [
      isBookingDisabled,
      theme?.hide_book_button,
      handleClickOnHiddenBookButton,
      offer?.id,
      handleBook,
      isWorkshop,
      onClick,
    ],
  );

  if (loading) {
    return (
      <Skeleton
        id="bs-offer__list-item--loading"
        animation="pulse"
        width="100%"
        height={156}
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
      ? moment.tz.guess()
      : establishment?.tzname || theme.timezone_name || 'Europe/Paris';

    if (offer?.date_start)
      return formatAsDateWithWeekday(
        offer?.date_start,
        theme,
        t,
        'LL',
        timezoneName,
      );

    return '';
  })();

  return (
    <button
      type="button"
      onClick={handleClick}
      className={classNames('bs-offer-list-item', {
        'bs-offer-list-item--mobile': isMobile,
        'bs-offer-list-item--first': position.includes('first'),
        'bs-offer-list-item--last': position.includes('last'),
        'bs-offer-list-item--disabled': isListItemDisabled,
        'bs-offer-list-item--isWorkshop': isWorkshop,
        'bs-offer-list-item--isNotWorkshop': !isWorkshop,
        'bs-offer-list-item--isWorkShop-with-hidden-button':
          isWorkshop && theme?.hide_book_button,
      })}
      style={{
        borderLeftWidth:
          theme?.show_activity_color && metaActivity?.color ? 5 : 2,
        borderLeftColor:
          theme?.show_activity_color && metaActivity?.color
            ? metaActivity?.color
            : getComputedStyle(document.documentElement).getPropertyValue(
                '--color-grey-light',
              ),
      }}
      disabled={isBookingDisabled}
    >
      <div className="bs-offer-list-item__content">
        <div className="bs-offer-list-item__content__offer">
          <div className="bs-offer-list-item__content__offer__left">
            {!isWorkshop && (
              <>
                {isSessionNameClickable ? (
                  <button
                    type="button"
                    onClick={handleClick}
                    disabled={isBookingDisabled}
                    className={classNames(
                      MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER,
                      {
                        'bs-offer-list-item__content__offer__left__title':
                          'bs-offer-list-item__content__offer__left__title',
                        'bs-offer-list-item__button__title':
                          'bs-offer-list-item__button__title',
                      },
                    )}
                  >
                    {metaActivity?.name}
                  </button>
                ) : (
                  <div
                    className={classNames(
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
                        t('marketplace.bookButton.popOverTitle.isPast')
                      }
                    >
                      {metaActivity?.name}
                    </PopOver>
                  </div>
                )}
              </>
            )}
            {isSessionTimeClickable ? (
              <button
                type="button"
                onClick={handleClick}
                disabled={isBookingDisabled}
                className={classNames(MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER, {
                  'bs-offer-list-item__button__title':
                    'bs-offer-list-item__button__title',
                  'bs-offer-list-item__content__offer__left__time--time-highlighted':
                    'bs-offer-list-item__content__offer__left__time--time-highlighted',
                  'bs-offer-list-item__content__offer__left__time--without-date':
                    !showDate,
                  'bs-offer-list-item__content__offer__left__time': showDate,
                })}
              >
                {(showDate ? `${date} ` : '') + offerHours}
              </button>
            ) : (
              <div
                className={classNames({
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
                    t('marketplace.bookButton.popOverTitle.isPast')
                  }
                >
                  {(showDate ? `${date} ` : '') + offerHours}
                </PopOver>
              </div>
            )}
            {isMobile && (
              <div
                className={classNames(
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
                    <div>{`${offer?.tot_slots}/${offer?.effectif}`} </div>
                  </div>
                )}
                {showOfferGender && (
                  <div className="bs-offer-list-item__content__offer__right__top__gender">
                    <div className="bs-offer-list-item__content__offer__right__top__gender__sex">
                      <MaleIcon isMobile />
                      <div>{genderCount?.nb_booked_male || 0}</div>
                    </div>
                    <div className="bs-offer-list-item__content__offer__right__top__gender__sex">
                      <FemaleIcon isMobile />
                      <div>{genderCount?.nb_booked_female || 0}</div>
                    </div>
                    <div>+ {genderCount?.nb_booked_other || 0}</div>
                  </div>
                )}
              </div>
            )}
            <div className="bs-offer-list-item__content__offer__left__establishment">
              <MarketplaceEstablishmentTitle
                establishment={establishment}
                theme={theme}
                classes={{
                  'bs-offer-list-item__content__offer__left__establishment__name':
                    'bs-offer-list-item__content__offer__left__establishment__name',
                  'bs-offer-list-item__content__offer__left__establishment__name--coach-highlighted':
                    isVariantCoachHighlighted &&
                    'bs-offer-list-item__content__offer__left__establishment__name--coach-highlighted',
                }}
                icon={
                  <RoomIcon className="bs-offer-list-item__content__offer__left__icon" />
                }
              />
            </div>
            {!!additionalCoaches && additionalCoaches?.length < 1 ? (
              <>
                {isSessionCoachClickable ? (
                  <button
                    type="button"
                    onClick={handleClick}
                    disabled={isBookingDisabled}
                    className={classNames('bs-card-offer__button__title', {
                      'bs-offer-list-item__content__offer__left__coach':
                        'bs-offer-list-item__content__offer__left__coach',
                      'bs-offer-list-item__content__offer__left__coach--coach-highlighted':
                        'bs-offer-list-item__content__offer__left__coach--coach-highlighted',
                    })}
                  >
                    <MarketplaceCoachInfos
                      theme={theme}
                      hideCoach={hideCoach}
                      coach={coach}
                      offer={offer}
                      classes={{
                        [MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER]: [
                          MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER,
                        ],
                        'bs-offer-list-item__content__offer__left__coach':
                          'bs-offer-list-item__content__offer__left__coach',
                        'bs-offer-list-item__content__offer__left__coach--coach-highlighted':
                          isVariantCoachHighlighted,
                      }}
                    />
                  </button>
                ) : (
                  <div
                    className={classNames(
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
                        theme={theme}
                        hideCoach={hideCoach}
                        coach={coach}
                        offer={offer}
                        classes={{
                          'bs-offer-list-item__content__offer__left__coach':
                            'bs-offer-list-item__content__offer__left__coach',
                          'bs-offer-list-item__content__offer__left__coach--coach-highlighted':
                            isVariantCoachHighlighted,
                        }}
                      />
                    </PopOver>
                  </div>
                )}
              </>
            ) : (
              <div>
                {isWorkshop ? (
                  <div>
                    <MarketplaceCoachInfos
                      theme={theme}
                      hideCoach={hideCoach}
                      coach={coach}
                      offer={offer}
                      classes={{
                        'bs-offer-list-item__content__offer__left__coach':
                          'bs-offer-list-item__content__offer__left__coach',
                        'bs-offer-list-item__content__offer__left__coach--time-highlighted':
                          isVariantTimeHighlighted &&
                          'bs-offer-list-item__content__offer__left__coach--time-highlighted',
                        'bs-offer-list-item__content__offer__left__coach--coach-highlighted':
                          isVariantCoachHighlighted &&
                          'bs-offer-list-item__content__offer__left__coach--coach-highlighted',
                      }}
                    />
                    {additionalCoaches?.map((additionalCoach) => (
                      <MarketplaceCoachInfos
                        key={`addtional_coach${additionalCoach?.id}`}
                        theme={theme}
                        hideCoach={hideCoach}
                        coach={additionalCoach}
                        offer={offer}
                        classes={{
                          'bs-offer-list-item__content__offer__left__coach':
                            'bs-offer-list-item__content__offer__left__coach',
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bs-offer-list-item__content__offer__left__coaches__row">
                    {isSessionCoachClickable ? (
                      <button
                        type="button"
                        onClick={handleClick}
                        disabled={isBookingDisabled}
                        className={classNames('bs-card-offer__button__title', {
                          'bs-offer-list-item__content__offer__left__coach':
                            'bs-offer-list-item__content__offer__left__coach',
                          'bs-offer-list-item__content__offer__left__coach--coach-highlighted':
                            'bs-offer-list-item__content__offer__left__coach--coach-highlighted',
                        })}
                      >
                        <MarketplaceCoachInfos
                          theme={theme}
                          hideCoach={hideCoach}
                          coach={coach}
                          offer={offer}
                          classes={{
                            [MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER]: [
                              MARKETPLACE_CLICKABLE_TITLE_IDENTIFIER,
                            ],
                          }}
                        />
                      </button>
                    ) : (
                      <MarketplaceCoachInfos
                        theme={theme}
                        hideCoach={hideCoach}
                        coach={coach}
                        offer={offer}
                        classes={{
                          'bs-offer-list-item__content__offer__left__coach':
                            'bs-offer-list-item__content__offer__left__coach',
                          'bs-offer-list-item__content__offer__left__coach--time-highlighted':
                            isVariantTimeHighlighted &&
                            'bs-offer-list-item__content__offer__left__coach--time-highlighted',
                          'bs-offer-list-item__content__offer__left__coach--coach-highlighted':
                            isVariantCoachHighlighted &&
                            'bs-offer-list-item__content__offer__left__coach--coach-highlighted',
                        }}
                      />
                    )}
                    <PopOver
                      title={
                        <div className="bs-offer-list-item__popover__coach">
                          {additionalCoaches?.map((additionalCoach) => (
                            <MarketplaceCoachInfos
                              key={`addtional_coach${additionalCoach?.id}`}
                              theme={theme}
                              hideCoach={hideCoach}
                              coach={additionalCoach}
                              offer={offer}
                              classes={{
                                'bs-offer-list-item__content__offer__left__coach':
                                  'bs-offer-list-item__content__offer__left__coach',
                                'bs-offer-list-item__content__offer__left__coach--time-highlighted':
                                  isVariantTimeHighlighted &&
                                  'bs-offer-list-item__content__offer__left__coach--time-highlighted',
                                'bs-offer-list-item__content__offer__left__coach--coach-highlighted':
                                  isVariantCoachHighlighted &&
                                  'bs-offer-list-item__content__offer__left__coach--coach-highlighted',
                              }}
                            />
                          ))}
                        </div>
                      }
                    >
                      <div className="bs-offer-list-item__content__offer__left__coaches__number">
                        +{additionalCoaches?.length}
                      </div>
                    </PopOver>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="bs-offer-list-item__content__offer__right">
            <div className="bs-offer-list-item__content__offer__right__top">
              <div className="bs-offer-list-item__content__offer__right__top__left">
                {!isMobile && (
                  <div className="bs-offer-list-item__content__offer__right__top__left">
                    {showOfferFilling && (
                      <div className="bs-offer-list-item__content__offer__right__top__group">
                        <GroupIcon className="bs-offer-list-item__content__offer__right__top__group__icon" />
                        <div>{`${offer?.tot_slots}/${offer?.effectif}`} </div>
                      </div>
                    )}
                    {showOfferGender && (
                      <div className="bs-offer-list-item__content__offer__right__top__gender">
                        <MaleIcon />
                        <div>{genderCount?.nb_booked_male || 0}</div>
                        <FemaleIcon />
                        <div>{genderCount?.nb_booked_female || 0}</div>
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
                    hideLevel={!theme.show_level}
                    className="bs-offer-list-item__content__offer__right__top__level"
                    customLevel={getLevel[offer.custom_level]}
                  />
                )}
                <FreeOfferChip
                  companyTheme={theme}
                  credits={offer?.credit_price}
                  creditsOverride={offer?.credit_price_override}
                />
              </div>
              {!isWorkshop && !isMobile && (
                <InfoIcon
                  className={classNames({
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
                <MarketplaceBookButton
                  offer={offer}
                  isRegistered={isRegistered}
                  className="bs-offer-list-item__content__offer__right__bottom"
                  metaActivity={metaActivity}
                  isHidden={theme?.hide_book_button}
                />
              )}
              <MarketplaceOfferStatusChip
                companyTheme={theme}
                offer={offer}
                isRegistered={isRegistered}
                showLabel
                metaActivity={metaActivity}
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
