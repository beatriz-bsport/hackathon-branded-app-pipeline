import React from 'react';

import Alert from '@material-ui/lab/Alert/Alert';
import { useTranslation } from 'react-i18next';
import ConfirmationMessage from '.';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
import ConfirmationMessageCss from '!!raw-loader!./styles.css';
import { CssComponentsVariantIdentifiers } from '#libs/exportable-components/constants';
import {
  MarketplaceCSSComponentConfig,
  MarketplacePage,
  VariationConfigurationChoice,
} from '#libs/exportable-components/types';
import { CompanyTheme } from '#libs/theme/types';
import { offerFactory } from '#libs/offer/factories';
import { subscriptionFactory } from '#libs/subscription/factory';
import { checkoutItemsFactory } from '#libs/checkout/factories';
import { ConfirmationStatus } from '#libs/checkout/types';

const offers = [offerFactory({})];
const billingPlan = subscriptionFactory();
const checkoutItems = checkoutItemsFactory(5);

const VariationRegistry = [
  {
    label: 'loading',
    choices: [
      { label: 'true', value: 'true' },
      { label: 'false', value: 'false' },
    ],
    default: { label: 'false', value: 'false' },
  },

  {
    label: 'bookingOrPurchaseStatus',
    choices: [
      {
        label: `confirmationMessage.${ConfirmationStatus.GENERIC_ERROR}`,
        value: ConfirmationStatus.GENERIC_ERROR,
      },
      {
        label: `confirmationMessage.${ConfirmationStatus.GENERIC_OFFER_ERROR}`,
        value: ConfirmationStatus.GENERIC_OFFER_ERROR,
      },
      {
        label: `confirmationMessage.${ConfirmationStatus.OFFER_ONLY_BOOKING_ERROR}`,
        value: ConfirmationStatus.OFFER_ONLY_BOOKING_ERROR,
      },
      {
        label: `confirmationMessage.${ConfirmationStatus.OFFER_ONLY_SUCCESS}`,
        value: ConfirmationStatus.OFFER_ONLY_SUCCESS,
      },
      {
        label: `confirmationMessage.${ConfirmationStatus.OFFER_GENERIC_ERROR_WITH_PURCHASE}`,
        value: ConfirmationStatus.OFFER_GENERIC_ERROR_WITH_PURCHASE,
      },
      {
        label: `confirmationMessage.${ConfirmationStatus.OFFER_AND_PURCHASE_SUCCESS}`,
        value: ConfirmationStatus.OFFER_AND_PURCHASE_SUCCESS,
      },
      {
        label: `confirmationMessage.${ConfirmationStatus.PURCHASE_ONLY_SUCCESS}`,
        value: ConfirmationStatus.PURCHASE_ONLY_SUCCESS,
      },
      {
        label: `confirmationMessage.${ConfirmationStatus.WAITING_LIST}`,
        value: ConfirmationStatus.WAITING_LIST,
      },
      {
        label: `confirmationMessage.${ConfirmationStatus.PURCHASE_WITH_PASSES_SUCCESS}`,
        value: ConfirmationStatus.PURCHASE_WITH_PASSES_SUCCESS,
      },
    ],
    default: {
      label: ConfirmationStatus.OFFER_ONLY_GUEST_SUCCESS,
      value: ConfirmationStatus.OFFER_ONLY_GUEST_SUCCESS,
    },
  },
];

const usePropsFromVariation = (
  variationsSelected: Record<string, VariationConfigurationChoice>,
): React.ComponentProps<typeof ConfirmationMessage> => {
  const isLoading = variationsSelected?.loading?.value === 'true';
  const status =
    variationsSelected?.bookingOrPurchaseStatus?.value ??
    ConfirmationStatus.OFFER_ONLY_GUEST_SUCCESS;

  return {
    offers,
    isLoading,
    checkoutItems,
    billingPlan,
    // @ts-expect-error
    status,
    goToCalendar: () => {},
    goToMemberProfile: () => {},
    goToMemberPasses: () => {},
    goToMemberSubscriptions: () => {},
    goBack: () => {},
  };
};

export const CONFIRMATION_CHECKOUT_MESSAGE_CONFIGURATION: MarketplaceCSSComponentConfig =
  {
    label: CssComponentsVariantIdentifiers.CONFIRMATION_CHECKOUT_MESSAGE,
    css: ConfirmationMessageCss,
    pages: [MarketplacePage.CHECKOUT_CONFIRMATION],
    defaultState: {},
    variations: VariationRegistry,
  };

export const CONFIRMATION_CHECKOUT_MESSAGE_PREVIEW: React.FC<{
  theme: CompanyTheme;
  variationsSelected: Record<string, VariationConfigurationChoice>;
}> = React.memo(({ variationsSelected }) => {
  const componentProps = usePropsFromVariation(variationsSelected);
  const { t } = useTranslation('widget');
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        justifyContent: 'center',
      }}
    >
      <Alert severity="info" style={{ alignItems: 'center' }}>
        {t('widget.cssConfig.confirmationMessageComponentAlert')}
      </Alert>
      <ConfirmationMessage {...componentProps} />;
    </div>
  );
});
