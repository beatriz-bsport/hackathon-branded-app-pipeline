import React, { useState, useMemo, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import ScheduleIcon from '@material-ui/icons/Schedule';
import { Avatar, Icon } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import DateRangeIcon from '@material-ui/icons/DateRange';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization.js';
import { getCoachDisplayName } from '@bsport/common/lib/master-data/coach.js';
import { Offer } from '#src/libs/offer/types';
import MarketplaceLevel from '#src/libs/marketplace/components/@Offer/MarketplaceLevelCSSOnly/MarketplaceLevelCSSOnly.component';
import MarketplaceBookButtonForDialog from '#src/libs/marketplace/components/@Booking/MarketplaceBookButton/MarketplaceBookButtonForDialog.component';
import MarketplaceBroadcast from '#src/libs/marketplace/components/@Broadcast/MarketplaceBroadcastCSSOnly/MarketplaceBroadcastCSSOnly.component';
import { Level } from '#src/libs/level/types';
import { Theme as CompanyTheme } from '#src/libs/theme/types';
// @ts-expect-error
import Map from '#src/components/map/Map.component';

import { MetaActivity } from '#src/libs/meta-activity/types';
import { Establishment } from '#src/libs/establishment/types';
import { Coach } from '#src/libs/associated-coach/types';
import { OffersGroup } from '#src/libs/group-offer/types';
import Button from '#src/components/css-only/Fabrique/Button';

import { formatOfferHours } from '#src/libs/marketplace/utils/offer';
import { useOfferHours } from '../../../hooks';
import { formatMinutes } from '../../../../../utils/datetime';
import FACEBOOK_PNG from '../../../../../public/images/facebook.png';
import INSTAGRAM_PNG from '../../../../../public/images/instagram.png';
import './MarketplaceActivity.css';
import OfferPriceTag from '#src/components/css-only/OfferPriceTag';
import { ImmutableObject } from 'seamless-immutable';

export type Props = {
  offer: Offer;
  coachDisplay?: MarketPlaceCoachDisplay;
  companyTheme: CompanyTheme;
  metaActivities: ImmutableObject<{ [key: number]: MetaActivity }>;
  establishments: ReadonlyArray<Establishment>;
  coaches: Array<Coach>;
  customLevels: Array<Level>;
  onClose: () => void;
  onClickBook: (offer: Offer) => void;
  onClickBookOption: (offer: Offer) => void;
  hideCoach: boolean;
  hideLevel?: boolean;
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
    hideLevel,
    coachDisplay,
    companyTheme,
    group,
  } = props;
  const { t } = useTranslation([
    'metaActivity',
    'marketplace',
    'coach',
    'datetime',
    'translation',
  ]);
  const handleBook = () => {
    props.onClickBook(offer);
  };

  const handleBookOption = () => {
    props.onClickBookOption(offer);
  };

  const [mobileMapModalOpen, setMobileMapModalOpen] = useState(false);

  const establishment = useMemo(
    () => establishments?.find((est) => est.id === offer.establishment),
    [establishments, offer.establishment],
  );
  const { location } = establishment || { location: null };

  const center = location ? [location.latitude, location.longitude] : null;
  const markers = location ? [establishment] : [];

  const isMobile = ['xs', 'sm'].includes(props.width);

  const metaActivity = props.metaActivities[offer.meta_activity];

  const offerHours = useOfferHours(
    offer,
    establishment,
    metaActivity,
    companyTheme,
  );

  const formattedOfferHours = formatOfferHours(offerHours);

  const coach = useMemo(
    () => coaches?.find((c) => c.id === offer.coach),
    [coaches, offer.coach],
  );

  const effectiveCoach = useMemo(
    () =>
      offer.coach_override
        ? coaches?.find((c) => c.id === offer.coach_override)
        : coach,
    [coaches, coach, offer.coach_override],
  );

  const customLevel = useMemo(
    () => customLevels?.find((level) => level.id === offer.custom_level),
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
        disablePortal
        onClose={() => {
          setMobileMapModalOpen(false);
        }}
        open={mobileMapModalOpen}
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
            mapContainerClassName="bs-activity__middle__top__map__dialog"
            markers={markers}
            zoom={15}
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
            {offer?.name_override || metaActivity?.name}
          </div>
          <div className="bs-activity__top__content__time">
            <div className="bs-activity__top__content__time__day">
              <DateRangeIcon />
              {DateTime.fromISO(offer.date_start).toLocaleString(
                DateTime.DATE_FULL,
              )}
            </div>
            <div className="bs-activity__top__content__time__hour">
              <ScheduleIcon />
              {formattedOfferHours}
            </div>
          </div>
          <div className="bs-activity__top__content__location">
            <LocationOnIcon />
            {!isMobile ? (
              <div className="bs-activity__top__content__location__address">
                {establishment?.location?.address || ''}
              </div>
            ) : (
              <button
                className="bs-activity__top__content__location__address--clickable"
                onClick={() => {
                  setMobileMapModalOpen(true);
                }}
                type="button"
              >
                {establishment?.location?.address || ''}
              </button>
            )}
          </div>
          <div className="bs-activity__top__content__status">
            <OfferPriceTag
              colorVariant="in-details"
              credits={offer?.credit_price}
              isCreditDisplayEnabled={
                companyTheme?.display_credit_price_for_offer
              }
              isFreeLabelEnabled={companyTheme?.show_free_session_label}
            />
            <MarketplaceLevel
              className="bs-activity__top__content__status__level"
              customLevel={customLevel}
              hideLevel={hideLevel}
            />
            {metaActivity && metaActivity?.is_broadcast && (
              <MarketplaceBroadcast activityDialog />
            )}
          </div>
        </div>
      </div>
      <div className="bs-activity__middle">
        <div className="bs-activity__middle__top">
          {!isMobile && (
            <Map
              activityDialog
              center={center}
              mapContainerClassName="bs-activity__middle__top__map"
              markers={markers}
              zoom={15}
            />
          )}
          <div className="bs-activity__middle__top__description">
            <div className="bs-activity__middle__top__description__title">
              {t('marketplace:calendar.description')}
            </div>
            <div className="bs-activity__middle__top__description__full">
              {offer?.description_override || metaActivity?.description}
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
                <li className="bs-activity__middle__conditions__full__list-item">
                  {t('metaActivity:settings.lastDiscardBeforeMinutesFull', {
                    m: formatMinutes(metaActivity?.last_discard_minutes, t),
                  })}
                </li>
              ) : null}
              {metaActivity?.last_booking_minutes ? (
                <li className="bs-activity__middle__conditions__full__list-item">
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
                  className="bs-activity__middle__coach__overrider__personality__avatar"
                  src={coach?.photo || ''}
                />
                <div className="bs-activity__middle__coach__overrider__personality__right">
                  <div className="bs-activity__middle__coach__overrider__personality__right__name">
                    {getCoachDisplayName(
                      coachDisplay,
                      coach?.name,
                      coach?.firstname,
                    ) || ''}
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
                  className="bs-activity__middle__coach__main__personality__avatar"
                  src={effectiveCoach?.photo || ''}
                />
                <div className="bs-activity__middle__coach__main__personality__right">
                  <div className="bs-activity__middle__coach__main__personality__right__name">
                    {getCoachDisplayName(
                      coachDisplay,
                      effectiveCoach?.name,
                      effectiveCoach?.firstname,
                    ) || ''}
                  </div>
                  {offer.coach_override && (
                    <div className="bs-activity__middle__coach__main__personality__right__override">
                      {t('coach:overrider')}
                    </div>
                  )}
                </div>
              </div>
              <div className="bs-activity__middle__coach__main__social">
                {effectiveCoach?.instagram_url && (
                  <a href={effectiveCoach?.instagram_url}>
                    <Icon>
                      <img
                        alt=""
                        className="bs-activity__middle__coach__main__social__icon"
                        src={INSTAGRAM_PNG}
                      />
                    </Icon>
                  </a>
                )}
                {effectiveCoach?.facebook_url && (
                  <a href={effectiveCoach?.facebook_url}>
                    <Icon>
                      <img
                        alt=""
                        className="bs-activity__middle__coach__main__social__icon"
                        src={FACEBOOK_PNG}
                      />
                    </Icon>
                  </a>
                )}
              </div>
            </div>
            <div className="bs-activity__middle__coach__description">
              {effectiveCoach?.description || ''}
            </div>
          </div>
        )}
      </div>
      <div className="bs-activity__bottom">
        <div className="bs-activity__bottom__content">
          <Button
            classes={{ root: 'bs-activity__bottom__content__closeButton' }}
            onClick={props.onClose}
          >
            {t('marketplace:calendar.close')}
          </Button>
          <MarketplaceBookButtonForDialog
            group={groupData}
            metaActivity={metaActivity}
            // @ts-expect-error
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
