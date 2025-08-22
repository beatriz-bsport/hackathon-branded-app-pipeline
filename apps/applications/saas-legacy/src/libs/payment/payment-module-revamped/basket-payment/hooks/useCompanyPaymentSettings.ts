import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTheme } from '#src/libs/theme/selectors';
import { getEnabledEstablishmentBillingGroups } from '#src/libs/establishment/selectors';

import { fetchCompanyTheme } from '#src/libs/theme/actions';
import { fetchAllEstablishmentBillingGroup } from '#src/libs/establishment/actions';

import type { RootState } from '#src/reducers';
import type { OptionCallback } from '#src/state/types';
import type { CompanyTheme } from '#src/libs/theme/types';
import type { EstablishmentBillingGroup } from '#src/libs/establishment/types';

type UseCompanyPaymentSettings = {
  companyTheme: CompanyTheme | null;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  generalTermsAndConditions: string;
  handleFetchCompanyThemeWithEstablishmentBillingGroups: () => void;
  isCardBillingDetailsMandatory: boolean;
  isCompanyThemeLoading: boolean;
  isConsumerAllowedToUseInternalAccount: boolean;
  isMultiLocalizationEnabled: boolean;
  paymentMethodAvailableBasket: number[];
};

/**
 * Custom hook to manage company payment settings within OnlinePaymentBasket.
 * This hook is not meant to be used outside the scope of OnlinePaymentBasket.
 *
 * @param {number} companyId - The ID of the company.
 * @returns {UseCompanyPaymentSettings} An object containing company payment settings and related functions.
 */
export const useCompanyPaymentSettings = (
  companyId: number,
): UseCompanyPaymentSettings => {
  const dispatch = useDispatch();

  const establishmentBillingGroups = useSelector((state: RootState) =>
    getEnabledEstablishmentBillingGroups(state),
  );

  const isCompanyThemeLoading = useSelector(
    (state: RootState) => state.theme.loading,
  );

  const companyTheme = useSelector((state: RootState) => getTheme(state));
  const isConsumerAllowedToUseInternalAccount =
    companyTheme?.allow_consumer_to_use_internal_account;
  const isCardBillingDetailsMandatory =
    companyTheme?.force_billing_details_on_cards;
  const paymentMethodAvailableBasket =
    companyTheme?.payment_method_available_basket;
  const generalTermsAndConditions = companyTheme?.general_terms_and_conditions;
  const isMultiLocalizationEnabled = companyTheme?.enable_multi_localization;

  const handleFetchAllEstablishmentBillingGroup = useCallback(
    (options?: OptionCallback) => {
      if (companyId)
        dispatch(
          fetchAllEstablishmentBillingGroup({
            params: { company: companyId },
            ...options,
          }),
        );
    },
    [dispatch, companyId],
  );

  const handleFetchCompanyTheme = useCallback(
    (options?: OptionCallback<CompanyTheme>) => {
      if (!companyTheme && companyId) {
        dispatch(fetchCompanyTheme(companyId, options));
      }
    },
    [dispatch, companyId, companyTheme],
  );

  const handleFetchCompanyThemeWithEstablishmentBillingGroups = useCallback(
    () =>
      handleFetchCompanyTheme({
        onSuccess: (theme) => {
          if (theme?.enable_multi_localization) {
            handleFetchAllEstablishmentBillingGroup();
          }
        },
      }),
    [handleFetchAllEstablishmentBillingGroup, handleFetchCompanyTheme],
  );

  return {
    companyTheme,
    establishmentBillingGroups,
    generalTermsAndConditions,
    isCardBillingDetailsMandatory,
    isCompanyThemeLoading,
    isConsumerAllowedToUseInternalAccount,
    isMultiLocalizationEnabled,
    paymentMethodAvailableBasket,
    handleFetchCompanyThemeWithEstablishmentBillingGroups,
  };
};
