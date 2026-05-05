import React, { useCallback, useMemo, useState } from 'react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';

import { formatAsDatetime, formatMinutes } from '#src/utils/datetime';
import { WELLHUB_PRODUCT_SELECTION_INITIAL_VALUES } from '#src/libs/wellhub/constants';

import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import WellhubProductSelectionContent from './WellhubProductSelectionContent.component';
import WellhubProductSelectionValidationSchema from './validationSchema';

import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import type {
  Offer,
  OfferSaas,
  UpdateWellhubProductIdPayload,
} from '#src/libs/offer/types';
import type { ReworkedPaginationResponse } from '#src/state/types';
import type { WellhubProductSelectionFormValues } from '#src/libs/wellhub/types';

type Props = {
  coaches: Coach[];
  isLoading: boolean;
  isOpen: boolean;
  offersData: ReworkedPaginationResponse<OfferSaas>;
  similarOffers: Offer<Coach, Establishment>[];
  similarOffersLoading: boolean;
  wellhubPartnershipId?: number | null;
  fetchMissingProductOffersSpecificPage: (page: number) => void;
  fetchSimilarOffers: (offerId: number) => void;
  onClose: () => void;
  onConfirm: (data: {
    offerId: number;
    data: UpdateWellhubProductIdPayload;
  }) => void;
};

const WellhubProductSelectionDrawer: React.FC<Props> = ({
  coaches,
  isLoading,
  isOpen,
  offersData,
  similarOffers,
  similarOffersLoading,
  wellhubPartnershipId,
  fetchMissingProductOffersSpecificPage,
  fetchSimilarOffers,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation('partnership');

  const [offerClickedId, setOfferClickedId] = useState<number | null>(null);

  const offerClicked = useMemo(
    () =>
      (!!offerClickedId &&
        offersData.results.find((offer) => offer.id === offerClickedId)) ||
      null,
    [offerClickedId, offersData.results],
  );

  const drawerTitle = useMemo(
    () =>
      offerClicked
        ? offerClicked.name
        : t('wellhub.productSelection.drawer.title'),
    [offerClicked, t],
  );

  const drawerSubtitle = useMemo(
    () =>
      offerClicked
        ? `${formatAsDatetime(
            offerClicked.date_start,
            offerClicked.timezone_name,
          )} - ${formatMinutes(offerClicked.duration_minute, t)}`
        : null,
    [offerClicked, t],
  );

  const drawerDescription = useMemo(
    () =>
      offerClicked
        ? t('wellhub.productSelection.drawer.actionRequired')
        : t('wellhub.productSelection.drawer.description'),
    [offerClicked, t],
  );

  const handleOnOfferClick = useCallback(
    (offerId: number) => setOfferClickedId(offerId),
    [],
  );

  const handleResetOfferClicked = useCallback(
    () => setOfferClickedId(null),
    [],
  );

  React.useEffect(() => {
    !!offerClickedId && fetchSimilarOffers(offerClickedId);
  }, [fetchSimilarOffers, offerClickedId]);

  if (!isLoading && !offersData.results?.length) {
    return null;
  }

  return (
    <GenericResponsiveDrawer
      onClose={onClose}
      open={isOpen}
      subtitle={drawerSubtitle}
      title={drawerTitle}
    >
      <Formik<WellhubProductSelectionFormValues>
        initialValues={WELLHUB_PRODUCT_SELECTION_INITIAL_VALUES}
        onSubmit={null}
        validationSchema={WellhubProductSelectionValidationSchema}
      >
        <WellhubProductSelectionContent
          coaches={coaches}
          descriptionText={drawerDescription}
          fetchMissingProductOffersSpecificPage={
            fetchMissingProductOffersSpecificPage
          }
          isLoading={isLoading}
          offersData={offersData}
          offerSelected={offerClicked}
          onClose={onClose}
          onConfirm={onConfirm}
          onOfferClick={handleOnOfferClick}
          resetOfferClicked={handleResetOfferClicked}
          similarOffers={similarOffers}
          similarOffersLoading={similarOffersLoading}
          wellhubPartnershipId={wellhubPartnershipId}
        />
      </Formik>
    </GenericResponsiveDrawer>
  );
};

export default React.memo(WellhubProductSelectionDrawer);
