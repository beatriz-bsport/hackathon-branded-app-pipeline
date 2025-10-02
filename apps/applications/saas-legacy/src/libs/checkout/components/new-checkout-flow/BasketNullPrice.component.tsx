import React from 'react';
import { useTranslation } from 'react-i18next';
import chroma from 'chroma-js';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import CheckoutBillingGroupSelector from '#src/libs/marketplace/components/@Basket/CheckoutBillingGroupSelector.component';

type BasketNullPriceProps = {
  areTermsAndConditionsAccepted?: boolean;
  basketHasOffers: boolean;
  enableMultiLocalization: boolean;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  setSelectedEstablishmentBillingGroup: (
    value: React.SetStateAction<EstablishmentBillingGroup>,
  ) => void;
  setIsEstablishmentBillingGroupSelected: (
    isEstablishmentBillingGroupSelected: boolean,
  ) => void;
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup;
};

type CompactLayoutProps = Omit<
  BasketNullPriceProps,
  'areTermsAndConditionsAccepted' | 'basketHasOffers'
> & { children: React.ReactNode };

const CompactLayout: React.FC<CompactLayoutProps> = ({
  enableMultiLocalization,
  establishmentBillingGroups,
  setSelectedEstablishmentBillingGroup,
  setIsEstablishmentBillingGroupSelected,
  selectedEstablishmentBillingGroup,
  children,
}: CompactLayoutProps) => {
  const classes = useStyles();
  return (
    <div className={classes.basketNullPriceCompactContainer}>
      <div className={classes.basketNullPriceCompact}>
        <div className={classes.iconContainer}>
          <ShoppingBasket className={classes.shoppingBasketIcon} />
        </div>
        <div className={classes.basketNullPriceCompactText}>{children}</div>
      </div>
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
    </div>
  );
};

const CenteredLayout: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.basketNullPriceContainer}>
      <div className={classes.iconContainer}>
        <ShoppingBasket className={classes.shoppingBasketIcon} />
      </div>
      {children}
    </div>
  );
};

export const BasketNullPrice: React.FC<BasketNullPriceProps> = ({
  areTermsAndConditionsAccepted,
  basketHasOffers,
  enableMultiLocalization,
  establishmentBillingGroups,
  setSelectedEstablishmentBillingGroup,
  setIsEstablishmentBillingGroupSelected,
  selectedEstablishmentBillingGroup,
}) => {
  const { t } = useTranslation('checkout');
  const classes = useStyles();

  const acceptTermsAndFinalizeMessage = basketHasOffers
    ? t('myBasket.acceptTermsAndFinalize')
    : t('myBasket.noBooking.acceptTermsAndFinalize');

  const checkAndFinalizeMessage = basketHasOffers
    ? t('myBasket.checkAndFinalize')
    : t('myBasket.noBooking.checkAndFinalize');

  return enableMultiLocalization ? (
    <CompactLayout
      enableMultiLocalization={enableMultiLocalization}
      establishmentBillingGroups={establishmentBillingGroups}
      selectedEstablishmentBillingGroup={selectedEstablishmentBillingGroup}
      setIsEstablishmentBillingGroupSelected={
        setIsEstablishmentBillingGroupSelected
      }
      setSelectedEstablishmentBillingGroup={
        setSelectedEstablishmentBillingGroup
      }
    >
      <Typography className={classes.title} variant="h6">
        {t('myBasket.almostDone')}
      </Typography>
      <Typography className={classes.subtitle} variant="body1">
        {areTermsAndConditionsAccepted
          ? checkAndFinalizeMessage
          : acceptTermsAndFinalizeMessage}
      </Typography>
    </CompactLayout>
  ) : (
    <CenteredLayout>
      <Typography className={classes.title} variant="h6">
        {t('myBasket.almostDone')}
      </Typography>
      <Typography className={classes.subtitle} variant="body1">
        {areTermsAndConditionsAccepted
          ? checkAndFinalizeMessage
          : acceptTermsAndFinalizeMessage}
      </Typography>
    </CenteredLayout>
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
    fontColor: theme.palette.grey[600],
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

export default React.memo(BasketNullPrice);
