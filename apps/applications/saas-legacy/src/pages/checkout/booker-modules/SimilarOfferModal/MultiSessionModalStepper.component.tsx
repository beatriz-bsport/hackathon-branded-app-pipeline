import React from 'react';

import type { Offer_FULL } from '#src/libs/offer/types';

import ModalToDrawerSwitcher from '#src/components/Modal/ModalToDrawerSwitcher.component';
import MultiSessionsOfferSelector, {
  MultiSessionOfferFinalProps,
  MultiSessionOfferSelectorProps,
} from './MultiSessionOfferSelector.component';
import MultiSessionSpotSelector, {
  MultiSessionSpotFinalProps,
  MultiSessionSpotSelectorProps,
} from './MultiSessionSpotSelector.component';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status.js';

import './styles.css';

enum MultiSessionModalStepperStater {
  SESSION = 0,
  SPOT = 1,
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (offer: Offer_FULL) => void;
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
  similarOffersLoading,
  similarOffersTotalCount,
}) => {
  const [currentStep, setCurrentStep] = React.useState<number>(
    MultiSessionModalStepperStater.SESSION,
  );
  const [preSelectedOffers, setPreSelectedOffers] = React.useState<
    Offer_FULL[]
  >([]);

  const onConfirmSessionToAdd = React.useCallback(
    (offer: Offer_FULL) => {
      if (offer) {
        onConfirm(offer);
      }
    },
    [onConfirm],
  );

  const nextStep = React.useCallback(() => {
    const isSpotSchedulingActivated =
      preSelectedOffers &&
      preSelectedOffers.length > 0 &&
      preSelectedOffers.filter((offer) => offer.room_blueprint).length > 0;
    if (
      currentStep < Object.values(MultiSessionModalStepperStater).length &&
      isSpotSchedulingActivated
    ) {
      const preSelectedOffersWithoutSpotScheduling =
        preSelectedOffers.filter(
          (preSelectedOffer) => preSelectedOffer.room_blueprint === null,
        ) ?? [];
      preSelectedOffersWithoutSpotScheduling.forEach((preSelectedOffer) =>
        onConfirmSessionToAdd(preSelectedOffer),
      );
      setCurrentStep((current) => current + 1);
    } else if (preSelectedOffers) {
      preSelectedOffers.forEach((preSelectedOffer) =>
        onConfirmSessionToAdd(preSelectedOffer),
      );
      onClose();
    }
  }, [
    currentStep,
    setCurrentStep,
    onConfirmSessionToAdd,
    preSelectedOffers,
    onClose,
  ]);

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

  const onCloseModal = React.useCallback(() => {
    setPreSelectedOffers([]);
    setCurrentStep(MultiSessionModalStepperStater.SESSION);
    onClose();
  }, [setPreSelectedOffers, setCurrentStep, onClose]);

  const currentProps: (
    | MultiSessionOfferFinalProps
    | MultiSessionSpotFinalProps
  )[] = [
    {
      setPreSelectedOffers,
      metaActivities,
      establishments,
      similarOffers: bookableSimilarOffers,
      fetchMoreSessions,
      nextStep,
      preSelectedOffers,
      companyTheme,
      onClose: onCloseModal,
      isAbleToFetchMoreSimilarSessions,
      similarOffersLoading,
      similarOffersTotalCount,
    },
    {
      assetByIdBlueprintByIdentifier,
      addSessionOffer: onConfirmSessionToAdd,
      getSpotExpirationDatetime,
      fetchOfferStatus,
      fetchSpotForBlueprint,
      getSpotCurrentlyInBasket,
      updateSpotForOffer,
      offers: preSelectedOffers,
      offerStatusById,
      roomBlueprintsById,
      selectedSpotsIds,
      spotTypes,
      previousStep,
      companyTheme,
      onClose: onCloseModal,
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
