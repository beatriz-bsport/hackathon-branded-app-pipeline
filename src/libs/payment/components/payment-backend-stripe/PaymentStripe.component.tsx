import React, { forwardRef, useCallback } from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_EPS,
  PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY,
} from '@bsport/common/lib/master-data/payment-group';

import type { OptionCallback } from '#src/state/types';
import type { Basket } from '#src/libs/checkout/types';
import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import type { InstalmentPaymentApiWithBasketId } from '#src/libs/instalment-payment-configuration/types';
import {
  TermsAndConditionType,
  type StripeInit,
} from '#src/libs/payment/types';

import AcceptTermsAndConditions from '#src/libs/payment/components/AcceptTermsAndConditions.component';
import CheckoutBillingGroupSelector from '#src/libs/marketplace/components/@Basket/CheckoutBillingGroupSelector.component';
import InstalmentPaymentSelector from '#src/libs/instalment-payment-configuration/components/InstalmentPaymentSelector.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import PaymentMethodCardSelector from '#src/libs/payment/components/PaymentMethodCardSelector.component';
import PriceInput from '#src/components/input/PriceInput.component';
import {
  getStripePkKey,
  getCurrencyDisplayWithPrice,
  getCompanyCountry,
} from '#src/libs/theme/selectors';
import PaymentStripeBancontact from './PaymentStripeBancontact.component';
import PaymentStripeCard from './PaymentStripeCard.component';
import PaymentStripeEPS from './PaymentStripeEPS.component';
import PaymentStripeGiropay from './PaymentStripeGiropay.component';
import PaymentStripeIdeal from './PaymentStripeIdeal.component';
import PaymentStripeSEPA from './PaymentStripeSEPA.component';
import PaymentStripeSofort from './PaymentStripeSofort.component';

const fallbackStripePromise = loadStripe(getStripePkKey());

type PaymentStripeProps = {
  allowConsumerToUseInternalAccount?: boolean;
  applyBalanceLoading?: boolean;
  basketId?: string;
  basketTotalPriceCts?: number;
  basketTotalPricePrepaidLines?: number;
  cardBillingDetailsMandatory: boolean;
  clientSecret: string;
  companyId: number;
  creditAccountBalance?: number | null;
  detachPaymentMethodLoading: boolean;
  enableMultiLocalization: boolean;
  establishmentBillingGroups?: EstablishmentBillingGroup[];
  forceHideButton?: boolean;
  fromApp?: boolean;
  hidePrice?: boolean;
  instalmentPaymentConfigurationList?:
    | InstalmentPaymentApiWithBasketId[]
    | null;
  instalmentPaymentSelectedId?: number;
  isEstablishmentBillingGroupSelected?: boolean;
  loading: boolean;
  memberId: number;
  paymentGroupId: number;
  paymentGroupPriceCts?: number;
  paymentMethodChoices: number[];
  paymentProcessing?: boolean;
  ref?: React.Ref<any>;
  selectedEstablishmentBillingGroup?: EstablishmentBillingGroup;
  sepaDefaultEmail?: string;
  sepaDefaultName?: string;
  termsAndConditions?: string;
  termsAndConditionsAccepted?: boolean;
  applyBalanceToInvoice?: () => void;
  checkItemsBasket?: (basketId: string) => boolean; // Only necessary if there is there is a basketId
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  detachPaymentMethod: (pm_id: string) => void;
  onCancel: () => void;
  onError?: () => void;
  onSelectInstalmentPayment?: (
    id: number,
    options?: OptionCallback<Basket>,
  ) => void;
  onSuccess: (callback?: () => void) => void;
  setIsEstablishmentBillingGroupSelected?: (
    isEstablishmentBillingGroupSelected: boolean,
  ) => void;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  setPaymentProcessing?: (process: boolean) => void;
  setSelectedEstablishmentBillingGroup?: (
    value: React.SetStateAction<EstablishmentBillingGroup>,
  ) => void;
  setTermsAndConditionsAccepted?: (termsAndConditionsAccepted: boolean) => void;
  snackbarErrorMsg?: (msg: string) => void;
  snackbarSuccessMsg?: (msg: string) => void;
  updateMemberBillingGroup?: (establishmentBillingGroupId: number) => void;
  updatePriceCts?: (priceCts: number, options: OptionCallback) => void;
  useInternalAccount?: (amount: number) => void;
  stripePromise?: StripeInit;
};

type PaymentStripePropsNewCheckoutFlow = Omit<
  PaymentStripeProps,
  'onCancel' | 'paymentGroupPriceCts' | 'updatePriceCts'
> &
  Partial<PaymentStripeProps>;

const STRIPE_PAYMENT_METHOD_FORM_COMPONENT: { [key: number]: any } = {
  [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]: PaymentStripeCard,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA]: PaymentStripeSEPA,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT]: PaymentStripeBancontact,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL]: PaymentStripeIdeal,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT]: PaymentStripeSofort,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_EPS]: PaymentStripeEPS,
  [PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY]: PaymentStripeGiropay,
  // [PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY]: PaymentStripeMobilePay,
  //  [PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT]: PaymentStripeBacsDebit,
};

const PaymentStripe: React.FC<
  PaymentStripeProps | PaymentStripePropsNewCheckoutFlow
> = forwardRef(
  (
    {
      allowConsumerToUseInternalAccount,
      applyBalanceLoading,
      basketId,
      basketTotalPriceCts,
      basketTotalPricePrepaidLines,
      cardBillingDetailsMandatory,
      clientSecret,
      companyId,
      creditAccountBalance,
      detachPaymentMethodLoading,
      enableMultiLocalization,
      establishmentBillingGroups,
      forceHideButton,
      fromApp,
      hidePrice,
      instalmentPaymentConfigurationList,
      instalmentPaymentSelectedId,
      isEstablishmentBillingGroupSelected = true,
      loading,
      memberId,
      paymentGroupId,
      paymentGroupPriceCts,
      paymentMethodChoices,
      paymentProcessing,
      selectedEstablishmentBillingGroup,
      sepaDefaultEmail,
      sepaDefaultName,
      termsAndConditions,
      termsAndConditionsAccepted,
      applyBalanceToInvoice,
      checkItemsBasket,
      createPendingBookingsIfNecessary,
      detachPaymentMethod,
      onCancel,
      onError,
      onSelectInstalmentPayment,
      onSuccess,
      setIsEstablishmentBillingGroupSelected,
      setIsOnlinePaymentDisabled,
      setPaymentProcessing,
      setSelectedEstablishmentBillingGroup,
      setTermsAndConditionsAccepted,
      snackbarErrorMsg,
      snackbarSuccessMsg,
      updateMemberBillingGroup,
      updatePriceCts,
      useInternalAccount,
      stripePromise,
    },
    ref,
  ) => {
    const classes = useStyles();

    const [paymentMethodSelected, selectPaymentMethod] = React.useState(
      PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    );

    const companyCountry = getCompanyCountry();

    const StripePaymentMethodForm =
      STRIPE_PAYMENT_METHOD_FORM_COMPONENT[paymentMethodSelected];

    const [priceUpdaterOpen, setPriceUpdaterOpen] = React.useState(false);
    const [priceUpdateAmount, setPriceUpdateAmount] = React.useState(
      paymentGroupPriceCts / 100,
    );

    const totalPriceCts = basketTotalPriceCts || paymentGroupPriceCts;

    const handleSelectPaymentMethod = useCallback(
      (paymentMethod: number) => {
        selectPaymentMethod(paymentMethod);
      },
      [selectPaymentMethod],
    );

    // This useEffect is mandatory in the new checkout flow, since if this condition is not
    // fullfilled no Stripe PaymentMethodForm component is mounted yet and so we don't want the
    // Pay button to be active
    React.useEffect(() => {
      if (setIsOnlinePaymentDisabled)
        setIsOnlinePaymentDisabled(!clientSecret || !totalPriceCts);
    }, [clientSecret, setIsOnlinePaymentDisabled, totalPriceCts]);

    const enhancedSetPaymentProcessing = setPaymentProcessing
      ? (value: boolean) => {
          if (
            value &&
            !!updateMemberBillingGroup &&
            !!selectedEstablishmentBillingGroup
          ) {
            // Update the member's default establishment billing group when payment starts
            // being processed
            updateMemberBillingGroup(selectedEstablishmentBillingGroup.id);
          }
          setPaymentProcessing(value);
        }
      : null;

    return (
      <div className={classes.container}>
        {!!priceUpdaterOpen && (
          <div className={classes.priceContainer}>
            <PriceInput
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPriceUpdateAmount(parseInt(e.target.value, 10));
              }}
              value={priceUpdateAmount}
            />
            <IconButton
              color="primary"
              onClick={() =>
                // @ts-expect-error
                updatePriceCts(parseInt(priceUpdateAmount * 100, 10) || 0, {
                  onSuccess: () => setPriceUpdaterOpen(false),
                })
              }
            >
              <SaveIcon />
            </IconButton>
          </div>
        )}
        {!priceUpdaterOpen && !!paymentGroupPriceCts && !hidePrice && (
          <div className={classes.priceContainer}>
            <Typography variant="h5">
              {`${getCurrencyDisplayWithPrice(
                (paymentGroupPriceCts / 100).toFixed(2),
              )}`}
            </Typography>
            {!!updatePriceCts && (
              <IconButton
                color="primary"
                onClick={() => {
                  setPriceUpdaterOpen(true);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
        )}
        <>
          <PaymentMethodCardSelector
            paymentMethodChoices={paymentMethodChoices}
            paymentMethodSelected={paymentMethodSelected}
            paymentProcessing={paymentProcessing}
            selectPaymentMethod={handleSelectPaymentMethod}
          />
          {instalmentPaymentConfigurationList?.length > 0 &&
            !!onSelectInstalmentPayment && (
              <InstalmentPaymentSelector
                basketPriceCts={
                  basketTotalPriceCts - (basketTotalPricePrepaidLines || 0)
                }
                fromApp={fromApp}
                instalmentPaymentConfigurationList={
                  instalmentPaymentConfigurationList
                }
                instalmentPaymentConfigurationSelectedId={
                  instalmentPaymentSelectedId
                }
                onSelectInstalmentPayment={onSelectInstalmentPayment}
                paymentProcessing={paymentProcessing}
              />
            )}
        </>
        {!clientSecret || !totalPriceCts ? (
          <CircularProgress />
        ) : (
          <div className={classes.innerContainer}>
            <Elements stripe={stripePromise ?? fallbackStripePromise}>
              <ObjectLevelPermissionProvider requiredPermission="billing.allowed_actions.addPaymentMethod">
                {(hasAddPaymentMethodPermission) => (
                  <StripePaymentMethodForm
                    ref={ref}
                    AcceptTermsAndConditionsComponent={
                      termsAndConditions ? (
                        <AcceptTermsAndConditions
                          accepted={termsAndConditionsAccepted}
                          onChecked={setTermsAndConditionsAccepted}
                          termsAndConditions={termsAndConditions}
                          type={TermsAndConditionType.TERMS_AND_CONDITIONS}
                        />
                      ) : null
                    }
                    allowConsumerToUseInternalAccount={
                      allowConsumerToUseInternalAccount &&
                      (useInternalAccount || applyBalanceToInvoice)
                    }
                    applyBalanceLoading={applyBalanceLoading}
                    applyBalanceToInvoice={applyBalanceToInvoice}
                    basketId={basketId}
                    basketTotalPriceCts={basketTotalPriceCts}
                    cardBillingDetailsMandatory={cardBillingDetailsMandatory}
                    checkItemsBasket={checkItemsBasket}
                    clientSecret={clientSecret}
                    companyCountry={companyCountry}
                    companyId={companyId}
                    createPendingBookingsIfNecessary={
                      createPendingBookingsIfNecessary
                    }
                    creditAccountBalance={creditAccountBalance}
                    detachPaymentMethod={detachPaymentMethod}
                    detachPaymentMethodLoading={detachPaymentMethodLoading}
                    forceDisabled={priceUpdaterOpen}
                    forceHideButton={forceHideButton}
                    forceSave={!!instalmentPaymentSelectedId}
                    fromApp={fromApp}
                    hasAddPaymentMethodPermission={
                      hasAddPaymentMethodPermission
                    }
                    isEstablishmentBillingGroupSelected={
                      isEstablishmentBillingGroupSelected
                    }
                    loading={loading || applyBalanceLoading}
                    memberId={memberId}
                    onCancel={onCancel}
                    onError={onError}
                    onSuccess={onSuccess}
                    paymentGroupId={paymentGroupId}
                    setIsOnlinePaymentDisabled={setIsOnlinePaymentDisabled}
                    setPaymentProcessing={enhancedSetPaymentProcessing}
                    snackbarErrorMsg={snackbarErrorMsg} // Unused as it does not exist in the child component
                    snackbarSuccessMsg={snackbarSuccessMsg} // Unused as it does not exist in the child component
                    termsAndConditionsAccepted={termsAndConditionsAccepted}
                    useInternalAccount={useInternalAccount}
                    userDefaultEmail={sepaDefaultEmail}
                    userDefaultName={sepaDefaultName}
                  >
                    <div className={classes.billingGroupSelector}>
                      {!!establishmentBillingGroups && (
                        <CheckoutBillingGroupSelector
                          enableMultiLocalization={enableMultiLocalization}
                          establishmentBillingGroups={
                            establishmentBillingGroups
                          }
                          selectedEstablishmentBillingGroup={
                            selectedEstablishmentBillingGroup
                          }
                          setIsEstablishmentBillingGroupSelected={
                            setIsEstablishmentBillingGroupSelected
                          }
                          setSelectedEstablishmentBillingGroup={
                            setSelectedEstablishmentBillingGroup
                          }
                        />
                      )}
                    </div>
                  </StripePaymentMethodForm>
                )}
              </ObjectLevelPermissionProvider>
            </Elements>
          </div>
        )}
      </div>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
  },
  innerContainer: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  priceContainer: {
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    margin: theme.spacing(2),
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingGroupSelector: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));

export default React.memo(PaymentStripe);
