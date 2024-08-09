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

export type MultiSessionOfferSelectorProps = {
  theme: CompanyTheme;
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
  theme: CompanyTheme;
  establishment: Establishment;
  offer: OfferREST;
  isSelected: boolean;
  onClick: (content: T, isSelected: boolean) => void;
};

const OfferSessionCard: React.FC<OfferSessionCardProps<OfferREST>> = ({
  metaActivity,
  theme,
  establishment,
  offer,
  isSelected,
  onClick,
}) => {
  const formattedDate = useOfferFormattedDate(
    offer,
    establishment,
    metaActivity,
    theme,
  );

  const offerHours = useOfferHours(offer, establishment, metaActivity, theme);

  const formattedOfferHours = formatOfferHours(offerHours);

  const date = formatOfferDateWithTime(formattedDate, formattedOfferHours);

  return (
    <ButtonBase
      key={offer.id}
      className={
        isSelected
          ? 'bs-similar-offer-modal-card-active'
          : 'bs-similar-offer-modal-card'
      }
      onClick={() => onClick(offer, isSelected)}
    >
      <Typography className="bs-similar-offer-modal-card-title">
        {metaActivity.name}
      </Typography>
      <Typography className="bs-similar-offer-modal-card-subtitle">
        {date}
      </Typography>
    </ButtonBase>
  );
};

const MultiSessionOfferSelector: React.FC<MultiSessionOfferFinalProps> = ({
  theme,
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
  const onSelectSession = (offer: OfferREST, isSelected: boolean) => {
    if (isSelected) {
      setPreSelectedOffer(null);
    } else {
      setPreSelectedOffer(offer);
    }
  };

  const handleAddOffer = () => {
    if (preSelectedOffer) {
      nextStep();
    }
  };

  return (
    <div className="bs-similar-offer-modal-container">
      <div className="bs-similar-offer-modal-container-header_container">
        <div className="bs-similar-offer-modal-container-header_text_container">
          <div className="bs-similar-offer-modal-container-header-title">
            {t('booking:bookingModule.multiSession.addSession.dialogTitle')}
          </div>
          <div className="bs-similar-offer-modal-container-header-subtitle">
            {t('booking:bookingModule.multiSession.addSession.dialogSubtitle')}
          </div>
        </div>
        <ButtonBase onClick={onClose}>
          <Close />
        </ButtonBase>
      </div>

      <div className="bs-similar-offer-modal-container-body">
        <>
          {similarOffers.length > 0 ? (
            similarOffers.map((offer) => {
              return (
                <OfferSessionCard
                  key={offer.id}
                  establishment={establishments?.[offer.establishment]}
                  isSelected={preSelectedOffer?.id === offer.id}
                  metaActivity={metaActivities?.[offer.meta_activity]}
                  offer={offer}
                  onClick={onSelectSession}
                  theme={theme}
                />
              );
            })
          ) : (
            <div className="bs-similar-offer-modal-container-body__no_content">
              {t('booking:bookingModule.multiSession.addSession.noContent')}
            </div>
          )}
          <ButtonBase
            className={
              isAbleToFetchMoreSimilarSessions
                ? 'bs-similar-offer-modal-container-fetch-button'
                : 'button__disabled bs-similar-offer-modal-container-fetch-button'
            }
            disabled={!isAbleToFetchMoreSimilarSessions}
            onClick={fetchMoreSessions}
          >
            {t('booking:bookingModule.multiSession.addSession.fetchButton')}
          </ButtonBase>
        </>
      </div>
      <div className="bs-similar-offer-modal-container-footer">
        <ButtonBase
          className="bs-similar-offer-modal-container-close-button"
          onClick={onClose}
        >
          {t('common:close').toUpperCase()}
        </ButtonBase>
        <ButtonBase
          className="bs-similar-offer-modal-container-add-button"
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
