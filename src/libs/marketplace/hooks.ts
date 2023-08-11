import { useCallback, useMemo, SetStateAction, ChangeEvent } from 'react';

import moment from 'moment-timezone';

import { MarketPlaceSessionTimeDisplay } from '@bsport/common/lib/master-data/personalization';

import { useTranslation } from 'react-i18next';
import { formatAsTime, formatMinutes } from '../../utils/datetime';

import { PaymentPackCategoryWithPacks } from '#libs/payment-packs/types';
import { PrivatePassCategoryWithPasses } from '#libs/private-service/types';
import {
  MarketplacePassFiltersHookOptions,
  MarketplacePassSearchHookOptions,
  MarketplacePaymentMethodBillingDetails,
} from '#libs/marketplace/types';
import { PaymentCombo } from '#libs/payment-combo/types';
import type { Establishment } from '#libs/establishment/types';
import type { Theme } from '#libs/theme/types';
import { Offer } from '#libs/offer/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Contract } from '#libs/subscription/types';

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
    return (contractList || [])?.filter((contract) =>
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
    let filteredPaymentPackByCategory = paymentPackByCategory ?? [];

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
    let filteredPrivatePassByCategory = privatePassByCategory ?? [];

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
  offer: Offer,
  establishment: Establishment,
  metaActivity: MetaActivity,
  theme: Theme,
) => {
  const { t } = useTranslation(['datetime']);
  const memoizedOfferHours = useMemo(() => {
    if (offer.date_start && establishment?.tzname) {
      const tz = metaActivity?.is_broadcast
        ? moment.tz.guess()
        : establishment?.tzname;

      const startMoment = moment(offer?.date_start).tz(tz);
      const startHour = formatAsTime(startMoment, tz);

      const duration = moment.duration(offer?.duration_minute, 'minutes');
      const durationInMinutes = duration.asMinutes();
      const readableDuration = formatMinutes(durationInMinutes, t);

      const endMoment = moment(offer?.date_start).add(duration).tz(tz);

      if (!endMoment.isSame(startMoment, 'day')) {
        return startHour;
      }
      const endHour = formatAsTime(endMoment, tz);

      switch (theme?.session_time_display) {
        case MarketPlaceSessionTimeDisplay.ONLY_STARTING_TIME:
          return `${startHour}`;
        case MarketPlaceSessionTimeDisplay.STARTING_TIME_AND_DURATION:
          return `${startHour} - ${readableDuration}`;
        default:
          return `${startHour} - ${endHour}`;
      }
    }

    if (offer.date_start) {
      const tz = metaActivity?.is_broadcast
        ? moment.tz.guess()
        : theme?.timezone_name || moment.tz.guess();
      const startMoment = moment(offer?.date_start).tz(tz);
      const startHour = startMoment.format('HH:mm');

      const duration = moment.duration(offer?.duration_minute, 'minutes');
      const durationInMinutes = duration.asMinutes();
      const readableDuration = formatMinutes(durationInMinutes, t);

      const endMoment = moment(offer?.date_start)
        .add(moment.duration(offer?.duration_minute, 'minutes'))
        .tz(tz);
      const endHour = endMoment.format('HH:mm');

      if (!endMoment.isSame(startMoment, 'day')) {
        return startHour;
      }

      switch (theme?.session_time_display) {
        case MarketPlaceSessionTimeDisplay.ONLY_STARTING_TIME:
          return `${startHour}`;
        case MarketPlaceSessionTimeDisplay.STARTING_TIME_AND_DURATION:
          return `${startHour} - ${readableDuration}`;
        default:
          return `${startHour} - ${endHour}`;
      }
    }
    return '';
  }, [
    offer.date_start,
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
