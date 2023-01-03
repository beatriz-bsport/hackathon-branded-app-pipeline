import React, { useState, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import ScheduleIcon from '@material-ui/icons/Schedule';
import { Avatar, Icon } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DateRangeIcon from '@material-ui/icons/DateRange';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import INSTAGRAM_PNG from '../../../../public/images/instagram.png';
import FACEBOOK_PNG from '../../../../public/images/facebook.png';
import { formatMinutes } from '../../../../utils/datetime';
import { Offer_FULL } from '#libs/offer/types';
import MarketplaceLevel from '../MarketplaceLevelCSSOnly/MarketplaceLevelCSSOnly.component';
import MarketplaceBookButtonV2 from '../MarketplaceBookButtonCSSOnly/MarketplaceBookButtonCSSOnlyForDialog.component';
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
  onClickBook: (offer: Offer_FULL) => void;
  onClickBookOption: (offer: Offer_FULL) => void;
  hideCoach: boolean;
  width: string;
};

export const MarketplaceActivityV2 = (props: Props) => {
  const { offer, customLevel, theme, hideCoach } = props;
  const { t } = useTranslation([
    'metaActivity',
    'marketplace',
    'coach',
    'datetime',
  ]);
  const handleBook = () => {
    props.onClickBook(offer);
  };

  const handleBookOption = () => {
    props.onClickBookOption(offer);
  };

  const [mobileMapModalOpen, setMobileMapModalOpen] = useState(false);

  const establishment = offer.establishment;
  const { location } = offer.establishment || { location: null };

  const center = location ? [location.latitude, location.longitude] : null;
  const markers = location ? [establishment] : [];

  const effectiveCoach = offer.coach_override || offer.coach;

  const isMobile = ['xs', 'sm'].includes(props.width);

  return (
    <div className="bs-activity">
      <Dialog
        open={mobileMapModalOpen}
        onClose={() => {
          setMobileMapModalOpen(false);
        }}
        maxWidth="md"
        disablePortal
        PaperProps={{
          style: {
            margin: '10px',
            width: '85%',
            background: 'none',
          },
        }}
      >
        <IconButton
          className="bs-activity__closeMobile"
          onClick={() => setMobileMapModalOpen(false)}
        >
          <CloseIcon className="bs-activity__closeMobile__icon" />
        </IconButton>
        <DialogContent id="bs-activity--mobileMapDialog">
          <Map
            center={center}
            markers={markers}
            zoom={15}
            mapContainerClassName="bs-activity__middle__top__map__dialog"
          />
        </DialogContent>
      </Dialog>
      <div
        className="bs-activity__top"
        style={
          {
            '--background-image': `url(${offer.meta_activity.cover_main})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          } as CSSProperties
        }
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
            {!isMobile ? (
              <div className="bs-activity__top__content__location__address">
                {offer.establishment.location.address}
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMapModalOpen(true);
                }}
                className="bs-activity__top__content__location__address--clickable"
                type="button"
              >
                {offer.establishment.location.address}
              </button>
            )}
          </div>
          <div className="bs-activity__top__content__status">
            <MarketplaceLevel
              className="bs-activity__top__content__status__level"
              customLevel={customLevel}
              activityDialog
            />
            {offer.meta_activity && offer.meta_activity.is_broadcast && (
              <MarketplaceBroadcast activityDialog />
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
      <div className="bs-activity__middle">
        <div className="bs-activity__middle__top">
          {!isMobile && (
            <Map
              center={center}
              markers={markers}
              zoom={15}
              mapContainerClassName="bs-activity__middle__top__map"
              activityDialog
            />
          )}
          <div className="bs-activity__middle__top__description">
            <div className="bs-activity__middle__top__description__title">
              {t('marketplace:calendar.description')}
            </div>
            <div className="bs-activity__middle__top__description__full">
              {offer.meta_activity.description}
            </div>
          </div>
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
                  {t('metaActivity:settings.lastDiscardBeforeMinutesFull', {
                    m: formatMinutes(
                      offer.meta_activity.last_discard_minutes,
                      t,
                    ),
                  })}
                </li>
              ) : null}
              {offer.meta_activity.last_booking_minutes ? (
                <li>
                  {t('metaActivity:settings.lastBookingBeforeMinutesFull', {
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
        {!hideCoach && (
          <div className="bs-activity__middle__coach">
            <div className="bs-activity__middle__coach__title">
              {t('marketplace:selector.coach.placeholder')}
            </div>
            {offer.coach_override && (
              <div className="bs-activity__middle__coach__overrider__personality">
                <Avatar
                  src={offer.coach?.photo || ''}
                  className="bs-activity__middle__coach__overrider__personality__avatar"
                />
                <div className="bs-activity__middle__coach__overrider__personality__right">
                  <div className="bs-activity__middle__coach__overrider__personality__right__name">
                    {offer.coach.name}
                  </div>

                  <div className="bs-activity__middle__coach__overrider__personality__right__override">
                    {t('translation:marketplace.substituted')}
                  </div>
                </div>
              </div>
            )}
            <div className="bs-activity__middle__coach__main">
              <div className="bs-activity__middle__coach__main__personality">
                <Avatar
                  src={effectiveCoach?.photo || ''}
                  className="bs-activity__middle__coach__main__personality__avatar"
                />
                <div className="bs-activity__middle__coach__main__personality__right">
                  <div className="bs-activity__middle__coach__main__personality__right__name">
                    {effectiveCoach.name}
                  </div>
                  {offer.coach_override && (
                    <div className="bs-activity__middle__coach__main__personality__right__override">
                      {t('coach:overrider')}
                    </div>
                  )}
                </div>
              </div>
              <div className="bs-activity__middle__coach__main__social">
                {effectiveCoach.instagram_url && (
                  <a href={effectiveCoach.instagram_url}>
                    <Icon>
                      <img
                        className="bs-activity__middle__coach__main__social__icon"
                        src={INSTAGRAM_PNG}
                        alt=""
                      />
                    </Icon>
                  </a>
                )}
                {effectiveCoach.facebook_url && (
                  <a href={effectiveCoach.facebook_url}>
                    <Icon>
                      <img
                        src={FACEBOOK_PNG}
                        alt=""
                        className="bs-activity__middle__coach__main__social__icon"
                      />
                    </Icon>
                  </a>
                )}
              </div>
            </div>
            <div className="bs-activity__middle__coach__description">
              {effectiveCoach.description ? effectiveCoach.description : null}
            </div>
          </div>
        )}
      </div>
      <div className="bs-activity__bottom">
        <div className="bs-activity__bottom__content">
          <Button
            className="bs-activity__bottom__content__closeButton"
            onClick={props.onClose}
          >
            {t('marketplace:calendar.close')}
          </Button>
          <MarketplaceBookButtonV2
            offer={offer}
            onClickBook={handleBook}
            onClickBookOption={handleBookOption}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MarketplaceActivityV2);
