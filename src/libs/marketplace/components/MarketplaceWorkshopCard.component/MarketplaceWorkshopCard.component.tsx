import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import CardMedia from '@material-ui/core/CardMedia';

import MarketplaceOfferListItem from '../MarketplaceOfferListItemCSSOnly';
import { formatMinutes } from '../../../../utils/datetime';
import { MetaActivity, OffersGroup } from '#libs/meta-activity/types';
import UnfoldableText from '#components/typo/UnfoldableText.component';
import { CompanyTheme } from '#libs/theme/types';
import { Offer } from '#libs/offer/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { Level } from '#libs/level/types';
import MarketplaceGroupOfferListItem from '../MarketplaceGroupOfferListItem.component/MarketplaceGroupOfferListItem.component';

import './MarketplaceWorkshopCard.css';

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
  bookedOffers: number[];
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
  bookedOffers,
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

  if (loading && !offers?.items?.length > 0) {
    return (
      <div className="bs-workshop-card bs-workshop-card--loading">
        <Skeleton animation="wave" variant="rect" width="100%">
          <div>
            <div className="bs-workshop-card__cover--loading" />
          </div>
        </Skeleton>

        <div className="bs-workshop-card__content bs-workshop-card__content--loading">
          <div className="bs-workshop-card__content__title--loading">
            <Skeleton animation="wave" width="80%" height={40} variant="text" />
          </div>

          <Skeleton
            animation="wave"
            variant="text"
            height={128}
            className="bs-workshop-card__content__description--loading"
          />

          <div className="bs-workshop-card__offer-list__title-wrapper--loading">
            <Skeleton animation="wave" width="80%" height={40} variant="text" />
          </div>
        </div>

        <div className="bs-workshop-card__offer-list">
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
        <div className="bs-workshop-card__offer-list__offer__conditions">
          <Skeleton animation="wave" variant="text" width="20%" />
        </div>
      </div>
    );
  }

  return (
    <div className="bs-workshop-card">
      <div className="bs-workshop-card__cover">
        <CardMedia
          component="img"
          image={metaActivity.cover_main}
          alt={metaActivity.alt_cover_main}
          className="bs-workshop-card__cover__image"
        />
      </div>

      <div className="bs-workshop-card__content">
        <div className="bs-workshop-card__content__title">
          {metaActivity.name}
        </div>

        <UnfoldableText
          text={metaActivity.description}
          maxLines={6}
          className="bs-workshop-card__content__description"
          ids={{
            button: 'bs-workshop-card__content__description__unfold',
          }}
        />
        <div className="bs-workshop-card__offer-list__title-wrapper">
          <div className="bs-workshop-card__offer-list__title">
            {t('marketplace:workshop.card.bookTitle')}
          </div>
        </div>
      </div>

      <div className="bs-workshop-card__offer-list">
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
                  getLevel={getLevel}
                  hideCoach
                  loading
                  onBookOption={() => {}}
                  onBook={() => {}}
                  offers={[]}
                  metaActivity={metaActivity}
                  bookedOffers={[]}
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
                bookedOffers={bookedOffers}
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
              getLevel={getLevel}
              theme={theme}
              hideCoach={hideCoach}
              loading={offerDetailsloading}
              onBookOption={onBookOption}
              onBook={onBook}
              isRegistered={
                bookedOffers?.length ? bookedOffers.includes(offer.id) : false
              }
            />
          );
        })}
        {!offerDetailsloading && !offers.loading && offers.nextPage && (
          <Button
            onClick={() => {
              onLoadMoreOffer(offers.nextPage);
            }}
            className="bs-workshop-card__offer-list__offer__load-more"
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
      <div className="bs-workshop-card__offer-list__offer__conditions">
        {t('metaActivity:settings.lastDiscardBeforeMinutes', {
          m: formatMinutes(metaActivity.last_discard_minutes, t),
        })}
      </div>
    </div>
  );
};

export default React.memo(MarketplaceWorkshopCard);
