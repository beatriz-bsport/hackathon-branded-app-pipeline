import React, { useEffect } from 'react';

import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { Offer_FULL } from '#src/libs/offer/types';
import type { CompanyTheme } from '#src/libs/theme/types';

import {
  useOfferFormattedDate,
  useOfferHours,
} from '#src/libs/marketplace/hooks';
import {
  formatOfferDateWithTime,
  formatOfferHours,
} from '#src/libs/marketplace/utils/offer';
import { Close } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

import './styles.css';
import clsx from 'clsx';

export type MultiSessionOfferSelectorProps = {
  companyTheme: CompanyTheme;
  metaActivities: { [key: number]: MetaActivity };
  establishments: { [key: number]: Establishment };
  similarOffers: Offer_FULL[];
  fetchMoreSessions: () => void;
  onClose: () => void;
  isAbleToFetchMoreSimilarSessions: boolean;
  similarOffersLoading: boolean;
  similarOffersTotalCount: number;
};

type OfferStepperProps = {
  nextStep: () => void;
  setPreSelectedOffers: (offers: Offer_FULL[]) => void;
  preSelectedOffers: Offer_FULL[];
};

export type MultiSessionOfferFinalProps = MultiSessionOfferSelectorProps &
  OfferStepperProps;

type OfferSessionCardProps<T> = {
  metaActivity: MetaActivity;
  companyTheme: CompanyTheme;
  establishment: Establishment;
  offer: Offer_FULL;
  isSelected: boolean;
  onClick: (content: T, isSelected: boolean) => void;
};

const OfferSessionCard: React.FC<OfferSessionCardProps<Offer_FULL>> = ({
  metaActivity,
  companyTheme,
  establishment,
  offer,
  isSelected,
  onClick,
}) => {
  const formattedDate = useOfferFormattedDate(
    offer,
    establishment,
    metaActivity,
    companyTheme,
  );

  const offerHours = useOfferHours(
    offer,
    establishment,
    metaActivity,
    companyTheme,
  );

  const formattedOfferHours = formatOfferHours(offerHours);

  const date = formatOfferDateWithTime(formattedDate, formattedOfferHours);

  const handleClick = React.useCallback(() => {
    onClick(offer, isSelected);
  }, [offer, isSelected, onClick]);

  return (
    <ButtonBase
      key={offer.id}
      className={
        isSelected
          ? 'bs-similar-offer-modal__card--active'
          : 'bs-similar-offer-modal__card'
      }
      onClick={handleClick}
    >
      <Typography className="bs-similar-offer-modal__card__title">
        {metaActivity.name}
      </Typography>
      <Typography className="bs-similar-offer-modal__card__subtitle">
        {date}
      </Typography>
    </ButtonBase>
  );
};

const MultiSessionOfferSelector: React.FC<MultiSessionOfferFinalProps> = ({
  companyTheme,
  metaActivities,
  establishments,
  similarOffers,
  preSelectedOffers,
  isAbleToFetchMoreSimilarSessions,
  fetchMoreSessions,
  onClose,
  nextStep,
  setPreSelectedOffers,
  similarOffersLoading,
  similarOffersTotalCount,
}) => {
  const { t } = useTranslation(['common', 'booking']);
  const onSelectSession = React.useCallback(
    (offer: Offer_FULL, isSelected: boolean) => {
      if (isSelected) {
        setPreSelectedOffers([
          ...preSelectedOffers.filter(
            (preSelectedOffer) => preSelectedOffer.id !== offer.id,
          ),
        ]);
      } else {
        setPreSelectedOffers([...preSelectedOffers, offer]);
      }
    },
    [setPreSelectedOffers, preSelectedOffers],
  );

  const onSelectAllSessions = React.useCallback(() => {
    setPreSelectedOffers(similarOffers);
  }, [setPreSelectedOffers, similarOffers]);

  const handleAddOffer = React.useCallback(() => {
    if (preSelectedOffers) {
      nextStep();
    }
  }, [nextStep, preSelectedOffers]);

  useEffect(() => {
    if (
      similarOffers?.length &&
      preSelectedOffers?.length &&
      similarOffers.length === preSelectedOffers.length
    ) {
      fetchMoreSessions();
    }
  }, [similarOffers?.length, preSelectedOffers?.length, fetchMoreSessions]);

  const areAllSessionsSelected =
    !isAbleToFetchMoreSimilarSessions &&
    similarOffers?.length &&
    preSelectedOffers?.length &&
    similarOffers.length === preSelectedOffers.length;

  return (
    <div className="bs-similar-offer-modal-container">
      <div className="bs-similar-offer-modal-container__header__container">
        <div className="bs-similar-offer-modal-container__header__text__container">
          <div className="bs-similar-offer-modal-container__header__title">
            {t('booking:bookingModule.multiSession.addSession.dialogTitle')}
          </div>
          <div className="bs-similar-offer-modal-container__header__subtitle">
            {t('booking:bookingModule.multiSession.addSession.dialogSubtitle')}
          </div>
        </div>
        <ButtonBase onClick={onClose}>
          <Close />
        </ButtonBase>
      </div>
      <div className="bs-similar-offer-modal-container__header__select-all-button-container">
        <ButtonBase
          className="bs-similar-offer-modal-container__header__select-all-button"
          disabled={areAllSessionsSelected || similarOffersLoading}
          onClick={onSelectAllSessions}
        >
          {t('booking:bookingModule.multiSession.addSession.selectAll')}
        </ButtonBase>
        {!!similarOffersTotalCount && (
          <Typography color="textSecondary" variant="body2">
            {t('booking:bookingModule.multiSession.addSession.sessionCount', {
              selectedSessionsCount: preSelectedOffers?.length,
              totalSessionsCount: similarOffersTotalCount,
            })}
          </Typography>
        )}
      </div>
      <div className="bs-similar-offer-modal-container__body">
        <>
          {similarOffers && similarOffers.length > 0 ? (
            similarOffers.map((offer) => {
              const offerMetaActiviy =
                typeof offer.meta_activity === 'number'
                  ? metaActivities?.[offer.meta_activity]
                  : offer.meta_activity;
              const offerEstablishments =
                typeof offer.establishment === 'number'
                  ? establishments?.[offer.establishment]
                  : offer.establishment;
              const isOfferSelected =
                preSelectedOffers &&
                preSelectedOffers.length > 0 &&
                !!preSelectedOffers.find(
                  (selectedOffer) => selectedOffer.id === offer.id,
                );
              return (
                <OfferSessionCard
                  key={offer.id}
                  companyTheme={companyTheme}
                  establishment={offerEstablishments}
                  isSelected={isOfferSelected}
                  metaActivity={offerMetaActiviy}
                  offer={offer}
                  onClick={onSelectSession}
                />
              );
            })
          ) : (
            <div className="bs-similar-offer-modal-container__body__no_content">
              {t('booking:bookingModule.multiSession.addSession.noContent')}
            </div>
          )}
          {isAbleToFetchMoreSimilarSessions && (
            <ButtonBase
              className={clsx(
                'bs-similar-offer-modal-container__fetch__button',
                {
                  'bs-similar-offer-modal__button--disabled':
                    !isAbleToFetchMoreSimilarSessions,
                },
              )}
              disabled={
                !isAbleToFetchMoreSimilarSessions || similarOffersLoading
              }
              onClick={fetchMoreSessions}
            >
              {t('common:text.showMoreText')}
            </ButtonBase>
          )}
        </>
      </div>
      <div className="bs-similar-offer-modal-container__footer">
        <ButtonBase
          className="bs-similar-offer-modal-container__close__button"
          onClick={onClose}
        >
          {t('common:close')}
        </ButtonBase>
        <ButtonBase
          className="bs-similar-offer-modal-container__add__button"
          disabled={preSelectedOffers && preSelectedOffers.length < 1}
          onClick={handleAddOffer}
        >
          {t('booking:bookingModule.multiSession.selectSpot.validationButton', {
            count: preSelectedOffers?.length || 1,
            selectedSessionsCount: preSelectedOffers?.length,
          })}
        </ButtonBase>
      </div>
    </div>
  );
};

export default React.memo(MultiSessionOfferSelector);
