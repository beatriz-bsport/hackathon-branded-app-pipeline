import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import type { PassPreviewData } from './types';
import { useTranslation } from 'react-i18next';
import { getFormatedCredits } from '#src/libs/theme/utils';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

export const PassPreview = ({ pass }: { pass: PassPreviewData }) => {
  const { t } = useTranslation('paymentPack');

  const credits = getFormatedCredits(
    t,
    pass.credits,
    pass.hasUnlimitedCredits ?? false,
  );
  const price = getCurrencyDisplayWithPrice(pass.price);

  return (
    <Grid container direction="column" style={{ width: 'fit-content' }}>
      <Typography variant="body1">{pass.label}</Typography>
      <Typography style={{ color: '#757575' }} variant="body2">
        {credits} - {price}
      </Typography>
    </Grid>
  );
};
