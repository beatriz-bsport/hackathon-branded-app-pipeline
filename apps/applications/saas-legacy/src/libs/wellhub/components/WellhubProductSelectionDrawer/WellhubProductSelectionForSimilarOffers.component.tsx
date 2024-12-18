import React, { useCallback } from 'react';

import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import { useFormikContext } from 'formik';

import WellhubProductSimilarOfferListComponent from './WellhubProductSimilarOfferList.component';

import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { Offer, OfferSaas } from '#src/libs/offer/types';
import type { WellhubProductSelectionFormValues } from '#src/libs/wellhub/types';

type Props = {
  offer: OfferSaas;
  similarOffers: Offer<Coach, Establishment>[];
  similarOffersLoading: boolean;
};

const WellhubProductSelectionForSimilarOffers: React.FC<Props> = ({
  offer,
  similarOffers,
  similarOffersLoading,
}) => {
  const { t } = useTranslation(['partnership', 'offer']);
  const classes = useStyles();

  const { setFieldValue } =
    useFormikContext<WellhubProductSelectionFormValues>();

  const handleSelectAll = useCallback(() => {
    setFieldValue(
      'selectedSimilarOffers',
      similarOffers?.map((similarOffer) => similarOffer.id) ?? [],
    );
  }, [setFieldValue, similarOffers]);

  const handleDeselectAll = useCallback(
    () => setFieldValue('selectedSimilarOffers', [offer.id]),
    [offer.id, setFieldValue],
  );

  return (
    <div className={classes.container}>
      <Typography variant="subtitle2">
        {t('offer:form.section.similarOffers.title')}
      </Typography>

      <div className={classes.selectButtonContainer}>
        <Button
          className={classes.selectButton}
          disabled={similarOffersLoading}
          onClick={handleSelectAll}
          size="small"
        >
          {t('offer:form.section.similarOffers.selectAll')}
        </Button>
        <Button
          className={classes.selectButton}
          disabled={similarOffersLoading}
          onClick={handleDeselectAll}
          size="small"
        >
          {t('offer:form.section.similarOffers.unselectAll')}
        </Button>
      </div>

      <WellhubProductSimilarOfferListComponent
        offer={offer}
        similarOffers={similarOffers}
        similarOffersLoading={similarOffersLoading}
      />

      <Alert severity="info">
        {t('offer:form.section.similarOffers.info')}
      </Alert>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  selectButtonContainer: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  selectButton: {
    textTransform: 'inherit',
    fontWeight: 400,
  },
}));

export default React.memo(WellhubProductSelectionForSimilarOffers);
