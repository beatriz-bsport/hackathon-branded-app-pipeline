import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';

import { WELLHUB_PRODUCT_SELECTION_INITIAL_VALUES } from '#src/libs/wellhub/constants';

import WellhubProductSelectionForm from './WellhubProductSelectionForm.component';
import WellhubProductSelectionOfferList from './WellhubProductSelectionOfferList.component';

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
  offerSelected: OfferSaas;
  availableEstablishments: Establishment[];
  coaches: Coach[];
  isLoading: boolean;
  offersData: ReworkedPaginationResponse<OfferSaas>;
  similarOffers: Offer<Coach, Establishment>[];
  similarOffersLoading: boolean;
  descriptionText: string;
  wellhubPartnershipId?: number | null;
  fetchMissingProductOffersSpecificPage: (page: number) => void;
  onClose: () => void;
  onConfirm: (data: {
    offerId: number;
    data: UpdateWellhubProductIdPayload;
  }) => void;
  onOfferClick: (offerId: number) => void;
  resetOfferClicked: () => void;
};

const WellhubProductSelectionContent: React.FC<Props> = ({
  availableEstablishments,
  offerSelected,
  coaches,
  isLoading,
  offersData,
  similarOffers,
  similarOffersLoading,
  descriptionText,
  wellhubPartnershipId,
  fetchMissingProductOffersSpecificPage,
  onClose,
  onConfirm,
  onOfferClick,
  resetOfferClicked,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();

  const { values, isValid, isValidating, setValues } =
    useFormikContext<WellhubProductSelectionFormValues>();

  const {
    current_page: currentPage,
    results: offers,
    total_count: totalOffers,
    total_pages: totalPages,
  } = offersData;

  const handleChangePage = useCallback(
    (page: number) => fetchMissingProductOffersSpecificPage(page),
    [fetchMissingProductOffersSpecificPage],
  );

  const handleGoBackToOfferList = useCallback(() => {
    resetOfferClicked?.();
    setValues(WELLHUB_PRODUCT_SELECTION_INITIAL_VALUES);
  }, [resetOfferClicked, setValues]);

  const handleUpdateWellhubProduct = useCallback(() => {
    if (!offerSelected || !values.wellhubProductId) {
      return;
    }

    const offerData: UpdateWellhubProductIdPayload = {
      custom_selection_ids: values.selectedSimilarOffers,
      wellhub_product_id: values.wellhubProductId,
    };

    offerSelected?.id &&
      onConfirm?.({
        offerId: offerSelected.id,
        data: offerData,
      });

    handleGoBackToOfferList();
  }, [
    handleGoBackToOfferList,
    offerSelected,
    onConfirm,
    values.selectedSimilarOffers,
    values.wellhubProductId,
  ]);

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Typography variant="body1">{descriptionText}</Typography>
        {!offerSelected ? (
          <WellhubProductSelectionOfferList
            coaches={coaches}
            currentPage={currentPage}
            isLoading={isLoading}
            offers={offers}
            onChangePage={handleChangePage}
            onOfferClick={onOfferClick}
            totalOffers={totalOffers}
            totalPages={totalPages}
          />
        ) : (
          <WellhubProductSelectionForm
            availableEstablishments={availableEstablishments}
            offer={offerSelected}
            similarOffers={similarOffers}
            similarOffersLoading={similarOffersLoading}
            wellhubPartnershipId={wellhubPartnershipId}
          />
        )}
      </div>
      <div className={classes.footer}>
        {!offerSelected ? (
          <Button onClick={onClose}>
            {t('wellhub.productSelection.drawer.footer.cancel')}
          </Button>
        ) : (
          <>
            <Button onClick={handleGoBackToOfferList}>
              {t('wellhub.productSelection.drawer.footer.back')}
            </Button>
            <Button
              color="primary"
              disabled={isValidating || !isValid}
              onClick={handleUpdateWellhubProduct}
              variant="contained"
            >
              {t('wellhub.productSelection.drawer.footer.save')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  footer: {
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'flex-end',
    padding: theme.spacing(4),
  },
}));

export default React.memo(WellhubProductSelectionContent);
