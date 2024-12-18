import React from 'react';
import { v4 as uuid4 } from 'uuid';
import { useTranslation } from 'react-i18next';

import { getBackofficeBillingPlanEnabledPaymentMethods } from '#src/libs/payment/utils';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#src/libs/payment/api';

import type { Member } from '#src/libs/member/types';
import type { PaymentMethod } from '#src/libs/payment/types';

import { BackgroundDialogDisplayMode } from '#src/libs/background-dialog/types';
import type {
  OptionBackgroundCallback,
  OptionCallback,
} from '../../../../state/types';

const useSubscriptionHandler = (
  currency: string,
  companyCountry: string,
  stripeRegion: string,
  fetchPaymentMethodList: (
    params?: any,
    options?: OptionCallback<PaymentMethod[]>,
  ) => void,
  registerContractBackground: (
    id: number,
    data: any,
    options?: OptionBackgroundCallback,
    noAuth?: boolean,
  ) => void,
  closeSubscriptionContractModal: () => void,
  displayBackgroundDialog: (
    uuid: string,
    message: string,
    title: string,
    link: string,
    actionMode?: string,
    displayMode?: string,
  ) => void,
  deletebackgroundDialog: (backgroundDialogId: string) => void,
  fetchSubscriptionList: (params?: any, options?: OptionCallback) => void,
  fetchStripeReaders: (options?: OptionCallback) => void,
  memberToSubscribe?: Member,
) => {
  React.useEffect(() => {
    fetchSubscriptionList();
    fetchPaymentMethodList();
    fetchStripeReaders();
  }, [fetchPaymentMethodList, fetchStripeReaders, fetchSubscriptionList]);

  const enabledPaymentMethods = React.useMemo(
    () =>
      getBackofficeBillingPlanEnabledPaymentMethods({
        currency,
        companyCountry,
        withCredit: true,
        withTerminal: true,
        stripeRegion,
      }),
    [companyCountry, currency, stripeRegion],
  );

  const requestSetupIntentSecret = React.useCallback(
    () => requestSetupIntentSecretAPI(memberToSubscribe?.id),
    [memberToSubscribe],
  );

  const refreshSavedPaymentMethodList = React.useCallback(() => {
    fetchPaymentMethodList({ member: memberToSubscribe?.id });
  }, [fetchPaymentMethodList, memberToSubscribe]);

  const { t } = useTranslation('subscription');

  const registerContract = React.useCallback(
    (id: number, data: any, options: OptionCallback) => {
      const uuid = uuid4();
      registerContractBackground(id, data, {
        onError: options?.onError,
        onSuccess: () => {
          closeSubscriptionContractModal();
          if (options?.onSuccess) options.onSuccess();
          displayBackgroundDialog(
            uuid,
            t('register.dialog.info'),
            '',
            undefined,
            '',
            BackgroundDialogDisplayMode.INFORMATION,
          );
        },
        onBackgroundError: () => {
          deletebackgroundDialog(uuid);
        },
        onBackgroundSuccess: (responseData: any) => {
          deletebackgroundDialog(uuid);
          displayBackgroundDialog(
            uuid4(),
            t('register.dialog.success', {
              name: responseData?.billing_plan?.name || '',
            }),
            '',
            responseData?.billing_plan?.id
              ? `/subscription/${responseData.billing_plan.id}`
              : undefined,
            '',
            BackgroundDialogDisplayMode.SUCCESS,
          );
          if (options?.onSuccess) options.onSuccess(responseData);
        },
      });
    },
    [
      closeSubscriptionContractModal,
      deletebackgroundDialog,
      displayBackgroundDialog,
      registerContractBackground,
      t,
    ],
  );

  return {
    enabledPaymentMethods,
    requestSetupIntentSecret,
    refreshSavedPaymentMethodList,
    registerContract,
  };
};

export default useSubscriptionHandler;
