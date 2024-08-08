import React from 'react';

import type { CompanyTheme } from '#src/libs/theme/types';
import type { OfferREST, OfferStatus } from '#src/libs/offer/types';
import type {
  AssetForBlueprint,
  RoomBlueprint,
  SpotType,
} from '#src/libs/spot-scheduling/types';
import { Close } from '@material-ui/icons';
import type { OptionCallback } from '#src/state/types';

import { DEFAULT_SPOT_TYPE } from '#src/libs/spot-scheduling/utils';

import { Button, ButtonBase } from '@material-ui/core';
import MarketplaceSpotSelector from '#src/libs/marketplace/components/@SpotScheduling/MarketplaceSpotSelector';

import './styles.css';
import { useTranslation } from 'react-i18next';

export type MultiSessionSpotSelectorProps = {
  assetByIdBlueprintByIdentifier: {
    [key: string]: {
      [key: string]: AssetForBlueprint;
    };
  };
  addSessionOffer: (offer: OfferREST) => void;
  fetchOfferStatus: (offerId: number) => void;
  fetchSpotForBlueprint: (
    data: { company: number },
    options?: OptionCallback,
  ) => void;
  getSpotExpirationDatetime: (offerId: number) => string;
  getSpotCurrentlyInBasket: (offerId: number) => string;
  updateSpotForOffer: (offer: number, index: number) => void;
  offer: OfferREST;
  offerStatusById: {
    [key: string]: OfferStatus;
  };
  roomBlueprintsById: { [key: number]: RoomBlueprint };
  selectedSpotsIds: { [key: number]: number };
  spotTypes: SpotType[];
  theme: CompanyTheme;
  previousStep: () => void;
};

const MultiSessionSpotSelector: React.FC<MultiSessionSpotSelectorProps> = ({
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
  theme,
  previousStep,
}) => {
  const { t } = useTranslation(['common', 'booking']);

  const canvasContainerRef = React.useRef<HTMLDivElement | null>(null);

  const validateSpot = () => {
    addSessionOffer(offer);
  };

  return (
    <div className="bs-new-offer-booking-page-multi-session--spot-selector">
      <div className="bs-new-offer-booking-multi-session__spot-selector__container">
        <div className="bs-new-offer-booking-multi-session__spot-selector__header">
          <div className="bs-new-offer-booking-multi-session__spot-selector__header_text_container">
            <div className="bs-new-offer-booking-multi-session__spot-selector__header_title">
              {t('booking:bookingModule.multiSession.selectSpot.dialogTitle')}
            </div>
            <div className="bs-new-offer-booking-multi-session__spot-selector__header_subtitle">
              {t(
                'booking:bookingModule.multiSession.selectSpot.dialogSubtitle',
              )}
            </div>
          </div>
          <ButtonBase onClick={previousStep}>
            <Close />
          </ButtonBase>
        </div>
        <div className="bs-new-offer-booking-multi-session__spot-selector__blueprint">
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
                  theme={theme}
                  updateSpotForOffer={updateSpotForOffer}
                />
              </div>
            )}
        </div>
        <div className="bs-new-offer-booking-multi-session__spot-selector__footer">
          <Button
            className="bs-new-offer-booking-multi-session__spot-selector__confirm_button"
            onClick={validateSpot}
          >
            {t(
              'booking:bookingModule.multiSession.selectSpot.validationButton',
            ).toUpperCase()}
          </Button>
          <Button
            className="bs-new-offer-booking-multi-session__spot-selector__cancel_button"
            onClick={previousStep}
          >
            {t('common:cancel').toUpperCase()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MultiSessionSpotSelector);
