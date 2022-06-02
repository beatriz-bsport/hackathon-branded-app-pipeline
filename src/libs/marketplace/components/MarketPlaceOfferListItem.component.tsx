import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import classNames from 'classnames';

import { Avatar, makeStyles, Theme } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import PeopleIcon from '@material-ui/icons/People';
import RoomIcon from '@material-ui/icons/Room';

import { Offer } from '#libs/offer/types';
import { Coach } from '#libs/associated-coach/types';
import { CompanyTheme } from '#libs/theme/types';
import { Establishment } from '#libs/establishment/types';

import MarketplaceBookButton from './MarketplaceBookButton.component';
import { MetaActivity } from '#libs/meta-activity/types';
import LevelComponent from '#libs/level/components/Level.component';
import { Level } from '#libs/level/types';
import { DEFAULT_AVATAR } from '#libs/associated-coach/utils';

export type Props = {
  showOfferFilling: boolean;
  offer: Offer<Coach, Establishment, MetaActivity>;
  theme: CompanyTheme;
  hideCoach: boolean;
  loading: boolean;
  onBookOption: (id: number) => void;
  onBook: (id: number) => void;
  establishment: Establishment;
  coach: Coach;
  customLevel: Level;
  withoutCTA: boolean;
};

export const MarketplaceOfferListItem: React.FC<Props> = ({
  offer,
  theme,
  loading,
  showOfferFilling,
  hideCoach,
  onBookOption,
  onBook,
  coach,
  establishment,
  customLevel,
  withoutCTA = false,
}) => {
  const { t } = useTranslation(['marketplace', 'datetime']);
  const classes = useStyles();

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

  const getDate = () => {
    if (offer.date_start && establishment) {
      const date = moment(offer?.date_start)
        .tz(establishment?.tzname ?? 'Europe/Paris')
        .format('dddd DD MMMM YYYY');
      const startHour = moment(offer?.date_start)
        .tz(establishment?.tzname ?? 'Europe/Paris')
        .format('HH:mm');
      const endHour = moment(offer?.date_start)
        .add(moment.duration(offer?.duration_minute, 'minutes'))
        .tz(establishment?.tzname ?? 'Europe/Paris')
        .format('HH:mm');

      return `${date} ${startHour} - ${endHour}`;
    }

    if (offer.date_start) {
      const date = moment(offer?.date_start)
        .tz(theme.timezone_name ?? 'Europe/Paris')
        .format('dddd DD MMMM YYYY');
      const startHour = moment(offer?.date_start)
        .tz(theme.timezone_name)
        .format('HH:mm' ?? 'Europe/Paris');
      const endHour = moment(offer?.date_start)
        .add(moment.duration(offer?.duration_minute, 'minutes'))
        .tz(theme.timezone_name)
        .format('HH:mm' ?? 'Europe/Paris');

      return `${date}: ${startHour} - ${endHour}`;
    }

    return '';
  };

  const handleBook = () => {
    onBook(offer);
  };

  const handleBookOption = () => {
    onBookOption(offer);
  };

  return (
    <div
      className={classNames(classes.offerListCard, 'bs-offer-list-item__left')}
      style={{
        borderLeftWidth: offer.meta_activity_color ? 5 : 1,
        borderLeftStyle: 'solid',
        borderLeftColor: offer.meta_activity_color
          ? offer.meta_activity_color
          : '#E0E5EC',
      }}
    >
      <div className="bs-offer-list-item__left">
        <div
          className={classNames(
            classes.title,
            'bs-offer-list-item__left__title',
          )}
        >
          {getDate()}
        </div>
        {establishment && (
          <div
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
        )}
        {!hideCoach && coach && (
          <div
            className={classNames(
              classes.subtitle,
              'bs-offer-list-item__offer__subtitle',
            )}
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
        )}
      </div>
      <div className={classNames(classes.right, 'bs-offer-list-item__right')}>
        <div
          className={classNames(
            classes.infosRow,
            'bs-offer-list-item__right__row',
          )}
        >
          {showOfferFilling && (
            <div
              className={classNames(
                classes.offerListFilling,
                'bs-offer-list-item__right__row__filling',
              )}
            >
              <PeopleIcon className={classes.offerListFillingIcon} />
              {`${offer?.tot_slots}/${offer?.effectif}`}
            </div>
          )}
          <div
            className={classNames(
              classes.infosRowColumn,
              'bs-offer-list-item__right__row__column',
            )}
          >
            <LevelComponent variant="caption" customLevel={customLevel} />

            {!withoutCTA && (
              <MarketplaceBookButton
                onClickBook={handleBook}
                onClickBookOption={handleBookOption}
                offer={offer}
                variant="text"
              />
            )}
          </div>
        </div>
      </div>
    </div>
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
  infosRow: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    height: '100%',
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
    marginTop: theme.spacing(1),
  },
  infosRowColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

export default React.memo(MarketplaceOfferListItem);
