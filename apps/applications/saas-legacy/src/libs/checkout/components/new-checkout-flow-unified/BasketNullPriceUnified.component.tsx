import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';

import { useBasketPaymentContext } from './BasketPaymentContext';
import CheckoutBillingGroupSelector from '#src/libs/marketplace/components/@Basket/CheckoutBillingGroupSelector.component';
import { useCompanyPaymentSettings } from '#src/libs/payment/payment-module-revamped/basket-payment/hooks/useCompanyPaymentSettings';
import AcceptTermsAndConditions from '#src/libs/payment/components/AcceptTermsAndConditions.component';
import { TermsAndConditionType } from '#src/libs/payment/types';

type BasketNullPriceProps = {
  basketHasOffers: boolean;
  companyId: number;
  enableMultiLocalization: boolean;
};

export const BasketNullPriceUnified: React.FC<BasketNullPriceProps> = ({
  basketHasOffers,
  companyId,
  enableMultiLocalization,
}) => {
  const { t } = useTranslation('checkout');
  const classes = useStyles();

  const {
    termsAccepted,
    setTermsAccepted,
    selectedEstablishmentBillingGroup,
    setIsEstablishmentBillingGroupSelected,
    setSelectedEstablishmentBillingGroup,
  } = useBasketPaymentContext();
  const { generalTermsAndConditions, establishmentBillingGroups } =
    useCompanyPaymentSettings(companyId);

  const acceptTermsAndFinalizeTransKey = useMemo(
    () =>
      basketHasOffers
        ? 'myBasket.acceptTermsAndFinalize'
        : 'myBasket.noBooking.acceptTermsAndFinalize',
    [basketHasOffers],
  );
  const checkAndFinalizeTransKey = useMemo(
    () =>
      basketHasOffers
        ? 'myBasket.checkAndFinalize'
        : 'myBasket.noBooking.checkAndFinalize',
    [basketHasOffers],
  );

  const termsAndConditionsNode = generalTermsAndConditions ? (
    <AcceptTermsAndConditions
      accepted={termsAccepted}
      onChecked={setTermsAccepted}
      termsAndConditions={generalTermsAndConditions}
      type={TermsAndConditionType.TERMS_AND_CONDITIONS}
    />
  ) : null;

  const billingGroupSelectorNode = enableMultiLocalization ? (
    <CheckoutBillingGroupSelector
      enableMultiLocalization={enableMultiLocalization}
      establishmentBillingGroups={establishmentBillingGroups}
      selectedEstablishmentBillingGroup={selectedEstablishmentBillingGroup}
      setIsEstablishmentBillingGroupSelected={
        setIsEstablishmentBillingGroupSelected
      }
      setSelectedEstablishmentBillingGroup={
        setSelectedEstablishmentBillingGroup
      }
    />
  ) : null;

  const showAcceptMessage = !!generalTermsAndConditions && !termsAccepted;
  const innerContent = (
    <>
      <Typography className={classes.title} variant="h6">
        {t('myBasket.almostDone')}
      </Typography>
      <Typography className={classes.subtitle} variant="body1">
        {showAcceptMessage
          ? t(acceptTermsAndFinalizeTransKey)
          : t(checkAndFinalizeTransKey)}
      </Typography>
    </>
  );

  return (
    <div
      className={
        enableMultiLocalization
          ? classes.basketNullPriceCompactContainer
          : classes.basketNullPriceContainer
      }
    >
      <div
        className={
          enableMultiLocalization
            ? classes.basketNullPriceCompact
            : classes.iconContainer
        }
      >
        <div className={classes.iconContainer}>
          <ShoppingBasket className={classes.shoppingBasketIcon} />
        </div>
        {enableMultiLocalization && (
          <div className={classes.basketNullPriceCompactText}>
            {innerContent}
          </div>
        )}
      </div>
      {!enableMultiLocalization && innerContent}
      {billingGroupSelectorNode}
      {termsAndConditionsNode}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  basketNullPriceContainer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  basketNullPriceCompactContainer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
  basketNullPriceCompact: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  basketNullPriceCompactText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 500,
  },
  subtitle: {
    color: theme.palette.grey[600],
  },
  iconContainer: {
    borderRadius: theme.spacing(1),
    display: 'flex',
    background: `${chroma(theme.palette.primary.main).hex()}1a`,
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
  },
  shoppingBasketIcon: {
    color: theme.palette.primary.main,
    width: '51%',
    height: '44%',
  },
}));
