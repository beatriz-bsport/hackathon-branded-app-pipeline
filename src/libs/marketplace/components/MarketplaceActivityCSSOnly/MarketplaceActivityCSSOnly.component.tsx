// @ts-nocheck
import React, { useState, useMemo, CSSProperties } from 'react';
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
import { Offer } from '#libs/offer/types';
import MarketplaceLevel from '../MarketplaceLevelCSSOnly/MarketplaceLevelCSSOnly.component';
import MarketplaceBookButtonV2 from '../MarketplaceBookButtonCSSOnly/MarketplaceBookButtonCSSOnlyForDialog.component';
import MarketplaceBroadcast from '../MarketplaceBroadcastCSSOnly/MarketplaceBroadcastCSSOnly.component';
import { useOfferHours } from '../../hooks';
import { Level } from '#libs/level/types';
import { Theme } from '#libs/theme/types';
import Map from '#components/map/Map.component';

import './MarketplaceActivity.css';
import { MetaActivity } from '#libs/meta-activity/types';
import { Establishment } from '#libs/establishment/types';
import { Coach } from '#libs/associated-coach/types';
import { OffersGroup } from '#libs/group-offer/types';

type Props = {
  offer: Offer;
  metaActivities: { [key: number]: MetaActivity };
  establishments: Array<Establishment>;
  coaches: Array<Coach>;
  customLevels: Array<Level>;
  onClose: () => void;
  theme: Theme;
  onClickBook: (offer: Offer) => void;
  onClickBookOption: (offer: Offer) => void;
  hideCoach: boolean;
  width: string;
  group: { [key: number]: OffersGroup };
};

export const MarketplaceActivityV2 = (props: Props) => {
  const {
    offer,
    establishments,
    coaches,
    customLevels,
    hideCoach,
    theme,
    group,
  } = props;
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

  const establishment = useMemo(
    () => establishments.find((est) => est.id === offer.establishment),
    [establishments, offer.establishment],
  );
  const { location } = establishment || { location: null };

  const center = location ? [location.latitude, location.longitude] : null;
  const markers = location ? [establishment] : [];

  const isMobile = ['xs', 'sm'].includes(props.width);

  const metaActivity = props.metaActivities[offer.meta_activity];

  const offerHours = useOfferHours(offer, establishment, metaActivity, theme);

  const coach = useMemo(
    () => coaches.find((c) => c.id === offer.coach),
    [coaches, offer.coach],
  );

  const effectiveCoach = useMemo(
    () =>
      offer.coach_override
        ? coaches.find((c) => c.id === offer.coach_override)
        : coach,
    [coaches, coach, offer.coach_override],
  );

  const customLevel = useMemo(
    () => customLevels.find((level) => level.id === offer.custom_level),
    [customLevels, offer.custom_level],
  );

  const groupData = useMemo(() => {
    if (offer?.group && group) {
      return group[offer.group];
    }
    return null;
  }, [group, offer.group]);

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
            '--background-image': `url(${metaActivity?.cover_main})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          } as CSSProperties
        }
      >
        <div className="bs-activity__top__content">
          <div className="bs-activity__top__content__title">
            {metaActivity?.name}
          </div>
          <div className="bs-activity__top__content__time">
            <div className="bs-activity__top__content__time__day">
              <DateRangeIcon />
              {moment(offer.date_start).format('DD MMMM YYYY')}
            </div>
            <div className="bs-activity__top__content__time__hour">
              <ScheduleIcon />
              {offerHours}
            </div>
          </div>
          <div className="bs-activity__top__content__location">
            <LocationOnIcon />
            {!isMobile ? (
              <div className="bs-activity__top__content__location__address">
                {establishment?.location.address}
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMapModalOpen(true);
                }}
                className="bs-activity__top__content__location__address--clickable"
                type="button"
              >
                {establishment?.location.address}
              </button>
            )}
          </div>
          <div className="bs-activity__top__content__status">
            <MarketplaceLevel
              className="bs-activity__top__content__status__level"
              customLevel={customLevel}
              activityDialog
            />
            {metaActivity && metaActivity?.is_broadcast && (
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
              {metaActivity?.description}
            </div>
          </div>
        </div>
        {metaActivity?.last_discard_minutes ||
        metaActivity?.last_booking_minutes ? (
          <div className="bs-activity__middle__conditions">
            <div className="bs-activity__middle__conditions__title">
              {t('marketplace:calendar.conditions')}
            </div>
            <ul className="bs-activity__middle__conditions__full">
              {metaActivity?.last_discard_minutes ? (
                <li>
                  {t('metaActivity:settings.lastDiscardBeforeMinutesFull', {
                    m: formatMinutes(metaActivity?.last_discard_minutes, t),
                  })}
                </li>
              ) : null}
              {metaActivity?.last_booking_minutes ? (
                <li>
                  {t('metaActivity:settings.lastBookingBeforeMinutesFull', {
                    m: formatMinutes(metaActivity?.last_booking_minutes, t),
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
                  src={coach?.photo || ''}
                  className="bs-activity__middle__coach__overrider__personality__avatar"
                />
                <div className="bs-activity__middle__coach__overrider__personality__right">
                  <div className="bs-activity__middle__coach__overrider__personality__right__name">
                    {coach?.name}
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
            group={groupData}
            onClickBook={handleBook}
            onClickBookOption={handleBookOption}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MarketplaceActivityV2);
