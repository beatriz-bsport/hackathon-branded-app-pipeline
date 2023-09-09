// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import CardMedia from '@material-ui/core/CardMedia';

import MarketplaceOfferListItem from '#libs/marketplace/components/@Offer/MarketplaceGroupOfferListItem.component';
import { formatMinutes } from '../../../../../utils/datetime';
import { MetaActivity } from '#libs/meta-activity/types';
import type { OffersGroup } from '#libs/group-offer/types';
import UnfoldableText from '#components/typo/UnfoldableText.component';
import { CompanyTheme } from '#libs/theme/types';
import { Offer } from '#libs/offer/types';
import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { Level } from '#libs/level/types';
import MarketplaceGroupOfferListItem from '#libs/marketplace/components/@Offer/MarketplaceGroupOfferListItem.component/MarketplaceGroupOfferListItem.component';

import './MarketplaceWorkshopCard.css';
import { isOfferInThePast } from '#libs/marketplace/utils';

export type Props = {
  metaActivity: MetaActivity;
  offers: {
    loading: boolean;
    nextPage: number | null;
    items: Offer<Coach, Establishment>[];
  };
  theme: CompanyTheme;
  showOfferFilling: boolean;
  showOfferGender: boolean;
  loading: boolean;
  offerDetailsloading: boolean;
  bookedOffers: number[];
  hideCoach: boolean;
  coaches: Coach[];
  onBookOption: (offer: Offer) => void;
  onBook: (offer: Offer) => void;
  onLoadMoreOffer: (page: number) => void;
  getCoach: (id: number) => Coach;
  getEstablishment: (id: number) => Establishment;
  getLevel: { [id: number]: Level };
  getGroup: (id: number) => OffersGroup;
  getOffersListByGroup: (ids: number) => Offer[];
};

export const MarketplaceWorkshopCard: React.FC<Props> = ({
  metaActivity,
  theme,
  loading,
  showOfferFilling,
  showOfferGender,
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
  const { t } = useTranslation(['marketplace', 'datetime', 'metaActivity']);

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
            <Skeleton animation="wave" height={40} variant="text" width="80%" />
          </div>

          <Skeleton
            animation="wave"
            className="bs-workshop-card__content__description--loading"
            height={128}
            variant="text"
          />

          <div className="bs-workshop-card__offer-list__title-wrapper--loading">
            <Skeleton animation="wave" height={40} variant="text" width="80%" />
          </div>
        </div>

        <div className="bs-workshop-card__offer-list">
          {Array(3)
            .fill(0)
            .map((_, index) => {
              return (
                <Skeleton
                  key={index}
                  animation="pulse"
                  className="bs-workshop-card__offer-list__offer--loading"
                  height={156}
                  width="100%"
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
          alt={metaActivity.alt_cover_main}
          className="bs-workshop-card__cover__image"
          component="img"
          image={metaActivity.cover_main}
        />
      </div>

      <div className="bs-workshop-card__content">
        <div className="bs-workshop-card__content__title">
          {metaActivity.name}
        </div>

        <UnfoldableText
          className="bs-workshop-card__content__description"
          ids={{
            button: 'bs-workshop-card__content__description__unfold',
          }}
          maxLines={6}
          text={metaActivity.description}
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
                  hideCoach
                  isWorkshop
                  loading
                  withoutBookButton
                  bookedOffers={[]}
                  customLevel={{}}
                  getCoach={getCoach}
                  getEstablishment={getEstablishment}
                  getLevel={getLevel}
                  metaActivity={metaActivity}
                  offers={[]}
                  onBook={() => {}}
                  onBookOption={() => {}}
                  showOfferFilling={showOfferFilling}
                  showOfferGender={showOfferGender}
                  theme={theme}
                />
              );

            return (
              <MarketplaceGroupOfferListItem
                key={group.id}
                isWorkshop
                withoutBookButton
                bookedOffers={bookedOffers}
                customLevel={getLevel[group.level]}
                getCoach={getCoach}
                getEstablishment={getEstablishment}
                getLevel={getLevel}
                group={group}
                hideCoach={hideCoach}
                loading={offerDetailsloading || groupsLoading}
                metaActivity={metaActivity}
                offers={offersGroup}
                onBook={onBook}
                onBookOption={onBookOption}
                showOfferFilling={showOfferFilling}
                showOfferGender={showOfferGender}
                theme={theme}
              />
            );
          }
          return (
            <MarketplaceOfferListItem
              key={offer.id}
              isWorkshop
              showDate
              additionalCoaches={offer.additional_coaches.map((coachId) =>
                getCoach(coachId),
              )}
              coach={getCoach(offer.coach_override || offer.coach)}
              customLevel={getLevel[offer.custom_level]}
              establishment={getEstablishment(offer.establishment)}
              getLevel={getLevel}
              hideCoach={hideCoach}
              isBookingDisabled={!offer.available || isOfferInThePast(offer)}
              isOfferPassed={isOfferInThePast(offer)}
              isRegistered={
                bookedOffers?.length ? bookedOffers.includes(offer.id) : false
              }
              loading={offerDetailsloading}
              metaActivity={metaActivity}
              offer={{
                ...offer,
                meta_activity: metaActivity,
              }}
              onBook={onBook}
              onBookOption={onBookOption}
              onClick={onBook}
              showOfferFilling={showOfferFilling}
              showOfferGender={showOfferGender}
              theme={theme}
              variant="time"
            />
          );
        })}
        {!offerDetailsloading && !offers.loading && offers.nextPage && (
          <Button
            className="bs-workshop-card__offer-list__offer__load-more"
            onClick={() => {
              onLoadMoreOffer(offers.nextPage);
            }}
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
                animation="pulse"
                className="bs-workshop-card__offer-list__offer--loading"
                height={120}
                width="100%"
              />
            ))}
      </div>
      <div className="bs-workshop-card__offer-list__offer__conditions">
        {t('metaActivity:settings.lastDiscardBeforeMinutesFull', {
          m: formatMinutes(metaActivity.last_discard_minutes, t),
        })}
      </div>
    </div>
  );
};

export default React.memo(MarketplaceWorkshopCard);
