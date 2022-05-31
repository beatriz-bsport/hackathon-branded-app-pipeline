import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { Button, makeStyles, Theme } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import MarketplaceOfferListItem from './MarketPlaceOfferListItem.component';
import { formatMinutes } from '../../../utils/datetime';
import { MetaActivity, OffersGroup } from '#libs/meta-activity/types';
import UnfoldableText from '#components/typo/UnfoldableText.component';
import { CompanyTheme } from '#libs/theme/types';
import { Offer } from '#libs/offer/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { Level } from '#libs/level/types';
import { MarketplaceGroupOfferListItem } from './MarketPlaceGroupOfferListItem.component';

export type Props = {
  metaActivity: MetaActivity;
  offers: {
    loading: boolean;
    nextPage: number | null;
    items: Offer<Coach, Establishment>[];
  };
  theme: CompanyTheme;
  showOfferFilling: boolean;
  loading: boolean;
  offerDetailsloading: boolean;
  hideCoach: boolean;
  onBookOption: (offer: Offer) => void;
  onBook: (offer: Offer) => void;
  onLoadMoreOffer: (page: number) => void;
  getCoach: (id: number) => Coach;
  getEstablishment: (id: number) => Establishment;
  getLevel: (id: number) => Level;
  getGroup: (id: number) => OffersGroup;
  getOffersListByGroup: (ids: number) => Offer[];
};

export const MarketplaceWorkshopCard: React.FC<Props> = ({
  metaActivity,
  theme,
  loading,
  showOfferFilling,
  offerDetailsloading,
  hideCoach,
  offers,
  onBookOption,
  onBook,
  onLoadMoreOffer,
  getCoach,
  getEstablishment,
  getLevel,
  getGroup,
  getOffersListByGroup,
}) => {
  const { t } = useTranslation(['marketplace', 'datetime']);
  const classes = useStyles();

  if (loading && !offers?.items?.length > 0) {
    return (
      <Card
        className={classNames(classes.container, 'bs-workshop-card--loading')}
      >
        <Skeleton animation="wave" variant="rect" width="100%">
          <div>
            <div
              className={classNames(
                classes.mediaWrapper,
                'bs-workshop-card__cover--loading',
              )}
            />
          </div>
        </Skeleton>

        <CardContent className="bs-workshop-card__content--loading">
          <div
            className={classNames(
              classes.title,
              'bs-workshop-card__content__title--loading',
            )}
          >
            <Skeleton animation="wave" width="80%" height={40} variant="text" />
          </div>

          <Skeleton
            animation="wave"
            variant="text"
            height={128}
            className={classNames(
              classes.description,
              'bs-workshop-card__content__description--loading',
            )}
          />

          <div
            className={classNames(
              classes.offerListCardTitleWrapper,
              'bs-workshop-card__offer-list__title-wrapper--loading',
            )}
          >
            <Skeleton animation="wave" width="80%" height={40} variant="text" />
          </div>
        </CardContent>

        <div
          className={classNames(
            classes.offerList,
            'bs-workshop-card__offer-list',
          )}
        >
          {Array(3)
            .fill(0)
            .map((_, index) => {
              return (
                <Skeleton
                  key={index}
                  className="bs-workshop-card__offer-list__offer--loading"
                  animation="pulse"
                  width="100%"
                  height={156}
                />
              );
            })}
        </div>
        <div
          className={classNames(
            classes.conditions,
            'bs-workshop-card__offer-list__offer__conditions',
          )}
        >
          <Skeleton animation="wave" variant="text" width="20%" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={classNames(classes.container, 'bs-workshop-card')}>
      <div
        className={classNames(classes.mediaWrapper, 'bs-workshop-card__cover')}
      >
        <CardMedia
          component="img"
          image={metaActivity.cover_main}
          alt={metaActivity.alt_cover_main}
          className={classes.fill}
        />
      </div>

      <CardContent className="bs-workshop-card__content">
        <div
          className={classNames(
            classes.title,
            'bs-workshop-card__content__title',
          )}
        >
          {metaActivity.name}
        </div>

        <UnfoldableText
          text={metaActivity.description}
          maxLines={6}
          className={classNames(
            classes.description,
            'bs-workshop-card__content__description',
          )}
          ids={{
            button: 'bs-workshop-card__content__description__unfold',
          }}
        />
        <div
          className={classNames(
            classes.offerListCardTitleWrapper,
            'bs-workshop-card__offer-list__title-wrapper',
          )}
        >
          <div
            className={classNames(
              classes.offerListTitle,
              'bs-workshop-card__offer-list__title',
            )}
          >
            {t('marketplace:workshop.card.bookTitle')}
          </div>
        </div>
      </CardContent>

      <div
        className={classNames(
          classes.offerList,
          'bs-workshop-card__offer-list',
        )}
      >
        {offers?.items?.map((offer) => {
          if (offer.group) {
            const group = getGroup(offer.group);
            const groupsLoading = false;
            const offersGroup = getOffersListByGroup(offer.group);

            if (!group)
              return (
                <MarketplaceGroupOfferListItem
                  customLevel={{}}
                  showOfferFilling={showOfferFilling}
                  theme={theme}
                  getEstablishment={getEstablishment}
                  getCoach={getCoach}
                  hideCoach
                  loading
                  onBookOption={() => {}}
                  onBook={() => {}}
                  offers={[]}
                  metaActivity={metaActivity}
                />
              );

            return (
              <MarketplaceGroupOfferListItem
                key={group.id}
                theme={theme}
                group={group}
                hideCoach={hideCoach}
                getEstablishment={getEstablishment}
                getCoach={getCoach}
                getLevel={getLevel}
                customLevel={getLevel(group.level)}
                showOfferFilling={showOfferFilling}
                loading={offerDetailsloading || groupsLoading}
                offers={offersGroup}
                metaActivity={metaActivity}
                onBookOption={onBookOption}
                onBook={onBook}
              />
            );
          }

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
              loading={offerDetailsloading}
              onBookOption={onBookOption}
              onBook={onBook}
            />
          );
        })}
        {!offerDetailsloading && !offers.loading && offers.nextPage && (
          <Button
            onClick={() => {
              onLoadMoreOffer(offers.nextPage);
            }}
            className={classNames(
              classes.loadMore,
              'bs-workshop-card__offer-list__offer__load-more',
            )}
          >
            {t('marketplace:workshop.card.loadMore')}
          </Button>
        )}
        {(offers.loading || offerDetailsloading) &&
          Array(3)
            .fill(0)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="bs-workshop-card__offer-list__offer--loading"
                animation="pulse"
                width="100%"
                height={120}
              />
            ))}
      </div>
      <div
        className={classNames(
          classes.conditions,
          'bs-workshop-card__offer-list__offer__conditions',
        )}
      >
        {t('metaActivity:settings.lastDiscardBeforeMinutes', {
          m: formatMinutes(metaActivity.last_discard_minutes, t),
        })}
      </div>
    </Card>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    width: '100%',
    borderRadius: 20,
    boxShadow: theme.shadows[5],
  },
  mediaWrapper: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%',
  },
  fillLoading: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  fill: {
    objectFit: 'cover',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  title: {
    fontWeight: 700,
    fontSize: 24,
    color: theme.palette.text.primary,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  iconDuration: {
    fill: theme.palette.text.secondary,
    height: 20,
  },
  rowText: {
    fontSize: 12,
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  description: {
    fontSize: 14,
    lineHeight: 1.6,
    marginTop: theme.spacing(4),
    whiteSpace: 'break-spaces',
  },
  buttonFlatPrimary: {
    fontSize: 16,
    color: theme.palette.primary.main,
    padding: theme.spacing(1),
  },
  offerListTitle: {
    fontWeight: 700,
    fontSize: 18,
    color: theme.palette.text.primary,
    marginTop: theme.spacing(4),
  },
  offerListCardTitleWrapper: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  offerListCardTitle: {
    fontWeight: 700,
    fontSize: 18,
    alignSelf: 'center',
  },
  offerList: {
    display: 'flex',
    flexDirection: 'column',
  },
  conditions: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
    fontSize: 14,
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(2),
  },
  loadMore: {
    color: theme.palette.primary.main,
  },
}));

export default React.memo(MarketplaceWorkshopCard);
