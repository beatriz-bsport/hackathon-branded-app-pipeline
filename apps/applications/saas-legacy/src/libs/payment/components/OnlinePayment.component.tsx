import React, { forwardRef, useCallback } from 'react';
import {
  PAYMENT_ENGINE_PAYPAL,
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_PAYPAL_WALLET,
} from '@bsport/common/lib/master-data/payment-group.js';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AcceptTermsAndConditions from '#src/libs/payment/components/AcceptTermsAndConditions.component';
import PriceInput from '#src/components/input/PriceInput.component';
import PaymentPaypal from './paypal/PaymentPaypal.component';
import PaymentStripe from './payment-backend-stripe/PaymentStripe.component';
import { getCurrencyDisplayWithPrice } from '../../theme/selectors';
import type { OptionCallback } from '#src/state/types';
import type { InstalmentPaymentApiWithBasketId } from '#src/libs/instalment-payment-configuration/types';
import type { Basket } from '#src/libs/checkout/types';
import type { StripePaymentElementConfig } from '#src/libs/company/types';
import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import CheckoutBillingGroupSelector from '#src/libs/marketplace/components/@Basket/CheckoutBillingGroupSelector.component';

import { TermsAndConditionType } from '#src/libs/payment/types';
import InstalmentPaymentSelector from '../../instalment-payment-configuration/components/InstalmentPaymentSelector.component';
import PaymentMethodCardSelector from './PaymentMethodCardSelector.component';

type Props = {
  allowConsumerToUseInternalAccount?: boolean;
  applyBalanceLoading?: boolean;
  applyBalanceToInvoice?: () => void;
  basketId?: string;
  basketTotalPriceCts?: number;
  basketTotalPricePrepaidLines?: number;
  cardBillingDetailsMandatory: boolean;
  checkItemsBasket?: (basketId: string) => boolean;
  clientSecret: string;
  clientSecretLoading: boolean;
  companyId: number;
  createPendingBookingsIfNecessary?: (data?: {
    payment_group_method_identifier?: number;
  }) => void;
  creditAccountBalance?: number | null;
  detachPaymentMethod: (pm_id: string) => void;
  detachPaymentMethodLoading: boolean;
  enableMultiLocalization: boolean;
  establishmentBillingGroups?: EstablishmentBillingGroup[];
  forceHideConfirmPaymentButton?: boolean;
  fromApp?: boolean;
  hideTotalPriceBeforePayment?: boolean;
  instalmentPaymentConfigurationList?:
    | InstalmentPaymentApiWithBasketId[]
    | null;
  instalmentPaymentSelectedId?: number;
  invalidatePendingBookingsIfNecessary?: () => void;
  isEstablishmentBillingGroupSelected?: boolean;
  loading: boolean;
  memberId: number;
  onCancel?: () => void;
  onError?: () => void;
  onSelectInstalmentPayment?: (
    id: number,
    options?: OptionCallback<Basket>,
  ) => void;
  onSuccess: (callback?: () => void) => void;
  paymentEngine?: number;
  paymentGroupId: number;
  paymentGroupPriceCts: number;
  paymentMethodChoices: Array<number>;
  paymentProcessing?: boolean;
  ref?: React.Ref<any>;
  selectedEstablishmentBillingGroup?: EstablishmentBillingGroup;
  sepaDefaultEmail?: string;
  sepaDefaultName?: string;
  setIsEstablishmentBillingGroupSelected?: (
    isEstablishmentBillingGroupSelected: boolean,
  ) => void;
  setIsOnlinePaymentDisabled?: (isLoading: boolean) => void;
  setPaymentEngine?: (paymentEngine: number) => void;
  setPaymentProcessing?: (process: boolean) => void;
  setSelectedEstablishmentBillingGroup?: (
    value: React.SetStateAction<EstablishmentBillingGroup>,
  ) => void;
  setTermsAndConditionsAccepted?: (termsAndConditionsAccepted: boolean) => void;
  snackbarErrorMsg?: (message: string) => void;
  stripePaymentElementConfig: StripePaymentElementConfig;
  termsAndConditions?: string;
  termsAndConditionsAccepted?: boolean;
  updateMemberBillingGroup?: (establishmentBillingGroupId: number) => void;
  updatePriceCts?: (priceCts: number, options: OptionCallback) => void;
  useInternalAccount?: (amount: number) => void;
};

const OnlinePayment: React.FC<Props> = forwardRef(
  (
    {
      allowConsumerToUseInternalAccount,
      applyBalanceLoading,
      applyBalanceToInvoice,
      basketId,
      basketTotalPriceCts,
      basketTotalPricePrepaidLines,
      cardBillingDetailsMandatory,
      checkItemsBasket,
      clientSecret,
      clientSecretLoading,
      companyId,
      createPendingBookingsIfNecessary,
      creditAccountBalance,
      detachPaymentMethod,
      detachPaymentMethodLoading,
      enableMultiLocalization,
      establishmentBillingGroups,
      forceHideConfirmPaymentButton,
      fromApp,
      hideTotalPriceBeforePayment,
      instalmentPaymentConfigurationList,
      instalmentPaymentSelectedId,
      invalidatePendingBookingsIfNecessary,
      isEstablishmentBillingGroupSelected = true,
      loading,
      memberId,
      onCancel,
      onError,
      onSelectInstalmentPayment,
      onSuccess,
      paymentEngine = PAYMENT_ENGINE_STRIPE,
      paymentGroupId,
      paymentGroupPriceCts,
      paymentMethodChoices,
      paymentProcessing,
      selectedEstablishmentBillingGroup,
      sepaDefaultEmail,
      sepaDefaultName,
      setIsEstablishmentBillingGroupSelected,
      setIsOnlinePaymentDisabled,
      setPaymentEngine,
      setPaymentProcessing,
      setSelectedEstablishmentBillingGroup,
      setTermsAndConditionsAccepted,
      snackbarErrorMsg,
      stripePaymentElementConfig,
      termsAndConditions,
      termsAndConditionsAccepted,
      updateMemberBillingGroup,
      updatePriceCts,
      useInternalAccount,
    },
    ref,
  ) => {
    const [paymentMethodSelected, selectPaymentMethod] = React.useState(
      PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    );
    const [priceUpdaterOpen, setPriceUpdaterOpen] = React.useState(false);
    const [priceUpdateAmount, setPriceUpdateAmount] = React.useState(
      paymentGroupPriceCts / 100,
    );

    const totalPriceCts = basketTotalPriceCts || paymentGroupPriceCts;

    const handleSelectPaymentMethod = useCallback(
      (paymentMethod: number) => {
        // By default, we consider that only Stripe payment methods are available
        if (setPaymentEngine) {
          if (paymentMethod === PAYMENT_GROUP_METHOD_IDENTIFIER_PAYPAL_WALLET) {
            setPaymentEngine(PAYMENT_ENGINE_PAYPAL);
          } else {
            setPaymentEngine(PAYMENT_ENGINE_STRIPE);
          }
        }
        selectPaymentMethod(paymentMethod);
      },
      [selectPaymentMethod, setPaymentEngine],
    );

    const classes = useStyles();

    const isOnlinePaymentLoading = !clientSecret || !totalPriceCts;

    // This useEffect is mandatory in the new checkout flow, since if this condition is not
    // fullfilled no Stripe PaymentMethodForm component is mounted yet and so we don't want the
    // Pay button to be active
    React.useEffect(() => {
      if (setIsOnlinePaymentDisabled)
        setIsOnlinePaymentDisabled(isOnlinePaymentLoading);
    }, [isOnlinePaymentLoading, setIsOnlinePaymentDisabled]);

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
      : undefined;

    return (
      <div className={classes.container}>
        {!!priceUpdaterOpen && (
          <div className={classes.priceContainer}>
            <PriceInput
              inputStep={1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPriceUpdateAmount(parseInt(e.target.value, 10));
              }}
              value={priceUpdateAmount}
            />
            <IconButton
              color="primary"
              disabled={isOnlinePaymentLoading || !priceUpdateAmount}
              onClick={() =>
                // @ts-expect-error
                updatePriceCts(parseInt(priceUpdateAmount * 100, 10) || 1, {
                  onSuccess: () => setPriceUpdaterOpen(false),
                })
              }
            >
              <SaveIcon />
            </IconButton>
          </div>
        )}
        {!priceUpdaterOpen &&
          !!paymentGroupPriceCts &&
          !hideTotalPriceBeforePayment && (
            <div className={classes.priceContainer}>
              <Typography variant="h5">
                {`${getCurrencyDisplayWithPrice(
                  (paymentGroupPriceCts / 100).toFixed(2),
                )}`}
              </Typography>
              {!!updatePriceCts && (
                <IconButton
                  color="primary"
                  disabled={isOnlinePaymentLoading}
                  onClick={() => {
                    setPriceUpdaterOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </div>
          )}
        <PaymentMethodCardSelector
          paymentMethodChoices={paymentMethodChoices}
          paymentMethodSelected={paymentMethodSelected}
          paymentProcessing={paymentProcessing}
          selectPaymentMethod={handleSelectPaymentMethod}
        />
        {instalmentPaymentConfigurationList?.length > 0 &&
          !!onSelectInstalmentPayment &&
          paymentEngine !== PAYMENT_ENGINE_PAYPAL && (
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
        {isOnlinePaymentLoading ? (
          <CircularProgress />
        ) : (
          <div className={classes.innerContainer}>
            {paymentEngine === PAYMENT_ENGINE_STRIPE && (
              <PaymentStripe
                ref={ref}
                allowConsumerToUseInternalAccount={
                  allowConsumerToUseInternalAccount
                }
                applyBalanceLoading={
                  applyBalanceLoading || isOnlinePaymentLoading
                }
                applyBalanceToInvoice={applyBalanceToInvoice}
                basketId={basketId}
                basketTotalPriceCts={basketTotalPriceCts}
                cardBillingDetailsMandatory={cardBillingDetailsMandatory}
                checkItemsBasket={checkItemsBasket}
                clientSecret={clientSecret}
                companyId={companyId}
                createPendingBookingsIfNecessary={
                  createPendingBookingsIfNecessary
                }
                creditAccountBalance={creditAccountBalance}
                detachPaymentMethod={detachPaymentMethod}
                detachPaymentMethodLoading={detachPaymentMethodLoading}
                forceHideConfirmPaymentButton={forceHideConfirmPaymentButton}
                instalmentPaymentSelectedId={instalmentPaymentSelectedId}
                invalidatePendingBookingsIfNecessary={
                  invalidatePendingBookingsIfNecessary
                }
                isEstablishmentBillingGroupSelected={
                  isEstablishmentBillingGroupSelected
                }
                loading={loading}
                memberId={memberId}
                onCancel={onCancel}
                onError={onError}
                onSuccess={onSuccess}
                paymentGroupId={paymentGroupId}
                paymentGroupPriceCts={paymentGroupPriceCts}
                paymentMethodSelected={paymentMethodSelected}
                sepaDefaultEmail={sepaDefaultEmail}
                sepaDefaultName={sepaDefaultName}
                setPaymentProcessing={enhancedSetPaymentProcessing}
                setTermsAndConditionsAccepted={setTermsAndConditionsAccepted}
                stripePaymentElementConfig={stripePaymentElementConfig}
                termsAndConditions={termsAndConditions}
                termsAndConditionsAccepted={termsAndConditionsAccepted}
                useInternalAccount={useInternalAccount}
              >
                <div className={classes.billingGroupSelector}>
                  {!!establishmentBillingGroups && (
                    <CheckoutBillingGroupSelector
                      enableMultiLocalization={enableMultiLocalization}
                      establishmentBillingGroups={establishmentBillingGroups}
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
              </PaymentStripe>
            )}
            {paymentEngine === PAYMENT_ENGINE_PAYPAL && (
              <PaymentPaypal
                ref={ref}
                acceptTermsAndConditionsElement={
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
                  allowConsumerToUseInternalAccount
                }
                applyBalanceLoading={applyBalanceLoading}
                applyBalanceToInvoice={applyBalanceToInvoice}
                basketId={basketId}
                basketPriceCts={
                  basketTotalPriceCts - (basketTotalPricePrepaidLines || 0)
                }
                clientSecret={clientSecret}
                clientSecretLoading={clientSecretLoading}
                creditAccountBalance={creditAccountBalance}
                forceDisabled={priceUpdaterOpen}
                fromApp={fromApp}
                isEstablishmentBillingGroupSelected={
                  isEstablishmentBillingGroupSelected
                }
                loading={loading}
                onCancel={onCancel}
                onError={onError}
                onSuccess={onSuccess}
                paymentGroupId={paymentGroupId}
                paymentProcessing={paymentProcessing}
                setPaymentProcessing={enhancedSetPaymentProcessing}
                snackbarErrorMsg={snackbarErrorMsg}
                termsAndConditionsAccepted={termsAndConditionsAccepted}
                useInternalAccount={useInternalAccount}
              >
                <div className={classes.billingGroupSelector}>
                  {!!establishmentBillingGroups && (
                    <CheckoutBillingGroupSelector
                      enableMultiLocalization={enableMultiLocalization}
                      establishmentBillingGroups={establishmentBillingGroups}
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
              </PaymentPaypal>
            )}
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

export default OnlinePayment;
