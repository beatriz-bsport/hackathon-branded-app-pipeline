import React, {
  useCallback,
  useMemo,
  SetStateAction,
  ChangeEvent,
  useEffect,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

import { DateTime } from 'luxon';

import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization.js';

import { useTranslation } from 'react-i18next';

import { PaymentPackCategoryWithPacks } from '#src/libs/payment-packs/types';
import { PrivatePassCategoryWithPasses } from '#src/libs/private-service/types';
import {
  MarketplacePassFiltersHookOptions,
  MarketplacePassSearchHookOptions,
  MarketplacePaymentMethodBillingDetails,
} from '#src/libs/marketplace/types';
import { PaymentCombo } from '#src/libs/payment-combo/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { CompanyTheme, Theme } from '#src/libs/theme/types';
import type {
  Offer,
  OfferREST,
  OfferWithSpotInformation,
  Offer_FULL,
} from '#src/libs/offer/types';
import { MetaActivity } from '#src/libs/meta-activity/types';
import { Contract } from '#src/libs/subscription/types';
import {
  formatAsDateWithWeekday,
  formatISOStringAsTime,
  formatMinutes,
  getUserZone,
} from '#src/utils/datetime';
import { ImmutableObject } from 'seamless-immutable';

/**
 * @description Hook used in the component MarketplaceContractList for handling
 * the fuzzy search and returning the associated filtered contracts
 * @param contractList All retrieved marketplace contracts
 * @param fuzzySearchContractResults The ids returned by fuzzy search
 * @returns {Contract[]} List of searched contracts
 */
export const filterSearchedMarketplaceContracts = (
  contractList: Contract[],
  fuzzySearchContractResults: number[],
) => {
  if (fuzzySearchContractResults) {
    return (contractList ?? [])?.filter((contract) =>
      fuzzySearchContractResults.some(
        (searchItem) => searchItem === contract.id,
      ),
    );
  }
  return contractList;
};

/**
 * Marketplace filter hook for pass page - returns the associated filtered list according to pass filters
 * @param {MarketplacePassFiltersHookOptions}
 */
export const useMarketplacePassFilters = ({
  selectedCategories,
  paymentPackByCategory,
  restrictedPaymentPackCategories,
  fuzzySearchPaymentPackResults,
  privatePassByCategory,
  restrictedPrivatePassCategories,
  fuzzySearchPrivatePassResults,
  paymentComboList,
  fuzzySearchPaymentComboResults,
}: MarketplacePassFiltersHookOptions) => {
  const getFilteredPaymentPackByCategory = useCallback(() => {
    let filteredPaymentPackByCategory =
      paymentPackByCategory?.asMutable({ deep: true }) ?? [];

    // if specific categories selected in BO settings return associated categories
    if (restrictedPaymentPackCategories?.length) {
      filteredPaymentPackByCategory = filteredPaymentPackByCategory.filter(
        (paymentPackCategory) =>
          restrictedPaymentPackCategories.includes(paymentPackCategory.id),
      );
    }

    // handle filter by category case
    if (selectedCategories?.length) {
      filteredPaymentPackByCategory = filteredPaymentPackByCategory.filter(
        (category) => {
          // Handle the empty category case
          if (!category.id && selectedCategories.includes(null)) {
            return true;
          }
          return selectedCategories.find(
            (selected) => selected === category.id,
          );
        },
      );
    }

    // only return categories that have items in it
    filteredPaymentPackByCategory = filteredPaymentPackByCategory.filter(
      (category) => category.packs.length,
    );

    // handle fuzzy search
    if (fuzzySearchPaymentPackResults) {
      filteredPaymentPackByCategory = filteredPaymentPackByCategory
        .map((paymentPackCategory) => {
          return {
            ...paymentPackCategory,
            packs: paymentPackCategory.packs.filter((paymentPack) =>
              fuzzySearchPaymentPackResults.some(
                (searchItem) => searchItem === paymentPack.id,
              ),
            ),
          };
        })
        .filter((category) => category.packs.length);
    }

    return filteredPaymentPackByCategory;
  }, [
    paymentPackByCategory,
    restrictedPaymentPackCategories,
    selectedCategories,
    fuzzySearchPaymentPackResults,
  ]);

  const getFilteredPrivatePassByCategory = useCallback(() => {
    let filteredPrivatePassByCategory =
      privatePassByCategory?.asMutable({ deep: true }) ?? [];

    // if specific categories selected in BO settings return associated categories
    if (restrictedPrivatePassCategories?.length) {
      filteredPrivatePassByCategory = filteredPrivatePassByCategory.filter(
        (privatePassCategory) =>
          restrictedPrivatePassCategories.includes(privatePassCategory.id),
      );
    }

    // handle filter by category case
    if (selectedCategories?.length) {
      filteredPrivatePassByCategory = filteredPrivatePassByCategory.filter(
        (category) => {
          // Handle the empty category case
          if (!category.id && selectedCategories.includes(null)) {
            return true;
          }
          return selectedCategories.find(
            (selected) => selected === category.id,
          );
        },
      );
    }

    // only return categories that have items in it
    filteredPrivatePassByCategory = filteredPrivatePassByCategory.filter(
      (category) => category.passes.length,
    );

    // handle fuzzy search
    if (fuzzySearchPrivatePassResults) {
      filteredPrivatePassByCategory = filteredPrivatePassByCategory
        .map((privatePassCategory) => {
          return {
            ...privatePassCategory,
            passes: privatePassCategory.passes.filter((privatePass) =>
              fuzzySearchPrivatePassResults.some(
                (searchItem) => searchItem === privatePass.id,
              ),
            ),
          };
        })
        .filter((category) => category.passes.length);
    }

    return filteredPrivatePassByCategory;
  }, [
    privatePassByCategory,
    restrictedPrivatePassCategories,
    selectedCategories,
    fuzzySearchPrivatePassResults,
  ]);

  const getFilteredPaymentComboList = useCallback(() => {
    let filteredPaymentComboList = paymentComboList ?? [];

    if (fuzzySearchPaymentComboResults) {
      filteredPaymentComboList = filteredPaymentComboList.filter(
        (paymentCombo) =>
          fuzzySearchPaymentComboResults.some(
            (searchItem) => searchItem === paymentCombo.id,
          ),
      );
    }

    return filteredPaymentComboList;
  }, [paymentComboList, fuzzySearchPaymentComboResults]);

  const filteredPaymentPackByCategory: PaymentPackCategoryWithPacks[] =
    getFilteredPaymentPackByCategory();

  const filteredPrivatePassByCategory: PrivatePassCategoryWithPasses[] =
    getFilteredPrivatePassByCategory();

  const filteredPaymentComboList: PaymentCombo[] =
    getFilteredPaymentComboList();

  return {
    filteredPaymentPackByCategory,
    filteredPrivatePassByCategory,
    filteredPaymentComboList,
  };
};

/**
 * Marketplace search data - returns the associated elements according to BO tab category settings if any
 * @param {MarketplacePassFiltersHookOptions}
 */
export const useMarketplacePassFlatLists = ({
  paymentPackByCategory,
  restrictedPaymentPackCategories,
  privatePassByCategory,
  restrictedPrivatePassCategories,
}: MarketplacePassSearchHookOptions) => {
  const filteredPaymentPackList = useMemo(() => {
    if (paymentPackByCategory?.length) {
      return paymentPackByCategory
        .flatMap((category) => category.packs)
        .filter((pack) =>
          restrictedPaymentPackCategories
            ? restrictedPaymentPackCategories.some((id) => id === pack.category)
            : pack,
        );
    }
    return [];
  }, [paymentPackByCategory, restrictedPaymentPackCategories]);

  const filteredPrivatePassList = useMemo(() => {
    if (privatePassByCategory?.length) {
      return privatePassByCategory
        .flatMap((category) => category.passes)
        .filter((pass) =>
          restrictedPrivatePassCategories
            ? restrictedPrivatePassCategories.some((id) => id === pass.category)
            : pass,
        );
    }
    return [];
  }, [privatePassByCategory, restrictedPrivatePassCategories]);

  return { filteredPaymentPackList, filteredPrivatePassList };
};

export const useOfferHours = (
  offer: Offer | OfferWithSpotInformation | Offer_FULL | OfferREST,
  establishment: Establishment,
  metaActivity: MetaActivity | ImmutableObject<MetaActivity>,
  theme: Theme,
) => {
  const { t } = useTranslation(['datetime']);
  const memoizedOfferHours = useMemo(() => {
    if (offer?.date_start && establishment?.tzname) {
      const tz = metaActivity?.is_broadcast
        ? getUserZone()
        : establishment?.tzname;

      const startDateTime = DateTime.fromISO(offer.date_start).setZone(tz);
      const startHour = formatISOStringAsTime(startDateTime.toISO(), tz);

      const readableDuration = formatMinutes(offer.duration_minute, t);

      const endDateTime = DateTime.fromISO(offer.date_start)
        .plus({ minute: offer.duration_minute })
        .setZone(tz);

      if (!endDateTime.hasSame(startDateTime, 'day')) {
        return { startTime: startHour, endTimeOrDuration: '' };
      }
      const endHour = formatISOStringAsTime(endDateTime.toISO(), tz);

      switch (theme?.session_time_display) {
        case MarketPlaceSessionTimeDisplay.ONLY_STARTING_TIME:
          return { startTime: startHour, endTimeOrDuration: '' };
        case MarketPlaceSessionTimeDisplay.STARTING_TIME_AND_DURATION:
          return { startTime: startHour, endTimeOrDuration: readableDuration };
        default:
          return { startTime: startHour, endTimeOrDuration: endHour };
      }
    }

    if (offer?.date_start) {
      const tz = metaActivity?.is_broadcast
        ? getUserZone()
        : theme?.timezone_name || getUserZone();
      const startDateTime = DateTime.fromISO(offer.date_start).setZone(tz);
      const startHour = startDateTime.toFormat('HH:mm');

      const readableDuration = formatMinutes(offer.duration_minute, t);

      const endDateTime = DateTime.fromISO(offer.date_start)
        .plus({ minute: offer.duration_minute })
        .setZone(tz);
      const endHour = endDateTime.toFormat('HH:mm');

      if (!endDateTime.hasSame(startDateTime, 'day')) {
        return { startTime: startHour, endTimeOrDuration: '' };
      }

      switch (theme?.session_time_display) {
        case MarketPlaceSessionTimeDisplay.ONLY_STARTING_TIME:
          return { startTime: startHour, endTimeOrDuration: '' };
        case MarketPlaceSessionTimeDisplay.STARTING_TIME_AND_DURATION:
          return { startTime: startHour, endTimeOrDuration: readableDuration };
        default:
          return { startTime: startHour, endTimeOrDuration: endHour };
      }
    }
    return { startTime: '', endTimeOrDuration: '' };
  }, [
    offer?.date_start,
    offer?.duration_minute,
    establishment?.tzname,
    metaActivity?.is_broadcast,
    t,
    theme?.session_time_display,
    theme?.timezone_name,
  ]);
  return memoizedOfferHours;
};

/**
 * Marketplace collect payment method - handle the onChange event on associated fields
 * @param {MarketplacePassFiltersHookOptions}
 */
export const usePaymentMethodBillingDetails = (
  setBillingDetails: (
    value: SetStateAction<MarketplacePaymentMethodBillingDetails>,
  ) => void,
) => {
  const setNewBillingDetails = useCallback(
    (value: string, billingField: string) => {
      setBillingDetails((prevState) => {
        const newBillingDetails = { ...prevState };
        if (billingField.includes('address')) {
          const addressField = billingField.split('.')[1];
          newBillingDetails.address[
            addressField as keyof MarketplacePaymentMethodBillingDetails['address']
          ] = value ?? '';
        } else {
          newBillingDetails[billingField as 'email' | 'name'] = value ?? '';
        }
        return newBillingDetails;
      });
    },
    [setBillingDetails],
  );

  const handleChangeName = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) =>
      setNewBillingDetails(target.value, 'name'),
    [setNewBillingDetails],
  );

  const handleChangeEmail = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) =>
      setNewBillingDetails(target.value, 'email'),
    [setNewBillingDetails],
  );
  const handleChangeLineOne = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setNewBillingDetails(target.value, 'address.line1');
    },
    [setNewBillingDetails],
  );

  const handleChangeLineTwo = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) =>
      setNewBillingDetails(target.value, 'address.line2'),
    [setNewBillingDetails],
  );

  const handleChangePostalCode = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) =>
      setNewBillingDetails(target.value, 'address.postal_code'),
    [setNewBillingDetails],
  );

  const handleChangeCity = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) =>
      setNewBillingDetails(target.value, 'address.city'),
    [setNewBillingDetails],
  );

  const handleChangeCountry = useCallback(
    (country: string) => setNewBillingDetails(country, 'address.country'),
    [setNewBillingDetails],
  );

  const handleChangeSortCode = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) =>
      setNewBillingDetails(target.value, 'sortCode'),
    [setNewBillingDetails],
  );

  const handleChangeAccountNumber = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) =>
      setNewBillingDetails(target.value, 'accountNumber'),
    [setNewBillingDetails],
  );

  const handleChangeState = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) =>
      setNewBillingDetails(target.value, 'address.state'),
    [setNewBillingDetails],
  );

  return {
    setNewBillingDetails,
    handleChangeName,
    handleChangeEmail,
    handleChangeLineOne,
    handleChangeLineTwo,
    handleChangePostalCode,
    handleChangeCity,
    handleChangeCountry,
    handleChangeSortCode,
    handleChangeAccountNumber,
    handleChangeState,
  };
};

/**
 * Simulate fixed position behavior for marketplace dialogs
 *
 * Since we now have container queries (CSS fixed position don't work inside),
 * we must set all of out marketplace dialogs out of the page container
 * @param DialogContainer The component rendering the dialog(s)
 * @param pageClass The CSS class of the page
 * (will be used to evaluate the closest `div.bs-setup-variable`)
 * @returns {React.ReactElement} The dialog container 'teleported' within `div.bs-setup-variable`
 * @example
 *  export const MarketplaceDialogPortal: React.FC<Props> = (props) => {
 *      const [pageClass, setPageClass] = useState<string>(null);
 *
 *      useEffect(() => {
 *        setPageClass('.bs-contract-page');
 *        return () => {
 *          setPageClass(null);
 *        };
 *      }, []);
 *
 *      const portalContainer = useMarketplaceFixedDialog(
 *        <MarketplaceDialog {...props} />,
 *        pageClass,
 *      );
 *
 *     return portalContainer;
 * };
 */
export const useMarketplaceFixedDialog = (
  DialogContainer: React.ReactElement,
  pageClass: string | null,
  parentElementId?: string,
) => {
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  useEffect(() => {
    // If neither pageClass nor parentElementId is provided, exit early
    if (!pageClass && !parentElementId) return;

    if (parentElementId) {
      // Find the parent element using the provided ID. This is used in a widget context,
      // where the pageContainer must be found as a child of the element with the given parentElementId.
      const parentElement = document.getElementById(parentElementId);
      if (parentElement) {
        // Find the first element inside the parent that matches the provided pageClass
        const pageContainer = parentElement.querySelector(pageClass);

        // Find the closest ancestor element with the class 'div.bs-setup-variable'
        const cssHocContainer = pageContainer?.closest('div.bs-setup-variable');

        // Set the portal container to the found ancestor element
        setPortalContainer(cssHocContainer);
      }
    } else {
      // If no parentElementId is provided, assume this hook is running outside of a widget context (or in a misconfigured one).
      // In this case, search the DOM from top to bottom for the first element matching the provided pageClass,
      // and find its closest ancestor with the class 'div.bs-setup-variable'.
      const pageContainer = document.querySelector(pageClass);
      const cssHocContainer = pageContainer?.closest('div.bs-setup-variable');

      setPortalContainer(cssHocContainer);
    }
  }, [pageClass, parentElementId]);

  // Return a portal rendering the DialogContainer inside the portal container, if found.
  // Otherwise, return the DialogContainer as is.
  return portalContainer
    ? ReactDOM.createPortal(DialogContainer, portalContainer)
    : DialogContainer;
};

export const useOfferFormattedDate = (
  offer: Offer_FULL | OfferWithSpotInformation | OfferREST,
  establishment: Establishment,
  metaActivity: MetaActivity,
  companyTheme: CompanyTheme,
) => {
  const timezoneName = metaActivity?.is_broadcast
    ? getUserZone()
    : establishment?.tzname || companyTheme?.timezone_name || 'Europe/Paris';
  const dateStart = offer?.date_start
    ? DateTime.fromISO(offer.date_start).setZone(timezoneName)
    : null;
  return formatAsDateWithWeekday(dateStart, companyTheme, 'DDD');
};
