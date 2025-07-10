import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { fetchEstablishmentBulk } from '#src/libs/establishment/actions';
import { fetchMetaActivityBulk } from '#src/libs/meta-activity/actions';
import {
  fetchAllPaymentPackCategory,
  fetchMarketplacePacks,
} from '#src/libs/payment-packs/actions';
import {
  fetchAllPrivatePassCategory,
  fetchPrivatePassAsConsumerList,
  fetchMarketplacePrivateServices,
  fetchMarketplacePrivateSlots,
} from '#src/libs/private-service/actions';
import type {
  PaymentPack,
  PaymentPackQueryParams,
} from '#src/libs/payment-packs/types';

/**
 * Custom React hook that declares fetch handlers for the passes page.
 *
 */
export const useFetchPassesData = () => {
  const dispatch = useDispatch();

  const handleFetchPaymentPacks = useCallback(
    (params: PaymentPackQueryParams) => {
      dispatch(
        fetchMarketplacePacks(params, {
          onSuccess: (packList: PaymentPack[] | undefined) => {
            const establishments =
              packList
                ?.map((paymentPack) => paymentPack.establishments)
                .flat(2) || [];
            const metaActivities =
              packList
                ?.map((paymentPack) => paymentPack.metaActivities)
                .flat(2) || [];

            dispatch(fetchEstablishmentBulk(establishments));
            dispatch(fetchMetaActivityBulk(metaActivities));
          },
        }),
      );
    },
    [dispatch],
  );
  const handleFetchAllPaymentPackCategory = useCallback(
    (companyId: number) => {
      dispatch(fetchAllPaymentPackCategory(companyId));
    },
    [dispatch],
  );
  const handleFetchPrivatePasses = useCallback(
    (companyId: number) => {
      dispatch(fetchPrivatePassAsConsumerList(companyId));
    },
    [dispatch],
  );
  const handleFetchPrivatePassCategory = useCallback(
    (companyId: number) => {
      dispatch(fetchAllPrivatePassCategory(companyId));
    },
    [dispatch],
  );
  const handleFetchMarketplacePrivateServices = useCallback(
    (companyId: number) => {
      dispatch(fetchMarketplacePrivateServices(companyId));
    },
    [dispatch],
  );
  const handleFetchMarketplacePrivateSlots = useCallback(
    (companyId: number) => {
      dispatch(fetchMarketplacePrivateSlots(companyId));
    },
    [dispatch],
  );
  return {
    handleFetchPaymentPacks,
    handleFetchAllPaymentPackCategory,
    handleFetchPrivatePasses,
    handleFetchPrivatePassCategory,
    handleFetchMarketplacePrivateServices,
    handleFetchMarketplacePrivateSlots,
  };
};
