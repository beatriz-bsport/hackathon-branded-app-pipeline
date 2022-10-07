import React from 'react';
import { useTranslation } from 'react-i18next';
import InfoIcon from '@material-ui/icons/Info';
import GroupIcon from '@material-ui/icons/Group';
import classNames from 'classnames';

import { Avatar, useMediaQuery, useTheme } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import RoomIcon from '@material-ui/icons/Room';

import moment from 'moment-timezone';
import MaleIcon from '../../../../components/icons/MaleIcon.component';
import FemaleIcon from '../../../../components/icons/FemaleIcon.component';

import { Offer } from '#libs/offer/types';
import { Coach } from '#libs/associated-coach/types';
import { CompanyTheme } from '#libs/theme/types';
import { Establishment } from '#libs/establishment/types';

import { getOfferHours } from '#libs/marketplace/utils';

import MarketplaceBookButtonV2 from '../MarketplaceBookButtonCSSOnly';
import { MetaActivity } from '#libs/meta-activity/types';
import MarketPlaceLevel from '#libs/marketplace/components/MarketplaceLevelCSSOnly';
import MarketplaceBroadcast from '../MarketplaceBroadcastCSSOnly';
import MarketplaceCalendarVariant from '../../types';
import { AVAILABLE_BOOKING_ELEMENTS_IDS } from '#libs/marketplace/constants';

import './MarketplaceOfferListItemCSSOnly.css';

export const DISABLE_BOOKING_ELEMENTS_IDS = [
  'book-button--disabled',
  'book-button__inner--disabled',
  'book-button__inner__text--disabled',
];

export type Props = {
  showOfferFilling: boolean;
  offer: Offer<Coach, Establishment, MetaActivity>;
  variant?: MarketplaceCalendarVariant;
  theme: CompanyTheme;
  hideCoach: boolean;
  loading: boolean;
  onClick: (id: number) => void;
  onBookOption: (id: number) => void;
  onBook: (id: number) => void;
  establishment: Establishment;
  coach: Coach;
  withoutCTA: boolean;
  isRegistered?: boolean;
  showOfferGender: boolean;
  getLevel: (id: number) => void;
  isBookingDisabled: boolean;
  isWorkshop?: boolean;
  showDate?: boolean;
  withoutBookButton?: boolean;
  position: ('first' | 'last')[];
};

const MarketplaceOfferListItem: React.FC<Props> = ({
  offer,
  theme,
  loading,
  showOfferFilling,
  hideCoach,
  onClick,
  onBookOption,
  onBook,
  coach,
  establishment,
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
}) => {
  const { t } = useTranslation('translation');
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const isVariantTimeHighlighted = variant === 'time';
  const isVariantCoachHighlighted = variant === 'coach';

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

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isBookingDisabled) return;

    if (AVAILABLE_BOOKING_ELEMENTS_IDS.includes(event?.target?.id)) {
      offer.is_full ? handleBookOption() : handleBook();
    } else if (!isWorkshop) {
      onClick(offer.id);
    }
  };

  const handleBook = () => {
    (onBook || onClick)(offer.id);
  };

  const handleBookOption = () => {
    onBookOption(offer.id);
  };

  const date = (() => {
    if (offer.date_start && establishment) {
      return moment(offer?.date_start)
        .tz(establishment?.tzname ?? 'Europe/Paris')
        .format('L');
    }

    if (offer.date_start) {
      return moment(offer?.date_start)
        .tz(theme.timezone_name ?? 'Europe/Paris')
        .format('L');
    }

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
        'bs-offer-list-item--disabled': isBookingDisabled,
        'bs-offer-list-item--isWorkshop': isWorkshop,
        'bs-offer-list-item--isNotWorkshop': !isWorkshop,
      })}
      style={{
        borderLeftWidth: offer.meta_activity.color ? 5 : 2,
        borderLeftColor: offer.meta_activity.color
          ? offer.meta_activity.color
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
                {offer.meta_activity.name}
              </div>
            )}
            <div
              className={classNames(
                'bs-offer-list-item__content__offer__left__time',
                {
                  'bs-offer-list-item__content__offer__left__time--time-highlighted':
                    isVariantTimeHighlighted,
                  'bs-offer-list-item__content__offer__left__time--coach-highlighted':
                    isVariantCoachHighlighted,
                },
              )}
            >
              {(showDate ? `${date} ` : '') +
                getOfferHours(offer, establishment, theme)}
            </div>
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
                      <div>{offer.male || 0}</div>
                    </div>
                    <div className="bs-offer-list-item__content__offer__right__top__gender__sex">
                      <FemaleIcon isMobile />
                      <div>{offer.female || 0}</div>
                    </div>
                    <div>+ {offer.other || 0}</div>
                  </div>
                )}
              </div>
            )}
            {establishment && (
              <div
                className={classNames(
                  'bs-offer-list-item__content__offer__left__establishment',
                  {
                    'bs-offer-list-item__content__offer__left__establishment--time-highlighted':
                      isVariantTimeHighlighted,
                  },
                )}
              >
                <RoomIcon className="bs-offer-list-item__content__offer__left__icon" />
                <div
                  className={classNames(
                    'bs-offer-list-item__content__offer__left__establishment__name',
                    {
                      'bs-offer-list-item__content__offer__left__establishment__name--coach-highlighted':
                        isVariantCoachHighlighted,
                    },
                  )}
                >
                  {establishment?.title}
                </div>
              </div>
            )}
            {!hideCoach && coach && (
              <div
                className={classNames(
                  'bs-offer-list-item__content__offer__left__coach',
                  {
                    'bs-offer-list-item__content__offer__left__coach--time-highlighted':
                      isVariantTimeHighlighted,
                    'bs-offer-list-item__content__offer__left__coach--coach-highlighted':
                      isVariantCoachHighlighted,
                  },
                )}
              >
                <Avatar
                  src={coach ? coach.photo : ''}
                  className="bs-offer-list-item__content__offer__left__icon"
                />
                <div className="bs-offer-list-item__content__offer__left__coach__name">
                  {coach.name &&
                    coach.name +
                      (offer.coach_override
                        ? ` (${t('translation:marketplace.substitute')})`
                        : '')}
                </div>
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
                        <div>{offer.male || 0}</div>
                        <FemaleIcon />
                        <div>{offer.female || 0}</div>
                        <div>+ {offer.other || 0}</div>
                      </div>
                    )}
                  </div>
                )}
                {offer.meta_activity && offer.meta_activity.is_broadcast && (
                  <MarketplaceBroadcast />
                )}
                {offer.custom_level && (
                  <MarketPlaceLevel
                    className="bs-offer-list-item__content__offer__right__top__level"
                    customLevel={getLevel(offer.custom_level)}
                  />
                )}
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
                <MarketplaceBookButtonV2
                  offer={offer}
                  isRegistered={isRegistered}
                  className="bs-offer-list-item__content__offer__right__bottom"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default React.memo(MarketplaceOfferListItem);
