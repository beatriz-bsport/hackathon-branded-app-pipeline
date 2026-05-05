import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';

import { SwitchField } from '#src/libs/custom-form/components/GenericFormik.input';
import PartnershipAccountProductSelector, {
  PartnershipAccountProductProvider,
} from '#src/libs/wellhub/components/PartnershipAccountProductSelector';
import WellhubProductSelectionForSimilarOffers from './WellhubProductSelectionForSimilarOffers.component';

import { useGetPartnershipAccounts } from '#src/libs/partnership/hooks';

import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { Offer, OfferSaas } from '#src/libs/offer/types';
import type {
  WellhubProductId,
  WellhubProductSelectionFormValues,
} from '#src/libs/wellhub/types';

type Props = {
  offer: OfferSaas;
  similarOffers: Offer<Coach, Establishment>[];
  similarOffersLoading: boolean;
  wellhubPartnershipId?: number | null;
};

const WellhubProductSelectionForm: React.FC<Props> = ({
  offer,
  similarOffers,
  similarOffersLoading,
  wellhubPartnershipId,
}) => {
  const { t } = useTranslation('partnership');
  const classes = useStyles();

  const { values, setFieldValue } =
    useFormikContext<WellhubProductSelectionFormValues>();

  const [{ value: partnershipAccounts }, fetchPartnershipAccounts] =
    useGetPartnershipAccounts(wellhubPartnershipId ?? 0);

  useEffect(() => {
    if (!wellhubPartnershipId) return;
    fetchPartnershipAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wellhubPartnershipId]);

  const partnershipAccountExternalId = useMemo(
    () =>
      partnershipAccounts?.find((account) =>
        account.establishments.some((e) => e.id === offer.etablissement.id),
      )?.external_id ?? null,
    [partnershipAccounts, offer.etablissement.id],
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
        {partnershipAccountExternalId ? (
          <PartnershipAccountProductProvider>
            <PartnershipAccountProductSelector
              id="drawer-wellhub-product-selector"
              isVirtualOffer={offer.is_broadcast}
              onSelect={handleSelectWellhubProduct}
              partnershipAccountExternalId={partnershipAccountExternalId}
              selectedProductId={values.wellhubProductId || null}
            />
          </PartnershipAccountProductProvider>
        ) : null}
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
