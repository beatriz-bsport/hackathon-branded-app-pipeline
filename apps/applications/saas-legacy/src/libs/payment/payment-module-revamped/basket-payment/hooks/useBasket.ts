import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { isErrorWithCustomCode } from '#src/libs/utils';

import { validateUnpaid } from '#src/libs/checkout/api';
import { checkItemsBasket, verifyPriceBasket } from '#src/libs/payment/api';

import { fetchOfferBulk } from '#src/libs/offer/actions';
import { fetchMetaActivityBulk } from '#src/libs/meta-activity/actions';
import { fetchEstablishmentBulk } from '#src/libs/establishment/actions';

import { useBasketPaymentStoreData } from './useBasketPaymentStoreData';
import { useBasketPaymentActions } from './useBasketPaymentActions';
import { useBasketPaymentLocalState } from './useBasketPaymentLocalState';

import type { AxiosError } from 'axios';
import type { OptionCallback, PaginatedResponse } from '#src/state/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Offer } from '#src/libs/offer/types';
import type { Basket } from '#src/libs/checkout/types';

type UseBasket = {
  availablePaymentMethods: number[];
  basketTotalPriceCts: number;
  basketTotalPricePrepaidLinesCts: number;
  checkBasketItems: (basketID: string) => Promise<boolean>;
  isBasketLoading: boolean;
  isCurrentBasketProcessing: boolean;
  submitUnpaidBasket: (options?: OptionCallback) => Promise<void>;
  refreshBasket: (options?: OptionCallback) => void;
  handleFetchBasket: (options?: OptionCallback<Basket>) => void;
  needAddress: boolean;
};

/**
 * Custom hook to manage basket operations within OnlinePaymentBasket.
 * This hook is not meant to be used outside the scope of OnlinePaymentBasket.
 *
 * @param {string} basketId - The ID of the basket.
 * @param {number} companyId - The ID of the company.
 * @param {number} memberId - The ID of the member.
 * @returns {UseBasketPaymentProvider} An object containing various functions to handle basket payment operations.
 */
export const useBasket = (
  basketId: string,
  companyId: number,
  memberId: number,
): UseBasket => {
  const dispatch = useDispatch();

  const { t } = useTranslation('checkout');

  const {
    basketTotalPriceCts,
    basketTotalPricePrepaidLinesCts,
    isBasketLoading,
    isCurrentBasketProcessing,
    paymentGroupId,
    availablePaymentMethods,
    needAddress,
  } = useBasketPaymentStoreData(basketId, memberId);

  const {
    handleFetchCurrentBasket,
    handleFetchInstalmentPaymentByBasket,
    handleFetchBasket,
    handleSetPaymentStatus,
  } = useBasketPaymentActions(basketId, companyId, memberId);

  const { setCheckBasketItemError } = useBasketPaymentLocalState();

  const handleFetchOfferBulk = useCallback(
    (offerIds: number[], options?: OptionCallback<Offer[]>) => {
      if (offerIds) dispatch(fetchOfferBulk(offerIds, options));
    },
    [dispatch],
  );

  const handleFetchMetaActivities = useCallback(
    (metaActivitiesIds: number[], options?: OptionCallback<MetaActivity[]>) => {
      if (metaActivitiesIds)
        dispatch(fetchMetaActivityBulk(metaActivitiesIds, options));
    },
    [dispatch],
  );

  const handleFetchEstablishment = useCallback(
    (
      establishmentIds: number[],
      options?: OptionCallback<PaginatedResponse<Establishment>>,
    ) => {
      if (establishmentIds)
        dispatch(fetchEstablishmentBulk(establishmentIds, options));
    },
    [dispatch],
  );

  /**
   * Fetches offers with associated establishment and activity data.
   *
   * @param {number[]} [offerIds] - An array of offer IDs to fetch.
   */
  const fetchOffersWithEstablishmentAndActivity = useCallback(
    (offerIds?: number[]) => {
      if (!!offerIds) {
        handleFetchOfferBulk(offerIds, {
          onSuccess: (offers) => {
            const metaActivityIds =
              offers?.map((offer) => offer.meta_activity) ?? [];
            const establishmentIds =
              offers?.map((offer) => offer.establishment) ?? [];
            handleFetchMetaActivities(metaActivityIds);
            handleFetchEstablishment(establishmentIds);
          },
        });
      }
    },
    [handleFetchEstablishment, handleFetchMetaActivities, handleFetchOfferBulk],
  );

  /**
   * Refreshes the basket data and fetches related information.
   *
   * @param {OptionCallback} [options] - Optional callbacks for success and error handling.
   */
  const refreshBasket = useCallback(
    (options?: OptionCallback) =>
      handleFetchCurrentBasket({
        onSuccess: (basket) => {
          options?.onSuccess?.();
          handleFetchInstalmentPaymentByBasket();
          const offerIdsList = basket?.checkout_items
            ?.flatMap(
              (checkoutItem) =>
                checkoutItem.extra_data?.offers_data?.map(
                  (offerData) => offerData.offer_id,
                ) ?? [],
            )
            .filter(Boolean);
          fetchOffersWithEstablishmentAndActivity(offerIdsList);
        },
        onError: options?.onError,
      }),
    [
      fetchOffersWithEstablishmentAndActivity,
      handleFetchCurrentBasket,
      handleFetchInstalmentPaymentByBasket,
    ],
  );

  /**
   * Checks the items in the basket.
   *
   * @returns {Promise<boolean>} Returns true if the check is successful, false otherwise.
   */
  const checkBasketItems = useCallback(
    async (basketID: string) => {
      try {
        await checkItemsBasket(basketID);
      } catch (error) {
        const axiosError = error as AxiosError;

        if (isErrorWithCustomCode(axiosError) && axiosError?.response?.data) {
          setCheckBasketItemError(axiosError);
          refreshBasket();
          return false;
        }
      }
      return true;
    },

    [refreshBasket, setCheckBasketItemError],
  );

  const submitUnpaidBasket = useCallback(
    async (options?: OptionCallback) => {
      handleSetPaymentStatus({ paymentGroupId, isPaymentProcessing: true });
      const basketItemsChecked = await checkBasketItems(basketId);
      if (!basketItemsChecked) {
        handleSetPaymentStatus({ paymentGroupId, isPaymentProcessing: false });
        return;
      }
      const { data } = await verifyPriceBasket(basketId);
      if (
        (!!basketTotalPriceCts || basketTotalPriceCts === 0) &&
        basketTotalPriceCts !== data
      ) {
        handleSetPaymentStatus({ paymentGroupId, isPaymentProcessing: false });
        window.alert(t('myBasket.error.inconsistentBasket'));
        window.location.reload();
        return;
      }
      await validateUnpaid(basketId)
        .then(() => {
          options?.onSuccess?.();
        })
        .catch((err) => {
          console.error(err);
          options?.onError?.(err);
        })
        .finally(() => {
          handleSetPaymentStatus({
            paymentGroupId,
            isPaymentProcessing: false,
          });
        });
    },
    [
      basketId,
      basketTotalPriceCts,
      checkBasketItems,
      t,
      handleSetPaymentStatus,
      paymentGroupId,
    ],
  );

  return {
    availablePaymentMethods,
    basketTotalPriceCts,
    basketTotalPricePrepaidLinesCts,
    checkBasketItems,
    isBasketLoading,
    isCurrentBasketProcessing,
    submitUnpaidBasket,
    refreshBasket,
    handleFetchBasket,
    needAddress,
  };
};
