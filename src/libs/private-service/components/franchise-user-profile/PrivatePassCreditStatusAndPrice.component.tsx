import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { Variant } from '@material-ui/core/styles/createTypography';

import {
  getCreditsDividedDisplay,
  getCreditsDividedValue,
} from '#src/libs/theme/utils';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';

import type {
  FranchisePrivatePass,
  FranchiseUserPrivatePass,
} from '#src/libs/franchise/types';

type Props = {
  privateConsumerPass?: FranchiseUserPrivatePass;
  privatePass?: FranchisePrivatePass;
  textColor?: React.ComponentProps<typeof Typography>['color'];
  variant?: Variant;
};

export const PrivatePassCreditStatusAndPrice: React.FC<Props> = ({
  privateConsumerPass,
  privatePass,
  textColor,
  variant,
}) => {
  const { t } = useTranslation('paymentPack');

  if (!privateConsumerPass || !privatePass) {
    return (
      <Typography
        color="textSecondary"
        component="span"
        variant={variant || 'caption'}
      >
        {' '}
        -{' '}
      </Typography>
    );
  }

  const priceToDisplay = getCurrencyDisplayWithPrice(
    privateConsumerPass.initial_price ?? 0,
  );

  const availableCredits =
    privatePass.credits - privateConsumerPass.used_credits;
  const creditsDisplay = `${getCreditsDividedDisplay(
    availableCredits,
  )} / ${getCreditsDividedDisplay(privatePass.credits)} ${t('credits', {
    count: getCreditsDividedValue(availableCredits),
  }).toLowerCase()}`;
  return (
    <Typography
      color={
        textColor ??
        (availableCredits / privatePass.credits > 0.2 ? 'primary' : 'error')
      }
      component="span"
      variant={variant || 'caption'}
    >
      {`${creditsDisplay} - ${priceToDisplay}`}
    </Typography>
  );
};

export default React.memo(PrivatePassCreditStatusAndPrice);
