import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { AxiosResponse } from 'axios';
import { MarketplacePaymentMethodBillingDetails } from '#src/libs/marketplace/types';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import type { StripeInit } from '#src/libs/payment/types';
import { OptionCallback } from '../../../../state/types';
import PaymentMethodListItem from '../PaymentMethodListItem.component';
import CollectPaymentMethod from '../CollectPaymentMethod.component';
import { PaymentMethod } from '../../types';
import CardBillingDetailsForm from '../payment-backend-stripe/CardBillingDetailsForm';

type Props = {
  companyId?: number;
  disabled?: boolean;
  savedPaymentMethodList: Array<PaymentMethod>;
  selectedSavedPaymentMethodId?: string;
  onSelect: (paymentMethodId: string) => void;
  showEmpty?: boolean | null;
  refreshSavedPaymentMethodList?: () => void;
  requestSetupIntentSecret?: () => Promise<AxiosResponse<any>>;
  paymentMethodType?: string;
  setHasDetached?: (paymentMethodId: string) => void;
  detachPaymentMethodLoading?: boolean;
  detachPaymentMethod?: (
    pm_id: string,
    options?: OptionCallback<unknown, number>,
  ) => void;
  onlyDefault?: boolean;
  sepaDefaultName?: string;
  sepaDefaultEmail?: string;
  onlinePaymentEnabled?: boolean;
  cardBillingDetailsMandatory?: boolean;
  areInitialBillingDetailsNecessary?: boolean;
  billingDetails?: MarketplacePaymentMethodBillingDetails;
  setBillingDetails?: React.Dispatch<
    React.SetStateAction<MarketplacePaymentMethodBillingDetails>
  >;
  stripePromise?: StripeInit;
  disableLink?: boolean;
};

export const PaymentMethodList = ({
  companyId,
  disabled,
  savedPaymentMethodList,
  selectedSavedPaymentMethodId,
  onSelect,
  showEmpty,
  refreshSavedPaymentMethodList,
  requestSetupIntentSecret,
  paymentMethodType,
  setHasDetached,
  detachPaymentMethodLoading,
  detachPaymentMethod,
  onlyDefault,
  sepaDefaultName,
  sepaDefaultEmail,
  onlinePaymentEnabled,
  cardBillingDetailsMandatory,
  areInitialBillingDetailsNecessary,
  billingDetails,
  setBillingDetails,
  stripePromise,
  disableLink,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['payment']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [collectPaymentMethodIsOpen, setCollectPaymentMethodIsOpen] =
    React.useState(false);

  if (
    !showEmpty &&
    (!savedPaymentMethodList || !savedPaymentMethodList.length)
  ) {
    return null;
  }

  const relevantSavedPaymentMethodList = paymentMethodType
    ? (savedPaymentMethodList ?? []).filter(
        (pm) => paymentMethodType === pm.type,
      )
    : savedPaymentMethodList;

  const defaultPaymentMethod = relevantSavedPaymentMethodList.find(
    (pm) => pm.is_default,
  );

  const onlinePaymentEnabledValue = onlinePaymentEnabled !== false;

  const displayEditForm = (paymentMethod: PaymentMethod) =>
    !areInitialBillingDetailsNecessary &&
    cardBillingDetailsMandatory &&
    paymentMethod.type === 'card' &&
    paymentMethod.id === selectedSavedPaymentMethodId &&
    !!paymentMethod.billing_details;

  return (
    <div className={classes.container}>
      {(onlyDefault && defaultPaymentMethod
        ? [defaultPaymentMethod]
        : relevantSavedPaymentMethodList
      ).map((pm) => (
        <React.Fragment key={pm.id}>
          <PaymentMethodListItem
            detachPaymentMethod={detachPaymentMethod}
            detachPaymentMethodLoading={detachPaymentMethodLoading}
            disabled={disabled}
            onClick={onSelect && (() => onSelect(pm.id))}
            paymentMethod={pm}
            selected={pm.id === selectedSavedPaymentMethodId}
            setHasDetached={setHasDetached}
          />
          {displayEditForm(pm) && (
            <CardBillingDetailsForm
              billingDetails={billingDetails}
              disabled={disabled}
              setBillingDetails={setBillingDetails}
            />
          )}
        </React.Fragment>
      ))}
      {!!requestSetupIntentSecret && onlinePaymentEnabledValue && (
        <ObjectLevelPermissionWrapper requiredPermission="billing.allowed_actions.addPaymentMethod">
          <ListItem button onClick={() => setCollectPaymentMethodIsOpen(true)}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText>
              {t('forms.paymentMethod.actions.addPaymentMethod')}
            </ListItemText>
          </ListItem>
        </ObjectLevelPermissionWrapper>
      )}
      {collectPaymentMethodIsOpen && (
        <CollectPaymentMethod
          cardBillingDetailsMandatory={cardBillingDetailsMandatory}
          companyId={companyId}
          defaultEmail={sepaDefaultEmail}
          defaultName={sepaDefaultName}
          disableLink={disableLink}
          fullScreen={isMobile}
          onClose={() => setCollectPaymentMethodIsOpen(false)}
          paymentMethodType={paymentMethodType}
          refreshSavedPaymentMethodList={refreshSavedPaymentMethodList}
          requestSetupIntentSecret={requestSetupIntentSecret}
          stripePromise={stripePromise}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    listStyleType: 'none',
    li: {
      listStyleType: 'none',
    },
  },
  item: {
    flex: '1',
  },
}));

export default React.memo(PaymentMethodList);
