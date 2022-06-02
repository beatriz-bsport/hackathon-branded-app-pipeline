import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import classNames from 'classnames';
import uniqBy from 'lodash/uniqBy';

import {
  Avatar,
  Button,
  CardMedia,
  Dialog,
  DialogContent,
  makeStyles,
  Theme,
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
import LevelComponent from '#libs/level/components/Level.component';
import { Level } from '#libs/level/types';
import { DEFAULT_AVATAR } from '#libs/associated-coach/utils';
import { MarketplaceOfferListItem } from './MarketPlaceOfferListItem.component';
import { isOfferBookableYet, isOfferInThePast } from '../utils';

export type Props = {
  showOfferFilling: boolean;
  group: OffersGroup;
  theme: CompanyTheme;
  hideCoach: boolean;
  loading: boolean;
  onBookOption: (id: number) => void;
  onBook: (id: number) => void;
  getCoach: (id: number) => Coach;
  getEstablishment: (id: number) => Establishment;
  getLevel: (id: number) => Level;
  customLevel: Level;
  offers: Offer[];
  metaActivity: MetaActivity;
};

export const MarketplaceGroupOfferListItem: React.FC<Props> = ({
  group,
  theme,
  loading,
  showOfferFilling,
  hideCoach,
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
  const classes = useStyles();
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
        id="bs-offer__list-item--loading"
        animation="pulse"
        width="100%"
        height={156}
      />
    );
  }

  const firstBookableOffer = offers.find((o) => isOfferInThePast(o) && !o.full);

  if (!firstBookableOffer) return null;

  return (
    <>
      <div
        className={classNames(classes.offerListCard, 'bs-offer-list-item', {
          'bs-offer-list-item--mobile': isMobile,
          [classes.offerListCardMobile]: isMobile,
        })}
        style={{
          borderLeftWidth: metaActivity.color !== '' ? 5 : 1,
          borderLeftStyle: 'solid',
          borderLeftColor:
            metaActivity.color !== '' ? metaActivity.color : '#E0E5EC',
        }}
      >
        <div className="bs-offer-list-item__left">
          <div
            className={classNames(
              classes.title,
              'bs-offer-list-item__left__title',
            )}
          >
            {group.name}
          </div>
          <div
            className={classNames(
              classes.title,
              'bs-offer-list-item__left__offers',
            )}
          >
            <span
              className={classNames(
                classes.emphasis,
                'bs-offer-list-item__left__offers__emphasis',
              )}
            >
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
                className={classNames(
                  classes.subtitle,
                  'bs-offer-list-item__left__subtitle',
                )}
              >
                <RoomIcon
                  color="disabled"
                  className={classNames(
                    classes.pin,
                    'bs-offer-list-item__left__icon',
                  )}
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
                  className={classNames(
                    classes.subtitle,
                    'bs-offer-list-item__offer__subtitle',
                  )}
                  key={coach.id}
                >
                  <Avatar
                    src={coach ? coach.photo || DEFAULT_AVATAR : ''}
                    className={classNames(
                      classes.avatar,
                      'bs-offer-list-item__offer__coach',
                    )}
                  />
                  {coach.name +
                    (offer.coach_override
                      ? ` (${t('marketplace.substituted')})`
                      : '')}
                </div>
              );
            })}
        </div>
        <div className={classNames(classes.right, 'bs-offer-list-item__right')}>
          <div
            className={classNames(
              classes.infosRow,
              'bs-offer-list-item__right__row',
            )}
          >
            <LevelComponent variant="caption" customLevel={customLevel} />
          </div>
          <Button
            variant="text"
            color="primary"
            className={classNames(classes.button, 'bs-offer-list-item__button')}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            {t('marketplace.discover')}
          </Button>
        </div>
      </div>
      {openModal && (
        <Dialog
          open
          onClose={() => {
            setOpenModal(false);
          }}
          classes={{
            paper: classNames(classes.dialog, 'bs-offer-dialog'),
          }}
        >
          <DialogContent className={classes.content}>
            <CardMedia
              className={classNames(classes.media, 'bs-offer-dialog__media')}
              src={metaActivity.cover_main}
              component="img"
            />
            <div
              className={classNames(
                classes.innerDialog,
                'bs-offer-dialog__inner',
              )}
            >
              <div
                className={classNames(
                  classes.dialogTitle,
                  'bs-offer-dialog__inner__title',
                )}
              >
                {metaActivity.name}
              </div>
              <div
                className={classNames(
                  classes.group,
                  'bs-offer-dialog__inner__group',
                )}
              >
                {group.name}
              </div>
              <div
                className={classNames('bs-offer-dialog__inner__group__text')}
              >
                {t(
                  group.full_booking_only
                    ? 'marketplace:workshop.warningFullBooking'
                    : 'marketplace:workshop.warningPartialBooking',
                  { count: group.offers?.length ?? 0 },
                )}{' '}
              </div>
              <div
                className={classNames(
                  classes.bookTitle,
                  'bs-offer-dialog__inner__book_title',
                )}
              >
                {t('marketplace.bookGroups')}
              </div>
              <div
                className={classNames(
                  classes.dialogList,
                  'bs-offer-dialog__inner__book_list',
                )}
              >
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
                        customLevel={getLevel(offer.custom_level)}
                        showOfferFilling={showOfferFilling}
                        theme={theme}
                        hideCoach={hideCoach}
                        loading={false}
                        onBookOption={handleBook()}
                        onBook={handleBookOption()}
                        withoutCTA={group.full_booking_only}
                      />
                    );
                  })}
              </div>
            </div>
          </DialogContent>
          <div
            className={classNames(classes.buttons, 'bs-offer-dialog__buttons')}
          >
            <Button
              className="bs-offer-dialog__buttons__cancel"
              onClick={() => {
                setOpenModal(false);
              }}
            >
              {t('marketplace.cancel')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              className="bs-offer-dialog__buttons__book"
              disabled={checkDisabled()}
              onClick={() => {
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
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  subtitle: {
    fontSize: 16,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  avatar: {
    height: theme.spacing(4),
    width: theme.spacing(4),
  },
  pin: {
    marginLeft: theme.spacing(1) / 2,
    marginRight: theme.spacing(1) / 2,
  },
  title: {
    fontWeight: 500,
    fontSize: 20,
    marginBottom: theme.spacing(2),
  },
  offerList: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
    gap: theme.spacing(2),
  },
  offerListCard: {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    background: '#FFFFFF',
    outlineStyle: 'solid',
    outlineColor: '#E0E5EC',
    outlineWidth: 1,
    padding: theme.spacing(3),
    transition: 'all 0.2s',
  },
  offerListCardMobile: {
    padding: theme.spacing(2),
  },
  infosRow: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  disabled: {
    cursor: 'unset',
    backgroundColor: theme.palette.grey[500],
    '&:hover': {
      backgroundColor: theme.palette.grey[500],
    },
  },
  offerListCardActionText: {
    textTransform: 'uppercase',
    color: theme.palette.primary.main,
    alignSelf: 'center',
  },
  offerListFillingIcon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(1),
    height: 16,
  },
  offerListFilling: {
    color: theme.palette.text.secondary,
    display: 'flex',
    fontSize: 12,
    fontWeight: 500,
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 'auto',
    color: theme.palette.primary.main,
  },
  emphasis: {
    color: theme.palette.primary.main,
  },
  group: {
    fontSize: 20,
  },
  dialogTitle: {
    fontSize: 25,
    letterSpacing: 0.25,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 500,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  media: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
  },
  dialog: {
    position: 'relative',
    maxHeight: '100vh',
    minWidth: '100vw',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '80vw',
      maxHeight: '80vh',
      minWidth: 600,
    },
  },
  buttons: {
    position: 'relative',
    bottom: 0,
    left: 0,
    width: '100%',
    height: theme.spacing(8),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: '#E0E5EC',
  },
  dialogList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  content: {
    paddingTop: '0 !important',
    padding: 0,
  },
  innerDialog: {
    padding: theme.spacing(3),
  },
}));

export default React.memo(MarketplaceGroupOfferListItem);
