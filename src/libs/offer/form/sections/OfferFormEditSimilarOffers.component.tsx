import React, { useCallback } from 'react';

import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import { useFormikContext } from 'formik';

import FormSection from '#components/forms/FormSection';
import SimilarOffersList from '#libs/offer/components/SimilarOffersList.component';

import { Coach } from '#libs/associated-coach/types';
import { Offer, OfferFormValues } from '#libs/offer/types';

type Props = {
  similarOffers: Offer[];
  similarOffersLoading: boolean;
  coaches: Coach[];
  offerCoach: Coach;
  offerId: number;
};

const OfferFormEditSimilarOffers = (props: Props) => {
  const { t } = useTranslation('offer');
  const classes = useStyles();
  const { setFieldValue } = useFormikContext<OfferFormValues>();
  const { similarOffers, similarOffersLoading, coaches, offerCoach, offerId } =
    props;

  const handleSelectAll = useCallback(() => {
    setFieldValue(
      'selectedSimilarOffers',
      similarOffers?.map((offer) => offer.id) ?? [],
    );
  }, [setFieldValue, similarOffers]);

  const handleDeselectAll = useCallback(
    () => setFieldValue('selectedSimilarOffers', [offerId]),
    [offerId, setFieldValue],
  );

  return (
    <FormSection>
      <Typography variant="subtitle2">
        {t('form.section.similarOffers.title')}
      </Typography>

      <div className={classes.selectButtonContainer}>
        <Button
          disabled={similarOffersLoading}
          size="small"
          className={classes.selectButton}
          onClick={handleSelectAll}
        >
          {t('form.section.similarOffers.selectAll')}
        </Button>
        <Button
          disabled={similarOffersLoading}
          size="small"
          className={classes.selectButton}
          onClick={handleDeselectAll}
        >
          {t('form.section.similarOffers.unselectAll')}
        </Button>
      </div>

      <SimilarOffersList
        similarOffers={similarOffers}
        similarOffersLoading={similarOffersLoading}
        coaches={coaches}
        offerCoach={offerCoach}
        offerId={offerId}
      />

      <Alert severity="info">{t('form.section.similarOffers.info')}</Alert>
    </FormSection>
  );
};

const useStyles = makeStyles((theme) => ({
  selectButtonContainer: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  selectButton: {
    textTransform: 'inherit',
    fontWeight: 400,
  },
}));

export default OfferFormEditSimilarOffers;
