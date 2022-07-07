import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import uniqBy from 'lodash/uniqBy';
import classNames from 'classnames';

import {
  Avatar,
  CardMedia,
  Dialog,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import RoomIcon from '@material-ui/icons/Room';

import { Offer } from '#libs/offer/types';
import { Coach } from '#libs/associated-coach/types';
import { CompanyTheme } from '#libs/theme/types';
import { Establishment } from '#libs/establishment/types';

import { MetaActivity, OffersGroup } from '#libs/meta-activity/types';
import MarketPlaceLevel from '#libs/marketplace/components/MarketplaceLevelCSSOnly';
import { Level } from '#libs/level/types';
import { DEFAULT_AVATAR } from '#libs/associated-coach/utils';
import MarketplaceOfferListItem from '../MarketplaceOfferListItemCSSOnly';
import { isOfferBookableYet, isOfferInThePast } from '../../utils';

import './MarketplaceGroupOfferListItem.css';

export type Props = {
  showOfferFilling: boolean;
  group: OffersGroup;
  theme: CompanyTheme;
  hideCoach: boolean;
  loading: boolean;
  bookedOffers: number[];
  onBookOption: (id: number) => void;
  onBook: (id: number) => void;
  getCoach: (id: number) => Coach;
  getEstablishment: (id: number) => Establishment;
  getLevel: (id: number) => Level;
  customLevel: Level;
  offers: Offer[];
  metaActivity: MetaActivity;
};

const MarketplaceGroupOfferListItem: React.FC<Props> = ({
  group,
  theme,
  loading,
  showOfferFilling,
  hideCoach,
  bookedOffers,
  getCoach,
  getEstablishment,
  getLevel,
  onBookOption,
  onBook,
  offers,
  customLevel,
  metaActivity,
}) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const getDate = useCallback(
    (offer: Offer, establishment: Establishment) => {
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
    },
    [theme],
  );

  const availableOffers = offers.filter(
    (o) => isOfferInThePast(o) && o.available,
  );

  const handleBook = useCallback(
    () => (offer: Offer) => {
      onBook(offer, {
        fbo: group.full_booking_only ? 1 : 0,
        offer_in_group: group.offers,
      });
    },
    [group, onBook],
  );

  const handleBookOption = useCallback(
    () => (offer: Offer) => {
      onBookOption(offer, {
        fbo: group.full_booking_only,
        offer_in_group: group.offers,
      });
    },
    [group, onBookOption],
  );

  const checkDisabled = useCallback(() => {
    if (
      group.full_booking_only &&
      !group.allow_booking_after_start &&
      offers.some((o) => !isOfferInThePast(o) || o.full)
    ) {
      return true;
    }

    if (
      group.allow_booking_after_start &&
      offers.filter((o) => !isOfferInThePast(o)).some((o) => o.full)
    ) {
      return true;
    }

    return !offers.some((o) => isOfferInThePast(o) && !o.full);
  }, [group, offers]);

  if (loading) {
    return (
      <Skeleton
        id="bs-offer-list-group-item--loading"
        animation="pulse"
        width="100%"
        height={156}
      />
    );
  }

  const firstBookableOffer = offers.find((o) => isOfferInThePast(o) && !o.full);

  if (availableOffers.length === 0) return null;

  return (
    <>
      <div
        className={classNames('bs-offer-list-group-item', {
          'bs-offer-list-group-item--mobile': isMobile,
        })}
        style={{
          borderLeftWidth: metaActivity.color !== '' ? 5 : 1,
          borderLeftStyle: 'solid',
          borderLeftColor:
            metaActivity.color !== '' ? metaActivity.color : '#E0E5EC',
        }}
      >
        <div className="bs-offer-list-group-item__left">
          <div className="bs-offer-list-group-item__left__title">
            {group.name}
          </div>
          <div className="bs-offer-list-group-item__left__offers">
            <span className="bs-offer-list-group-item__left__offers__emphasis">
              {t('marketplace.offers', { count: availableOffers.length })}
            </span>{' '}
            {t('marketplace.from_to', {
              from: availableOffers?.[0]
                ? getDate(
                    availableOffers?.[0],
                    getEstablishment(availableOffers[0].establishment),
                  )
                : '',
              to: availableOffers?.[availableOffers.length - 1]
                ? getDate(
                    availableOffers?.[availableOffers.length - 1],
                    getEstablishment(
                      availableOffers[availableOffers.length - 1]
                        ?.establishment,
                    ),
                  )
                : '',
            })}
          </div>
          {uniqBy(offers ?? [], 'establishment').map((offer) => {
            if (!offer) return null;
            const establishment = getEstablishment(offer.establishment);
            if (!establishment) return null;
            return (
              <div
                key={establishment.id}
                className="bs-offer-list-group-item__left__subtitle"
              >
                <RoomIcon
                  color="disabled"
                  className="bs-offer-list-group-item__left__icon"
                />
                {establishment?.location?.address}
              </div>
            );
          })}
          {!hideCoach &&
            uniqBy(offers ?? [], (o) =>
              o ? o.coach_override || o.coach : null,
            ).map((offer) => {
              if (!offer) return null;
              const coach = getCoach(offer.coach_override || offer.coach);
              if (!coach) return null;
              return (
                <div
                  className="bs-offer-list-group-item__offer__subtitle"
                  key={coach.id}
                >
                  <Avatar
                    src={coach ? coach.photo || DEFAULT_AVATAR : ''}
                    className="bs-offer-list-group-item__offer__coach"
                  />
                  {coach.name +
                    (offer.coach_override
                      ? ` (${t('marketplace.substituted')})`
                      : '')}
                </div>
              );
            })}
        </div>
        <div className="bs-offer-list-group-item__right">
          <div className="bs-offer-list-group-item__right__row">
            <MarketPlaceLevel
              customLevel={customLevel}
              className="bs-offer-list-group-item__right__row__level"
            />
          </div>
          <button
            className="bs-offer-list-group-item__right__row__button"
            onClick={() => {
              setOpenModal(true);
            }}
            type="button"
          >
            {t('marketplace.discover')}
          </button>
        </div>
      </div>
      {openModal && (
        <Dialog
          disablePortal
          open
          onClose={() => {
            setOpenModal(false);
          }}
          classes={{
            paper: 'bs-offer-dialog',
          }}
        >
          <div className="bs-offer-dialog__content">
            <CardMedia
              className="bs-offer-dialog__content__media"
              src={metaActivity.cover_main}
              component="img"
            />
            <div className="bs-offer-dialog__content__inner">
              <div className="bs-offer-dialog__content__inner__title">
                {metaActivity.name}
              </div>
              <div className="bs-offer-dialog__content__inner__group">
                {group.name}
              </div>
              <div className="bs-offer-dialog__content__inner__group__text">
                {t(
                  group.full_booking_only
                    ? 'marketplace:workshop.warningFullBooking'
                    : 'marketplace:workshop.warningPartialBooking',
                  { count: group.offers?.length ?? 0 },
                )}
              </div>
              <div className="bs-offer-dialog__content__inner__book_title">
                {t('marketplace.bookGroups')}
              </div>
              <div className="bs-offer-dialog__content__inner__book_list">
                {offers
                  .filter((o) => o.available && isOfferInThePast(o))
                  .map((offer) => {
                    return (
                      <MarketplaceOfferListItem
                        key={offer.id}
                        offer={{
                          ...offer,
                          meta_activity: metaActivity,
                        }}
                        establishment={getEstablishment(offer.establishment)}
                        coach={getCoach(offer.coach_override || offer.coach)}
                        getLevel={getLevel}
                        showOfferFilling={showOfferFilling}
                        theme={theme}
                        hideCoach={hideCoach}
                        loading={false}
                        onBookOption={handleBook()}
                        onBook={handleBookOption()}
                        withoutCTA={group.full_booking_only}
                        isRegistered={
                          bookedOffers?.length
                            ? bookedOffers.includes(offer.id)
                            : false
                        }
                      />
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="bs-offer-dialog__content__buttons">
            <button
              className="bs-offer-dialog__content__buttons__cancel"
              onClick={() => {
                setOpenModal(false);
              }}
              type="button"
            >
              {t('marketplace.cancel')}
            </button>
            <button
              className={classNames('bs-offer-dialog__content__buttons__book', {
                'bs-offer-dialog__content__buttons__book--disabled':
                  checkDisabled(),
              })}
              type="button"
              onClick={() => {
                if (checkDisabled()) return;
                if (firstBookableOffer?.available) {
                  handleBook()(firstBookableOffer);
                }
                if (firstBookableOffer.full) {
                  handleBookOption()(firstBookableOffer);
                }
              }}
            >
              {isOfferBookableYet({
                ...firstBookableOffer,
                meta_activity: metaActivity,
              })
                ? t('marketplace.book')
                : t('marketplace.bookButton.notBookableYet')}
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default React.memo(MarketplaceGroupOfferListItem);
