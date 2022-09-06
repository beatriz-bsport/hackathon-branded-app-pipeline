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
import { DEFAULT_AVATAR } from '#libs/associated-coach/utils';
import MarketplaceCalendarVariant from '../../types';

import './MarketplaceOfferListItemCSSOnly.css';

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
}) => {
  const { t } = useTranslation('translation');
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const isVariantTimeHighlighted = variant === 'time';

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

  const handleClick = () => {
    (onClick || onBook)(offer.id);
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
        'bs-offer-list-item--disabled': isBookingDisabled,
      })}
      style={{
        borderTop: 'none',
        borderRight: 'none',
        borderLeftWidth: offer.meta_activity.color ? 5 : 1,
        borderLeftStyle: 'solid',
        borderLeftColor: offer.meta_activity.color
          ? offer.meta_activity.color
          : '#E0E5EC',
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
                },
              )}
            >
              {(showDate ? `${date} ` : '') +
                getOfferHours(offer, establishment, theme)}
            </div>
            <div className="bs-offer-list-item__content__offer__left__bottom">
              {establishment && (
                <div className="bs-offer-list-item__content__offer__left__bottom__icons">
                  <RoomIcon className="bs-offer-list-item__content__offer__left__bottom__icons__location" />
                  <Avatar
                    src={coach ? coach.photo || DEFAULT_AVATAR : ''}
                    className="bs-offer-list-item__content__offer__left__bottom__icons__avatar"
                  />
                </div>
              )}
              {!hideCoach && coach && (
                <div className="bs-offer-list-item__content__offer__left__bottom__names">
                  <div className="bs-offer-list-item__content__offer__left__bottom__names__establishment">
                    {establishment?.title}
                  </div>
                  <div>
                    {coach.name +
                      (offer.coach_override
                        ? ` (${t('translation:marketplace.substitute')})`
                        : '')}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bs-offer-list-item__content__offer__right">
            <div className="bs-offer-list-item__content__offer__right__top">
              {showOfferFilling && (
                <div className="bs-offer-list-item__content__offer__right__top__group">
                  <GroupIcon className="bs-offer-list-item__content__offer__right__top__group__icon" />
                  <div>
                    {`${offer?.validated_booking_count}/${offer?.effectif}`}{' '}
                  </div>
                </div>
              )}
              {showOfferGender && (
                <div className="bs-offer-list-item__content__offer__right__top__gender">
                  <MaleIcon />
                  <div>{offer.male}</div>
                  <FemaleIcon />
                  <div>{offer.female}</div>
                  <div>+{offer.otherGender}</div>
                </div>
              )}
              {offer.custom_level ? (
                <MarketPlaceLevel
                  className="bs-offer-list-item__content__offer__right__top__level"
                  customLevel={getLevel(offer.custom_level)}
                />
              ) : (
                ''
              )}
              <InfoIcon
                onClick={handleClick}
                className="bs-offer-list-item__content__offer__right__top__icon"
              />
            </div>
            <div>
              {!withoutCTA && (
                <MarketplaceBookButtonV2
                  onClickBook={handleBook}
                  onClickBookOption={handleBookOption}
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
