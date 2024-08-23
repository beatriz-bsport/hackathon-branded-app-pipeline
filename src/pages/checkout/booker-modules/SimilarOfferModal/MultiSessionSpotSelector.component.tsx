import React from 'react';

import type { CompanyTheme } from '#src/libs/theme/types';
import type { Offer_FULL, OfferStatus } from '#src/libs/offer/types';
import type {
  AssetForBlueprint,
  RoomBlueprint,
  SpotType,
} from '#src/libs/spot-scheduling/types';
import { Close } from '@material-ui/icons';
import type { OptionCallback } from '#src/state/types';

import { DEFAULT_SPOT_TYPE } from '#src/libs/spot-scheduling/utils';

import { ButtonBase } from '@material-ui/core';
import MarketplaceSpotSelector from '#src/libs/marketplace/components/@SpotScheduling/MarketplaceSpotSelector';
import { useTranslation } from 'react-i18next';

import './styles.css';

export type MultiSessionSpotSelectorProps = {
  assetByIdBlueprintByIdentifier: {
    [key: string]: {
      [key: string]: AssetForBlueprint;
    };
  };
  fetchOfferStatus: (offerId: number) => void;
  fetchSpotForBlueprint: (
    data: { company: number },
    options?: OptionCallback,
  ) => void;
  getSpotExpirationDatetime: (offerId: number) => string;
  getSpotCurrentlyInBasket: (offerId: number) => string;
  updateSpotForOffer: (offer: number, index: number) => void;
  offerStatusById: {
    [key: string]: OfferStatus;
  };
  roomBlueprintsById: { [key: number]: RoomBlueprint };
  selectedSpotsIds: { [key: number]: number };
  spotTypes: SpotType[];
  companyTheme: CompanyTheme;
};

type SpotStepperProps = {
  addSessionOffer: (offer: Offer_FULL) => void;
  previousStep: () => void;
  offer: Offer_FULL;
};

export type MultiSessionSpotFinalProps = MultiSessionSpotSelectorProps &
  SpotStepperProps;

const MultiSessionSpotSelector: React.FC<MultiSessionSpotFinalProps> = ({
  assetByIdBlueprintByIdentifier,
  addSessionOffer,
  getSpotExpirationDatetime,
  fetchOfferStatus,
  fetchSpotForBlueprint,
  getSpotCurrentlyInBasket,
  updateSpotForOffer,
  offer,
  offerStatusById,
  roomBlueprintsById,
  selectedSpotsIds,
  spotTypes,
  companyTheme,
  previousStep,
}) => {
  const { t } = useTranslation(['common', 'booking']);

  const canvasContainerRef = React.useRef<HTMLDivElement | null>(null);

  const validateSpot = React.useCallback(() => {
    addSessionOffer(offer);
  }, [addSessionOffer, offer]);

  return (
    <div className="bs-new-offer-booking-page-multi-session-spot-selector">
      <div className="bs-new-offer-booking-multi-session-spot-selector__container">
        <div className="bs-new-offer-booking-multi-session-spot-selector__header">
          <div className="bs-new-offer-booking-multi-session-spot-selector__header__text__container">
            <div className="bs-new-offer-booking-multi-session-spot-selector__header__title">
              {t('booking:bookingModule.multiSession.selectSpot.dialogTitle')}
            </div>
            <div className="bs-new-offer-booking-multi-session-spot-selector__header__subtitle">
              {t(
                'booking:bookingModule.multiSession.selectSpot.dialogSubtitle',
              )}
            </div>
          </div>
          <ButtonBase onClick={previousStep}>
            <Close />
          </ButtonBase>
        </div>
        <div className="bs-new-offer-booking-multi-session-spot-selector__blueprint">
          {offer &&
            roomBlueprintsById &&
            roomBlueprintsById[offer.room_blueprint] && (
              <div ref={canvasContainerRef}>
                <MarketplaceSpotSelector
                  assetByIdBlueprintByIdentifier={
                    assetByIdBlueprintByIdentifier
                  }
                  closeSpotSelector={validateSpot}
                  expirationDatetime={getSpotExpirationDatetime(offer.id)}
                  fetchOfferStatus={fetchOfferStatus}
                  fetchSpotForBlueprint={fetchSpotForBlueprint}
                  offer={offer}
                  offerStatusById={offerStatusById}
                  roomBlueprintsById={roomBlueprintsById}
                  selectedSpot={selectedSpotsIds[offer.id]}
                  spotCurrentlyInBasket={getSpotCurrentlyInBasket(offer.id)}
                  spotTypes={[DEFAULT_SPOT_TYPE as SpotType].concat(spotTypes)}
                  theme={companyTheme}
                  updateSpotForOffer={updateSpotForOffer}
                />
              </div>
            )}
        </div>
        <div className="bs-new-offer-booking-multi-session-spot-selector__footer">
          <ButtonBase
            className="bs-new-offer-booking-multi-session-spot-selector__confirm__button"
            onClick={validateSpot}
          >
            {t(
              'booking:bookingModule.multiSession.selectSpot.validationButton',
            )}
          </ButtonBase>
          <ButtonBase
            className="bs-new-offer-booking-multi-session-spot-selector__cancel__button"
            onClick={previousStep}
          >
            {t('common:cancel')}
          </ButtonBase>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MultiSessionSpotSelector);
