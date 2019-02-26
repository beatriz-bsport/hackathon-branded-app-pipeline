// @flow

import React from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import PaymentPackCard from '../../libs/payment-packs/PaymentPackCard.component';

type Props = {
  t: TFunction,
  paymentPacks: *[],
  pushPackCheckout: (number) => void,
};

export function MarketplacePassList(props: Props) {
  const { paymentPacks, t, pushPackCheckout } = props;
  return (
    <Grid container direction="row" spacing={16}>
      {// Forgive me but i haz no tiime
      paymentPacks
        .map((p) => ({
          ...p,
          metaActivities: p.metaActivities.map((ma) => ma.id),
          metaActivitiesFull: p.metaActivities,
          establishments: p.establishments.map((e) => e.id),
          establishmentsFull: p.establishments,
        }))
        .map((pp) => (
          <Grid item xs={12} md={6} lg={4}>
            <PaymentPackCard
              pack={pp}
              metaActivities={pp.metaActivitiesFull}
              establishments={pp.establishmentsFull}
              onlyPublic
            />
            <Button
              style={{ width: '100%' }}
              onClick={() => pushPackCheckout(pp.id)}
              color="primary"
              variant="contained"
            >
              {t('marketplace.buyPack')}
            </Button>
          </Grid>
        ))}
    </Grid>
  );
}

export default withNamespaces()(MarketplacePassList);
