// @ts-nocheck
import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import uniqBy from 'lodash/uniqBy';
import classNames from 'classnames';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import { CardMedia, Dialog, useMediaQuery, useTheme } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import RoomIcon from '@material-ui/icons/Room';

import { Offer } from '#libs/offer/types';
import { Coach } from '#libs/associated-coach/types';
import { CompanyTheme } from '#libs/theme/types';
import { Establishment } from '#libs/establishment/types';

import { MetaActivity } from '#libs/meta-activity/types';
import { OffersGroup } from '#libs/group-offer/types';
import MarketPlaceLevel from '#libs/marketplace/components/MarketplaceLevelCSSOnly';
import { Level } from '#libs/level/types';
import MarketplaceOfferListItem from '../MarketplaceOfferListItemCSSOnly';
import {
  getBookingButtonTraduction,
  isOfferInThePast,
  getPositionOfOfferInTheList,
} from '../../utils';
import './MarketplaceGroupOfferListItem.css';
import MarketplaceCoachInfos from '#libs/marketplace/components/MarketplaceCoachInfos';
import MarketplaceEstablishmentTitle from '#libs/marketplace/components/MarketplaceEstablishmentTitle';
import MarketplaceOfferStatusChip from '../MarketplaceOfferStatusChip';

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
  getLevel: { [id: number]: Level };
  customLevel: Level;
  offers: Offer[];
  metaActivity: MetaActivity;
  withoutBookButton: boolean;
};

const MarketplaceGroupOfferListItem: React.FC<Props> = ({
  group,
  theme,
  loading,
  showOfferFilling,
  showOfferGender,
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
  withoutBookButton,
}) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [offersToDisplay, setOffersToDisplay] = React.useState([]);

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const anchorDate = React.useMemo(() => {
    if (!group) {
      return moment().format();
    }
    const { allow_booking_after_start, first_offer_date, full_booking_only } =
      group;
    if (!full_booking_only) {
      return moment().format();
    }

    if (!allow_booking_after_start) {
      return first_offer_date;
    }
    return moment().format();
  }, [group]);

  React.useEffect(() => {
    // useEffect used to set the offers to display based on the group configuration (and thus, the anchorDate)
    // 1 - !full_booking_only : then all offers in the future must de displayed (anchorDate is now)
    // 2 - allow_booking_after_start : then we also display all offers in future (anchorDate in now)
    // 3 - !allow_booking_after_start :
    //    a - If anchorDate is before group.first_offer_date then we display nothing.
    //    b - Otherwise we display the future offers.
    if (!group?.full_booking_only) {
      setOffersToDisplay(
        offers.filter((_offer) =>
          moment(_offer?.date_start).isSameOrAfter(moment(anchorDate)),
        ),
      );
    } else if (offers && group) {
      if (group.allow_booking_after_start) {
        setOffersToDisplay(
          offers.filter((_offer) =>
            moment(_offer?.date_start).isSameOrAfter(moment(anchorDate)),
          ),
        );
      } else if (moment(group.first_offer_date).isBefore(moment(anchorDate))) {
        setOffersToDisplay([]);
      } else {
        setOffersToDisplay(offers.filter((o) => !isOfferInThePast(o)));
      }
    } else {
      setOffersToDisplay([]);
    }
  }, [offers, group, anchorDate]);

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

  const offersWithPosition = useMemo(() => {
    const l: Array<{ offer: Offer; position: ('first' | 'last')[] }> = [];
    offersToDisplay.forEach((offer, index) => {
      const position = getPositionOfOfferInTheList(offersToDisplay, index);
      l.push({ offer, position });
    });
    return l;
  }, [offersToDisplay]);

  const handleBook = useCallback(
    () => (offer: Offer) => {
      setOpenModal(false);
      onBook(offer, {
        fbo: group.full_booking_only ? 1 : 0,
        offer_in_group: group.offers,
      });
    },
    [group, onBook, setOpenModal],
  );

  const handleBookOption = useCallback(
    () => (offer: Offer) => {
      setOpenModal(false);
      onBookOption(offer, {
        fbo: group.full_booking_only,
        offer_in_group: group.offers,
      });
    },
    [group, onBookOption, setOpenModal],
  );

  const handleClick = useCallback(() => {
    if (group?.full_booking_only) {
      !disableBookGroupButton() && setOpenModal(true);
    } else {
      setOpenModal(true);
    }
  }, [group?.full_booking_only, disableBookGroupButton]);

  const isRegisteredInOnOfferInGroup = React.useMemo(() => {
    if (!group?.full_booking_only) {
      return false;
    }
    if (offersToDisplay.some((o) => bookedOffers?.includes(o?.id))) {
      return true;
    }
    return !offersToDisplay.some((o) => !o?.full);
  }, [group, offersToDisplay, bookedOffers]);

  const groupIsFull = React.useMemo(() => {
    if (!group?.full_booking_only) {
      return false;
    }

    return offersToDisplay.some((o) => o?.full);
  }, [group, offersToDisplay]);

  const disableBookGroupButton = useCallback(() => {
    if (!group?.full_booking_only) {
      // Without full_booking_only
      return false;
    }
    if (!group?.allow_booking_after_start) {
      return groupIsFull || moment(anchorDate).isSameOrBefore(moment());
    }
    return groupIsFull;
  }, [
    group?.full_booking_only,
    group?.allow_booking_after_start,
    groupIsFull,
    anchorDate,
  ]);

  if (loading) {
    return (
      <Skeleton
        animation="pulse"
        height={156}
        id="bs-offer-list-group-item--loading"
        width="100%"
      />
    );
  }

  const firstBookableOffer = offersToDisplay?.find((o) => !o?.full);
  const firstOfferToBeBooked =
    group?.full_booking_only && offersToDisplay?.length !== 0
      ? offersToDisplay[0]
      : null;

  if (offersToDisplay?.length === 0) return null;

  return (
    <>
      <button
        className={classNames('bs-offer-list-group-item', {
          'bs-offer-list-group-item--mobile': isMobile,
          'bs-offer-list-group-item--without-color':
            !theme?.show_activity_color || !metaActivity.color,
          '--hidden-book-button': theme?.hide_book_button,
        })}
        onClick={theme?.hide_book_button && handleClick}
        style={{
          borderLeftWidth:
            theme?.show_activity_color && metaActivity.color ? 5 : 1,
          borderLeftStyle: 'solid',
          borderLeftColor:
            theme?.show_activity_color &&
            metaActivity.color &&
            metaActivity.color,
        }}
        type="button"
      >
        <div className="bs-offer-list-group-item__left">
          <div className="bs-offer-list-group-item__left__title">
            {group.name}
          </div>
          <div className="bs-offer-list-group-item__left__offers">
            <span className="bs-offer-list-group-item__left__offers__emphasis">
              {t('marketplace.offers', { count: offersToDisplay.length })}
            </span>{' '}
            {t('marketplace.from_to', {
              from: offersToDisplay[0]
                ? getDate(
                    offersToDisplay[0],
                    getEstablishment(offersToDisplay[0].establishment),
                  )
                : '',
              to: offersToDisplay[offersToDisplay.length - 1]
                ? getDate(
                    offersToDisplay[offersToDisplay.length - 1],
                    getEstablishment(
                      offersToDisplay[offersToDisplay.length - 1]
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
              <MarketplaceEstablishmentTitle
                key={establishment.id}
                classes={{
                  'bs-offer-list-group-item__establishment':
                    'bs-offer-list-group-item__establishment',
                }}
                establishment={establishment}
                icon={
                  <RoomIcon
                    className="bs-offer-list-group-item__left__icon"
                    color="disabled"
                  />
                }
                theme={theme}
              />
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
                <MarketplaceCoachInfos
                  key={coach.id}
                  classes={{
                    'bs-offer-list-group-item__offer__subtitle':
                      'bs-offer-list-group-item__offer__subtitle',
                  }}
                  coach={coach}
                  coachPictureClasses={{
                    'bs-offer-list-group-item__offer__coach':
                      'bs-offer-list-group-item__offer__coach',
                  }}
                  hideCoach={hideCoach}
                  offer={offer}
                  theme={theme}
                />
              );
            })}
        </div>
        <div className="bs-offer-list-group-item__right">
          <div className="bs-offer-list-group-item__right__row">
            <MarketPlaceLevel
              className="bs-offer-list-group-item__right__row__level"
              customLevel={customLevel}
              hideLevel={!theme.show_level}
            />
          </div>
          {group?.full_booking_only && firstOfferToBeBooked && (
            <>
              {theme?.hide_book_button ? (
                <MarketplaceOfferStatusChip
                  showLabel
                  companyTheme={theme}
                  isRegistered={isRegisteredInOnOfferInGroup}
                  metaActivity={metaActivity}
                  offer={{
                    ...firstOfferToBeBooked,
                    full: groupIsFull,
                    group,
                  }}
                />
              ) : (
                <button
                  className={classNames(
                    'bs-offer-list-group-item__right__row__button',
                    {
                      'bs-offer-list-group-item__right__row__button--disabled':
                        disableBookGroupButton(),
                      'bs-offer-list-group-item__right__row__button--booked':
                        isRegisteredInOnOfferInGroup,
                      'bs-offer-list-group-item__right__row__button--booked:hover::before':
                        isRegisteredInOnOfferInGroup,
                    },
                  )}
                  onClick={handleClick}
                  type="button"
                >
                  {isRegisteredInOnOfferInGroup && (
                    <DoneAllIcon className="bs-book-button-card__inner__icon__already-booked" />
                  )}
                  {getBookingButtonTraduction(
                    {
                      ...firstOfferToBeBooked,

                      is_full: groupIsFull,
                      group,
                    },
                    metaActivity,
                    isRegisteredInOnOfferInGroup,
                    t,
                  )}
                </button>
              )}
            </>
          )}
          {!group?.full_booking_only && !theme?.hide_book_button && (
            <button
              className="bs-offer-list-group-item__right__row__button"
              onClick={handleClick}
              type="button"
            >
              {t('marketplace.book')}
            </button>
          )}
        </div>
      </button>
      {openModal && (
        <Dialog
          disablePortal
          open
          classes={{
            paper: 'bs-offer-dialog',
          }}
          onClose={() => {
            setOpenModal(false);
          }}
        >
          <div className="bs-offer-dialog__content">
            <CardMedia
              className="bs-offer-dialog__content__media"
              component="img"
              src={metaActivity.cover_main}
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
                  { count: offersToDisplay.length },
                )}
              </div>
              <div className="bs-offer-dialog__content__inner__book_title">
                {t('marketplace.bookGroups')}
              </div>
              <div className="bs-offer-dialog__content__inner__book_list">
                {offersWithPosition.map((offerWithPosition) => {
                  const { offer, position } = offerWithPosition;
                  return (
                    <MarketplaceOfferListItem
                      key={offer.id}
                      isWorkshop
                      coach={getCoach(offer.coach_override || offer.coach)}
                      establishment={getEstablishment(offer.establishment)}
                      getLevel={getLevel}
                      hideCoach={hideCoach}
                      isRegistered={
                        bookedOffers?.length
                          ? bookedOffers.includes(offer.id)
                          : false
                      }
                      loading={false}
                      metaActivity={metaActivity}
                      offer={{
                        ...offer,
                        meta_activity: metaActivity,
                        group,
                      }}
                      onBook={handleBookOption()}
                      onBookOption={handleBook()}
                      onClick={handleBook}
                      position={position}
                      showOfferFilling={showOfferFilling}
                      showOfferGender={showOfferGender}
                      theme={theme}
                      variant="time"
                      withoutBookButton={withoutBookButton}
                      withoutCTA={group.full_booking_only}
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
                  disableBookGroupButton(),
              })}
              onClick={() => {
                if (disableBookGroupButton()) return;
                if (firstBookableOffer?.available) {
                  handleBook()(firstBookableOffer);
                }
                if (firstBookableOffer?.full) {
                  handleBookOption()(firstBookableOffer);
                }
              }}
              type="button"
            >
              {t('marketplace.book')}
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default React.memo(MarketplaceGroupOfferListItem);
