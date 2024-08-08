import React from 'react';

import type { OfferREST } from '#src/libs/offer/types';

import ModalToDrawerSwitcher from '#src/components/Modal/ModalToDrawerSwitcher.component';
import MultiSessionsOfferSelector, {
  MultiSessionOfferSelectorProps,
} from './MultiSessionOfferSelector.component';
import MultiSessionSpotSelector, {
  MultiSessionSpotSelectorProps,
} from './MultiSessionSpotSelector.component';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';

import './styles.css';

const ADD_SIMILAR_OFFER_STEPS = [
  {
    name: 'Select session',
    Component: (props: MultiSessionOfferSelectorProps) => (
      <MultiSessionsOfferSelector {...props} />
    ),
  },
  {
    name: 'Select spot',
    Component: (props: MultiSessionSpotSelectorProps) => (
      <MultiSessionSpotSelector {...props} />
    ),
  },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (offer: OfferREST) => void;
} & MultiSessionOfferSelectorProps &
  MultiSessionSpotSelectorProps;

const MultiSessionModalStepper: React.FC<
  Omit<
    Props,
    | 'nextStep'
    | 'preSelectedOffer'
    | 'setPreSelectedOffer'
    | 'offer'
    | 'addSessionOffer'
    | 'previousStep'
  >
> = ({
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
  theme,
  isOpen,
  isAbleToFetchMoreSimilarSessions,
}) => {
  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [preSelectedOffer, setPreSelectedOffer] =
    React.useState<OfferREST | null>(null);

  const onConfirmSessionToAdd = React.useCallback(
    (offer: OfferREST) => {
      if (offer) {
        onConfirm(offer);
        setCurrentStep(1);
        setPreSelectedOffer(null);
      }
    },
    [onConfirm, setCurrentStep, setPreSelectedOffer],
  );

  const nextStep = React.useCallback(() => {
    const isSpotSchedulingActivated =
      preSelectedOffer && preSelectedOffer.room_blueprint;
    if (
      currentStep < ADD_SIMILAR_OFFER_STEPS.length &&
      isSpotSchedulingActivated
    ) {
      setCurrentStep((current) => current + 1);
    } else if (preSelectedOffer) {
      onConfirmSessionToAdd(preSelectedOffer);
    }
  }, [currentStep, setCurrentStep, onConfirmSessionToAdd, preSelectedOffer]);

  const previousStep = React.useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((current) => current - 1);
    }
  }, [currentStep, setCurrentStep]);

  const getStepProps = React.useCallback(():
    | MultiSessionOfferSelectorProps
    | MultiSessionSpotSelectorProps => {
    if (currentStep === 1) {
      const bookableSimilarOffers = similarOffers.filter(
        (similarOffer) =>
          offerStatusById[similarOffer.id]?.bookable_status ===
          OFFER_BOOKABLE_STATUS_BOOKABLE,
      );

      return {
        setPreSelectedOffer,
        metaActivities,
        establishments,
        similarOffers: bookableSimilarOffers,
        fetchMoreSessions,
        nextStep,
        preSelectedOffer,
        theme,
        onClose,
        isAbleToFetchMoreSimilarSessions,
      };
    }
    return {
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
      theme,
    };
  }, [
    currentStep,
    fetchSpotForBlueprint,
    setPreSelectedOffer,
    metaActivities,
    establishments,
    similarOffers,
    fetchMoreSessions,
    nextStep,
    preSelectedOffer,
    theme,
    onClose,
    assetByIdBlueprintByIdentifier,
    onConfirmSessionToAdd,
    getSpotExpirationDatetime,
    fetchOfferStatus,
    getSpotCurrentlyInBasket,
    updateSpotForOffer,
    offerStatusById,
    roomBlueprintsById,
    selectedSpotsIds,
    spotTypes,
    previousStep,
    isAbleToFetchMoreSimilarSessions,
  ]);

  const ActiveComponent: React.FC<
    MultiSessionOfferSelectorProps | MultiSessionSpotSelectorProps
  > = ADD_SIMILAR_OFFER_STEPS[currentStep - 1]?.Component;

  return (
    <div className="bs-new-offer-booking-multi-session">
      <ModalToDrawerSwitcher isOpen={isOpen} maxWidth="md" onClose={onClose}>
        <ActiveComponent {...getStepProps()} />
      </ModalToDrawerSwitcher>
    </div>
  );
};

export default React.memo(MultiSessionModalStepper);
