// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import ScheduleIcon from '@material-ui/icons/Schedule';
import { Avatar, Icon } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import Button from '@material-ui/core/Button';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DateRangeIcon from '@material-ui/icons/DateRange';

import INSTAGRAM_PNG from '../../../../public/images/instagram.png';
import FACEBOOK_PNG from '../../../../public/images/facebook.png';
import { formatMinutes } from '../../../../utils/datetime';
import { Offer_FULL } from '#libs/offer/types';
import MarketplaceLevel from '../MarketplaceLevelCSSOnly/MarketplaceLevelCSSOnly.component';
import MarketplaceBookButtonV2 from '../MarketplaceBookButtonCSSOnly/MarketplaceBookButtonCSSOnly.component';
import MarketplaceBroadcast from '../MarketplaceBroadcastCSSOnly/MarketplaceBroadcastCSSOnly.component';
import { getOfferHours } from '../../utils';
import { Level } from '#libs/level/types';
import { Theme } from '#libs/theme/types';
import Map from '#components/map/Map.component';

import './MarketplaceActivity.css';

type Props = {
  offer: Offer_FULL;
  customLevel: Level;
  onClose: () => void;
  theme: Theme;
  onClickBook: () => void;
  onClickBookOption: () => void;
};

export const MarketplaceActivityV2 = (props: Props) => {
  const { offer, customLevel, theme } = props;
  const { t } = useTranslation(['metaActivity', 'marketplace', 'coach']);

  const establishment = offer.establishment_override || offer.establishment;
  const { location } = offer.establishment || { location: null };
  const center = location ? [location.latitude, location.longitude] : null;
  const markers = location ? [establishment] : [];

  return (
    <div className="bs-activity">
      <div
        className="bs-activity__top"
        style={{
          backgroundImage: `url(${offer.meta_activity.cover_main})`,
          backgroundPosition: 'center',
        }}
      >
        <div className="bs-activity__top__content">
          <div className="bs-activity__top__content__title">
            {offer.meta_activity.name}
          </div>
          <div className="bs-activity__top__content__time">
            <div className="bs-activity__top__content__time__day">
              <DateRangeIcon />
              {moment(offer.date_start).format('DD MMMM YYYY')}
            </div>
            <div className="bs-activity__top__content__time__hour">
              <ScheduleIcon />
              {getOfferHours(offer, offer.establishment, theme)}
            </div>
          </div>
          <div className="bs-activity__top__content__location">
            <LocationOnIcon />
            <div className="bs-activity__top__content__location__address">
              {offer.establishment.location.address}
            </div>
          </div>
          <div className="bs-activity__top__content__status">
            <MarketplaceLevel
              className="bs-activity__top__content__status__level"
              customLevel={customLevel}
            />
            <MarketplaceBroadcast />
          </div>
        </div>
      </div>
      <div className="bs-activity__middle">
        <div className="bs-activity__middle__top">
          <div className="bs-activity__middle__top__description">
            <div className="bs-activity__middle__top__description__title">
              {t('marketplace:calendar.description')}
            </div>
            <div className="bs-activity__middle__top__description__full">
              {offer.meta_activity.description}
            </div>
          </div>
          <Map
            center={center}
            markers={markers}
            zoom={15}
            mapContainerClassName="bs-activity__middle__top__map"
          />
        </div>
        {offer.meta_activity.last_discard_minutes ||
        offer.meta_activity.last_booking_minutes ? (
          <div className="bs-activity__middle__conditions">
            <div className="bs-activity__middle__conditions__title">
              {t('marketplace:calendar.conditions')}
            </div>
            <ul className="bs-activity__middle__conditions__full">
              {offer.meta_activity.last_discard_minutes ? (
                <li>
                  {t('metaActivity:settings.lastDiscardBeforeMinutes', {
                    m: formatMinutes(
                      offer.meta_activity.last_discard_minutes,
                      t,
                    ),
                  })}
                </li>
              ) : null}
              {offer.meta_activity.last_booking_minutes ? (
                <li>
                  {t('metaActivity:settings.lastBookingBeforeMinutes', {
                    m: formatMinutes(
                      offer.meta_activity.last_booking_minutes,
                      t,
                    ),
                  })}
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
        <div className="bs-activity__middle__coach">
          <div className="bs-activity__middle__coach__title">
            {t('marketplace:selector.coach.placeholder')}
          </div>
          {offer.coach_override && (
            <div className="bs-activity__middle__coach__overrider__personality">
              <div>
                {offer.coach_override.photo ? (
                  <Avatar
                    src={offer.coach_override.photo}
                    className="bs-activity__middle__coach__overrider__personality__avatar"
                  />
                ) : (
                  <PersonIcon className="bs-activity__middle__coach__overrider__personality__avatar" />
                )}
              </div>
              <div className="bs-activity__middle__coach__overrider__personality__right">
                <div className="bs-activity__middle__coach__overrider__personality__right__name">
                  {offer.coach_override.name}
                </div>

                <div className="bs-activity__middle__coach__overrider__personality__right__override">
                  {t('marketplace:substituted')}
                </div>
              </div>
            </div>
          )}
          <div className="bs-activity__middle__coach__main">
            <div className="bs-activity__middle__coach__main__personality">
              <div>
                {offer.coach.photo ? (
                  <Avatar
                    src={offer.coach.photo}
                    className="bs-activity__middle__coach__main__personality__avatar"
                  />
                ) : (
                  <PersonIcon className="bs-activity__middle__coach__main__personality__avatar" />
                )}
              </div>
              <div className="bs-activity__middle__coach__main__personality__right">
                <div className="bs-activity__middle__coach__main__personality__right__name">
                  {offer.coach.name}
                </div>
                {offer.coach_override && (
                  <div className="bs-activity__middle__coach__main__personality__right__override">
                    {t('coach:overrider')}
                  </div>
                )}
              </div>
            </div>
            {offer.coach.facebook_url ||
              (offer.coach.instagram_url && (
                <div className="bs-activity__middle__coach__main__social">
                  {offer.coach.facebook_url && (
                    <a href={offer.coach.facebook_url}>
                      <Icon>
                        <img
                          src={FACEBOOK_PNG}
                          alt="Facebook"
                          className="bs-activity__middle__coach__main__social__icon"
                        />
                      </Icon>
                    </a>
                  )}
                  {offer.coach.instagram_url && (
                    <a href={offer.coach.instagram_url}>
                      <Icon>
                        <img
                          className="bs-activity__middle__coach__main__social__icon"
                          src={INSTAGRAM_PNG}
                          alt="Instagram"
                        />
                      </Icon>
                    </a>
                  )}
                </div>
              ))}
          </div>
          <div className="bs-activity__middle__coach__description">
            {offer.coach.description ? offer.coach.description : null}
          </div>
        </div>
      </div>
      <div className="bs-activity__bottom">
        <div className="bs-activity__bottom__content">
          <Button
            className="bs-activity__bottom__content__closeButton"
            onClick={props.onClose}
          >
            <div className="bs-activity__bottom__content__closeButton">
              {t('marketplace:calendar.close')}
            </div>
          </Button>
          <MarketplaceBookButtonV2
            offer={offer}
            className="bs-activity__bottom__content__bookButton"
            onClickBook={props.onClickBook}
            onClickBookOption={props.onClickBookOption}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MarketplaceActivityV2);
