import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';

import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';
import WellhubProductSelector from '#src/libs/wellhub/components/WellhubProductSelector';
import WellhubProductSelectionForSimilarOffers from './WellhubProductSelectionForSimilarOffers.component';

import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { Offer, OfferSaas } from '#src/libs/offer/types';
import type {
  WellhubProductId,
  WellhubProductSelectionFormValues,
} from '#src/libs/wellhub/types';

type Props = {
  offer: OfferSaas;
  availableEstablishments: Establishment[];
  similarOffers: Offer<Coach, Establishment>[];
  similarOffersLoading: boolean;
};

const WellhubProductSelectionForm: React.FC<Props> = ({
  offer,
  availableEstablishments,
  similarOffers,
  similarOffersLoading,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();

  const { values, setFieldValue } =
    useFormikContext<WellhubProductSelectionFormValues>();

  const correspondingWellhubGymUuid = useMemo(
    () =>
      (!!offer.etablissement.id &&
        availableEstablishments?.find(
          (availableEstablishment) =>
            availableEstablishment.id === offer.etablissement.id,
        )?.wellhub_gym) ||
      null,
    [availableEstablishments, offer.etablissement.id],
  );

  const handleSelectWellhubProduct = useCallback(
    (productId: WellhubProductId | null) => {
      productId !== values.wellhubProductId &&
        setFieldValue('wellhubProductId', productId);
    },
    [setFieldValue, values.wellhubProductId],
  );

  React.useEffect(() => {
    offer && setFieldValue('selectedSimilarOffers', [offer.id]);
  }, [offer, setFieldValue]);

  return (
    <div className={classes.container}>
      <div className={classes.selector}>
        <Typography variant="body2">
          {t('wellhub.productSelection.drawer.form.label')}
        </Typography>
        <WellhubProductSelector
          id="drawer-wellhub-product-selector"
          isVirtualOffer={offer.is_broadcast}
          onSelect={handleSelectWellhubProduct}
          selectedProductId={values.wellhubProductId || null}
          wellhubGymUuid={correspondingWellhubGymUuid}
        />
      </div>

      {similarOffers?.length > 1 && (
        <>
          <SwitchField
            id="drawer-wellhub-product-similar-offers"
            label={t(
              'wellhub.productSelection.drawer.form.applyToSimilarOffers',
            )}
            name="modifyRecursively"
          />
          {values.modifyRecursively && (
            <>
              <Divider />
              <WellhubProductSelectionForSimilarOffers
                offer={offer}
                similarOffers={similarOffers}
                similarOffersLoading={similarOffersLoading}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  selector: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export default React.memo(WellhubProductSelectionForm);
