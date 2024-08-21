import React from 'react';

import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { OfferREST } from '#src/libs/offer/types';
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
import classNames from 'classnames';

export type MultiSessionOfferSelectorProps = {
  companyTheme: CompanyTheme;
  metaActivities: { [key: number]: MetaActivity };
  establishments: { [key: number]: Establishment };
  similarOffers: OfferREST[];
  fetchMoreSessions: () => void;
  onClose: () => void;
  isAbleToFetchMoreSimilarSessions: boolean;
};

type OfferStepperProps = {
  nextStep: () => void;
  setPreSelectedOffer: (offer: OfferREST) => void;
  preSelectedOffer: OfferREST;
};

export type MultiSessionOfferFinalProps = MultiSessionOfferSelectorProps &
  OfferStepperProps;

type OfferSessionCardProps<T> = {
  metaActivity: MetaActivity;
  companyTheme: CompanyTheme;
  establishment: Establishment;
  offer: OfferREST;
  isSelected: boolean;
  onClick: (content: T, isSelected: boolean) => void;
};

const OfferSessionCard: React.FC<OfferSessionCardProps<OfferREST>> = ({
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
  preSelectedOffer,
  isAbleToFetchMoreSimilarSessions,
  fetchMoreSessions,
  onClose,
  nextStep,
  setPreSelectedOffer,
}) => {
  const { t } = useTranslation(['common', 'booking']);
  const onSelectSession = React.useCallback(
    (offer: OfferREST, isSelected: boolean) => {
      if (isSelected) {
        setPreSelectedOffer(null);
      } else {
        setPreSelectedOffer(offer);
      }
    },
    [setPreSelectedOffer],
  );

  const handleAddOffer = React.useCallback(() => {
    if (preSelectedOffer) {
      nextStep();
    }
  }, [nextStep, preSelectedOffer]);

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

      <div className="bs-similar-offer-modal-container__body">
        <>
          {similarOffers && similarOffers.length > 0 ? (
            similarOffers.map((offer) => {
              return (
                <OfferSessionCard
                  key={offer.id}
                  companyTheme={companyTheme}
                  establishment={establishments?.[offer.establishment]}
                  isSelected={preSelectedOffer?.id === offer.id}
                  metaActivity={metaActivities?.[offer.meta_activity]}
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
          {isAbleToFetchMoreSimilarSessions ? (
            <ButtonBase
              className={classNames(
                'bs-similar-offer-modal-container__fetch__button',
                {
                  'bs-similar-offer-modal__button--disabled':
                    !isAbleToFetchMoreSimilarSessions,
                },
              )}
              disabled={!isAbleToFetchMoreSimilarSessions}
              onClick={fetchMoreSessions}
            >
              {t('common:text.showMoreText')}
            </ButtonBase>
          ) : null}
        </>
      </div>
      <div className="bs-similar-offer-modal-container__footer">
        <ButtonBase
          className="bs-similar-offer-modal-container__close__button"
          onClick={onClose}
        >
          {t('common:close').toUpperCase()}
        </ButtonBase>
        <ButtonBase
          className="bs-similar-offer-modal-container__add__button"
          disabled={preSelectedOffer === null}
          onClick={handleAddOffer}
        >
          {t('common:add').toUpperCase()}
        </ButtonBase>
      </div>
    </div>
  );
};

export default React.memo(MultiSessionOfferSelector);
