import React from 'react';

import type { OfferREST } from '#src/libs/offer/types';

import ModalToDrawerSwitcher from '#src/components/Modal/ModalToDrawerSwitcher.component';
import MultiSessionsOfferSelector, {
  MultiSessionOfferFinalProps,
  MultiSessionOfferSelectorProps,
} from './MultiSessionOfferSelector.component';
import MultiSessionSpotSelector, {
  MultiSessionSpotFinalProps,
  MultiSessionSpotSelectorProps,
} from './MultiSessionSpotSelector.component';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';

import './styles.css';

enum MultiSessionModalStepperStater {
  SESSION = 0,
  SPOT = 1,
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (offer: OfferREST) => void;
} & MultiSessionOfferSelectorProps &
  MultiSessionSpotSelectorProps;

const MultiSessionModalStepper: React.FC<Props> = ({
  metaActivities,
  establishments,
  similarOffers,
  fetchMoreSessions,
  onClose,
  onConfirm,
  assetByIdBlueprintByIdentifier,
  getSpotExpirationDatetime,
  fetchOfferStatus,
  fetchSpotForBlueprint,
  getSpotCurrentlyInBasket,
  updateSpotForOffer,
  offerStatusById,
  roomBlueprintsById,
  selectedSpotsIds,
  spotTypes,
  companyTheme,
  isOpen,
  isAbleToFetchMoreSimilarSessions,
}) => {
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [preSelectedOffer, setPreSelectedOffer] =
    React.useState<OfferREST | null>(null);

  const onConfirmSessionToAdd = React.useCallback(
    (offer: OfferREST) => {
      if (offer) {
        onConfirm(offer);
        setCurrentStep(0);
        setPreSelectedOffer(null);
      }
    },
    [onConfirm, setCurrentStep, setPreSelectedOffer],
  );

  const nextStep = React.useCallback(() => {
    const isSpotSchedulingActivated =
      preSelectedOffer && preSelectedOffer.room_blueprint;
    if (
      currentStep < Object.values(MultiSessionModalStepperStater).length &&
      isSpotSchedulingActivated
    ) {
      setCurrentStep((current) => current + 1);
    } else if (preSelectedOffer) {
      onConfirmSessionToAdd(preSelectedOffer);
    }
  }, [currentStep, setCurrentStep, onConfirmSessionToAdd, preSelectedOffer]);

  const previousStep = React.useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((current) => current - 1);
    }
  }, [currentStep, setCurrentStep]);

  const bookableSimilarOffers = React.useMemo(
    () =>
      similarOffers.filter(
        (similarOffer) =>
          offerStatusById[similarOffer.id]?.bookable_status ===
          OFFER_BOOKABLE_STATUS_BOOKABLE,
      ) ?? [],
    [offerStatusById, similarOffers],
  );

  const currentProps: (
    | MultiSessionOfferFinalProps
    | MultiSessionSpotFinalProps
  )[] = [
    {
      setPreSelectedOffer,
      metaActivities,
      establishments,
      similarOffers: bookableSimilarOffers,
      fetchMoreSessions,
      nextStep,
      preSelectedOffer,
      companyTheme,
      onClose,
      isAbleToFetchMoreSimilarSessions,
    },
    {
      assetByIdBlueprintByIdentifier,
      addSessionOffer: onConfirmSessionToAdd,
      getSpotExpirationDatetime,
      fetchOfferStatus,
      fetchSpotForBlueprint,
      getSpotCurrentlyInBasket,
      updateSpotForOffer,
      offer: preSelectedOffer,
      offerStatusById,
      roomBlueprintsById,
      selectedSpotsIds,
      spotTypes,
      previousStep,
      companyTheme,
    },
  ];

  return (
    <div className="bs-new-offer-booking-multi-session">
      <ModalToDrawerSwitcher isOpen={isOpen} maxWidth="md" onClose={onClose}>
        <>
          {currentStep === MultiSessionModalStepperStater.SESSION && (
            <MultiSessionsOfferSelector
              {...(currentProps[currentStep] as MultiSessionOfferFinalProps)}
            />
          )}
          {currentStep === MultiSessionModalStepperStater.SPOT && (
            <MultiSessionSpotSelector
              {...(currentProps[currentStep] as MultiSessionSpotFinalProps)}
            />
          )}
        </>
      </ModalToDrawerSwitcher>
    </div>
  );
};

export default React.memo(MultiSessionModalStepper);
